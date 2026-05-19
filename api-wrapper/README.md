# Mileora — Vercel API wrapper

A thin Vercel serverless function that sits in front of the CI3 origin (`api.mileora.com`) and gives you:

- **Edge caching** for read-heavy public endpoints (astrologers/pujas/cities/search)
- **Uniform CORS** — set allowed origins once, browser POSTs from the marketing site work
- **JWT forwarding** for user-context calls
- **Server-key injection** for unauthenticated server-to-server calls
- **One regional edge** (default `bom1` = Mumbai)

## When to use this

- You want sub-100ms TTFB for the marketing site reads without scaling CI3 vertically
- Mileora web is on Vercel and you'd rather not call a separate origin (CORS friction)
- You want a single source of cache invalidation in front of CI3

If you just have one VPS with everything on the same box, **skip this folder** — call CI3 directly.

## Files

| File | Purpose |
|---|---|
| [`vercel.json`](vercel.json) | Rewrites `/api/*` → catch-all, sets region |
| [`api/proxy.ts`](api/proxy.ts) | The handler — CORS, cache policy, header forwarding |
| [`package.json`](package.json) | Vercel function dep (`@vercel/node`) |

## Deploy

```bash
cd api-wrapper
npm install
npx vercel link        # one-time
npx vercel env add ORIGIN_URL production           # https://api.mileora.com/api/v1
npx vercel env add ALLOWED_ORIGINS production      # https://mileora.com,https://www.mileora.com
npx vercel env add MILEORA_SERVER_KEY production   # the same key as CI3's MILEORA_SERVER_API_KEY
npx vercel deploy --prod
```

Then point `mileora.com/api/*` → this Vercel project (custom domain in dashboard).

## Cache map (extend in `proxy.ts`)

| Path | s-maxage | swr |
|---|---|---|
| `astrologers`, `pujas`, `cities` (list) | 5–60 min | 1 hr – 1 day |
| `*/{slug}` (detail) | 10 min | 1 day |
| `search/*` | 1 min | 5 min |

POST / PUT / DELETE are never cached.

## Cache busting

When you push a change in CI3 admin that should propagate immediately, hit the Vercel API:

```bash
curl -X DELETE "https://api.vercel.com/v1/edge-cache/MyProjectId" \
     -H "Authorization: Bearer $VERCEL_TOKEN"
```

Or use `unstable_revalidatePath` from the main Next.js app if you're already calling `/api/admin/elastic/reindex/*` on save.

## Local testing

```bash
npx vercel dev
# Hits http://localhost:3000/api/health → proxies to your local CI3
```

Set `ORIGIN_URL=http://localhost/Mileora/api/index.php/api/v1` in `.env.local` for local CI3.
