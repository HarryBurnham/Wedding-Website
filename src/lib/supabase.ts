/**
 * Public / browser-safe Supabase client
 * - Uses anon key
 * - RLS enforced
 */
import { createClient } from '@supabase/supabase-js';

/**
 * Public Supabase client (browser + server-safe)
 * - Uses anon key
 * - RLS enforced
 */
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publicAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!publicUrl || !publicAnonKey) {
  throw new Error('Missing public Supabase environment variables');
}

export const supabase = createClient(publicUrl, publicAnonKey, {
  auth: { persistSession: false },
  global: {
    fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }),
  },
});

/**
 * Admin Supabase client (SERVER ONLY)
 * - Uses service role key
 * - Bypasses RLS
 * - Must never be used in client components
 */
export const createAdminClient = () => {
  const adminUrl = process.env.SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!adminUrl || !serviceRoleKey) {
    throw new Error('Missing admin Supabase environment variables');
  }

  return createClient(adminUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
};
