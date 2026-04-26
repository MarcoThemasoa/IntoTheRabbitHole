# LAPORAN LENGKAP STRUKTUR WEBSITE
## DeepfakeAware - Platform Edukasi dan Pelaporan Kasus Deepfake di Indonesia

**Tanggal Laporan:** April 4, 2026  
**Nama Proyek:** DeepfakeAware  
**Target Pengguna:** Korban Deepfake Scams/Terror di Indonesia  
**Teknologi Utama:** React 19 + TypeScript + Vercel + Supabase

---

## 📋 DAFTAR ISI
1. [Overview Proyek](#overview-proyek)
2. [Teknologi & Tech Stack](#teknologi--tech-stack)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Struktur Direktori](#struktur-direktori)
5. [Backend & Database](#backend--database)
6. [Frontend Architecture](#frontend-architecture)
7. [API & Integration](#api--integration)
8. [Styling & UI](#styling--ui)
9. [Komponen & Pages](#komponen--pages)
10. [Security & Rate Limiting](#security--rate-limiting)
11. [Performance Optimization](#performance-optimization)
12. [Deployment & Hosting](#deployment--hosting)

---

## 🎯 1. OVERVIEW PROYEK

### Deskripsi
DeepfakeAware adalah sebuah platform web yang dirancang untuk membantu korban kasus deepfake (penipuan dan terror menggunakan deepfake) di Indonesia dengan tujuan:

- ✅ Membantu korban menemukan keadilan
- ✅ Memberikan panduan cara melaporkan kasus
- ✅ Menampilkan kisah dari korban lain
- ✅ Memberikan insights untuk meningkatkan kewaspadaan
- ✅ Memungkinkan korban berbagi cerita (dengan opsi anonim)

### Target Pengguna
- Korban deepfake scams
- Korban deepfake terror/berbentuk kekerasan
- Masyarakat umum yang ingin belajar
- Aktivis dan organisasi perlindungan

### Fitur Utama
1. **Home Page** - Landing page dengan informasi umum
2. **Cara Melapor** - Panduan lengkap proses pelaporan
3. **Kisah Korban** - Galeri cerita dari korban lain
4. **Bagikan Kisah** - Form untuk mensubmit cerita baru
5. **Analytics** - Statistik pengunjung dan cerita

---

## 🛠️ 2. TEKNOLOGI & TECH STACK

### Frontend
```
React 19.1.0                    - UI Framework utama
TypeScript 5.8.3                - Type safety dan development experience
Vite 7.2.2                      - Build tool modern & fast
TailwindCSS 4.1.11              - Utility-first CSS Framework
```

### UI & Components
```
Radix UI                        - Headless UI components
  - @radix-ui/react-checkbox   - Checkbox component
  - @radix-ui/react-slot       - Slot composition
  - @radix-ui/react-toast      - Toast notifications
Lucide React 0.484.0            - Icon library
```

### Data & State Management
```
@tanstack/react-query 5.85.0    - Server state & caching
@supabase/supabase-js 2.81.1    - Database & backend-as-service
Zod 3.22.0                      - Schema validation & type inference
```

### Routing & Animation
```
React Router DOM 7.6.3          - Client-side routing
Anime.js 4.2.2                  - Animation library
GSAP 3.13.0                     - Animation & tweening
OGL 1.0.11                      - WebGL rendering
```

### Utilities
```
clsx 2.1.1                      - Class name concatenation
tailwind-merge 3.3.1            - TailwindCSS class conflict resolver
react-datepicker 8.9.0          - Date picker component
class-variance-authority 0.7.1  - CSS-in-JS utility
```

### Build & Deployment
```
Vercel                          - Hosting & serverless functions
@vercel/node 5.5.5              - Node.js runtime untuk Vercel
Terser 5.33.0                   - JavaScript minifier
Lightning CSS 1.29.2            - Modern CSS processor
```

---

## 🏗️ 3. ARSITEKTUR SISTEM

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Components                                    │  │
│  │  - Navigation, Home, Stories, SubmitStory, etc     │  │
│  │  - Custom UI Components (Button, Input, Toast)     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  State Management & Data Fetching                    │  │
│  │  - React Query (TanStack Query)                      │  │
│  │  - Visitor ID Management (localStorage)             │  │
│  │  - Animation & Effects (GSAP, Anime.js)             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
            ┌───────────────────────────────┐
            │   VERCEL EDGE / SERVERLESS    │
            ├───────────────────────────────┤
            │  API Routes:                  │
            │  - /api/stories (GET, POST)   │
            │  - /api/stats (GET)           │
            │  - /api/track (POST)          │
            │                               │
            │  Rate Limiting & Validation   │
            │  - Zod Schema validation      │
            │  - IP-based rate limiter      │
            └───────────────────────────────┘
                            ↓
            ┌───────────────────────────────┐
            │      SUPABASE (PostgreSQL)    │
            ├───────────────────────────────┤
            │  Tables:                      │
            │  - stories                    │
            │  - page_views (tracking)      │
            │  - rate_limits                │
            │                               │
            │  RPC Functions:               │
            │  - count_page_views()         │
            │  - count_stories()            │
            └───────────────────────────────┘
```

### Data Flow

```
1. USER VISIT:
   User → [React App] → Tracking API → [Supabase] 
   
2. VIEW STORIES:
   User → Fetch /api/stories → [Supabase] → Display Stories
   
3. SUBMIT STORY:
   User Form → Validate (Zod) → POST /api/stories → [Supabase]
   → Store Story → Confirmation Toast
   
4. GET STATS:
   Dashboard → Query /api/stats → [Supabase RPC] → Display Metrics
```

---

## 📁 4. STRUKTUR DIREKTORI

```
DeepfakeAware/
├── package.json                 # Root workspace config
├── README.md                    # Project documentation
├── node_modules/                # Dependencies
│
└── frontend/                    # Frontend application
    ├── package.json             # Frontend dependencies
    ├── vite.config.ts           # Vite build configuration
    ├── tsconfig.json            # TypeScript configuration
    ├── index.html               # HTML entry point
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Root component with routing
    ├── index.css                # Global styles
    ├── components.json          # Shadcn/ui configuration
    ├── vite-env.d.ts            # Vite type definitions
    ├── vercel.json              # Vercel deployment config
    │
    ├── public/                  # Static assets
    │   └── [images, icons, etc]
    │
    ├── api/                     # Backend API handlers (Vercel Functions)
    │   ├── _client.ts           # Supabase client initialization
    │   ├── schemas.ts           # Zod validation schemas
    │   ├── ratelimit.ts         # Rate limiting logic
    │   ├── stories.ts           # Stories CRUD API
    │   ├── stats.ts             # Analytics API
    │   └── track.ts             # User tracking API
    │
    ├── components/              # Reusable React components
    │   ├── Navigation.tsx        # Navigation bar
    │   ├── Footer.tsx            # Footer component
    │   ├── ErrorBoundary.tsx     # Error boundary wrapper
    │   ├── GlassSurface.tsx      # Glass morphism UI effect
    │   ├── FaultyTerminal.tsx    # Terminal effect animation
    │   ├── StatCard.tsx          # Statistic card component
    │   ├── TextType.tsx          # Text typing animation
    │   │
    │   └── ui/                  # Shadcn/ui components
    │       ├── button.tsx        # Button component
    │       ├── checkbox.tsx      # Checkbox component
    │       ├── input.tsx         # Input field
    │       ├── textarea.tsx      # Textarea field
    │       ├── toast.tsx         # Toast notification
    │       ├── toaster.tsx       # Toast container
    │       └── use-toast.ts      # Toast hook
    │
    ├── pages/                   # Page components (routed)
    │   ├── Home.tsx             # Homepage (/)
    │   ├── HowToReport.tsx       # Report guide (/how-to-report)
    │   ├── Stories.tsx          # Stories gallery (/stories)
    │   └── SubmitStory.tsx      # Story submission (/submit-story)
    │
    ├── lib/                     # Utilities & helpers
    │   ├── types.ts             # TypeScript type definitions
    │   └── utils.ts             # Helper functions
    │
    └── [generated files]
        └── node_modules/
```

---

## 💾 5. BACKEND & DATABASE

### Platform: Supabase (PostgreSQL)

Supabase adalah Backend-as-a-Service yang menyediakan:
- PostgreSQL Database
- Real-time subscriptions
- Authentication & Authorization
- Vector & Full-text search
- File Storage

### Database Schema

#### Table: `stories`
```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL (max 10,000 chars),
  author_name VARCHAR(200),
  is_anonymous BOOLEAN DEFAULT true,
  status VARCHAR(50) CHECK (status IN ('pending', 'approved', 'rejected')),
  user_id UUID,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  INDEXES:
  - idx_stories_status: status
  - idx_stories_created_at: created_at DESC
  - idx_stories_user_id: user_id
);

STRUKTUR KOLOM:
├── id: Unique identifier untuk setiap story
├── title: Judul cerita (5-500 karakter)
├── content: Isi cerita lengkap (10-10,000 karakter)
├── author_name: Nama penulis (bisa null jika anonymous)
├── is_anonymous: Flag untuk anonimitas
├── status: Workflow status (pending review, approved, rejected)
├── user_id: Referensi ke user (jika authenticated)
├── created_at: Timestamp pembuatan
└── updated_at: Timestamp update terakhir
```

#### Table: `page_views`
```sql
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page VARCHAR(255) NOT NULL,
  visitor_id UUID,
  ip_address INET,
  referrer VARCHAR(255),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT now(),
  
  INDEXES:
  - idx_page_views_page: page
  - idx_page_views_visitor_id: visitor_id
  - idx_page_views_created_at: created_at DESC
);

TRACKING DATA:
├── page: URL/halaman yang dikunjungi
├── visitor_id: UUID unik per browser (dari localStorage)
├── ip_address: IP address pengunjung
├── referrer: Halaman asal (from mana user datang)
├── user_agent: Browser info
└── created_at: Waktu kunjungan
```

#### Table: `rate_limits`
```sql
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,
  endpoint VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  
  INDEXES:
  - idx_rate_limits_identifier_endpoint: (identifier, endpoint, created_at)
);

UNTUK SECURITY:
├── identifier: IP address atau visitor ID
├── endpoint: Endpoint API (get_stories, post_stories, etc)
└── created_at: Timestamp request
```

### RPC Functions (Stored Procedures)

```plpgsql
-- Hitung total halaman yang diview
CREATE OR REPLACE FUNCTION count_page_views()
RETURNS BIGINT AS $$
  SELECT COUNT(DISTINCT visitor_id)
  FROM page_views
$$ LANGUAGE SQL;

-- Hitung total cerita yang disetujui
CREATE OR REPLACE FUNCTION count_stories()
RETURNS BIGINT AS $$
  SELECT COUNT(*)
  FROM stories
  WHERE status = 'approved'
$$ LANGUAGE SQL;
```

### Connection & Authentication

```typescript
// _client.ts
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Environment variables yang dibutuhkan:
// SUPABASE_URL: https://[project-id].supabase.co
// SUPABASE_KEY: anon key untuk public access
```

---

## 🎨 6. FRONTEND ARCHITECTURE

### State Management

```typescript
// React Query Configuration (App.tsx)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 minutes,      // Data dianggap fresh selama 5 menit
      gcTime: 10 minutes,        // Cache in memory selama 10 menit
    },
  },
});

// Query Keys Convention:
// ["stats"]        - Analytics statistics
// ["stories"]      - List of approved stories
// ["story", id]    - Single story detail
```

### Routing Configuration

```typescript
// App.tsx - Route Structure
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/how-to-report" element={<HowToReport />} />
    <Route path="/stories" element={<Stories />} />
    <Route path="/submit-story" element={<SubmitStory />} />
  </Routes>
</BrowserRouter>

PAGES:
├── / (Home)
│   ├── Hero Section with Terminal Animation
│   ├── Statistics Display
│   ├── Feature Overview
│   └── Call-to-Action Buttons
│
├── /how-to-report
│   ├── Step-by-step guide
│   ├── Contact information
│   └── Legal information
│
├── /stories
│   ├── Stories list with filters
│   ├── Search functionality
│   └── Story details modal
│
└── /submit-story
    ├── Story form
    ├── Anonymous toggle
    ├── Validation feedback
    └── Submit confirmation
```

### Error Handling

```typescript
// ErrorBoundary.tsx
- Catches React component errors
- Displays fallback UI
- Prevents white screen of death
- Logs errors untuk debugging

// Component-level error handling:
- Try-catch di async operations
- Zod validation untuk input validation
- Toast notifications untuk user feedback
```

---

## 🔌 7. API & INTEGRATION

### API Endpoints

#### GET /api/stories
**Purpose:** Retrieve approved stories list  
**Rate Limit:** 100 requests/minute per IP  
**Cache:** 5 min (max-age=300), 1 hour (s-maxage=3600)

```typescript
// Request
GET /api/stories

// Response (200 OK)
{
  "stories": [
    {
      "id": "uuid",
      "title": "Pengalaman saya dengan deepfake",
      "content": "Cerita lengkap...",
      "author_name": "Rina Wijaya",
      "is_anonymous": false,
      "status": "approved",
      "created_at": "2026-03-15T10:30:00Z"
    }
  ]
}

// Rate Limit Response (429)
{
  "error": "Too many requests. Please try again later.",
  "retryAfter": 45
}
```

#### POST /api/stories
**Purpose:** Submit new story  
**Rate Limit:** 5 submissions/hour per IP  
**Validation:** Zod schema validation

```typescript
// Request
POST /api/stories
Content-Type: application/json

{
  "title": "Pengalaman saya...",
  "content": "Cerita lengkap minimal 10 karakter...",
  "is_anonymous": true,
  "author_name": null or "Nama Penulis"
}

// Response (201 Created)
{
  "data": {
    "id": "uuid",
    "title": "...",
    "content": "...",
    ...
  },
  "message": "Story submitted successfully"
}

// Validation Error Response (400)
{
  "error": "Validation failed",
  "details": [
    "title: Title must be at least 5 characters",
    "content: Content must be at least 10 characters"
  ]
}

// Rate Limit Response (429)
{
  "error": "Too many story submissions. You can submit 5 stories per hour.",
  "retryAfter": 3600,
  "remaining": 0
}
```

#### GET /api/stats
**Purpose:** Get analytics statistics  
**Rate Limit:** 100 requests/minute per IP  
**Cache:** 5 min (max-age=300), 1 hour (s-maxage=3600)

```typescript
// Request
GET /api/stats

// Response (200 OK)
{
  "totalVisitors": 1245,
  "totalStories": 87,
  "data": {
    "visitors": 1245,
    "stories": 87
  }
}

// Field Explanation:
// totalVisitors: Count distinct visitor_id dari page_views
// totalStories: Count stories dengan status 'approved'
```

#### POST /api/track
**Purpose:** Track page visits & user behavior  
**Rate Limit:** 50 views/minute per visitor  
**Validation:** Zod schema validation

```typescript
// Request
POST /api/track
Content-Type: application/json

{
  "page": "/",
  "referrer": "google.com",
  "visitorId": "uuid-dari-localStorage"
}

// Response (201 Created)
{
  "success": true,
  "message": "Page view tracked"
}

// Validation Error Response (400)
{
  "error": "Validation failed",
  "details": [
    "page: Invalid URL format"
  ]
}
```

---

## 🎨 8. STYLING & UI

### CSS Framework: TailwindCSS v4

```typescript
// vite.config.ts - Tailwind integration
plugins: [
  react(),
  tailwindcss(),  // Vite plugin untuk TailwindCSS
]

// Build optimization:
chunkSizeWarningLimit: 1000,
manualChunks: {
  'vendor': ['react', 'react-dom', 'react-router-dom'],
  'ui': ['@radix-ui/...'],
  'animations': ['animejs', 'gsap'],
  'graphics': ['ogl'],
  'data': ['@tanstack/react-query', '@supabase/supabase-js'],
}
```

### Design System

```
COLOR PALETTE:
├── Primary: Blue (#000080 to #1e3a8a)
├── Secondary: Purple (#8b5cf6)
├── Accent: White/Transparent (glass morphism)
└── Background: Gradient (blue-50 to white)

TYPOGRAPHY:
├── Headings: Bold, Large (responsive)
├── Body: Regular, 16px default
└── Monospace: For code/terminal effects

SPACING:
├── Padding: 4px increments (0, 4, 8, 12, 16...)
├── Margins: 4px increments
└── Gap: 4px increments (flexbox/grid)

SHADOWS:
├── Small: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
├── Medium: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
└── Large: 0 20px 25px -5px rgba(0, 0, 0, 0.1)

ANIMATIONS:
├── Duration: 150ms, 300ms, 500ms (standard)
├── Easing: ease-out, ease-in-out (cubic-bezier)
└── Effects: Fade, Scale, Slide (Tailwind built-in)
```

### Glass Morphism Effect

```typescript
// GlassSurface.tsx - Reusable glass effect component
className={`
  bg-white/80
  bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_40%),...]
  backdrop-blur-2xl
  shadow-[0_8px_30px_rgba(0,0,0,0.12)]
  border border-white/40
  supports-[backdrop-filter]:bg-white/70
`}

EFFECT:
- Translucent white background (80% opacity)
- Radial gradients untuk highlight
- Backdrop blur untuk frosted glass effect
- Subtle shadow untuk depth
- Border dengan opacity untuk edge definition
```

### Responsive Design

```typescript
// Breakpoints (TailwindCSS default):
sm: 640px    - Tablets
md: 768px    - Small laptops
lg: 1024px   - Laptops
xl: 1280px   - Desktops
2xl: 1536px  - Large displays

// Mobile-first approach:
// Base styles → apply mobile defaults
// sm: → tablet optimizations
// lg: → desktop layout adjustments
```

---

## 🧩 9. KOMPONEN & PAGES

### Components Overview

#### Navigation.tsx
```
Fitur:
✓ Sticky navigation dengan scroll detection
✓ Mobile hamburger menu
✓ Glass morphism styling
✓ Active link highlighting
✓ Responsive design
✓ Smooth animations pada scroll

Props: None (menggunakan location dari React Router)
State Management:
- mobileMenuOpen: untuk toggle mobile menu
- scrolled: untuk detect scroll position

Links:
- / (Beranda)
- /how-to-report (Cara Melapor)
- /stories (Kisah Korban)
- /submit-story (Bagikan Kisah)
```

#### Home.tsx
```
Fitur:
✓ Hero section dengan Terminal animation (FaultyTerminal)
✓ Statistics display (dari /api/stats)
✓ Feature cards
✓ Call-to-action buttons
✓ Intersection Observer untuk scroll animations
✓ Lazy loading komponen non-critical

Performance Optimizations:
- Lazy load FaultyTerminal component
- Prefetch stories data saat page load
- requestIdleCallback untuk non-blocking tasks
- Intersection Observer untuk efficient animations

Data Fetching:
- useQuery untuk stats (TanStack Query)
- Prefetch stories saat idle
- Tracking visitor activity
```

#### Stories.tsx
```
Fitur:
✓ Display list of approved stories
✓ Search/filter functionality
✓ Story detail modal
✓ Sort by date/popularity
✓ Pagination

Komponen Support:
- StatCard.tsx untuk summary
- Story list dengan infinite scroll (optional)
```

#### SubmitStory.tsx
```
Fitur:
✓ Form untuk submit cerita baru
✓ Title input (5-500 chars validated)
✓ Content textarea (10-10,000 chars validated)
✓ Anonymous toggle
✓ Author name field (conditional)
✓ Real-time validation feedback
✓ Submit button dengan loading state
✓ Success/error toast notifications

Form Validation (Zod):
- Title: min 5, max 500 chars, trimmed
- Content: min 10, max 10,000 chars, trimmed
- is_anonymous: boolean, default true
- author_name: max 200 chars, required if not anonymous

Error Handling:
- Display validation errors per field
- Toast notification untuk success/error
- Rate limit feedback jika sudah submit terlalu banyak
```

#### Counter/StatCard.tsx
```
Props:
- label: string (label statistik)
- value: number (nilai yang ditampilkan)
- icon: ReactNode (ikon untuk stat)
- trend?: number (untuk trend indicator)

Features:
- Animated number increment
- Icon display
- Responsive sizing
```

#### ErrorBoundary.tsx
```
Purpose:
- Catch JavaScript errors di component tree
- Display fallback UI
- Prevent white screen of death

Error Logging:
- Console error untuk development
- Could be sent to error tracking service
```

#### FaultyTerminal.tsx
```
Features:
- WebGL-based terminal effect animation
- Using OGL library untuk graphics
- Mouse reactivity optional
- Customizable glitch/flicker effects
- Grid-based digital display

Props:
- eventTargetRef: untuk mouse events
- scale: zoom level
- gridMul: grid dimensions multiplier
- digitSize: size of digits
- timeScale: animation speed
- curvature: distortion effect
- scanlineIntensity: CRT scanline effect
- glitchAmount: glitch effect intensity
- flickerAmount: flicker effect
- noiseAmp: noise amplitude
- tint: color tint
- gradientStartColor: start gradient color
- gradientEndColor: end gradient color
- mouseReact: enable mouse reactivity
- mouseStrength: mouse interaction strength
- pageLoadAnimation: animate on page load
- brightness: brightness level
```

#### UI Components (shadcn/ui)
```
button.tsx
├── Variants: default, primary, secondary, destructive
├── Sizes: sm, md, lg
├── States: normal, hover, active, disabled
├── Features: Loading state, Icon support

input.tsx
├── Types: text, email, password, number, date
├── Validation states: error, success
├── Placeholder support
├── Disabled state

textarea.tsx
├── Resizable textarea
├── Character counter (optional)
├── Placeholder support
├── Validation states

checkbox.tsx
├── Radix UI based
├── Labeled support
├── Disabled state
├── Checked state

toast.tsx & toaster.tsx & use-toast.ts
├── Toast hook untuk trigger notifications
├── Types: success, error, warning, info
├── Auto-dismiss timer
├── Close button
├── Action button support

Example:
const { toast } = useToast();
toast({
  title: "Success!",
  description: "Story submitted successfully",
  variant: "default"
});
```

---

## 🔒 10. SECURITY & RATE LIMITING

### Rate Limiting Strategy

Rate limiting diimplementasikan menggunakan **Supabase PostgreSQL** tanpa external service:

```typescript
// Configuration (ratelimit.ts)
rateLimitConfigs = {
  storySubmission: {
    maxAttempts: 5,
    windowMs: 60 * 60 * 1000  // 1 hour
  },
  tracking: {
    maxAttempts: 50,
    windowMs: 60 * 1000         // 1 minute
  },
  general: {
    maxAttempts: 100,
    windowMs: 60 * 1000          // 1 minute
  }
}

RATE LIMITS:
├── Story Submission: 5 per jam per IP
├── Page Tracking: 50 per menit per visitor
└── General API: 100 per menit per IP
```

### Client Identification

```typescript
function getClientId(req: Request, visitorId?: string): string {
  // Priority:
  // 1. Explicit visitorId (dari request body)
  // 2. X-Forwarded-For header (dari reverse proxy)
  // 3. X-Real-IP header (dari nginx)
  // 4. Socket remote address
  // 5. 'unknown' fallback
  
  // Extract IP dari X-Forwarded-For yang bisa berisi multiple IPs
  const forwardedFor = req.headers['x-forwarded-for'];
  return Array.isArray(forwardedFor) 
    ? forwardedFor[0] 
    : forwardedFor?.split(',')[0]?.trim() || ...
}
```

### Input Validation dengan Zod

```typescript
// schemas.ts - Define validation rules
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

// Runtime validation di API
try {
  const validatedData = StorySchema.parse(req.body);
} catch (err) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => `${e.path.join('.')}: ${e.message}`)
    });
  }
}
```

### Security Headers

```typescript
// Response headers untuk security
res.setHeader('Content-Type', 'application/json; charset=utf-8');
res.setHeader('Cache-Control', 'max-age=300, s-maxage=3600');
res.setHeader('Retry-After', resetIn?.toString());

