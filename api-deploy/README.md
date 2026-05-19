# Mileora — Containerized API

Production Docker image for the CodeIgniter 3 API. Single container packs nginx + php-fpm + supervisord.

## Files

| File | Purpose |
|---|---|
| [`Dockerfile`](Dockerfile) | Multi-stage build: composer deps → php:8.1-fpm-alpine runtime |
| [`nginx.conf`](nginx.conf), [`site.conf`](site.conf) | Nginx in front of PHP-FPM |
| [`php.ini`](php.ini) | PHP overrides — OpCache on, `display_errors` off, 256M memory |
| [`php-fpm.conf`](php-fpm.conf) | Dynamic worker pool (20 max children, tuned for 1 GB / 1 vCPU) |
| [`supervisord.conf`](supervisord.conf) | Runs nginx + php-fpm as PID 1 |
| [`docker-compose.prod.yml`](docker-compose.prod.yml) | Single-container deploy with persistent volumes |
| [`api.env.example`](api.env.example) | Production env vars — copy to `api.env` and fill in |

## Build & run

```bash
# From repo root
docker build -t mileora/api:latest -f api-deploy/Dockerfile .

# Or via compose (recommended)
cd api-deploy
cp api.env.example api.env
vi api.env                                # fill in DB, JWT, Razorpay, ES, FCM
docker compose -f docker-compose.prod.yml up -d
```

API is now at `http://localhost:8080/api/v1/health` (returns 200 once warm).

## Deploy to a registry

```bash
docker build -t ghcr.io/kranthipendyala/mileora-api:$(git rev-parse --short HEAD) \
              -t ghcr.io/kranthipendyala/mileora-api:latest \
              -f api-deploy/Dockerfile .
docker push ghcr.io/kranthipendyala/mileora-api --all-tags
```

## Tuning for bigger boxes

Edit [`php-fpm.conf`](php-fpm.conf):

| Resources | `pm.max_children` |
|---|---|
| 1 GB / 1 vCPU | 20 |
| 2 GB / 1 vCPU | 40 |
| 4 GB / 2 vCPU | 80 |

Rule of thumb: `(available_memory_MB - 200) / 25` if each request peaks at ~25 MB.

## Logs

- `docker logs mileora-api` — supervisord, nginx, php-fpm combined
- Volume `api-logs` → `/var/log/nginx`
- Volume `api-php-logs` → `/var/log/php`

## Migrations on first boot

The Dockerfile does **not** run migrations automatically. After the container is up:

```bash
docker exec -it mileora-api php /var/www/api/index.php migrate
docker exec -it mileora-api php /var/www/api/index.php migrate seed
```

Or apply the SQL dump from [`/database/schema.sql`](../database/schema.sql) directly against your managed DB.
