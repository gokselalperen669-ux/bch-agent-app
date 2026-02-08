import { createClient } from '@supabase/supabase-js';

// DIRECT DEBUG CONFIGURATION
// We are hardcoding these values temporarily to rule out environment variable issues on Vercel.
const supabaseUrl = 'https://vbsnrlohhgvqqzjxedpi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZic25ybG9oaGd2cXF6anhlZHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1MjY2NzMsImV4cCI6MjA4NjEwMjY3M30.I88EtlEJcYdwv2Hr3IM-CILZxrXDoMgJhSSUqzXOxZM';

console.log('Supabase Client: Using HARDCODED credentials');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // Keep session in local storage
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
});
