<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_users extends CI_Migration
{
    public function up(): void
    {
        $this->dbforge->add_field([
            'id'    => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'name'  => ['type' => 'VARCHAR', 'constraint' => 120],
            'phone' => ['type' => 'VARCHAR', 'constraint' => 15],
            'email' => ['type' => 'VARCHAR', 'constraint' => 190, 'null' => TRUE],
            'role'  => ['type' => 'ENUM("user","astrologer","admin")', 'default' => 'user'],
            'phone_verified_at' => ['type' => 'DATETIME', 'null' => TRUE],
            'otp_hash'          => ['type' => 'VARCHAR', 'constraint' => 190, 'null' => TRUE],
            'otp_expires_at'    => ['type' => 'DATETIME', 'null' => TRUE],
            'created_at'        => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at'        => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('phone', FALSE);
        $this->db->query('CREATE TABLE IF NOT EXISTS `users_placeholder` (id INT) ENGINE=InnoDB');
        $this->dbforge->create_table('users', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `users` ADD UNIQUE KEY `users_phone_uq` (`phone`)');
        $this->db->query('DROP TABLE IF EXISTS `users_placeholder`');
    }

    public function down(): void
    {
        $this->dbforge->drop_table('users', TRUE);
    }
}
