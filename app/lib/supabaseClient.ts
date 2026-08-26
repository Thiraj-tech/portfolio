import { createClient } from "@supabase/supabase-js";

// Falls back to a placeholder so `next build`'s static prerender doesn't
// throw when NEXT_PUBLIC_SUPABASE_* isn't set (e.g. local builds without
// .env configured yet) — Supabase calls just fail gracefully at runtime.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
