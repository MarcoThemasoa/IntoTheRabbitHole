// Lokasi: frontend/api/track.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_client.js'; // Impor client server kita

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { page, referrer } = req.body;
    
    // Ambil IP dari header Vercel
    const user_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const { error } = await supabase.from('page_views').insert({
      page: page,
      referrer: referrer,
      visited_at: new Date().toISOString(),
      // Kita juga bisa menyimpan IP jika Anda mau
      // user_ip: user_ip 
    });
    // Anda juga bisa memanggil RPC Anda:
    // const { error } = await supabase.rpc('track_page_view', { user_ip: String(user_ip) });

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}