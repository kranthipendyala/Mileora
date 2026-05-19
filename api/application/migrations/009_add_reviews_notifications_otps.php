<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Adds tables for:
 *  - reviews         (independent reviews; complements `reviews` already created
 *                     in migration 002 for astrologer-specific reviews. This new
 *                     `reviews` is more general — booking-attached, can be for
 *                     pujas/reports too)
 *  - notifications   (in-app feed + push log)
 *  - device_tokens   (FCM/APNS tokens per user, for push notifications)
 *  - otps            (centralized OTP storage with attempt limits; replaces
 *                     inline otp_hash/otp_expires_at columns on users)
 */
class Migration_Add_reviews_notifications_otps extends CI_Migration
{
    public function up(): void
    {
        // The existing `reviews` table (from 002) is astrologer-scoped. Extend it
        // with optional booking_id + type so it can also cover pujas and reports.
        if (!$this->db->field_exists('booking_id', 'reviews')) {
            $this->dbforge->add_column('reviews', [
                'booking_id' => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE, 'after' => 'astrologer_id'],
                'type'       => ['type' => "ENUM('astrologer','puja','report')", 'default' => 'astrologer', 'after' => 'booking_id'],
                'title'      => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE, 'after' => 'rating'],
                'status'     => ['type' => "ENUM('published','hidden','flagged')", 'default' => 'published', 'after' => 'body'],
            ]);
        }

        // Notifications (in-app feed)
        $this->dbforge->add_field([
            'id'         => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'user_id'    => ['type' => 'INT', 'unsigned' => TRUE],
            'type'       => ['type' => 'VARCHAR', 'constraint' => 64,
                             'comment' => 'booking_confirmed, booking_reminder, payment_received, review_received, system'],
            'title'      => ['type' => 'VARCHAR', 'constraint' => 200],
            'body'       => ['type' => 'TEXT', 'null' => TRUE],
            'data_json'  => ['type' => 'JSON', 'null' => TRUE],
            'cta_url'    => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => TRUE],
            'read_at'    => ['type' => 'DATETIME', 'null' => TRUE],
            'sent_push'  => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0],
            'created_at' => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['user_id', 'read_at']);
        $this->dbforge->create_table('notifications', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Device tokens (for FCM push)
        $this->dbforge->add_field([
            'id'         => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'user_id'    => ['type' => 'INT', 'unsigned' => TRUE],
            'platform'   => ['type' => "ENUM('ios','android','web')"],
            'token'      => ['type' => 'VARCHAR', 'constraint' => 500],
            'app_version' => ['type' => 'VARCHAR', 'constraint' => 32, 'null' => TRUE],
            'is_active'  => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'last_seen_at' => ['type' => 'DATETIME', 'null' => TRUE],
            'created_at' => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('user_id');
        $this->dbforge->create_table('device_tokens', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Centralized OTPs
        $this->dbforge->add_field([
            'id'           => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'channel'      => ['type' => "ENUM('phone','email')", 'default' => 'phone'],
            'identifier'   => ['type' => 'VARCHAR', 'constraint' => 190,
                               'comment' => 'phone number or email'],
            'purpose'      => ['type' => 'VARCHAR', 'constraint' => 32, 'default' => 'login',
                               'comment' => 'login, signup, guide_apply, password_reset'],
            'code_hash'    => ['type' => 'VARCHAR', 'constraint' => 190],
            'attempts'     => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0],
            'expires_at'   => ['type' => 'DATETIME'],
            'verified_at'  => ['type' => 'DATETIME', 'null' => TRUE],
            'created_at'   => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['identifier', 'purpose']);
        $this->dbforge->add_key('expires_at');
        $this->dbforge->create_table('otps', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('otps', TRUE);
        $this->dbforge->drop_table('device_tokens', TRUE);
        $this->dbforge->drop_table('notifications', TRUE);
        // Don't drop columns on reviews (leave additive)
    }
}
