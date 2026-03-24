// Lokasi: frontend/api/stories.ts
import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_client.js';
import { StorySchema } from './schemas.js';
import { storyRateLimiter, getClientId, checkRateLimit } from './ratelimit.js';
import { ZodError } from 'zod';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    // --- Logika GET /stories (List approved stories) ---
    if (req.method === 'GET') {
      // Apply rate limiting
      const clientId = getClientId(req);
      const { success, remaining, resetIn } = await checkRateLimit(
        generalRateLimiter,
        `get_stories:${clientId}`
      );

      if (!success) {
        res.setHeader('Retry-After', resetIn?.toString() || '60');
        return res.status(429).json({
          error: 'Too many requests. Please try again later.',
          retryAfter: resetIn,
        });
      }

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to fetch stories' });
      }

      res.setHeader('Cache-Control', 'max-age=300, s-maxage=3600');
      return res.status(200).json({ stories: data });
    }
    
    // --- Logika POST /stories (Create new story) ---
    if (req.method === 'POST') {
      // Apply rate limiting for submissions
      const clientId = getClientId(req);
      const { success, remaining, resetIn } = await checkRateLimit(
        storyRateLimiter,
        `submit_story:${clientId}`
      );

      if (!success) {
        res.setHeader('Retry-After', resetIn?.toString() || '60');
        return res.status(429).json({
          error: 'Too many story submissions. You can submit 5 stories per hour.',
          retryAfter: resetIn,
          remaining: 0,
        });
      }

      // Validate request body
      let validatedData;
      try {
        validatedData = StorySchema.parse(req.body);
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

      // If not anonymous but no author name, return error
      if (!validatedData.is_anonymous && !validatedData.author_name?.trim()) {
        return res.status(400).json({
          error: 'Author name is required when not submitting anonymously',
        });
      }

      const storyData = {
        title: validatedData.title,
        content: validatedData.content,
        is_anonymous: validatedData.is_anonymous,
        author_name: validatedData.is_anonymous ? null : validatedData.author_name,
        status: 'approved', // Can be changed to 'pending' for moderation
      };

      const { data, error } = await supabase
        .from('stories')
        .insert(storyData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to create story' });
      }

      return res.status(201).json({ 
        story: data,
        message: 'Story submitted successfully',
      });
    }

    // Jika metode lain
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}