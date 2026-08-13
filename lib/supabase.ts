'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

function getHybridStorage() {
  return {
    getItem: (key: string) => {
      if (typeof window === 'undefined') return null;
      return window.localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, value);
      try {
        const parsed = JSON.parse(value);
        if (parsed?.access_token) {
          const secure = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; secure' : '';
          document.cookie = `sb-access-token=${parsed.access_token}; path=/; max-age=${60 * 60 * 24 * 7}; samesite=lax${secure}`;
        }
      } catch {
        // ignore parse errors
      }
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
      document.cookie = 'sb-access-token=; path=/; max-age=0';
    },
  };
}

function createSafeClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: getHybridStorage(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

export const supabase = createSafeClient();

export async function signIn(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  // Clear cookie
  document.cookie = 'sb-access-token=; path=/; max-age=0';
}

export async function getSession() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/api/auth/callback`,
    },
  });
  if (error) throw error;
  return data;
}