// Recommended Vercel Security Headers:
// Strict-Transport-Security: enforce HTTPS
// X-Content-Type-Options: prevent MIME sniffing
// X-Frame-Options: prevent clickjacking
// X-XSS-Protection: legacy XSS protection
```

### Data Privacy

```
Anonymity Options:
├── Public stories: author_name displayed
├── Anonymous stories: author_name NULL, is_anonymous TRUE
└── User cannot link story ke profile (jika authenticated)

Data Retention:
- No explicit deletion mentioned
- Consider adding GDPR compliance:
  - Data retention policy
  - Export functionality
  - Deletion ability
```

---

## ⚡ 11. PERFORMANCE OPTIMIZATION

### Build Optimization

```typescript
// vite.config.ts
build: {
  minify: 'terser',           // Aggressive minification
  rollupOptions: {
    output: {
      manualChunks: {         // Code splitting strategy
        'vendor': ['react', 'react-dom', 'react-router-dom'],
        'ui': ['@radix-ui/react-*'],
        'animations': ['animejs', 'gsap'],
        'graphics': ['ogl'],
        'data': ['@tanstack/react-query', '@supabase/supabase-js'],
      },
    },
  },
  chunkSizeWarningLimit: 1000, // Warn if chunk > 1000KB
}

CHUNK STRATEGY:
vendor/    - Core React frameworks (~100KB)
ui/        - Radix UI components (~50KB)
animations/ - Heavy animation libraries (~80KB)
graphics/  - WebGL library OGL (~60KB)
data/      - Query & DB clients (~70KB)
main/      - Application code (~80KB)
```

### React Query Caching

```typescript
// App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 menit
      gcTime: 1000 * 60 * 10,      // 10 menit di memory
    },
  },
});

