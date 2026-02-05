import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabaseLegacyKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error('EXPO_PUBLIC_SUPABASE_URL is required to initialize Supabase.');
}

if (!supabaseAnonKey) {
  if (supabaseLegacyKey) {
    throw new Error(
      'EXPO_PUBLIC_SUPABASE_ANON_KEY is required. Rename EXPO_PUBLIC_SUPABASE_KEY to EXPO_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  throw new Error('EXPO_PUBLIC_SUPABASE_ANON_KEY is required to initialize Supabase.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
