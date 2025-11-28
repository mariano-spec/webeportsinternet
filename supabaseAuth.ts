import { supabase } from './lib/supabase';

export const loginAdmin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return null;
  return data.user;
};

export const logoutAdmin = async () => {
  await supabase.auth.signOut();
};