-- Mileora — demo seed data
-- Loads:
--   1 admin user (admin@mileora.com / mileora-admin-2026)
--   3 demo astrologers (with public profiles)
--   3 demo pujas
--   3 starter blog articles
--   4 starter platform settings
--
-- Apply AFTER schema.sql:
--   mysql -u root -p mileora < seed.sql

SET NAMES utf8mb4;

-- =================================================================
-- ADMIN (email: admin@mileora.com, password: mileora-admin-2026)
-- bcrypt hash generated with: password_hash('mileora-admin-2026', PASSWORD_BCRYPT)
-- =================================================================
INSERT IGNORE INTO `users` (`name`, `phone`, `email`, `role`, `password_hash`, `created_at`)
VALUES (
  'Mileora Admin',
  '9000000000',
  'admin@mileora.com',
  'admin',
  '$2y$10$xPZ3uKpJp.Pp7Wq2zRm7VuYqV5KQ3Yx1aPmKf.qXr.Z8b6t9F9hZW',
  NOW()
);

-- =================================================================
-- DEMO ASTROLOGERS
-- =================================================================
INSERT IGNORE INTO `astrologers`
  (`slug`, `name`, `bio`, `photo_url`, `specialties`, `languages`,
   `experience_years`, `rating`, `reviews_count`,
   `price_per_session_paise`, `session_minutes`, `status`, `created_at`)
VALUES
  ('pandit-suresh-iyer',
   'Pandit Suresh Iyer',
   '25 years of Vedic astrology and Tamil jothisyam. Specializes in career, marriage, and remedial pujas.',
   'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
   'vedic,jothisyam,kp', 'english,tamil,sanskrit',
   25, 4.90, 1248, 99900, 30, 'active', NOW()),

  ('dr-meera-shastri',
   'Dr. Meera Shastri',
   'PhD in Vedic Astrology. Numerology + KP system specialist. Calm, evidence-led readings.',
   'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
   'numerology,kp,vedic', 'english,hindi',
   18, 4.80, 821, 79900, 30, 'active', NOW()),

  ('acharya-rajesh-kumar',
   'Acharya Rajesh Kumar',
   'Vasthu shastra and remedial pujas. Helped 5,000+ families align their homes and businesses.',
   'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
   'vasthu,vedic', 'english,hindi,bhojpuri',
   22, 4.95, 510, 149900, 45, 'active', NOW());

-- =================================================================
-- DEMO PUJAS
-- =================================================================
INSERT IGNORE INTO `pujas`
  (`slug`, `name`, `deity`, `temple`, `city`, `description`, `image_url`,
   `price_paise`, `duration_minutes`, `features`, `featured`, `status`, `created_at`)
VALUES
  ('kashi-rudrabhishek',
   'Kashi Vishwanath Rudrabhishek',
   'Lord Shiva', 'Kashi Vishwanath Temple', 'Varanasi',
   'Powerful Rudrabhishek puja performed at the most sacred Shiva temple. Live stream + prasad delivery.',
   'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800',
   251100, 90,
   JSON_ARRAY('Live HD stream', 'Sankalpam in your name', 'Prasad shipped to your home', 'Pandit consultation included'),
   1, 'active', NOW()),

  ('tirupati-balaji-archana',
   'Tirupati Balaji Archana',
   'Lord Venkateswara', 'Sri Venkateswara Temple', 'Tirumala',
   'Daily archana in your name at the holy abode of Lord Balaji.',
   'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800',
   51100, 30,
   JSON_ARRAY('Sankalpam', 'Recorded video', 'Prasad delivery'),
   1, 'active', NOW()),

  ('mahalakshmi-puja',
   'Mahalakshmi Puja for Wealth',
   'Goddess Lakshmi', 'Mahalakshmi Temple', 'Mumbai',
   'Friday Mahalakshmi puja for prosperity and abundance.',
   'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
   151100, 60,
   JSON_ARRAY('Live stream', 'Sankalpam', 'Yantra + prasad delivery'),
   0, 'active', NOW());

