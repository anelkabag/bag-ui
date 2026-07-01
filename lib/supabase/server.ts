import { createRouteHandlerSupabaseClient, createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import type { Database } from "@/types/supabase";

export const createSupabaseServerClient = () =>
  createServerComponentSupabaseClient<Database>({
    cookies,
    headers,
  });

export const createSupabaseRouteHandlerClient = () =>
  createRouteHandlerSupabaseClient<Database>({
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    cookies,
    headers,
  });
