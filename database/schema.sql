-- Mileora — full schema dump
-- Generated from CI3 migrations 001–011.
-- Target: MySQL 8.0, utf8mb4_unicode_ci, InnoDB.
--
-- To recreate the database from scratch:
--   mysql -u root -p mileora < schema.sql
--   mysql -u root -p mileora < seed.sql       (optional demo data)
--
-- Or run via CI3:
--   visit http://localhost/Mileora/api/index.php/migrate

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET time_zone = '+00:00';

-- =================================================================
-- 001 — users (extended in 007 for 3 roles)
-- =================================================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `email` VARCHAR(190) NULL,
  `role` ENUM('user','guide','admin') NOT NULL DEFAULT 'user',
  `password_hash` VARCHAR(190) NULL,
  `last_login_at` DATETIME NULL,
  `phone_verified_at` DATETIME NULL,
  `otp_hash` VARCHAR(190) NULL,
  `otp_expires_at` DATETIME NULL,
  `business_name` VARCHAR(200) NULL,
  `business_type` VARCHAR(60) NULL COMMENT 'astrologer, pujari, numerologist, vasthu, tarot',
  `kyc_status` ENUM('pending','verified','rejected') DEFAULT 'pending',
  `onboarding_completed` TINYINT UNSIGNED DEFAULT 0,
  `astrologer_id` INT UNSIGNED NULL COMMENT 'links a guide row to its public astrologers row',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_uq` (`phone`),
  UNIQUE KEY `users_email_uq` (`email`),
  KEY `users_phone_ix` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================
-- 002 — astrologers + slots + (legacy) reviews
-- =================================================================
CREATE TABLE IF NOT EXISTS `astrologers` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(160) NOT NULL,
  `name` VARCHAR(160) NOT NULL,
  `bio` TEXT NULL,
  `photo_url` VARCHAR(500) NULL,
  `specialties` VARCHAR(500) NULL COMMENT 'CSV: vedic,jothisyam,kp',
  `languages` VARCHAR(200) NULL COMMENT 'CSV: english,tamil,hindi',
  `experience_years` TINYINT UNSIGNED DEFAULT 0,
  `rating` DECIMAL(3,2) DEFAULT 4.50,
  `reviews_count` INT UNSIGNED DEFAULT 0,
  `price_per_session_paise` INT UNSIGNED DEFAULT 49900,
  `session_minutes` SMALLINT UNSIGNED DEFAULT 30,
  `status` ENUM('active','paused','draft') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `astrologers_slug_uq` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `astrologer_slots` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `astrologer_id` INT UNSIGNED NOT NULL,
  `starts_at` DATETIME NOT NULL,
  `ends_at` DATETIME NOT NULL,
  `status` ENUM('open','held','booked','cancelled') DEFAULT 'open',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `astrologer_slots_lookup` (`astrologer_id`, `starts_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `astrologer_id` INT UNSIGNED NOT NULL,
  `booking_id` INT UNSIGNED NULL,
  `type` ENUM('astrologer','puja','report') DEFAULT 'astrologer',
  `user_id` INT UNSIGNED NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `title` VARCHAR(200) NULL,
  `body` TEXT NULL,
  `status` ENUM('published','hidden','flagged') DEFAULT 'published',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reviews_astrologer_ix` (`astrologer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 003 — pujas + schedules