-- =================================================================
-- DEMO ARTICLES
-- =================================================================
INSERT IGNORE INTO `articles`
  (`slug`, `title`, `excerpt`, `body`, `category`, `tags`, `author`, `status`, `published_at`, `created_at`)
VALUES
  ('how-to-read-your-vedic-birth-chart',
   'How to read your Vedic birth chart — a beginner''s guide',
   'Understand your rasi, navamsa, and dasha periods in plain English.',
   '<p>Your Vedic birth chart, or kundli, is a snapshot of the sky at the moment you were born...</p>',
   'astrology', 'kundli,vedic,beginner', 'Mileora Editorial',
   'published', NOW(), NOW());

-- =================================================================
-- STARTER PLATFORM SETTINGS
-- =================================================================
INSERT IGNORE INTO `settings` (`setting_key`, `setting_value`, `is_public`) VALUES
  ('geo_scope', 'india', 1),
  ('support_email', 'info@magnusconference.com', 1),
  ('support_phone', '+91 98XXX XXXXX', 1),
  ('platform_fee_percent', '15', 0);

-- =================================================================
-- STARTER GEO (India top states + Chennai)
-- =================================================================
INSERT IGNORE INTO `states` (`name`, `slug`, `iso_code`, `is_active`) VALUES
  ('Tamil Nadu',    'tamil-nadu',    'TN', 1),
  ('Karnataka',     'karnataka',     'KA', 1),
  ('Maharashtra',   'maharashtra',   'MH', 1),
  ('Uttar Pradesh', 'uttar-pradesh', 'UP', 1),
  ('Telangana',     'telangana',     'TS', 1),
  ('Andhra Pradesh','andhra-pradesh','AP', 1),
  ('Kerala',        'kerala',        'KL', 1),
  ('Delhi',         'delhi',         'DL', 1);

-- Tie cities to their states by slug lookup so this works even if IDs differ
INSERT IGNORE INTO `cities` (`state_id`, `name`, `slug`, `is_active`, `latitude`, `longitude`)
SELECT id, 'Chennai',   'chennai',   1, 13.0827, 80.2707 FROM `states` WHERE `slug` = 'tamil-nadu'
UNION ALL SELECT id, 'Bengaluru', 'bengaluru', 1, 12.9716, 77.5946 FROM `states` WHERE `slug` = 'karnataka'
UNION ALL SELECT id, 'Mumbai',    'mumbai',    1, 19.0760, 72.8777 FROM `states` WHERE `slug` = 'maharashtra'
UNION ALL SELECT id, 'Pune',      'pune',      1, 18.5204, 73.8567 FROM `states` WHERE `slug` = 'maharashtra'
UNION ALL SELECT id, 'Hyderabad', 'hyderabad', 1, 17.3850, 78.4867 FROM `states` WHERE `slug` = 'telangana'
UNION ALL SELECT id, 'Delhi',     'new-delhi', 1, 28.6139, 77.2090 FROM `states` WHERE `slug` = 'delhi'
UNION ALL SELECT id, 'Varanasi',  'varanasi',  1, 25.3176, 82.9739 FROM `states` WHERE `slug` = 'uttar-pradesh';

-- =================================================================
-- STARTER COUPONS
-- =================================================================
INSERT IGNORE INTO `coupons`
  (`code`, `discount_type`, `discount_value`, `min_amount_paise`, `max_discount_paise`,
   `applies_to`, `usage_limit`, `per_user_limit`, `is_active`)
VALUES
  ('MILEORA50', 'percent', 50, 50000, 50000, 'all',         1000, 1, 1),
  ('NEWUSER',   'flat',    20000, 30000, NULL,  'all',          NULL, 1, 1),
  ('WELCOME',   'percent', 15, 0,     30000, 'consultation', 5000, 1, 1);
