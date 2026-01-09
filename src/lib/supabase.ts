import { createClient } from '@supabase/supabase-js';

/**
 * Public / browser-safe Supabase client
 * - Uses anon key
 * - RLS enforced
 */
const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!publicSupabaseUrl || !publicAnonKey) {
  throw new Error('Missing public Supabase environment variables');
}

export const supabase = createClient(publicSupabaseUrl, publicAnonKey);

/**
 * Admin Supabase client (SERVER ONLY)
 * - Uses service role key
 * - Bypasses RLS
 * - Must NEVER be imported into client components
 */
export const createAdminClient = () => {
  const adminSupabaseUrl = process.env.SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!adminSupabaseUrl || !serviceRoleKey) {
    throw new Error('Missing admin Supabase environment variables');
  }

  return createClient(adminSupabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
};
