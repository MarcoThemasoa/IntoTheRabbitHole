// Lokasi: frontend/api/stats.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_client.js';
import {
  getClientId,
  checkRateLimit,
  rateLimitConfigs,
} from './ratelimit.js';

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
      clientId,
      rateLimitConfigs.general,
      'get_stats'
    );

    if (!success) {
      res.setHeader('Retry-After', resetIn?.toString() || '60');
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: resetIn,
      });
    }

    // Get page views for this month only
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const { count: pageViewCount, error: viewError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStart);

    if (viewError) {
      console.error('Error counting page views:', viewError);
      throw viewError;
    }

    // Count total stories
    const { data: stories, error: storyError } = await supabase.rpc('count_stories');

    if (storyError) {
      console.error('Error counting stories:', storyError);
      throw storyError;
    }

    // Auto-cleanup: Delete tracking records older than 1 month
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('page_views').delete().lt('created_at', oneMonthAgo).then(() => {
      // Cleanup done, but don't fail the request if cleanup errors
    }).catch((err) => console.error('Cleanup warning:', err));

    // Cache response for 5 minutes
    res.setHeader('Cache-Control', 'max-age=300, s-maxage=3600');
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).json({
      totalVisitors: pageViewCount || 0,
      totalStories: (stories as number) || 0,
      period: `This month (${monthStart.split('T')[0]})`
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}   