// Lokasi: frontend/api/stats.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_client.js';
import { generalRateLimiter, getClientId, checkRateLimit } from './ratelimit.js';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Apply rate limiting
    const clientId = getClientId(req);
    const { success, resetIn } = await checkRateLimit(
      generalRateLimiter,
      `get_stats:${clientId}`
    );

    if (!success) {
      res.setHeader('Retry-After', resetIn?.toString() || '60');
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: resetIn,
      });
    }

    // Call Supabase RPC functions for aggregated data
    const { data: visitors, error: visitorError } = await supabase.rpc('count_page_views');
    const { data: stories, error: storyError } = await supabase.rpc('count_stories');

    if (visitorError) {
      console.error('Error counting visitors:', visitorError);
      throw visitorError;
    }
    if (storyError) {
      console.error('Error counting stories:', storyError);
      throw storyError;
    }

    // Cache response for 5 minutes
    res.setHeader('Cache-Control', 'max-age=300, s-maxage=3600');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json({
      totalVisitors: (visitors as number) || 0,
      totalStories: (stories as number) || 0,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}   