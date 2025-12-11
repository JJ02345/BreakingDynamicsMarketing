import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Security check: Warn if credentials are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️ Supabase credentials missing!\n' +
    'Please create a .env file with:\n' +
    '  VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '  VITE_SUPABASE_ANON_KEY=your-anon-key\n\n' +
    'See .env.example for reference.'
  );
}

// Security check: Warn if using placeholder in production
if (import.meta.env.PROD && (!supabaseUrl || supabaseUrl.includes('placeholder'))) {
  console.error('🚨 SECURITY: Running in production without valid Supabase credentials!');
}

export const supabase = createClient(
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
