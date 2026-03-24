// frontend/api/schemas.ts
import { z } from 'zod';

/**
 * Validation schemas for API request bodies
 * Used for runtime validation of incoming requests
 */

export const StorySchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(500, 'Title must not exceed 500 characters')
    .trim(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content must not exceed 10,000 characters')
    .trim(),
  is_anonymous: z.boolean().default(true),
  author_name: z.string()
    .max(200, 'Author name must not exceed 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
});

export const TrackingSchema = z.object({
  page: z.string()
    .min(1, 'Page is required')
    .url()
    .or(z.literal('/'))
    .or(z.literal('/stories'))
    .or(z.literal('/how-to-report'))
    .or(z.literal('/submit-story')),
  referrer: z.string().optional(),
  visitorId: z.string()
    .uuid('Invalid visitor ID')
    .optional(),
});

export const StatsQuerySchema = z.object({
  // GET endpoints typically don't have body, but adding for completeness
});

// Type exports for use in components
export type Story = z.infer<typeof StorySchema>;
export type Tracking = z.infer<typeof TrackingSchema>;
