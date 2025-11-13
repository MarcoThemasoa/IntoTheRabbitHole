// Lokasi: frontend/api/stats.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from 'lib/supabaseServer'; // Impor client server kita

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data: visitors, error: visitorError } = await supabase.rpc('count_page_views');
    const { data: stories, error: storyError } = await supabase.rpc('count_stories');

    if (visitorError) throw visitorError;
    if (storyError) throw storyError;

    res.status(200).json({
      totalVisitors: (visitors as number) || 0,
      totalStories: (stories as number) || 0,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}   