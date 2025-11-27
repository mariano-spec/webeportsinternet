import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

/**
 * Login amb email i contrasenya
 * Només funciona amb usuaris creats a Supabase Authentication
 */
export const loginAdmin = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login error:', error.message);
      return null;
    }

    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email || '',
        role: 'admin', // Per ara, tots els usuaris autenticats són admin
      };
    }

    return null;
  } catch (err) {
    console.error('Login exception:', err);
    return null;
  }
};

/**
 * Logout de la sessió actual
 */
export const logoutAdmin = async (): Promise<void> => {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Logout error:', err);
  }
};

/**
 * Obté l'usuari actualment autenticat
 */
export const getCurrentAdmin = async (): Promise<AuthUser | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.user) {
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        role: 'admin',
      };
    }

    return null;
  } catch (err) {
    console.error('Get current admin error:', err);
    return null;
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        role: 'admin',
      });
    } else {
      callback(null);
    }
  });
};
