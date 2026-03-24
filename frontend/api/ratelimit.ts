// frontend/api/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

/**
 * Initialize rate limiter with Upstash Redis
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars
 */

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

/**
 * Create different rate limiters for different endpoints
 */

// Story submission limit: 5 submissions per hour per IP
export const storyRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'),
  analytics: true,
  prefix: 'ratelimit:story',
});

// Tracking limit: 50 page views per minute per visitor
export const trackingRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, '1 m'),
  analytics: true,
  prefix: 'ratelimit:tracking',
});

// General API limit: 100 requests per minute per IP
export const generalRateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, '1 m'),
  analytics: true,
  prefix: 'ratelimit:general',
});

/**
 * Get client identifier (prefer user ID, fallback to IP)
 */
export function getClientId(
  req: any,
  visitorId?: string
): string {
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
 * Utility to check rate limit and return response if exceeded
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string
): Promise<{ success: boolean; remaining?: number; resetIn?: number }> {
  try {
    const { success, remaining, resetIn } = await limiter.limit(identifier);
    return { success, remaining, resetIn };
  } catch (error) {
    console.error('Rate limit check failed:', error);
    // Fail open - allow request if rate limiter fails
    return { success: true };
  }
}
