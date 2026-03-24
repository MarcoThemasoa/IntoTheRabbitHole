# Environment Variables Setup Guide

## Frontend Configuration

Update your `.env.local` file with your Supabase credentials:

```bash
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_anon_key_here
```

## Backend (API) Configuration - Rate Limiting

For rate limiting to work on Vercel, you need to set up Upstash Redis (serverless Redis):

### Step 1: Create Upstash Account
1. Go to https://console.upstash.com
2. Sign up for a free account
3. Click "Create Database"
4. Choose "Global" for best performance
5. Select your region

### Step 2: Get Your Credentials
1. Click on your database
2. Go to "REST API" tab
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

### Step 3: Add to Vercel Environment Variables

In your Vercel dashboard:

1. Go to Project Settings → Environment Variables
2. Add these variables:

```
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

Make sure to add them to:
- Production
- Preview
- Development

## Rate Limiting Configuration

Current rate limits are set as follows:

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /api/stories (submit) | 5 | 1 hour |
| POST /api/track (tracking) | 50 | 1 minute |
| GET /api/stories | 100 | 1 minute |
| GET /api/stats | 100 | 1 minute |

You can adjust these in `frontend/api/ratelimit.ts`

## Local Development without Rate Limiting

If `UPSTASH_REDIS_REST_URL` or `UPSTASH_REDIS_REST_TOKEN` are not set:
- The rate limiter will gracefully fail open (allow requests)
- You'll see console errors but won't break functionality
- Perfect for local development

## Testing Rate Limits Locally

```bash
# Install packages
npm install

# Set env vars locally (optional, for testing)
# export UPSTASH_REDIS_REST_URL=your_url
# export UPSTASH_REDIS_REST_TOKEN=your_token

# Run dev server
npm run dev
```

## Monitoring Rate Limits

Upstash provides analytics in their dashboard:
1. Go to your database
2. Click on "Commands" tab
3. See all rate limit checks in real-time

## Troubleshooting

### "terser not found" error
```bash
npm install terser --save-dev
```

### Rate limiter not working
1. Check `UPSTASH_REDIS_REST_URL` is correct
2. Verify token has sufficient permissions
3. Check Upstash dashboard for database status
4. Rate limiter fails open, so requests should still work

### Validation errors
1. Check your request body matches the schema
2. Ensure title/content lengths are within limits
3. Check console for ZodError messages

## Next Steps

1. Deploy to Vercel: `git push`
2. Set environment variables in Vercel dashboard
3. Test rate limiting with multiple rapid requests
4. Monitor analytics in Upstash dashboard

---

For more info:
- Upstash: https://upstash.com/docs
- Zod Validation: https://zod.dev
- Vercel Environment: https://vercel.com/docs/environment-variables
