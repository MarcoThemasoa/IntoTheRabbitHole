// Lokasi: frontend/api/_client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Kita buat pesan error ini unik agar kita tahu kode baru kita berjalan
  throw new Error("!!_CLIENT.TS ERROR!! SUPABASE_URL or SUPABASE_KEY not found.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);