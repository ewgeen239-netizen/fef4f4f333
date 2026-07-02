# Krasnovska PH

Editorial photographer's website — multi-page portfolio + availability-based
session reservation. Ultra-minimalist quiet-luxury dark mode, multilingual
(EN / PL / RU / UA), self-hosted booking calendar or Cal.com.

**Stack** — Next.js 15 (App Router) · TypeScript · Tailwind · Framer Motion ·
Lenis · React Hook Form + Zod · Prisma + PostgreSQL · Resend · (optional) Telegram.

---

## Features

- 6 pages: Home, Studio, Portfolio, Services, Process, Contact/Reservation
- Sticky top navigation bar (horizontal links + active state, scrolled state,
  backdrop-blur); compact hamburger dropdown on mobile only; magnetic buttons,
  custom cursor, film grain, page transitions, scroll-reveal, hero parallax
- i18n via typed JSON dictionaries (EN default + PL / RU / UA) + `middleware`
  locale routing + language switcher
- Filterable portfolio grid with keyboard-navigable lightbox, lazy `next/image`
  with blur placeholders
- Booking: interactive availability calendar → reservation form (Zod validated,
  honeypot + rate-limited) → atomic slot reservation (no double-booking) →
  Resend email to owner + client auto-reply → optional Telegram
- Two configurable backends via `BOOKING_PROVIDER`: `self` | `calcom`
- SEO: Metadata API, OpenGraph, `sitemap.ts`, `robots.ts`, hreflang alternates
- A11y: semantic HTML, focus-visible, `prefers-reduced-motion`, alt text

---

## Getting started

### 1. Install

```bash
npm install
```

### 2. Environment

```bash
cp .env.example .env
```

Fill in at least `DATABASE_URL`. See the table below.

### 3. Database (Prisma + PostgreSQL)

```bash
# Create the schema / first migration
npm run db:migrate          # prisma migrate dev

# Seed ~60 days of weekday availability slots
npm run db:seed
```

Handy:

```bash
npm run db:studio           # visual DB browser
npm run db:deploy           # apply migrations in prod (no prompts)
```

### 4. Run

```bash
npm run dev                 # http://localhost:3000 → redirects to /pl
```

---

## Environment variables

| Var | Required | Notes |
|-----|----------|-------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string (pooled in prod) |
| `DIRECT_URL` | prod | Non-pooled URL for migrations (Neon/Supabase) |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Canonical origin, used in metadata/sitemap |
| `BOOKING_PROVIDER` | ✅ | `self` (default) or `calcom` |
| `RESEND_API_KEY` | email | From resend.com; without it emails are skipped |
| `EMAIL_FROM` | email | Verified sender, e.g. `Krasnovska PH <hello@krasnovska.ph>` |
| `EMAIL_TO_OWNER` | email | Inbox that receives new bookings |
| `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` | optional | Duplicate notification |
| `NEXT_PUBLIC_CALCOM_LINK` | calcom | e.g. `krasnovska/session` |
| `CALCOM_WEBHOOK_SECRET` | calcom | HMAC secret to verify webhook |

---

## Booking backends

### Self-hosted (default, `BOOKING_PROVIDER=self`)

- `Availability(date, timeSlot, isBooked)` rows seeded via `prisma/seed.ts`
- `GET /api/availability?month=YYYY-MM` → open slots grouped by date
- `POST /api/booking` → validates, **atomically** flips the slot to booked in a
  transaction (guards against a race → no double-booking), persists the
  `Booking`, sends emails/Telegram

### Cal.com (`BOOKING_PROVIDER=calcom`)

- Contact page renders the inline Cal.com embed (`NEXT_PUBLIC_CALCOM_LINK`)
- Add a webhook in Cal.com → `https://your-domain/api/booking/webhook`,
  secret = `CALCOM_WEBHOOK_SECRET`
- `POST /api/booking/webhook` verifies the HMAC signature, upserts a
  `CONFIRMED` booking, and notifies

---

## Project structure

```
app/
  layout.tsx                 # fonts, <html>
  page.tsx                   # → /pl redirect
  robots.ts  sitemap.ts  not-found.tsx
  [lang]/
    layout.tsx               # providers, header, footer, metadata, hreflang
    template.tsx             # page transition wrapper
    page.tsx                 # Home (hero parallax, selected works, CTA)
    studio/ portfolio/ services/ process/ contact/  page.tsx
  api/
    availability/route.ts    # GET open slots
    booking/route.ts         # POST reserve (atomic)
    booking/webhook/route.ts # Cal.com receiver
components/
  providers/LenisProvider.tsx
  layout/    Header.tsx Footer.tsx LanguageSwitcher.tsx
  animation/ Reveal.tsx PageTransition.tsx MagneticButton.tsx CustomCursor.tsx
  gallery/   FilterableGallery.tsx Lightbox.tsx
  booking/   BookingCalendar.tsx ReservationForm.tsx CalcomEmbed.tsx
  home/Hero.tsx   ui/ SectionHeading Faq LocalTime Grain
lib/
  i18n/ config.ts dictionaries.ts   prisma.ts  utils.ts
  validations/booking.ts  rate-limit.ts  notify.ts  portfolio.ts
messages/  en.json pl.json ru.json ua.json
lib/packages.ts              # typed price-list packages (single source)
prisma/    schema.prisma  seed.ts
public/images/
middleware.ts                # locale detection + redirect
```

---

## Deployment

### Vercel (recommended)

1. Import the repo. Framework auto-detected.
2. Add all env vars (Project → Settings → Environment Variables).
3. Use a serverless-friendly Postgres (Neon / Supabase / Vercel Postgres) and
   set both `DATABASE_URL` (pooled) and `DIRECT_URL` (direct).
4. `vercel.json` runs `prisma generate && prisma migrate deploy && next build`.
5. Seed once after first deploy: `vercel env pull && npm run db:seed`.

### Railway

1. New project → deploy from repo + add a PostgreSQL plugin.
2. Set env vars; `DATABASE_URL` from the plugin.
3. Build: `npm run build` · Start: `npm start`.
4. Run `npm run db:deploy && npm run db:seed` in the Railway shell.

---

## Customization

- **Images** — replace demo Unsplash URLs in `lib/portfolio.ts` + `Hero`/CTA
  `src` with local `/images/*` assets; see `public/images/README.md`.
- **Slots / hours** — edit `SLOTS` and `DAYS_AHEAD` in `prisma/seed.ts`.
- **Copy / translations** — `messages/{pl,ru,ua}.json` (typed against `pl`).
- **Palette / type** — `tailwind.config.ts` (`ink`, `bone`, `brass`) + fonts in
  `app/layout.tsx` (Fraunces + Inter; swap for Editorial New / Neue Montreal).
- **Availability badge** — `common.availability` per locale.
```
