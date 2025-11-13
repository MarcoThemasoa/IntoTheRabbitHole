// Lokasi: frontend/lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js';

// Vercel akan menyediakan variabel-variabel ini dari "Environment Variables"
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY; // Gunakan kunci 'anon' (public) Anda

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL or SUPABASE_KEY not set in Vercel Environment Variables");
}

// Ini adalah Supabase client *khusus server* kita
export const supabase = createClient(supabaseUrl, supabaseKey);