CACHING STRATEGY:
- /api/stats: 5 min stale + 10 min memory
- /api/stories: 5 min stale + 10 min memory
- /api/track: No caching (fire-and-forget)

CDN Cache (dari response headers):
- /api/stats: max-age=300 client, s-maxage=3600 CDN
- /api/stories: max-age=300 client, s-maxage=3600 CDN
```

### Lazy Loading & Code Splitting

```typescript
// App.tsx - Lazy load non-critical pages
const HowToReport = lazy(() => import("./pages/HowToReport"));
const Stories = lazy(() => import("./pages/Stories"));
const SubmitStory = lazy(() => import("./pages/SubmitStory"));

// Home.tsx - Lazy load heavy components
const FaultyTerminal = lazy(() => import("@/components/FaultyTerminal"));

// Loading fallback UI
<Suspense fallback={<PageLoader />}>
  <Routes>...</Routes>
</Suspense>

BENEFIT:
- Home page load hanya include Home + Navigation
- Page-specific components di-load on-demand
- Terminal animation (WebGL) di-load async
```

### Runtime Performance

```typescript
// Home.tsx optimizations
1. requestIdleCallback untuk non-blocking tasks
   - Prefetch stories data
   - Track visitor saat browser idle
   
2. Intersection Observer untuk scroll animations
   - Only animate elements yang visible
   - Unobserve elements setelah animasi
   - Efficient memory usage

