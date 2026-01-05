import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local');
}

// Create Supabase client with auth
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

const baseHeaders = {
  apikey: supabaseAnonKey || '',
  Authorization: `Bearer ${supabaseAnonKey || ''}`,
  'Content-Type': 'application/json'
};

export async function supabaseFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase env vars missing');
  }

  // Get the current session token if available
  const { data: { session } } = await supabase.auth.getSession();
  const authToken = session?.access_token || supabaseAnonKey;

  const headers = {
    ...baseHeaders,
    Authorization: `Bearer ${authToken}`,
    ...(init?.headers || {})
  };

  const res = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Supabase request failed (${res.status})`);
  }

  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return (await res.json()) as T;
  }

  return undefined as unknown as T;
}

// Helper to get user from Supabase users table, or create from auth if missing
export async function getUserFromSupabase(email: string): Promise<User | null> {
  try {
    // First, try to get user from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        department: data.department,
        avatarUrl: data.avatar_url,
      };
    }

    // If user doesn't exist in users table, try to get from auth and create a record
    if (error && error.code === 'PGRST116') { // No rows returned
      console.log('User not found in users table, checking auth user...');
      
      // Get the authenticated user's info
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Try to create a user record with default values
        const newUser = {
          id: authUser.id,
          email: email.toLowerCase(),
          name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || email.split('@')[0],
          role: 'RAAD_ANALYST' as const, // Default role
          department: null,
          avatar_url: authUser.user_metadata?.avatar_url || null,
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select()
          .single();

        if (createError) {
          console.error('Error creating user record:', createError);
          console.log('Attempted to create user:', newUser);
          // If we can't create (likely RLS issue), return a basic user object from auth
          console.warn('Falling back to auth user metadata. User may need to be added to users table manually.');
          return {
            id: authUser.id,
            name: newUser.name,
            email: email.toLowerCase(),
            role: 'RAAD_ANALYST',
            avatarUrl: newUser.avatar_url || undefined,
          };
        }

        console.log('Successfully created user record:', createdUser);

        return {
          id: createdUser.id,
          name: createdUser.name,
          email: createdUser.email,
          role: createdUser.role,
          department: createdUser.department,
          avatarUrl: createdUser.avatar_url,
        };
      }
    }

    console.error('Error fetching user:', error);
    return null;
  } catch (error) {
    console.error('Error in getUserFromSupabase:', error);
    return null;
  }
}

