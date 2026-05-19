<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Servora-pattern service catalog for Mileora:
 *  - service_categories    canonical, hierarchical catalog (Astrology, Numerology,
 *                          Vasthu, Jothisyam, Puja, Kundli Matching, etc.)
 *  - guide_services        PER-GUIDE service rows (Pandit Suresh's "30-min Vedic
 *                          Reading" at ₹999 is different from another guide's)
 *  - guide_service_variants optional pricing tiers ("Quick 15-min" vs "Deep 60-min")
 *
 * Replaces hardcoded service lists in the web frontend.
 * Seeds 9 starter categories so the home page renders on first install.
 */
class Migration_Add_services_catalog extends CI_Migration
{
    public function up(): void
    {
        // ---- Canonical category catalog ----
        $this->dbforge->add_field([
            'id'          => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'parent_id'   => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE,
                              'comment' => 'NULL = top-level category'],
            'name'        => ['type' => 'VARCHAR', 'constraint' => 120],
            'slug'        => ['type' => 'VARCHAR', 'constraint' => 140],
            'icon'        => ['type' => 'VARCHAR', 'constraint' => 60, 'null' => TRUE,
                              'comment' => 'Lucide icon name — e.g. Sparkles, Calculator, Home'],
            'description' => ['type' => 'TEXT', 'null' => TRUE],
            'meta_title'  => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE],
            'meta_description' => ['type' => 'TEXT', 'null' => TRUE],
            'sort_order'  => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 0],
            'is_active'   => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'created_at'  => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('parent_id');
        $this->dbforge->create_table('service_categories', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `service_categories` ADD UNIQUE KEY `svc_categories_slug_uq` (`slug`)');

        // ---- Per-guide service rows ----
        $this->dbforge->add_field([
            'id'               => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'guide_id'         => ['type' => 'INT', 'unsigned' => TRUE,
                                   'comment' => 'users.id where role=guide'],
            'category_id'      => ['type' => 'INT', 'unsigned' => TRUE],
            'name'             => ['type' => 'VARCHAR', 'constraint' => 200,
                                   'comment' => 'e.g. "30-min Vedic Birth Chart Reading"'],
            'slug'             => ['type' => 'VARCHAR', 'constraint' => 220],
            'description'      => ['type' => 'TEXT', 'null' => TRUE],
            'base_price_paise' => ['type' => 'INT', 'unsigned' => TRUE],
            'discounted_price_paise' => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE],
            'price_unit'       => ['type' => "ENUM('fixed','per_session','per_hour','per_report')",
                                   'default' => 'fixed'],
            'duration_minutes' => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 30],
            'delivery_mode'    => ['type' => "ENUM('video','voice','chat','in_person','async_report','online_puja')",
                                   'default' => 'video'],
            'image_url'        => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => TRUE],
            'sort_order'       => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 0],
            'is_active'        => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'created_at'       => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at'       => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['guide_id', 'category_id']);
        $this->dbforge->add_key('category_id');
        $this->dbforge->create_table('guide_services', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `guide_services` ADD UNIQUE KEY `guide_services_slug_uq` (`guide_id`, `slug`)');

        // ---- Optional pricing variants per service ----
        $this->dbforge->add_field([
            'id'               => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'service_id'       => ['type' => 'INT', 'unsigned' => TRUE],
            'name'             => ['type' => 'VARCHAR', 'constraint' => 120,
                                   'comment' => 'e.g. "Quick 15-min" or "Deep 60-min"'],
            'price_paise'      => ['type' => 'INT', 'unsigned' => TRUE],
            'duration_minutes' => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 30],
            'is_active'        => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'sort_order'       => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 0],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('service_id');
        $this->dbforge->create_table('guide_service_variants', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // ---- Seed 9 starter categories ----
        $this->db->insert_batch('service_categories', [
            ['name' => 'Vedic Astrology',  'slug' => 'astrology',
             'icon' => 'Sparkles',         'sort_order' => 1, 'is_active' => 1,
             'description' => 'Birth chart analysis, dasha periods, planetary remedies from verified Vedic astrologers.',
             'meta_title' => 'Vedic Astrology — Birth Chart, Dasha & Remedies',
             'meta_description' => 'Authentic Vedic astrology readings on Mileora. Get your kundli analyzed, understand dasha periods, and receive personalized remedies.'],
            ['name' => 'Numerology',       'slug' => 'numerology',
             'icon' => 'Calculator',       'sort_order' => 2, 'is_active' => 1,
             'description' => 'Life path, destiny, soul-urge numbers and lucky vibrations from your name and date of birth.',
             'meta_title' => 'Numerology — Life Path, Destiny & Lucky Numbers',
             'meta_description' => 'Decode your life path, destiny, and lucky numbers. Free instant numerology reading + expert consultation.'],
            ['name' => 'Vasthu Shastra',   'slug' => 'vasthu',
             'icon' => 'Home',             'sort_order' => 3, 'is_active' => 1,
             'description' => 'Compass-based vasthu audit for your home or office. Practical, no-demolition fixes from verified vasthu experts.',
             'meta_title' => 'Vasthu Shastra — Home & Office Energy Audit',
             'meta_description' => 'Compass-based vasthu audit for your home or office. Practical fixes from verified vasthu experts on Mileora.'],
            ['name' => 'Tamil Jothisyam',  'slug' => 'jothisyam',
             'icon' => 'Sun',              'sort_order' => 4, 'is_active' => 1,
             'description' => 'South Indian Vedic astrology with rasi, navamsa, and traditional Tamil panchangam guidance.',
             'meta_title' => 'Tamil Jothisyam — South Indian Vedic Astrology',
             'meta_description' => 'Authentic Tamil jothisyam readings — rasi, navamsa, traditional Tamil panchangam guidance from verified jothidars.'],
            ['name' => 'Online Puja',      'slug' => 'puja',
             'icon' => 'Flame',            'sort_order' => 5, 'is_active' => 1,
             'description' => 'Authentic pujas at famous temples, live streamed in your name with prasad delivery.',
             'meta_title' => 'Online Puja Booking — Authentic Rituals at Famous Temples',
             'meta_description' => 'Book authentic pujas at India\'s most sacred temples — live stream, sankalpam in your name, prasad delivered.'],
            ['name' => 'Kundli Matching',  'slug' => 'kundli-matching',
             'icon' => 'Heart',            'sort_order' => 6, 'is_active' => 1,
             'description' => 'Vedic kundli matching with 36-guna porutham — for marriage compatibility.',
             'meta_title' => 'Kundli Matching — 36 Guna Porutham',
             'meta_description' => 'Free Vedic kundli matching with 36-guna porutham analysis. Check compatibility for marriage instantly.'],
            ['name' => 'Tarot Reading',    'slug' => 'tarot',
             'icon' => 'Layers',           'sort_order' => 7, 'is_active' => 1,
             'description' => 'Tarot card readings for love, career, and decision-making clarity.',
             'meta_title' => 'Tarot Reading — Love, Career & Life Guidance',
             'meta_description' => 'Tarot card readings on Mileora — love, career, and life-decision clarity from verified tarot readers.'],
            ['name' => 'Daily Horoscope',  'slug' => 'horoscope',
             'icon' => 'Star',             'sort_order' => 8, 'is_active' => 1,
             'description' => 'Personalized daily, weekly, and monthly horoscopes by your rasi.',
             'meta_title' => 'Daily Horoscope — All 12 Zodiac Signs',
             'meta_description' => 'Daily horoscope for all 12 zodiac signs — Vedic + Western readings, updated every morning.'],
            ['name' => 'Remedial Pujas',   'slug' => 'remedial-pujas',
             'icon' => 'Sparkle',          'sort_order' => 9, 'is_active' => 1,
             'description' => 'Custom remedial pujas for planetary doshas, navagraha shanti, and pitru tarpanam.',
             'meta_title' => 'Remedial Pujas — Navagraha Shanti, Dosha Nivaran',
             'meta_description' => 'Custom remedial pujas for planetary doshas — performed at the most relevant temple in your name.'],
        ]);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('guide_service_variants', TRUE);
        $this->dbforge->drop_table('guide_services', TRUE);
        $this->dbforge->drop_table('service_categories', TRUE);
    }
}
