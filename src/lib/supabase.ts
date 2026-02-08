
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase Config:', {
    url: supabaseUrl ? 'Set' : 'Missing',
    key: supabaseAnonKey ? 'Set' : 'Missing',
    fullUrl: supabaseUrl
});

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Please check your .env file.');
}

// Safe initialization to prevent Auth crash
const safeUrl = supabaseUrl && supabaseUrl.startsWith('http')
    ? supabaseUrl
    : 'https://placeholder.supabase.co';

const safeKey = supabaseAnonKey && supabaseAnonKey.length > 10
    ? supabaseAnonKey
    : 'placeholder-key';

export const supabase = createClient(safeUrl, safeKey);
