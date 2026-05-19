<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Adds:
 *  - coupons          — promo codes for bookings
 *  - coupon_redemptions — usage log
 *  - settings         — key/value platform config (geo_scope, feature flags, etc.)
 *  - seo_pages        — CMS-style metadata overrides for individual URL paths
 */
class Migration_Add_coupons_settings_seo extends CI_Migration
{
    public function up(): void
    {
        // Coupons
        $this->dbforge->add_field([
            'id'              => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'code'            => ['type' => 'VARCHAR', 'constraint' => 32],
            'discount_type'   => ['type' => "ENUM('flat','percent')", 'default' => 'flat'],
            'discount_value'  => ['type' => 'INT', 'unsigned' => TRUE,
                                  'comment' => 'paise if flat, integer 1-100 if percent'],
            'min_amount_paise' => ['type' => 'INT', 'unsigned' => TRUE, 'default' => 0],
            'max_discount_paise' => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE],
            'applies_to'      => ['type' => "ENUM('all','consultation','puja','report')", 'default' => 'all'],
            'usage_limit'     => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE,
                                  'comment' => 'total platform-wide uses (NULL = unlimited)'],
            'per_user_limit'  => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'starts_at'       => ['type' => 'DATETIME', 'null' => TRUE],
            'expires_at'      => ['type' => 'DATETIME', 'null' => TRUE],
            'is_active'       => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'created_at'      => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('coupons', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `coupons` ADD UNIQUE KEY `coupons_code_uq` (`code`)');

        // Redemptions
        $this->dbforge->add_field([
            'id'                => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'coupon_id'         => ['type' => 'INT', 'unsigned' => TRUE],
            'user_id'           => ['type' => 'INT', 'unsigned' => TRUE],
            'booking_id'        => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE],
            'discount_paise'    => ['type' => 'INT', 'unsigned' => TRUE],
            'created_at'        => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['coupon_id', 'user_id']);
        $this->dbforge->create_table('coupon_redemptions', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Settings (platform config)
        $this->dbforge->add_field([
            'id'            => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'setting_key'   => ['type' => 'VARCHAR', 'constraint' => 64],
            'setting_value' => ['type' => 'TEXT', 'null' => TRUE],
            'is_public'     => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0,
                                'comment' => '1 = exposed to client; 0 = server-only'],
            'updated_at'    => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('settings', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `settings` ADD UNIQUE KEY `settings_key_uq` (`setting_key`)');

        // SEO page overrides
        $this->dbforge->add_field([
            'id'                => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'path'              => ['type' => 'VARCHAR', 'constraint' => 250,
                                    'comment' => 'starts with /'],
            'meta_title'        => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE],
            'meta_description'  => ['type' => 'TEXT', 'null' => TRUE],
            'h1'                => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE],
            'noindex'           => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0],
            'json_ld'           => ['type' => 'JSON', 'null' => TRUE],
            'updated_at'        => ['type' => 'DATETIME', 'null' => TRUE],
            'created_at'        => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('seo_pages', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `seo_pages` ADD UNIQUE KEY `seo_pages_path_uq` (`path`)');

        // Seed a few starter settings
        $this->db->insert('settings', ['setting_key' => 'geo_scope', 'setting_value' => 'india', 'is_public' => 1]);
        $this->db->insert('settings', ['setting_key' => 'support_email', 'setting_value' => 'info@magnusconference.com', 'is_public' => 1]);
        $this->db->insert('settings', ['setting_key' => 'support_phone', 'setting_value' => '+91 98XXX XXXXX', 'is_public' => 1]);
        $this->db->insert('settings', ['setting_key' => 'platform_fee_percent', 'setting_value' => '15', 'is_public' => 0]);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('seo_pages', TRUE);
        $this->dbforge->drop_table('settings', TRUE);
        $this->dbforge->drop_table('coupon_redemptions', TRUE);
        $this->dbforge->drop_table('coupons', TRUE);
    }
}
