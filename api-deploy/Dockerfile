# Production image for the Mileora API (CodeIgniter 3 + PHP 8.1).
# Multi-stage:
#   1. composer:2  → install vendor/
#   2. php:8.1-fpm-alpine + nginx → runtime
#
# Build:
#   docker build -t mileora/api:latest -f api-deploy/Dockerfile .
#
# Run (with managed MySQL + Elasticsearch over network):
#   docker run -d --name mileora-api -p 8080:80 \
#     --env-file .env.production \
#     mileora/api:latest

# -------- Stage 1: vendor dependencies --------
FROM composer:2 AS deps

WORKDIR /build
COPY api/composer.json api/composer.lock* ./
RUN composer install --no-dev --no-scripts --no-interaction --prefer-dist --optimize-autoloader

# -------- Stage 2: runtime --------
FROM php:8.1-fpm-alpine

# System packages
RUN apk add --no-cache \
      nginx supervisor curl tzdata \
      libpng libjpeg-turbo libwebp icu \
    && apk add --no-cache --virtual .build-deps \
      $PHPIZE_DEPS libpng-dev libjpeg-turbo-dev libwebp-dev icu-dev oniguruma-dev \
    && docker-php-ext-configure gd --with-jpeg --with-webp \
    && docker-php-ext-install -j$(nproc) gd intl mysqli pdo_mysql mbstring opcache \
    && apk del .build-deps \
    && rm -rf /var/cache/apk/*

# PHP-FPM tuning
COPY api-deploy/php.ini      /usr/local/etc/php/php.ini
COPY api-deploy/php-fpm.conf /usr/local/etc/php-fpm.d/zz-mileora.conf

# Nginx in front of PHP-FPM
COPY api-deploy/nginx.conf   /etc/nginx/nginx.conf
COPY api-deploy/site.conf    /etc/nginx/http.d/default.conf

# Supervisor runs nginx + php-fpm
COPY api-deploy/supervisord.conf /etc/supervisord.conf

# App
WORKDIR /var/www/api
COPY api/ ./
COPY --from=deps /build/vendor ./vendor

# CI3 system files are NOT in git; download via composer-managed framework
# (chriskacerguis/codeigniter-restserver pulls CI3 as a transitive dep — copy them)
RUN if [ -d vendor/codeigniter/framework/system ]; then \
      cp -r vendor/codeigniter/framework/system ./system; \
    fi

# Logs + cache dirs writable by php-fpm
RUN mkdir -p application/logs application/cache application/cache/sessions \
    && chown -R www-data:www-data application/logs application/cache \
    && chmod -R 755 application/logs application/cache

# Disable display_errors regardless of .env
ENV CI_ENV=production

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD curl -fs http://localhost/api/v1/health || exit 1

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
