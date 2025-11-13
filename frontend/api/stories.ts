// Lokasi: frontend/api/stories.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_client'; // Impor client server kita

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // --- Logika GET /stories (dari list.ts) ---
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ stories: data });
    }
    
    // --- Logika POST /stories (dari create.ts) ---
    if (req.method === 'POST') {
      const { title, content, is_anonymous, author_name } = req.body;

      const storyData = {
        title,
        content,
        is_anonymous,
        author_name: is_anonymous ? null : author_name,
        status: 'approved', // Anda bisa ubah ke 'pending' jika ingin moderasi
      };

      const { data, error } = await supabase
        .from('stories')
        .insert(storyData)
        .select() // Pastikan untuk .select() agar mengembalikan data baru
        .single(); // Karena kita hanya membuat satu

      if (error) throw error;
      return res.status(201).json({ story: data });
    }

    // Jika metode lain
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}