3. Passive event listeners
   - addEventListener(..., { passive: true })
   - Tidak block scroll thread

4. Debouncing scroll events
   - Throttle scroll handler dengan 16ms (60fps)
   - Reduce re-renders

5. Visitor ID caching di localStorage
   - No re-generation per page
   - Persistent tracking
```

### Image & Asset Optimization

```
HTML (index.html):
├── Preconnect ke external APIs
├── DNS prefetch untuk CDN
├── Prefetch API endpoints
└── Minimal inline styles

SVG Grid Pattern:
- Inline SVG background (data URI)
- No additional HTTP request
- Optimized untuk small file size
- Scalable untuk any screen size

Icons (Lucide React):
- Tree-shakeable icon library
- Only import used icons
- SVG-based (crisp pada any size)
- Very small bundle overhead
```

---

## 🚀 12. DEPLOYMENT & HOSTING

### Deployment Platform: Vercel

```
Vercel adalah optimal untuk:
- Next.js-like projects
- Serverless functions
- Edge network CDN
- Automatic deployments dari Git
- Preview URLs untuk setiap PR
- Automatic SSL certificates
- Environment variables management
```

### Vercel Configuration

```json
// frontend/vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "SUPABASE_URL": "@SUPABASE_URL",
    "SUPABASE_KEY": "@SUPABASE_KEY"
  },
  "functions": {
    "api/**/*.ts": {
      "runtime": "@vercel/node@5.5.0"
    }
  }
}

