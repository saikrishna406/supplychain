
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback to avoid app crash during development if keys are missing
const isConfigured = supabaseUrl && supabaseAnonKey;

if (!isConfigured) {
    console.warn("Supabase is not configured. Authentication will fail.");
}

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
);
