// frontend/api/ratelimit.ts
import { supabase } from './_client.js';

/**
 * Rate limiting using Supabase PostgreSQL
 * No external services needed, everything in one place
 */

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number; // in milliseconds
}

// Rate limit configurations for different endpoints
export const rateLimitConfigs = {
  // Story submission limit: 5 submissions per hour per IP
  storySubmission: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
  // Tracking limit: 50 page views per minute per visitor
  tracking: {
    maxAttempts: 50,
    windowMs: 60 * 1000, // 1 minute
  },
  // General API limit: 100 requests per minute per IP
  general: {
    maxAttempts: 100,
    windowMs: 60 * 1000, // 1 minute
  },
};

/**
 * Get client identifier (IP address from request headers)
 */
export function getClientId(req: any, visitorId?: string): string {
  if (visitorId) return visitorId;

  const forwardedFor = req.headers['x-forwarded-for'];
  const clientIp = Array.isArray(forwardedFor)
    ? forwardedFor[0]
    : forwardedFor?.split(',')[0]?.trim() ||
      req.headers['x-real-ip'] ||
      req.socket?.remoteAddress ||
      'unknown';

  return clientIp;
}

/**
 * Check rate limit for an identifier
 * Returns { success: boolean, remaining: number, resetIn: number }
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
  endpoint: string
): Promise<{
  success: boolean;
  remaining?: number;
  resetIn?: number;
}> {
  try {
    const now = new Date();
    const windowStart = new Date(now.getTime() - config.windowMs);

    // Count recent attempts from this identifier
    const { count, error: countError } = await supabase
      .from('rate_limits')
      .select('*', { count: 'exact', head: true })
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('created_at', windowStart.toISOString());

    if (countError) {
      console.error('Rate limit check failed:', countError);
      // Fail open - allow request if rate limiter fails
      return { success: true };
    }

    const attempts = count || 0;

    if (attempts >= config.maxAttempts) {
      // Get the oldest attempt to calculate reset time
      const { data: oldestAttempt } = await supabase
        .from('rate_limits')
        .select('created_at')
        .eq('identifier', identifier)
        .eq('endpoint', endpoint)
        .gte('created_at', windowStart.toISOString())
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (oldestAttempt) {
        const resetTime = new Date(oldestAttempt.created_at).getTime() + config.windowMs;
        const resetIn = Math.ceil((resetTime - now.getTime()) / 1000);
        return { success: false, remaining: 0, resetIn };
      }

      return { success: false, remaining: 0, resetIn: Math.ceil(config.windowMs / 1000) };
    }

    // Record this attempt
    await supabase.from('rate_limits').insert({
      identifier,
      endpoint,
      created_at: now.toISOString(),
    });

    return {
      success: true,
      remaining: config.maxAttempts - attempts - 1,
    };
  } catch (error) {
    console.error('Unexpected rate limit error:', error);
    // Fail open - allow request if rate limiter fails
    return { success: true };
  }
}

/**
 * Clean up old rate limit records (keeps only recent 24 hours)
 * Called automatically with each stats request
 */
export async function cleanupOldRateLimits(): Promise<void> {
  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('rate_limits')
      .delete()
      .lt('created_at', oneDayAgo);

    if (error) {
      console.error('Rate limit cleanup error:', error);
    }
  } catch (error) {
    console.error('Unexpected cleanup error:', error);
  }
}

/**
 * Clean up old page view records (run via stats endpoint)
 * Keeps only the last month of page view data
 */
export async function cleanupOldPageViews(): Promise<void> {
  try {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from('page_views')
      .delete()
      .lt('created_at', oneMonthAgo);

    if (error) {
      console.error('Page view cleanup error:', error);
    }
  } catch (error) {
    console.error('Unexpected page view cleanup error:', error);
  }
}
