<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Extends the users table to support 3 roles (user, guide, admin):
 *  - changes role enum to (user, guide, admin)
 *  - adds password_hash for admin email+password login
 *  - adds guide onboarding fields (kyc_status, business_name, business_type, onboarding_completed)
 *
 * Servora pattern: single users table, role column distinguishes; admin uses
 * email+password, user/guide use phone+OTP.
 */
class Migration_Extend_users_for_3_roles extends CI_Migration
{
    public function up(): void
    {
        // Change role enum
        $this->db->query(
            "ALTER TABLE `users`
             MODIFY COLUMN `role` ENUM('user','guide','admin') NOT NULL DEFAULT 'user'"
        );

        // Add admin email+password support
        $this->dbforge->add_column('users', [
            'password_hash' => [
                'type' => 'VARCHAR', 'constraint' => 190, 'null' => TRUE, 'after' => 'role',
            ],
            'last_login_at' => [
                'type' => 'DATETIME', 'null' => TRUE, 'after' => 'password_hash',
            ],
        ]);

        // Guide-specific onboarding fields (NULL for users + admins)
        $this->dbforge->add_column('users', [
            'business_name' => [
                'type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE,
            ],
            'business_type' => [
                'type' => 'VARCHAR', 'constraint' => 60, 'null' => TRUE,
                'comment' => 'astrologer, pujari, numerologist, vasthu, tarot',
            ],
            'kyc_status' => [
                'type' => 'ENUM("pending","verified","rejected")', 'default' => 'pending',
            ],
            'onboarding_completed' => [
                'type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0,
            ],
            'astrologer_id' => [
                'type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE,
                'comment' => 'links a guide row to its public astrologers row',
            ],
        ]);

        // Email needs to be unique for admin login
        $this->db->query("ALTER TABLE `users` ADD UNIQUE KEY `users_email_uq` (`email`)");
    }

    public function down(): void
    {
        $this->db->query("DROP INDEX `users_email_uq` ON `users`");
        $this->dbforge->drop_column('users', 'astrologer_id');
        $this->dbforge->drop_column('users', 'onboarding_completed');
        $this->dbforge->drop_column('users', 'kyc_status');
        $this->dbforge->drop_column('users', 'business_type');
        $this->dbforge->drop_column('users', 'business_name');
        $this->dbforge->drop_column('users', 'last_login_at');
        $this->dbforge->drop_column('users', 'password_hash');
        $this->db->query(
            "ALTER TABLE `users`
             MODIFY COLUMN `role` ENUM('user','astrologer','admin') NOT NULL DEFAULT 'user'"
        );
    }
}