DEPLOYMENT FLOW:
1. Push code ke GitHub main branch
2. Vercel detects changes
3. Install dependencies: npm install
4. Build frontend: npm run build (vite build)
5. Build API functions: compile TS ke JS
6. Deploy ke Vercel Edge Network
7. Health check & activate
8. DNS route to live deployment
```

### Environment Variables

```
Required untuk production:

SUPABASE_URL
├── Format: https://[project-id].supabase.co
├── Dari Supabase dashboard
└── Public, dapat di-expose (anon key)

SUPABASE_KEY
├── Anon public key (untuk browser)
├── Restricted permissions di RLS
└── NOT untuk server-side operations
```

### Monitoring & Logging

```
Available tools:

1. Vercel Dashboard
   - Deployment history
   - Error tracking
   - Function logs
   - Performance analytics

2. Supabase Dashboard
   - Query logs
   - RPC function execution
   - Database activity monitor
   - Backup management

3. Browser Console
   - Client-side errors
   - Network requests
   - React warning/errors

Recommended:
- Add error tracking: Sentry, LogRocket
- Add analytics: Google Analytics, Mixpanel
- Add monitoring: DataDog, New Relic
```

### Scaling Considerations

```
Current Setup:
├── Frontend: Static + Serverless functions
├── Database: Supabase PostgreSQL (shared)
└── Storage: Vercel Edge Network

