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

    // Get total page visits for this month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartISO = monthStart.toISOString();
    
    console.log('Stats Request - Current Date:', now.toISOString());
    console.log('Stats Request - Month Start:', monthStartISO);
    
    // Query visitors table - count all rows from this month (each row = one page visit)
    const { count: pageVisits, error: visitorError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthStartISO);

    console.log('Page Visits This Month:', pageVisits, 'Error:', visitorError);

    if (visitorError) {
      console.error('Error counting visitors:', visitorError);
      throw visitorError;
    }

    // Count total stories
    const { data: stories, error: storyError } = await supabase.rpc('count_stories');

    if (storyError) {
      console.error('Error counting stories:', storyError);
      throw storyError;
    }

    // Auto-cleanup: Delete old records (older than 1 month)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    if (pageVisits && pageVisits > 10) {
      // Only cleanup if we have enough data
      await supabase.from('visitors').delete().lt('created_at', oneMonthAgo).then(() => {
        console.log('Cleanup completed');
      }).catch((err) => console.error('Cleanup warning:', err));
    }

    // Cache response for 5 minutes
    res.setHeader('Cache-Control', 'max-age=300, s-maxage=3600');
    res.setHeader('Content-Type', 'application/json');
    
    const response = {
      totalVisitors: pageVisits || 0,
      totalStories: (stories as number) || 0,
      period: `This month (${monthStartISO.split('T')[0]})`
    };
    
    console.log('Stats Response:', response);
    
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}   