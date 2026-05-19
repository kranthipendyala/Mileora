# Mileora — Database

Canonical SQL schema + seed data. Versioned alongside the CI3 migrations in [`api/application/migrations/`](../api/application/migrations/).

| File | Purpose |
|---|---|
| [`schema.sql`](schema.sql) | Full schema dump (all 17 tables from migrations 001–011) |
| [`seed.sql`](seed.sql) | Demo data — 1 admin, 3 astrologers, 3 pujas, geo, articles, coupons, settings |

## Two ways to provision

### 1. From SQL (fastest, e.g. CI/CD bootstrap)

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS mileora CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p mileora < schema.sql
mysql -u root -p mileora < seed.sql        # optional demo data
```

### 2. From CI3 migrations (dev-loop friendly)

```powershell
cd c:\xampp2\htdocs\Mileora\api
composer install
# Visit http://localhost/Mileora/api/index.php/migrate
# Visit http://localhost/Mileora/api/index.php/migrate/seed
```

Both paths produce identical schemas. SQL is the source of truth for production; migrations are convenient for incremental dev changes.

## Updating the schema

When you add a new CI3 migration:

1. Write the migration in `api/application/migrations/NNN_descriptive_name.php`
2. Bump `migration_version` in `api/application/config/migration.php`
3. **Update [`schema.sql`](schema.sql) and [`seed.sql`](seed.sql) here** to reflect the new shape
4. Bump the `INSERT INTO migrations` version at the bottom of `schema.sql`

## Restoring from a production dump

```bash
# On the prod server
mysqldump --single-transaction --routines --triggers \
  -u $DB_USER -p$DB_PASS mileora > mileora-$(date +%Y%m%d).sql.gz

# Locally
gunzip < mileora-2026-05-19.sql.gz | mysql -u root -p mileora
```

## Notes

- All tables use `InnoDB` + `utf8mb4_unicode_ci` for proper emoji + Tamil/Devanagari support.
- Money is stored in **paise** (`INT UNSIGNED`) — never `DECIMAL`. Display layer divides by 100.
- The `migrations` table at the bottom of `schema.sql` is required by CI3's Migration class so it doesn't try to re-apply 001–011 on top of an already-provisioned schema.
- The seeded admin password is `mileora-admin-2026` — **change it immediately in production**.