Untuk scale lebih besar:
1. Supabase upgrade ke dedicated database
2. Add Redis caching untuk frequently accessed data
3. Implement CDN untuk static assets
4. Add API gateway untuk rate limiting terpusat
5. Implement full-text search dengan Elasticsearch
6. Add message queue (RabbitMQ) untuk async tasks
7. Implement cron jobs untuk maintenance tasks
```

---

## 📊 TECH STACK SUMMARY TABLE

| Layer | Technology | Purpose | Version |
|-------|-----------|---------|---------|
| **Frontend** | React | UI Framework | 19.1.0 |
| | TypeScript | Type Safety | 5.8.3 |
| | Vite | Build Tool | 7.2.2 |
| | TailwindCSS | Styling | 4.1.11 |
| **UI Components** | Radix UI | Headless Components | - |
| | Lucide React | Icons | 0.484.0 |
| **State Mgmt** | React Query | Server State | 5.85.0 |
| | React Router | Routing | 7.6.3 |
| **Animation** | GSAP | Animations | 3.13.0 |
| | Anime.js | Animation | 4.2.2 |
| | OGL | WebGL Graphics | 1.0.11 |
| **Validation** | Zod | Schema Validation | 3.22.0 |
| **Backend** | Vercel Functions | Serverless API | - |
| **Database** | Supabase/PostgreSQL | Data Storage | - |
| **Hosting** | Vercel | CDN + Deployment | - |

---

## 🎓 WORKFLOW DEVELOPMENT

### Development Workflow

```bash
# Setup project
npm install
npm install -C frontend

