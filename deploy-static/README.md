# Mileora — Static export build

For when you want to host the marketing surface area on a pure CDN
(Cloudflare Pages, Netlify, S3 + CloudFront) instead of a Node origin.

## When to use this vs `/deploy/`

| | `/deploy/` (Node + PM2 + Apache) | `/deploy-static/` (pure CDN) |
|---|---|---|
| Marketing pages | SSG + ISR | Static export at build time |
| Account / Admin portals | ✅ work | ❌ excluded (need BFF + JWT) |
| Route handlers (`/api/leads`, Razorpay) | ✅ work | ❌ must point at CI3 directly |
| Cost | $25–50/mo (small VPS) | ~$0 (free CDN tiers) |
| Latency to user | Good (one region) | Great (every edge POP) |
| When to pick | Default — gives you everything | When marketing volume >> account/admin volume |

## Build

```bash
./deploy-static/build.sh
# → web/out/  ready to upload
```

The script swaps in `next.config.static.mjs` (which sets `output: "export"` and disables next/image optimization), then runs `next build`.

## What the static export contains

- Home + 5 service pages (/astrology, /numerology, /vasthu, /jothisyam, /puja)
- All static blog / legal / about / contact / book / login pages
- Pre-rendered `/astrologers/[slug]`, `/puja/[slug]`, `/blog/[slug]`, `/free/horoscope/[sign]` (from `generateStaticParams`)
- sitemap.xml, robots.txt, manifest.webmanifest, OG image (pre-rendered)

## What it does NOT contain

- `/account/*` — guarded by user JWT, no static path
- `/admin/*`, `/guide/*` — same reason
- Route handlers under `/api/*` — won't exist in the export

For those, run the full Node deploy under `/deploy/` OR have a separate
sub-domain (e.g. `app.mileora.com`) for the dynamic portals while
`mileora.com` is static.

## Cloudflare Pages

```bash
npx wrangler pages project create mileora-web
npx wrangler pages deploy web/out/ --project-name=mileora-web
```

Custom domain → Cloudflare DNS → done.
