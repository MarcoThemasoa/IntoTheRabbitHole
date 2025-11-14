// Lokasi: frontend/api/track.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_client.js'; // Pastikan .js ada di akhir

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { page, referrer, visitorId } = req.body;
    const user_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // --- INI PERBAIKANNYA: Logika "Insert or Ignore" yang lebih aman ---
    if (visitorId) {
      // 2. Cek apakah visitorId sudah ada di database
      const { data: existingVisitor } = await supabase
        .from('visitors')
        .select('visitor_id')
        .eq('visitor_id', visitorId)
        .maybeSingle();

      // 3. Jika TIDAK ADA, baru masukkan
      if (!existingVisitor) {
        const { error: visitorError } = await supabase
          .from('visitors')
          .insert({ visitor_id: visitorId }); // <- INSERT SEDERHANA

        if (visitorError) {
           // Ini akan menangkap error jika terjadi konflik unik
           throw visitorError;
        }
      }
    }
    // --- AKHIR PERBAIKAN ---

    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}