# Development server
npm run dev

# Build untuk production
npm run build

# Type checking
npm run type-check

# Linting & formatting
npm run lint
npm run format
```

### Git Workflow

```
main (production)
  ↑
  └── develop (staging)
        ↑
        ├── feature/story-submission
        ├── feature/analytics
        └── bugfix/rate-limiting
```

### Testing Strategy

```
Unit Tests:
- Components (render tests)
- Utilities (logic tests)
- Schemas (validation tests)

Integration Tests:
- API endpoints
- Database operations
- Form submissions

E2E Tests (optional):
- Full user workflows
- Cross-browser testing
- Performance testing
```

---

## 📝 FILE SUMMARY

```
TOTAL FILES:
- Frontend Components: 10+ React components
- API Routes: 4 serverless functions
- UI Components: 5 reusable components
- Pages: 4 full-page components
- Utilities: Helper functions
- Configuration: Build + Deploy configs

APPROX. LOC (Lines of Code):
- Frontend JSX/TSX: 2000-3000 LOC
- API Handlers: 500-800 LOC
- Utilities & Types: 300-400 LOC
- Config Files: 200-300 LOC
- Total: ~3500-4500 LOC
```

---

## 🔐 SECURITY CHECKLIST

```
✅ Input Validation
  - Zod schema validation di semua endpoints
  - Length constraints
  - Type checking

