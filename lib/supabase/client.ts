import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/types/supabase";

export const createSupabaseBrowserClient = () =>
  createBrowserSupabaseClient<Database>({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  });
