# Mileora — Architecture

## High-level diagram

```
   ┌──────────────────┐    ┌──────────────────┐
   │  Web (Next.js)   │    │ Mobile (RN/Expo) │
   │  Vercel / PWA    │    │   iOS + Android  │
   └────────┬─────────┘    └────────┬─────────┘
            │ JWT + JSON            │ JWT + JSON
            └──────────┬────────────┘
                       ▼
            ┌──────────────────────────┐
            │ CodeIgniter 3 REST API   │
            │      PHP 8.1             │
            │  - JWT auth              │
            │  - Bookings + payments   │
            │  - Owns DB writes        │
            │  - Owns ES index writes  │
            └──┬─────────────┬─────────┘
               │             │
       ┌───────▼─────┐  ┌────▼──────────────┐
       │  MySQL 8    │  │ Elasticsearch 8   │
       │(phpMyAdmin) │  │ astrologers/pujas │
       └─────────────┘  └───────────────────┘
                       │
                       ▼
            ┌──────────────────────────┐
            │  Razorpay (payments)     │
            └──────────────────────────┘
```

## Why this shape

### Three clients, one API
- **Web** owns SEO, marketing pages, and the desktop booking experience.
- **Mobile** owns push notifications, daily horoscope nudges, and the on-the-go booking experience.
- **CodeIgniter 3** is the single source of truth for business logic + DB + ES.
- Both clients consume the **same JWT-authenticated REST API**. Shared TS types live in `shared/` so web (TS) and mobile (TS) stay in sync.

### Why CodeIgniter 3 (not 4)?
- **User-specified.** CI3 is the legacy-friendly choice — runs on virtually any PHP host, single-folder deploy, no Composer required at runtime (though we use it for jwt + razorpay SDK).
- We use **CI3.1.13** + the **chriskacerguis/codeigniter-restserver** library for clean REST controllers.
- PHP 8.1 produces some deprecation notices against CI3 internals; `index.php` suppresses notices in production.

### MySQL as system of record, Elasticsearch as read replica
- All writes go to MySQL via CI3 models.
- After commit, models call `Elasticsearch_service::index($index, $id, $doc)` to mirror the document.
- Search/list endpoints read from ES (low-latency facets, full-text).
- Detail pages and bookings read from MySQL (consistency).

### Why React Native + Expo (not bare RN, not Flutter)?
- Expo SDK 51+ ships OTA updates, push notifications, EAS Build/Submit out of the box.
- Reuses TypeScript skills + zod schemas + zustand/TanStack Query patterns from web.
- `shared/` package gives compile-time guarantees that web + mobile speak the same API.

## Data flow examples

### Lead capture (e.g. "free kundli" form)
1. **Web:** User submits → `web/src/app/api/leads/route.ts` validates with zod → POSTs to `POST /api/v1/leads` on CI3 with server-side `X-Mileora-Key`.
2. **Mobile:** RN form posts directly to CI3 with the same key (key stored in mobile env, not committed).
3. CI3 inserts into `leads`, queues a notification (email + WhatsApp), returns `{id, status}`.

### Astrologer search
1. Client calls `GET /api/v1/search/astrologers?q=vedic&minPrice=500`.
2. CI3 `Search` controller builds an ES query, hits ES, returns hits.
3. Client renders results.

### Booking + Razorpay payment
1. User picks slot → POST `/api/v1/bookings` (CI3 creates `pending` booking, calls Razorpay `orders.create`, returns `{booking_id, razorpay_order_id, amount, key_id}`).
2. Client opens Razorpay Checkout (web SDK or `react-native-razorpay`).
3. Razorpay returns `payment_id` + `signature` → POST `/api/v1/payments/verify`.
4. CI3 verifies HMAC, marks booking `confirmed`, sends confirmation email + push notification.
5. Razorpay webhook → `/api/v1/webhooks/razorpay` (HMAC-verified) reconciles edge cases (failed/refunded).

## Security model

- **Browser/App → CI3:**
  - Public/anonymous endpoints (search, list pujas) → `X-Mileora-Key` (server-side or app-side public key).
  - Authenticated endpoints → `Authorization: Bearer <jwt>`. JWT signed with `JWT_SECRET` from CI3 `.env`.
- **CI3 → Razorpay:** key + secret in `.env`, never exposed to clients.
- **Webhooks:** Razorpay webhook signature verified against `RAZORPAY_WEBHOOK_SECRET`.
- **CORS:** `application/config/cors.php` allow-lists web origin (`https://mileora.com`) and Expo dev tunnels for local mobile development.
- **Rate limiting:** REST_Controller's built-in throttling on auth endpoints (5 req/min per IP for login/OTP).

## SEO strategy (web only — see [seo-checklist.md](seo-checklist.md))
- Server-rendered marketing pages with per-route `generateMetadata`.
- JSON-LD: `Organization`, `LocalBusiness`, `Service`, `Person` (astrologer), `Event` (puja), `BreadcrumbList`, `FAQPage`.
- `app/sitemap.ts` dynamically lists all astrologer + puja + article pages (fetches slugs from CI3).
- `app/robots.ts` allows all, points to sitemap.
- Dynamic OG images via `app/opengraph-image.tsx`.
- Core Web Vitals: ISR for marketing pages, `next/image`, `next/font` self-hosted.

## Environments

| Env       | Web                          | API                              | DB              | ES              |
| --------- | ---------------------------- | -------------------------------- | --------------- | --------------- |
| local     | `localhost:3000`             | `localhost/Mileora/api`          | XAMPP / Docker  | Docker          |
| staging   | `staging.mileora.com`        | `api-staging.mileora.com`        | Managed MySQL   | Elastic Cloud   |
| prod      | `mileora.com` (Vercel)       | `api.mileora.com` (PHP host)     | Managed MySQL   | Elastic Cloud   |

Mobile points to `EXPO_PUBLIC_API_URL` per build profile (dev/staging/prod) configured in `mobile/eas.json`.
