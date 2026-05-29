# 🏴‍☠️ Grand Line — Setup & Deployment Guide

> The world for One Piece fans. Built with Next.js 14, Supabase, Vercel.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, TailwindCSS |
| Animations | Framer Motion |
| State | Zustand + TanStack Query |
| Backend | Next.js API Routes + Supabase Edge Functions |
| Database | Supabase (PostgreSQL + Realtime) |
| Auth | Supabase Auth (Email, Google, Discord) |
| Storage | Supabase Storage (fan art) |
| Payments | Stripe (fan art marketplace) |
| Email | Resend (transactional) |
| Media | Cloudinary (image uploads) |
| Episode Data | Jikan API (free, no key — auto-syncs all 1100+ eps) |
| AI Engine | Groq (Llama 3.1 8B, free) + Gemini Flash fallback |
| Deployment | Vercel |

---

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste entire contents of `supabase/schema.sql` → Run
3. Enable **Google** and **Discord** OAuth in Authentication → Providers
4. Enable **Realtime** for the `activity_feed`, `crew_members`, `profiles` tables
5. Copy your **Project URL** and **anon key** to `.env.local`

### 4. Run development server

```bash
npm run dev
# Visit http://localhost:3000
```

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial Grand Line platform"
git remote add origin https://github.com/YOUR_USERNAME/grand-line
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Add all environment variables from `.env.example`
4. Deploy

### 3. Update Supabase redirect URLs

In Supabase → Authentication → URL Configuration:
- **Site URL**: `https://grandline.gg`
- **Redirect URLs**: `https://grandline.gg/api/auth/callback`

---

## Feature Flags & Configuration

### Episode Data — Fully Automatic via Jikan API

All 1100+ episodes are fetched automatically from the **Jikan API** (free unofficial MyAnimeList API, no key needed). No manual data entry required.

#### First-time sync (run once after deployment)

```bash
curl -X POST https://grandline.gg/api/admin/sync-episodes \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

This fetches all episodes from MAL in batches, maps them to arcs, flags filler/recap episodes, and upserts them into Supabase. It runs for up to 5 minutes and streams progress.

#### Check sync status

```bash
curl https://grandline.gg/api/admin/sync-episodes \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
# Returns: { total, synced, missing }
```

#### Sync only new episodes (incremental — run weekly)

```bash
curl -X POST "https://grandline.gg/api/admin/sync-episodes?mode=new" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### Automate with Vercel Cron

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/admin/sync-episodes?mode=new",
      "schedule": "0 6 * * 1"
    }
  ]
}
```

Set `CRON_SECRET` in Vercel environment variables. Vercel will send this cron request every Monday at 6 AM — keeping the episode list up to date as new One Piece episodes air.

---

### AI Engine Setup (100% Free)

Grand Line uses two free AI providers. Both are needed — Groq is the primary (fast), Gemini is the fallback.

#### Groq (Primary)

1. Sign up at **[console.groq.com](https://console.groq.com)** (no credit card)
2. Go to **API Keys** → **Create API Key**
3. Add to `.env.local`: `GROQ_API_KEY=gsk_...`

Free tier: **500,000 tokens/day**, sub-200ms responses, Llama 3.1 8B model.

#### Google Gemini Flash (Fallback)

1. Go to **[aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)**
2. Click **Create API Key**
3. Add to `.env.local`: `GEMINI_API_KEY=AIza...`

Free tier: **1,000,000 tokens/day**.

#### AI Features included

| Feature | Endpoint | When it runs |
|---------|----------|--------------|
| Personalized "what to watch next" | `GET /api/ai/recommend` | Dashboard widget |
| Arc recommendation | `GET /api/ai/recommend?type=arc` | Dashboard widget |
| Daily motivation message | `GET /api/ai/recommend?type=motivation` | Dashboard widget |
| Den Den Mushi chatbot | `POST /api/ai/chat` | Floating 🐌 button (all pages) |
| AI quiz generation | `POST /api/ai/quiz` | Auto-triggered when episode has no quiz |
| Batch quiz generation | `GET /api/ai/quiz` | Cron job (generate for all new episodes) |

#### Quiz auto-generation cron (optional)

Add to `vercel.json` to pre-generate quizzes for new episodes every week:

```json
{
  "crons": [
    { "path": "/api/admin/sync-episodes?mode=new", "schedule": "0 6 * * 1" },
    { "path": "/api/ai/quiz", "schedule": "0 7 * * 1" }
  ]
}
```

The quiz endpoint generates quizzes for up to 20 episodes per run (to stay within token limits). Run it weekly after the episode sync.

### Quiz Questions

Quizzes are generated automatically by AI when a user first marks an episode as watched and no quiz exists yet. The Den Den Mushi chatbot shows a "crafting your quiz…" animation while generating.

Quiz data is cached in Supabase after first generation — subsequent users get the cached version instantly.

Manual override: you can still insert quiz questions directly in Supabase's `episodes` table (`quiz_question`, `quiz_options`, `quiz_explanation` columns). Manual entries take precedence.

### Merch Deals

Add affiliate deals in `merch_deals` table:
- `episode_id` or `arc_id` = contextual deal (shows when watching that content)
- Both null = sitewide deal

### Stripe for Fan Art Marketplace

1. Create Stripe account
2. Add webhook: `https://grandline.gg/api/webhooks/stripe`
3. Events to listen: `payment_intent.succeeded`, `payment_intent.payment_failed`

