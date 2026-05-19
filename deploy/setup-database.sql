-- One-time production database bootstrap. Run by `update.sh` on first deploy.
-- DO NOT re-run on an existing prod database — it's destructive.
--
-- Usage:
--   mysql -u root -p < setup-database.sql

CREATE DATABASE IF NOT EXISTS `mileora`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create a least-privilege app user. The password should be set via env var
-- before running this script:
--   export DB_APP_PASSWORD='...'
--   envsubst < setup-database.sql | mysql -u root -p
SET @app_password = COALESCE(@app_password, NULL);

CREATE USER IF NOT EXISTS 'mileora_app'@'%'
  IDENTIFIED BY 'CHANGE_ME_BEFORE_RUNNING';

GRANT SELECT, INSERT, UPDATE, DELETE, EXECUTE
  ON `mileora`.*
  TO 'mileora_app'@'%';

-- A separate user for migrations / DDL. Keep its credentials in a sealed vault.
CREATE USER IF NOT EXISTS 'mileora_ddl'@'%'
  IDENTIFIED BY 'CHANGE_ME_BEFORE_RUNNING';

GRANT ALL PRIVILEGES ON `mileora`.* TO 'mileora_ddl'@'%';

FLUSH PRIVILEGES;

-- Then load:
--   mysql -u mileora_ddl -p mileora < ../database/schema.sql
--   mysql -u mileora_ddl -p mileora < ../database/seed.sql
