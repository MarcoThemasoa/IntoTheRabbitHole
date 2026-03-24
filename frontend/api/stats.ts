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
    
    console.log('=== STATS DEBUG ===');
    console.log('Current Date (local):', now.toString());
    console.log('Current Date (ISO):', now.toISOString());
    console.log('Month Start (local):', monthStart.toString());
    console.log('Month Start (ISO):', monthStartISO);
    
    // First, test: get ALL visitors count (no filter)
    const { count: totalAllTime, error: totalError } = await supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true });
    
    console.log('Total visitors ALL TIME:', totalAllTime, 'Error:', totalError);
    
    // Second, get this month's visitors with filter
    const { count: pageVisits, error: visitorError, data: sampleRows } = await supabase
      .from('visitors')
      .select('id, created_at', { count: 'exact' })
      .gte('created_at', monthStartISO)
      .limit(3);

    console.log('Page Visits THIS MONTH:', pageVisits, 'Error:', visitorError);
    console.log('Sample rows:', sampleRows?.map(r => ({ id: r.id, created_at: r.created_at })));

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

    // Auto-cleanup: Delete old records (older than 1 month) - ONLY if we have enough data
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    console.log('One month ago date:', oneMonthAgo);
    
    if (pageVisits && pageVisits > 10) {
      // Only cleanup if we have enough data
      console.log('Running cleanup: deleting records before', oneMonthAgo);
      await supabase.from('visitors').delete().lt('created_at', oneMonthAgo).then(() => {
        console.log('Cleanup completed');
      }).catch((err) => console.error('Cleanup warning:', err));
    } else {
      console.log('Skipping cleanup: pageVisits =', pageVisits);
    }

    // Cache response for 5 minutes
    res.setHeader('Cache-Control', 'max-age=300, s-maxage=3600');
    res.setHeader('Content-Type', 'application/json');
    
    const response = {
      totalVisitors: pageVisits || 0,
      totalStories: (stories as number) || 0,
      period: `This month (${monthStartISO.split('T')[0]})`,
      _debug: { totalAllTime, monthStartISO, now: now.toISOString() }
    };
    
    console.log('Stats Response:', response);
    console.log('=== END STATS DEBUG ===');
    
    res.status(200).json(response);
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}   