# Mileora API — CodeIgniter 3 + PHP 8.1

REST API for the Mileora platform. Consumed by the Next.js web app and the React Native mobile app.

## Setup

```powershell
cd c:\xampp2\htdocs\Mileora\api
copy application\config\.env.example application\config\.env
composer install
```

CodeIgniter 3's `system/` folder is **not** committed. After `composer install`:

```powershell
xcopy /E /I vendor\codeigniter\framework\system system
```

(or symlink it). The `application/` folder is fully owned by Mileora.

## Run migrations + seed

Open in browser (XAMPP must be serving `htdocs/Mileora/api/`):

- http://localhost/Mileora/api/index.php/migrate
- http://localhost/Mileora/api/index.php/migrate/seed

## Test

- Health: http://localhost/Mileora/api/index.php/api/v1/health
- Astrologers: http://localhost/Mileora/api/index.php/api/v1/astrologers

## Folder layout (CI3)

```
api/
├── index.php                       # Front controller (PHP-8.1 friendly bootstrap)
├── .htaccess                       # Pretty URLs
├── composer.json                   # PHP deps (CI3, jwt, razorpay, ES, dotenv)
├── application/
│   ├── config/
│   │   ├── .env.example            # Copy to .env
│   │   ├── config.php              # CI3 overrides
│   │   ├── database.php            # MySQL connection (reads from .env)
│   │   ├── routes.php              # All API routes
│   │   ├── autoload.php            # libs/helpers loaded for every request
│   │   ├── rest.php                # REST_Controller config (CORS, formats)
│   │   └── migration.php           # Migrations enabled, version = 6
│   ├── core/
│   │   └── MY_Controller.php       # Base REST controller (JWT + server-key helpers)
│   ├── controllers/
│   │   ├── Home.php
│   │   ├── Migrate.php             # Browser-callable migration runner
│   │   └── api/
│   │       ├── Health.php
│   │       ├── Auth.php
│   │       ├── Astrologers.php
│   │       ├── Pujas.php
│   │       ├── Bookings.php
│   │       ├── Payments.php
│   │       ├── Webhooks.php
│   │       ├── Leads.php
│   │       └── Search.php
│   ├── models/
│   │   ├── User_model.php
│   │   ├── Astrologer_model.php
│   │   ├── Puja_model.php
│   │   ├── Booking_model.php
│   │   ├── Payment_model.php
│   │   └── Lead_model.php
│   ├── libraries/
│   │   ├── Jwt_lib.php             # firebase/php-jwt wrapper
│   │   ├── Elasticsearch_service.php
│   │   └── Razorpay_service.php
│   ├── migrations/
│   │   ├── 001_create_users.php
│   │   ├── 002_create_astrologers.php
│   │   ├── 003_create_pujas.php
│   │   ├── 004_create_bookings.php
│   │   ├── 005_create_payments.php
│   │   └── 006_create_leads.php
│   └── database/
│       └── seeds/
│           └── DemoSeeder.php
└── system/                         # CI3 framework — installed via composer, not committed
```

## PHP 8.1 + CI3 caveats

- CI3 was written long before PHP 8. Expect `Deprecated` notices from `system/` files. We suppress these via `error_reporting()` in `index.php` for development; production sets `display_errors=0`.
- Avoid using CI3 features that triggered fatal errors on PHP 8.1 (the old `each()` loop, `create_function`, dynamic property assignment without `#[AllowDynamicProperties]`). Stay within the patterns shown in the existing controllers/models.
- `chriskacerguis/codeigniter-restserver` v3.2 is PHP 8.x compatible.
