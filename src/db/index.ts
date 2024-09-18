import { createClient } from "@supabase/supabase-js";
import { db, runMigrations } from "./drizzle";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Run migrations (you should run this separately in production)
runMigrations().catch(console.error);

export { supabase, db };
