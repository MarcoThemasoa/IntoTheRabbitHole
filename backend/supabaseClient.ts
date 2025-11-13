import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL_V2!;
const supabaseKey = process.env.SUPABASE_KEY_V2!;

export const supabase = createClient(supabaseUrl, supabaseKey);