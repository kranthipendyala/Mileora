#!/usr/bin/env bash
#
# Build a static export of the Mileora marketing site for CDN hosting.
# Output goes to web/out/. Upload that folder to your CDN bucket.
#
# Usage:
#   ./deploy-static/build.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "▶ swapping in static config"
cp "$ROOT/deploy-static/next.config.static.mjs" "$ROOT/web/next.config.mjs"

cd "$ROOT/web"
echo "▶ npm ci"
npm ci --no-audit --no-fund

echo "▶ next build (static export)"
NEXT_TELEMETRY_DISABLED=1 npm run build

echo ""
echo "✔ static build complete — output in web/out/"
echo ""
echo "Upload to S3:"
echo "  aws s3 sync web/out/ s3://mileora-static --delete"
echo ""
echo "Upload to Cloudflare Pages:"
echo "  npx wrangler pages deploy web/out/"
