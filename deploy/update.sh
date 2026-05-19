#!/usr/bin/env bash
#
# Idempotent deploy script. Run on the production box after `git pull`.
# Steps it performs (in order):
#   1. composer install --no-dev for the CI3 API
#   2. Run any pending CI3 migrations
#   3. npm ci --omit=dev + next build for the web tier
#   4. pm2 reload mileora-web
#   5. Verify health endpoints respond 200
#
# Fail-fast: any non-zero exit aborts the deploy.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
echo "▶ deploying from $ROOT"

# ---- 1. CI3 API ----
echo "▶ [1/5] composer install --no-dev"
cd "$ROOT/api"
composer install --no-dev --optimize-autoloader --no-interaction

# ---- 2. Migrations ----
echo "▶ [2/5] running migrations"
# We call CI3's migrate controller via the CLI for safety. Requires
# `php-cli` and CodeIgniter's built-in CLI runner; see api/index.php.
php "$ROOT/api/index.php" migrate || {
  echo "✗ migrations failed; aborting"
  exit 1
}

# ---- 3. Next.js build ----
echo "▶ [3/5] npm ci + next build"
cd "$ROOT/web"
npm ci --omit=dev --no-audit --no-fund
npm run build

# ---- 4. Reload PM2 ----
echo "▶ [4/5] pm2 reload mileora-web"
pm2 reload "$ROOT/deploy/ecosystem.config.js" --env production --update-env

# ---- 5. Health check ----
echo "▶ [5/5] health checks"
sleep 3

WEB_URL="${WEB_URL:-https://mileora.com}"
API_URL="${API_URL:-https://api.mileora.com/api/v1/health}"

web_status=$(curl -s -o /dev/null -w "%{http_code}" "$WEB_URL")
api_status=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")

[[ "$web_status" == "200" ]] || { echo "✗ web $WEB_URL returned $web_status"; exit 1; }
[[ "$api_status" == "200" ]] || { echo "✗ api $API_URL returned $api_status"; exit 1; }

echo "✔ deploy complete — web $web_status, api $api_status"
