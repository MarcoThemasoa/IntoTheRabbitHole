// Lokasi: frontend/api/track.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_client.js';
import { TrackingSchema } from './schemas.js';
import {
  getClientId,
  checkRateLimit,
  rateLimitConfigs,
} from './ratelimit.js';
import { ZodError } from 'zod';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Validate request body
    let validatedData;
    try {
      validatedData = TrackingSchema.parse(req.body);
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`);
        return res.status(400).json({
          error: 'Validation failed',
          details: messages,
        });
      }
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const { page, referrer, visitorId } = validatedData;
    const clientId = getClientId(req, visitorId);

    // Apply rate limiting
    const { success, resetIn } = await checkRateLimit(
      clientId,
      rateLimitConfigs.tracking,
      'post_track'
    );

    if (!success) {
      res.setHeader('Retry-After', resetIn?.toString() || '60');
      return res.status(429).json({
        error: 'Too many tracking requests',
        retryAfter: resetIn,
      });
    }

    // Insert visitor if needed
    if (visitorId) {
      const { data: existingVisitor } = await supabase
        .from('visitors')
        .select('visitor_id')
        .eq('visitor_id', visitorId)
        .maybeSingle();

      if (!existingVisitor) {
        const { error: visitorError } = await supabase
          .from('visitors')
          .insert({ visitor_id: visitorId });

        if (visitorError) {
          console.error('Error inserting visitor:', visitorError);
          // Don't fail the request, just log it
        }
      }
    }

    // Insert page view
    const { error: pageViewError } = await supabase
      .from('page_views')
      .insert({
        visitor_id: visitorId || null,
        page,
        referrer: referrer || null,
        user_ip: clientId,
      });

    if (pageViewError) {
      console.error('Error tracking page view:', pageViewError);
      // Don't fail the request for tracking failures
    }

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}