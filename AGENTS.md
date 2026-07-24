# TSL NetCare

Next.js 15 (App Router, Turbopack) + React 19 + Tailwind v4 app for managing fishing‑net repair requests. Captains log in by phone number, submit repair requests (with optional photo), and an admin page tracks/updates status. All persistence is in Supabase (Postgres + Storage). Server Actions in `lib/actions/*` talk to Supabase using the **service role** key (`lib/supabase/server.ts`), so Postgres Row Level Security is effectively bypassed — the service role must have table privileges (see gotcha below).

## Cursor Cloud specific instructions

The `npm install` in the update script only covers Node deps. Running the app end‑to‑end also needs a **local Supabase stack (Docker)**, which is service startup and is intentionally NOT in the update script. Docker + the Supabase CLI are already installed on the VM image.

### Bring up services (per session)

Docker does not run under systemd here; start it manually and make the socket usable without sudo:

```bash
sudo service docker start
sudo chmod 666 /var/run/docker.sock
```

Then start Supabase from the repo root and run the dev server:

```bash
supabase start        # boots Postgres/PostgREST/Storage/Studio in Docker (first run pulls images)
npm run dev           # Next.js dev server on http://localhost:3000
```

- `.env.local` (gitignored) is already populated with the local Supabase URL + demo anon/service keys. If Supabase reports different keys, regenerate values from `supabase status`.
- The Docker volumes persist on disk across snapshots, so DB tables, storage buckets, and prior data usually survive a restart — you typically only need to restart the Docker daemon and `supabase start` (no re‑seeding). Only re‑run the DB setup below if the DB was reset or tables/buckets are missing.

### DB setup gotcha (critical, non‑obvious)

`supabase/schema.sql` is applied against local Postgres as the `postgres` role (e.g. `docker exec -i supabase_db_<project> psql -U postgres -d postgres < supabase/schema.sql`). In **local** Supabase, tables created by `postgres` do NOT automatically grant `SELECT`/`INSERT` to `anon`/`authenticated`/`service_role` (only delete/truncate/update/trigger). Because the app uses the **service role**, this surfaces as runtime errors like `permission denied for table captains`. After creating/recreating tables you MUST grant privileges:

```sql
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
```

Do NOT "fix" this by enabling RLS + adding anon policies — the app never uses the anon key for DB writes, so that is unnecessary and misleading.

Storage buckets (`request-photos`, `completion-photos`, both public) are required for photo upload actions. Create them if missing:

```sql
insert into storage.buckets (id, name, public) values
  ('request-photos','request-photos', true),
  ('completion-photos','completion-photos', true)
on conflict (id) do nothing;
```

### Lint / build / run

Standard scripts in `package.json`: `npm run dev`, `npm run lint`, `npm run build`. Protected routes `/request` and `/mypage` require the `captain_phone` cookie (set on login); unauthenticated hits redirect to `/login` (see `middleware.ts`). `/admin` is intentionally unauthenticated.