---

## Monetization Setup

### 1. Affiliate Partners

| Partner | Sign up | Commission |
|---------|---------|------------|
| Crunchyroll Store | [store.crunchyroll.com](https://store.crunchyroll.com) | 8% |
| AmiAmi | [amiami.com](https://amiami.com) | 10% |
| Right Stuf / Nozomi | Via affiliate network | 8% |
| Hot Topic | Via Impact/CJ network | 6% |

Add affiliate IDs to `.env.local` and append them to product URLs.

### 2. Sponsored Arc Challenges

Insert into `challenges` table with:
- `sponsor_name`: brand name
- `sponsor_logo_url`: their logo
- `sponsor_url`: their website
- Sponsors pay flat fee or CPC — handle billing separately

### 3. Fan Art Marketplace (Stripe)

Platform takes 10% of each sale automatically via the `platform_fee_pct` column.
Remaining 90% goes to creator via Stripe Connect (implement as needed).

---

## Project Structure

```
grand-line/
├── app/
│   ├── (auth)/          # Login, signup pages
│   ├── (main)/          # Protected pages (dashboard, episodes, etc.)
│   │   ├── page.tsx     # Dashboard (after login)
│   │   ├── arcs/        # Grand Line Map
│   │   ├── episodes/    # Episode browser + quiz
│   │   ├── challenges/  # Arc challenges
│   │   ├── leaderboard/ # World bounty board
│   │   ├── marketplace/ # Merch + fan art
│   │   └── profile/     # Wanted poster profile
│   ├── api/             # API routes
│   └── page.tsx         # Landing page (before login)
├── components/
│   ├── nav/             # Navigation
│   ├── landing/         # Landing page sections
│   ├── arcs/            # Grand Line Map, Arc list
│   ├── episodes/        # Episode browser, card, quiz modal
│   ├── profile/         # Wanted poster, stats, devil fruits
│   ├── leaderboard/     # Bounty board
│   ├── marketplace/     # Merch + fan art
│   ├── challenges/      # Challenge cards
│   └── dashboard/       # Post-login dashboard
├── lib/
│   ├── supabase/        # Supabase client (browser, server, middleware)
│   ├── gamification.ts  # XP, ranks, streaks, devil fruits
│   ├── jikan.ts         # Jikan API client — auto-fetches all episode data
│   └── ai.ts            # Groq + Gemini AI engine (7 AI features)
├── components/
│   └── ai/
│       ├── den-den-mushi.tsx        # Floating chatbot (all pages)
│       └── ai-recommendation-widget.tsx  # Dashboard AI widget
├── types/index.ts        # All TypeScript types + config
├── supabase/schema.sql   # Complete DB schema + seed data
└── .env.example         # Environment variable template
```

---

## Domain & Branding

Suggested domain: **grandline.gg** (.gg = gaming/geek culture)

Alternatives:
- `nakama.watch`
- `theGrandLine.io`
- `bountyboard.gg`

---

## Roadmap (Post-Launch)

- [x] Episode data auto-import from Jikan API
- [x] AI-powered episode quizzes (Groq/Gemini generated)
- [x] Personalized "what to watch next" AI recommendations
- [x] Den Den Mushi AI chatbot
- [ ] Crew leaderboards (real-time via Supabase Realtime)
- [ ] Watch parties (WebRTC / Livekit)
- [ ] Mobile app (React Native / Expo)
- [ ] AI-powered spoiler-free episode recaps
- [ ] "Skip filler" guide integration
- [ ] Discord bot that syncs watch progress
- [ ] Premium membership (Yonko tier) — exclusive badges, bonus XP
- [ ] AI-generated Wanted Poster epithets (currently seeded with Groq on rank-up)

---

*"I'm gonna be King of the Pirates" — start with episode 1.*
