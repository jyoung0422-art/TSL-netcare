# AGENTS.md

## Cursor Cloud specific instructions

TSL NetCare is a single Next.js 15 (App Router, React 19, Turbopack) application whose
only backend is Supabase (Postgres + Storage). Server Actions in `lib/actions/*` talk to
Supabase using the `service_role` key, so the app cannot run without a reachable Supabase
instance. In Cursor Cloud we run a **local** Supabase stack via the Supabase CLI + Docker;
no hosted project or external secrets are required.

### Services

- Next.js dev server — `npm run dev` (Turbopack, http://localhost:3000).
- Local Supabase stack — `supabase start` (API on http://127.0.0.1:54321, Studio on
  http://127.0.0.1:54323). Requires a running Docker daemon.

### Startup (not handled by the update script)

Docker and the Supabase CLI are preinstalled in the VM image, but services are not running
on boot, so start them each session:

1. Start the Docker daemon (needs the Docker-in-Docker workaround already baked into the
   image — `fuse-overlayfs` storage driver + `containerd-snapshotter` disabled in
   `/etc/docker/daemon.json`, and legacy iptables):
   `sudo tmux -f /exec-daemon/tmux.portal.conf new-session -d -s dockerd dockerd`
   then `sudo chmod 666 /var/run/docker.sock` so Docker is usable without sudo.
2. `supabase start` from the repo root. This applies `supabase/migrations/*` (the schema)
   and auto-creates the public `request-photos` / `completion-photos` storage buckets
   declared in `supabase/config.toml`.
3. Ensure `.env.local` exists (it is git-ignored). The local stack always prints the same
   default demo keys, so `.env.local` should contain:
   - `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from `supabase start`>`
   - `SUPABASE_SERVICE_ROLE_KEY=<service_role key from `supabase start`>`
   - `NEXT_PUBLIC_APP_URL=http://localhost:3000`
4. `npm run dev`.

### Gotchas

- The DB is empty on a fresh `supabase start`; there is no seed data. Register a captain
  (phone + ship name) via `/login` → `/register` before requests/mypage/admin show data.
- `/request` and `/mypage` are gated by `middleware.ts` on the `captain_phone` cookie set
  during login — hitting them directly without logging in redirects to `/login`.
- To reset the database to a clean schema state: `supabase db reset`.
- `supabase/schema.sql` is the canonical schema; it is duplicated into
  `supabase/migrations/20250101000000_init.sql` so the CLI applies it automatically.
- `supabase/migrations/20250101000001_grant_api_roles.sql` grants the Supabase API
  roles (incl. `service_role`, which the app uses) access to the schema. Without it the
  local CLI-applied schema returns `permission denied for table ...` (hosted Supabase
  adds these grants automatically). RLS is intentionally not used — every DB call goes
  through the `service_role` key, which bypasses RLS.
- Do NOT run `npm run build` while `npm run dev` is running: both write to `.next` and
  it corrupts the dev build / server-action ids (symptoms: "Internal Server Error" or a
  hanging/404 server action). If it happens, stop dev, `rm -rf .next`, restart `npm run dev`.

### Lint / build

- Lint: `npm run lint` (`next lint`).
- Build: `npm run build`. Standard commands live in `package.json`.
