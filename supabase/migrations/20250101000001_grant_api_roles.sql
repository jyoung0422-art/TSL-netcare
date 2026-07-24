-- Local-dev parity: grant the Supabase API roles access to the schema created by
-- 20250101000000_init.sql.
--
-- Hosted Supabase auto-grants these privileges when schema.sql is run in the SQL
-- editor, but the local CLI applies migrations without them, so service_role
-- (used by the app's server actions via the SUPABASE_SERVICE_ROLE_KEY) otherwise
-- gets "permission denied for table ..." (SQLSTATE 42501). This migration mirrors
-- Supabase's default grants and does not change behavior on a hosted project.

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
