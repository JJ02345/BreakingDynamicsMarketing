// Supabase Client - Core Infrastructure
// Single source of truth for Supabase connection

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Security check: Fail fast in production without credentials
if (import.meta.env.PROD && (!supabaseUrl || !supabaseAnonKey)) {
  throw new Error(
    'SECURITY ERROR: Running in production without valid Supabase credentials!'
  );
}

// Development warning
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Core] Supabase credentials missing!\n' +
    'Please create a .env file with:\n' +
    '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key'
  );
}

export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

export default supabase;
