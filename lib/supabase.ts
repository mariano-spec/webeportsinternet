import { createClient } from '@supabase/supabase-js';

// Safely access environment variables
const env = typeof process !== 'undefined' && process.env ? process.env : {};

const supabaseUrl = env.SUPABASE_URL || '';
const supabaseKey = env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseKey !== '';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder'
);