# Mileora

Premium spiritual-services platform for **astrology, numerology, vasthu, jothisyam, puja & rituals**. Service-booking + lead-generation product, India-first.

## Monorepo layout

```
Mileora/
├── web/             # Next.js 15 (App Router, TS, Tailwind v4)  → Vercel
├── mobile/          # React Native (Expo) iOS + Android          → App Store / Play Store
├── api/             # CodeIgniter 3 (PHP 8.1) REST API           → XAMPP / any PHP host
├── shared/          # Shared TS contracts (consumed by web + mobile)
│
├── database/        # Canonical SQL schema + seed data (schema.sql, seed.sql)
├── infra/           # Local dev — docker-compose: MySQL + Elasticsearch + Kibana + phpMyAdmin
├── deploy/          # Production — Apache + PM2 + ecosystem.config + update.sh
├── deploy-static/   # Static-export build for pure CDN hosting (Cloudflare Pages / S3)
├── api-deploy/      # Containerized API — Dockerfile + nginx + php-fpm + supervisord
├── api-wrapper/     # Vercel serverless proxy in front of CI3 (edge caching + CORS)
├── design/          # Design system reference (palette, typography, components)
└── docs/            # Architecture, API spec, DB schema, ES indices, SEO checklist
```

**Three deploy shapes — pick what fits:**

| Shape | Folders | When |
|---|---|---|
| **All-in-one VPS** | `deploy/` | Default. One Apache + PM2 + PHP-FPM box. ~$25/mo. |
| **Edge + API box** | `api-wrapper/` + your CI3 box | Marketing site on Vercel, CI3 behind it. Lowest latency. |
| **Containerized** | `api-deploy/` | If you want Kubernetes/Docker Swarm/Fargate. |
| **Static CDN** | `deploy-static/` (marketing only) + `api-deploy/` (portals) | Maximum scale, cheapest. Two domains. |

## Tech stack

| Layer        | Choice                                                           |
| ------------ | ---------------------------------------------------------------- |
| Web          | Next.js 15 (App Router), TypeScript, Tailwind CSS v4, next-pwa   |
| Web UI       | shadcn-style primitives, Lucide icons, Framer Motion             |
| Forms        | react-hook-form + zod (web), react-hook-form + zod (mobile)      |
| Data fetch   | TanStack Query (web + mobile)                                    |
| Mobile       | React Native via Expo SDK 51+, Expo Router, NativeWind           |
| Backend API  | **CodeIgniter 3** + chriskacerguis/codeigniter-restserver, **PHP 8.1** |
| Auth         | JWT (firebase/php-jwt) — same tokens for web + mobile            |
| Database     | MySQL 8 (managed via phpMyAdmin)                                 |
| Search       | Elasticsearch 8.x                                                |
| Payments     | Razorpay (India)                                                 |
| Hosting      | Web → Vercel · API → any PHP 8.1 host · Mobile → EAS Build       |

> **CI3 + PHP 8.1 note:** Use CodeIgniter 3.1.13 (the last release with broad PHP 8.x compatibility). Some deprecation notices are expected; `index.php` is configured to suppress them in production.

See [docs/architecture.md](docs/architecture.md) for the full system design.

## Quick start (local dev)

### 1. Infrastructure — MySQL, Elasticsearch, Kibana, phpMyAdmin

```powershell
cd infra
docker compose up -d
```

- MySQL: `localhost:3306` (user `mileora` / pass `mileora`)
- phpMyAdmin: http://localhost:8081
- Elasticsearch: http://localhost:9200
- Kibana: http://localhost:5601

> Already running MySQL via XAMPP? Comment the `mysql` service in `docker-compose.yml` and point the API at your XAMPP MySQL credentials.

### 2. Backend API — CodeIgniter 3

```powershell
cd api
copy application\config\.env.example application\config\.env
composer install
```

Then in your browser visit `http://localhost/Mileora/api/index.php/migrate` to run migrations, then `http://localhost/Mileora/api/index.php/migrate/seed` to load demo data.

API base URL: `http://localhost/Mileora/api/index.php/api/v1`

### 3. Web — Next.js

```powershell
cd web
copy .env.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

### 4. Mobile — React Native (Expo)

```powershell
cd mobile
copy .env.example .env
npm install
npx expo start
```

Scan QR with Expo Go (Android/iOS) or press `a` for Android emulator, `i` for iOS simulator.

## Documentation

- [Architecture](docs/architecture.md) — system diagram, data flow, decisions
- [API spec](docs/api-spec.md) — REST endpoints
- [Database schema](docs/database-schema.md) — tables + relationships
- [Elasticsearch indices](docs/elasticsearch-indices.md) — mappings
- [SEO checklist](docs/seo-checklist.md) — what's already wired + what to verify per page

## Production deploy

- **Web** → push to GitHub, connect Vercel project, set env vars from `web/.env.example`
- **API** → upload `api/` to PHP 8.1 host, point webroot at the `api/` folder, configure `application/config/.env`, run migrations once
- **DB** → managed MySQL (DigitalOcean / AWS RDS / PlanetScale) or self-hosted with phpMyAdmin
- **Elasticsearch** → Elastic Cloud or Bonsai (managed)
- **Mobile** → `eas build --platform all` then `eas submit`