-- =================================================================
CREATE TABLE IF NOT EXISTS `pujas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(160) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `deity` VARCHAR(100) NULL,
  `temple` VARCHAR(200) NULL,
  `city` VARCHAR(80) NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(500) NULL,
  `price_paise` INT UNSIGNED DEFAULT 99900,
  `duration_minutes` SMALLINT UNSIGNED DEFAULT 60,
  `features` TEXT NULL COMMENT 'JSON array',
  `featured` TINYINT UNSIGNED DEFAULT 0,
  `status` ENUM('active','draft') DEFAULT 'active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pujas_slug_uq` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `puja_schedules` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `puja_id` INT UNSIGNED NOT NULL,
  `starts_at` DATETIME NOT NULL,
  `capacity` SMALLINT UNSIGNED DEFAULT 100,
  `booked` SMALLINT UNSIGNED DEFAULT 0,
  `status` ENUM('open','closed','cancelled') DEFAULT 'open',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `puja_schedules_lookup` (`puja_id`, `starts_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 004 — bookings
-- =================================================================
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` ENUM('consultation','puja','report') NOT NULL,
  `item_id` INT UNSIGNED DEFAULT 0,
  `item_slug` VARCHAR(160) NOT NULL,
  `slot_iso` DATETIME NULL,
  `amount_paise` INT UNSIGNED NOT NULL,
  `currency` CHAR(3) DEFAULT 'INR',
  `status` ENUM('pending','confirmed','failed','cancelled','refunded') DEFAULT 'pending',
  `razorpay_order_id` VARCHAR(80) NULL,
  `razorpay_payment_id` VARCHAR(80) NULL,
  `user_name` VARCHAR(160) NOT NULL,
  `user_phone` VARCHAR(15) NOT NULL,
  `user_email` VARCHAR(190) NOT NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  `confirmed_at` DATETIME NULL,
  `cancelled_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `bookings_user_ix` (`user_phone`),
  KEY `bookings_order_ix` (`razorpay_order_id`),
  KEY `bookings_item_ix` (`type`, `item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 005 — payments
-- =================================================================
CREATE TABLE IF NOT EXISTS `payments` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NOT NULL,
  `razorpay_order_id` VARCHAR(80) NOT NULL,
  `razorpay_payment_id` VARCHAR(80) NOT NULL,
  `amount_paise` INT UNSIGNED NOT NULL,
  `currency` CHAR(3) DEFAULT 'INR',
  `status` ENUM('created','authorized','captured','refunded','failed') DEFAULT 'created',
  `method` VARCHAR(32) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `payments_booking_ix` (`booking_id`),
  KEY `payments_payment_ix` (`razorpay_payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 006 — leads + articles
-- =================================================================
CREATE TABLE IF NOT EXISTS `leads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(160) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `email` VARCHAR(190) NULL,
  `interest` ENUM('astrology','numerology','vasthu','jothisyam','puja') NOT NULL,
  `source` VARCHAR(64) DEFAULT 'web',
  `status` ENUM('new','contacted','converted','lost') DEFAULT 'new',
  `assigned_to` INT UNSIGNED NULL,
  `notes` TEXT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `leads_phone_ix` (`phone`),
  KEY `leads_status_ix` (`status`),
  KEY `leads_created_ix` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `articles` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` VARCHAR(200) NOT NULL,
  `title` VARCHAR(260) NOT NULL,
  `excerpt` TEXT NULL,
  `body` LONGTEXT NULL,
  `category` VARCHAR(60) NULL,
  `tags` VARCHAR(500) NULL,
  `cover_url` VARCHAR(500) NULL,
  `author` VARCHAR(120) NULL,
  `published_at` DATETIME NULL,
  `status` ENUM('draft','published') DEFAULT 'draft',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `articles_slug_uq` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 008 — geo (states / cities / localities / addresses)
-- =================================================================
CREATE TABLE IF NOT EXISTS `states` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(80) NOT NULL,
  `slug` VARCHAR(80) NOT NULL,
  `iso_code` CHAR(5) NULL,
  `is_active` TINYINT UNSIGNED DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `states_slug_uq` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `cities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `state_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `slug` VARCHAR(120) NOT NULL,
  `is_active` TINYINT UNSIGNED DEFAULT 1,
  `meta_title` VARCHAR(200) NULL,
  `meta_description` TEXT NULL,
  `latitude` DECIMAL(10,7) NULL,
  `longitude` DECIMAL(10,7) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cities_slug_uq` (`slug`),
  KEY `cities_state_ix` (`state_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `localities` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `city_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(180) NOT NULL,
  `pincode` VARCHAR(10) NULL,
  `is_active` TINYINT UNSIGNED DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `localities_city_ix` (`city_id`, `slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `addresses` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `label` VARCHAR(40) DEFAULT 'home' COMMENT 'home, office, mom, etc.',
  `name` VARCHAR(160) NOT NULL,
  `phone` VARCHAR(15) NOT NULL,
  `line1` VARCHAR(200) NOT NULL,
  `line2` VARCHAR(200) NULL,
  `locality_id` INT UNSIGNED NULL,
  `city_id` INT UNSIGNED NULL,
  `state_id` INT UNSIGNED NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `landmark` VARCHAR(200) NULL,
  `is_default` TINYINT UNSIGNED DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `addresses_user_ix` (`user_id`),
  KEY `addresses_pin_ix` (`pincode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 009 — notifications, device_tokens, otps
-- =================================================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `type` VARCHAR(64) NOT NULL COMMENT 'booking_confirmed, booking_reminder, payment_received, review_received, system',
  `title` VARCHAR(200) NOT NULL,
  `body` TEXT NULL,
  `data_json` JSON NULL,
  `cta_url` VARCHAR(500) NULL,
  `read_at` DATETIME NULL,
  `sent_push` TINYINT UNSIGNED DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `notifications_inbox_ix` (`user_id`, `read_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `device_tokens` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `platform` ENUM('ios','android','web') NOT NULL,
  `token` VARCHAR(500) NOT NULL,
  `app_version` VARCHAR(32) NULL,
  `is_active` TINYINT UNSIGNED DEFAULT 1,
  `last_seen_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `device_tokens_user_ix` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `otps` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `channel` ENUM('phone','email') DEFAULT 'phone',
  `identifier` VARCHAR(190) NOT NULL COMMENT 'phone number or email',
  `purpose` VARCHAR(32) DEFAULT 'login' COMMENT 'login, signup, guide_apply, password_reset',
  `code_hash` VARCHAR(190) NOT NULL,
  `attempts` TINYINT UNSIGNED DEFAULT 0,
  `expires_at` DATETIME NOT NULL,
  `verified_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `otps_lookup_ix` (`identifier`, `purpose`),
  KEY `otps_expires_ix` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 010 — chat + guide KYC
-- =================================================================
CREATE TABLE IF NOT EXISTS `chat_threads` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `booking_id` INT UNSIGNED NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `guide_id` INT UNSIGNED NOT NULL,
  `last_message_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chat_threads_pair_ix` (`user_id`, `guide_id`),
  KEY `chat_threads_booking_ix` (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `thread_id` INT UNSIGNED NOT NULL,
  `sender_id` INT UNSIGNED NOT NULL,
  `sender_role` ENUM('user','guide','system') DEFAULT 'user',
  `body` TEXT NULL,
  `attachment_url` VARCHAR(500) NULL,
  `read_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chat_messages_thread_ix` (`thread_id`, `created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `guide_documents` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `guide_id` INT UNSIGNED NOT NULL,
  `doc_type` ENUM('pan','aadhaar','certificate','gst','other') NOT NULL,
  `doc_number` VARCHAR(100) NULL,
  `file_url` VARCHAR(500) NOT NULL,
  `status` ENUM('submitted','verified','rejected') DEFAULT 'submitted',
  `rejection_reason` VARCHAR(200) NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `verified_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  KEY `guide_documents_guide_ix` (`guide_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `guide_bank_accounts` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `guide_id` INT UNSIGNED NOT NULL,
  `account_name` VARCHAR(120) NOT NULL,
  `account_number` VARCHAR(32) NOT NULL,
  `ifsc` VARCHAR(16) NOT NULL,
  `bank_name` VARCHAR(80) NULL,
  `is_default` TINYINT UNSIGNED DEFAULT 0,
  `verified_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `guide_bank_guide_ix` (`guide_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `guide_availability` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `guide_id` INT UNSIGNED NOT NULL,
  `day_of_week` TINYINT UNSIGNED NOT NULL COMMENT '0=Sunday, 6=Saturday',
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `is_active` TINYINT UNSIGNED DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `guide_avail_lookup` (`guide_id`, `day_of_week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- 011 — coupons, settings, seo
-- =================================================================
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(32) NOT NULL,
  `discount_type` ENUM('flat','percent') DEFAULT 'flat',
  `discount_value` INT UNSIGNED NOT NULL COMMENT 'paise if flat, integer 1-100 if percent',
  `min_amount_paise` INT UNSIGNED DEFAULT 0,
  `max_discount_paise` INT UNSIGNED NULL,
  `applies_to` ENUM('all','consultation','puja','report') DEFAULT 'all',
  `usage_limit` INT UNSIGNED NULL COMMENT 'platform-wide total uses; NULL = unlimited',
  `per_user_limit` TINYINT UNSIGNED DEFAULT 1,
  `starts_at` DATETIME NULL,
  `expires_at` DATETIME NULL,
  `is_active` TINYINT UNSIGNED DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_uq` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `coupon_redemptions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `coupon_id` INT UNSIGNED NOT NULL,
  `user_id` INT UNSIGNED NOT NULL,
  `booking_id` INT UNSIGNED NULL,
  `discount_paise` INT UNSIGNED NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `coupon_redemptions_pair_ix` (`coupon_id`, `user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `setting_key` VARCHAR(64) NOT NULL,
  `setting_value` TEXT NULL,
  `is_public` TINYINT UNSIGNED DEFAULT 0 COMMENT '1 = exposed to client; 0 = server-only',
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `settings_key_uq` (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `seo_pages` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `path` VARCHAR(250) NOT NULL COMMENT 'starts with /',
  `meta_title` VARCHAR(200) NULL,
  `meta_description` TEXT NULL,
  `h1` VARCHAR(200) NULL,
  `noindex` TINYINT UNSIGNED DEFAULT 0,
  `json_ld` JSON NULL,
  `updated_at` DATETIME NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seo_pages_path_uq` (`path`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =================================================================
-- CI3 framework table (migrations tracking)
-- =================================================================
CREATE TABLE IF NOT EXISTS `migrations` (
  `version` BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `migrations` (`version`) VALUES (11) ON DUPLICATE KEY UPDATE `version` = 11;

SET FOREIGN_KEY_CHECKS = 1;
