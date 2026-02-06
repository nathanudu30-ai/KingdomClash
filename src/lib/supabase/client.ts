import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabaseLegacyKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;
const fallbackSupabaseUrl = 'https://offline-preview.supabase.co';
const fallbackSupabaseKey = 'offline-preview-anon-key';

export const isSupabaseConfigured = Boolean(supabaseUrl && (supabaseAnonKey || supabaseLegacyKey));

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not configured. Running in offline preview mode (guest only). Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to enable full auth.'
  );
}

const resolvedSupabaseUrl = supabaseUrl ?? fallbackSupabaseUrl;
const resolvedSupabaseKey = supabaseAnonKey ?? supabaseLegacyKey ?? fallbackSupabaseKey;

export const supabase = createClient<Database>(resolvedSupabaseUrl, resolvedSupabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