✅ Rate Limiting
  - Per IP-based untuk general endpoints
  - Per IP untuk story submission
  - Per visitor untuk tracking

✅ Anonymous Submission
  - Option untuk anonymous stories
  - Conditional author_name field
  - Data privacy respected

✅ Error Handling
  - No sensitive data di error messages
  - Generic error messages untuk user
  - Detailed logs di server

❓ TODO:
  - HTTPS enforcement (Vercel default)
  - CORS configuration
  - SQL injection prevention (Supabase handles)
  - XSS prevention (React escapes by default)
  - CSRF token untuk forms (if needed)
  - API response signing (optional)
```

---

## 📈 METRICS & MONITORING

### Key Metrics untuk Track

```
User Metrics:
- Total visitors (Count distinct visitor_id)
- Pages per session
- Average session duration
- Bounce rate

Content Metrics:
- Total stories submitted
- Stories approved/rejected/pending
- Average story length
- Most viewed stories

Performance Metrics:
- Page load time
- Time to interactive (TTI)
- Core Web Vitals (LCP, FID, CLS)
- API response time
- Database query time

Business Metrics:
- Conversion rate (visitors → story submitters)
- Repeat visitors
- Geographic distribution
- Referrer sources
```

### Recommended Monitoring Services

```
1. Analytics: Google Analytics 4, Mixpanel
2. Error Tracking: Sentry, Rollbar
3. Performance: Vercel Analytics, DataDog
4. Database: Supabase built-in monitoring
5. Uptime: UptimeRobot, StatusPage
```

---

## 🎯 FUTURE ENHANCEMENTS

```
Phase 2 Features:
1. User authentication & profiles
2. Comment system pada stories
3. Support ticket system
4. Admin dashboard
5. Data export functionality
6. Email notifications
7. Social sharing features
8. Related stories recommendations
9. Story categories/tags
10. Search dengan full-text indexing

Phase 3 Features:
1. Mobile app (React Native)
2. Multi-language support
3. AI-powered story recommendations  
4. Bot detection
5. Blockchain for authentication
6. Integration dengan legal services
7. Payment processing untuk donations
```

---

## 📞 SUPPORT & CONTACT

```
Repository: MarcoThemasoa/IntoTheRabbitHole
Branch: main
Workspace: c:\Marco - Code\IntoTheRabbitHole\DeepfakeAware

Documentation:
- Frontend: /frontend/README.md
- API: /frontend/api/ (inline comments)
- Database: Supabase dashboard

Development Team:
- Lead: MarcoThemasoa
```

---

## 📄 DOKUMEN REVISI

| Versi | Tanggal | Deskripsi Perubahan |
|-------|---------|-------------------|
| 1.0 | 2026-04-04 | Initial comprehensive documentation |

---

**LAPORAN INI DIBUAT PADA:** April 4, 2026  
**TEKNOLOGI UTAMA:** React 19 + TypeScript + Vercel + Supabase  
**STATUS:** ✅ Production Ready

---

## 🙋 QUICK START UNTUK DEVELOPERS BARU

### 1. Setup Development Environment
```bash
# Clone repository
git clone https://github.com/MarcoThemasoa/IntoTheRabbitHole.git
cd DeepfakeAware

# Install dependencies
npm install
npm install -C frontend

# Setup environment variables
cp frontend/.env.example frontend/.env.local
# Edit SUPABASE_URL dan SUPABASE_KEY
```

### 2. Start Development Server
```bash
npm run dev
# Frontend: http://localhost:5173
# API: http://localhost:5173/api/*
```

### 3. Struktur File Utama untuk Dimengerti
```
1. App.tsx - Routing & setup
2. frontend/pages/* - Main pages
3. frontend/api/* - Backend API
4. frontend/components/ui/* - Reusable UI
5. frontend/lib/types.ts - Type definitions
```

### 4. Common Development Tasks
```bash
# Build untuk production
npm run build

# Type checking
npm run type-check

# Format code
npm run format

# Deploy ke Vercel
git push origin main
# Vercel auto-deploys dari git push
```

---

**🎓 DOKUMENTASI LENGKAP BERHASIL DISUSUN**
