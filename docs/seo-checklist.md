# Mileora — SEO checklist

Modern SEO standards baked into the Next.js scaffold. Use this as a per-launch and per-page review.

## ✅ Already wired (in the scaffold)

### Site-wide
- [x] **`generateMetadata` helper** — [`web/src/lib/seo.ts`](../web/src/lib/seo.ts) returns full `Metadata` (title, description, canonical, robots, OG, Twitter, manifest, icons).
- [x] **Canonical URLs** on every page via `alternates.canonical`.
- [x] **`metadataBase`** set so relative OG image URLs resolve correctly.
- [x] **`robots.txt`** at [`web/src/app/robots.ts`](../web/src/app/robots.ts) → `disallow /api/, /admin/, /account/`.
- [x] **`sitemap.xml`** at [`web/src/app/sitemap.ts`](../web/src/app/sitemap.ts) — static routes done; dynamic astrologer/puja/article URLs to be wired once API is reachable.
- [x] **Dynamic Open Graph image** — [`web/src/app/opengraph-image.tsx`](../web/src/app/opengraph-image.tsx) (Edge runtime, branded gradient).
- [x] **Twitter Card** = `summary_large_image`.
- [x] **`manifest.webmanifest`** + PWA install prompt.
- [x] **Theme color + viewport** (`web/src/app/layout.tsx`).
- [x] **Self-hosted fonts** via `next/font` (Inter + Cormorant Garamond) — no FOIT, no third-party calls.
- [x] **Security headers** (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy) in `next.config.mjs` — Google's Page Experience signal.
- [x] **JSON-LD schemas:**
  - `Organization` + `WebSite` (with SearchAction) on every page (root layout).
  - `BreadcrumbList` per page.
  - `Service` per service page.
  - `FAQPage` on home + service pages with FAQs.
  - Helpers in [`web/src/components/seo/json-ld.tsx`](../web/src/components/seo/json-ld.tsx).
- [x] **Semantic HTML** — `<header>`, `<main>`, `<section>`, `<nav aria-label>`, `<footer>`.
- [x] **Image optimization** — `next/image` ready, AVIF/WebP enabled.
- [x] **Compression + `poweredByHeader: false`** in `next.config.mjs`.

### Per-page
- [x] **Unique title + meta description** via `buildMetadata({ title, description, path })`.
- [x] **One `<h1>` per page**, descriptive copy with primary keyword.
- [x] **Premium UI** — visual polish improves engagement metrics (dwell time, bounce) which Google now treats as ranking signals.

## 🔜 To add page-by-page (use this as your review)

For every new page, confirm:

- [ ] `metadata` exported with **unique title + description** (50–60 / 150–160 chars).
- [ ] **Primary keyword in `<h1>`**, secondary in first paragraph.
- [ ] **Breadcrumb** rendered + `breadcrumbJsonLd()` emitted.
- [ ] **Internal links** to ≥3 related pages.
- [ ] **Hero image** with descriptive `alt`, `next/image` `priority` for LCP.
- [ ] **FAQ section** with `faqJsonLd()` (5+ Q&As). Astrology / puja queries trigger FAQ rich results well.
- [ ] **Lead magnet** (free kundli / numerology calculator / WhatsApp opt-in) above the fold.
- [ ] **Page added to `sitemap.ts`** if not from a dynamic source.

## 🔜 Schema.org schemas worth adding to specific pages

| Page                | Add                                                            |
| ------------------- | -------------------------------------------------------------- |
| `/astrologers/[slug]` | `Person` with `jobTitle: "Astrologer"`, `aggregateRating`, `Service` |
| `/puja/[slug]`      | `Event` (with `eventAttendanceMode: OnlineEventAttendanceMode`), `Offer` |
| `/blog/[slug]`      | `Article` with `author`, `datePublished`, `image`              |
| `/contact`          | `LocalBusiness` (if you have a physical office), `ContactPoint` |
| `/free/kundli`      | `SoftwareApplication` + `HowTo` for steps                       |

## 🔜 Operational SEO

- [ ] **Google Search Console** — verify both `https://mileora.com` and `https://www.mileora.com`, submit sitemap.
- [ ] **Bing Webmaster Tools** — same.
- [ ] **Analytics** — GA4 + (privacy-friendlier) Plausible. Both already wired via env vars.
- [ ] **Content cadence** — 2 SEO-optimized articles/week in `/blog` for the first 6 months. Target keywords: "free kundli online", "best numerology calculator", "online puja booking", "vasthu for home", "Tamil jothisyam free".
- [ ] **Local SEO** (if/when you have a physical office) — Google Business Profile, NAP consistency.
- [ ] **WhatsApp click-to-chat** floating button — high-converting for the Indian market.

## Core Web Vitals targets

| Metric | Target | Mileora baseline (scaffolded) |
| ------ | ------ | ----------------------------- |
| LCP    | < 2.5s | Achievable via SSG + `next/image` `priority` on hero |
| CLS    | < 0.1  | Reserved width/height on all images, no layout shift in fonts (`display: swap` + self-hosted) |
| INP    | < 200ms | Server Components + minimal client JS |
| TTFB   | < 0.8s | Vercel edge + ISR for marketing pages |

## Tools to run before launch

- [PageSpeed Insights](https://pagespeed.web.dev) for every key URL
- [Schema.org Validator](https://validator.schema.org)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) in CI pipeline
