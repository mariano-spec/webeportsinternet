import { createClient } from '@supabase/supabase-js';

// Access variables injected by Vite via define in vite.config.ts
// We use empty string fallback to prevent "process is not defined" errors if logic fails
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

// Check if keys are actually set and not placeholders
export const isSupabaseConfigured = 
  supabaseUrl !== '' && 
  supabaseAnonKey !== '' && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('your_supabase_project_url');

if (!isSupabaseConfigured) {
  console.warn('Supabase URLs are missing or invalid in .env file. App will run in local mode (changes won\'t be saved to DB).');
}

// Initialize client with fallback to avoid runtime crashes if env vars are missing
// The client object is created but we won't use it if !isSupabaseConfigured
export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabaseAnonKey : 'placeholder'
);
