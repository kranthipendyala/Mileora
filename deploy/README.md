# Mileora — Production deployment

Reference configs for the canonical "one VPS, two tiers" deploy:

- **Web (Next.js)** runs on Node via PM2 on `127.0.0.1:3000`
- **API (CodeIgniter 3 + PHP-FPM)** runs under Apache at `/api`
- **MySQL** + **Elasticsearch** are usually managed services (Elastic Cloud, DigitalOcean DB, etc.)

## Files

| File | Purpose |
|---|---|
| [`apache-proxy.conf`](apache-proxy.conf) | VirtualHost — HTTPS + HTTP→HTTPS, routes `/api` to PHP-FPM and everything else to Next |
| [`ecosystem.config.js`](ecosystem.config.js) | PM2 process definition for `mileora-web` (cluster mode, auto-restart, deploy step) |
| [`next.config.production.mjs`](next.config.production.mjs) | Drop-in prod config (PWA enabled, immutable static-asset cache, full security headers) |
| [`config-production.php`](config-production.php) | CI3 prod config — HTTPS-only, DB sessions, secure cookies, output compression |
| [`setup-database.sql`](setup-database.sql) | One-time DB bootstrap — creates schema + least-privilege app user + DDL user |
| [`update.sh`](update.sh) | Idempotent deploy script — composer install, migrate, npm build, pm2 reload, health-check |

## First-time setup

```bash
# 1. SSH to the box and clone
ssh deploy@mileora.com
sudo mkdir -p /var/www/mileora && sudo chown deploy:deploy /var/www/mileora
git clone https://github.com/kranthipendyala/Mileora.git /var/www/mileora

# 2. Database
mysql -u root -p < deploy/setup-database.sql
mysql -u mileora_ddl -p mileora < database/schema.sql
mysql -u mileora_ddl -p mileora < database/seed.sql

# 3. Configure secrets
cp api/application/config/.env.example api/application/config/.env
vi api/application/config/.env                 # fill in DB, JWT, Razorpay, FCM
cp deploy/config-production.php api/application/config/config.php

cp web/.env.example web/.env.local
vi web/.env.local                              # fill NEXT_PUBLIC_API_URL etc.
cp deploy/next.config.production.mjs web/next.config.mjs

# 4. Apache vhost
sudo cp deploy/apache-proxy.conf /etc/apache2/sites-available/mileora.com.conf
sudo a2enmod proxy proxy_http rewrite headers ssl http2
sudo a2ensite mileora.com
sudo certbot --apache -d mileora.com -d www.mileora.com
sudo systemctl reload apache2

# 5. PM2
cd /var/www/mileora
chmod +x deploy/update.sh
./deploy/update.sh
pm2 startup        # one-time — wires PM2 into systemd
pm2 save
```

## Ongoing deploys

```bash
ssh deploy@mileora.com
cd /var/www/mileora
git pull
./deploy/update.sh
```

That's it. The script is idempotent and self-verifying.

## Rolling back

```bash
git log --oneline -5                     # find the previous good commit
git checkout <sha>
./deploy/update.sh
```

## Logs

| What | Where |
|---|---|
| PM2 web stdout/stderr | `/var/log/mileora/web-*.log` |
| Apache access/error   | `/var/log/apache2/mileora-*.log` |
| CodeIgniter           | `api/application/logs/log-YYYY-MM-DD.log` |
| PHP-FPM               | `/var/log/php8.1-fpm.log` |
| MySQL slow queries    | `/var/log/mysql/mysql-slow.log` (enable in `my.cnf`) |

## Staging

For `staging.mileora.com`, duplicate this folder as `deploy-staging/` with:
- different `WEB_URL` / `API_URL` in `update.sh`
- different Apache `ServerName`
- different DB name (`mileora_staging`)
- Razorpay test mode (not live)

## CloudFlare in front?

Update `config-production.php` to set `proxy_ips` to CloudFlare's IP ranges (see https://www.cloudflare.com/ips/) so CodeIgniter trusts `CF-Connecting-IP` for the real client IP.
