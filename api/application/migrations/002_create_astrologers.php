<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_astrologers extends CI_Migration
{
    public function up(): void
    {
        $this->dbforge->add_field([
            'id'           => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'slug'         => ['type' => 'VARCHAR', 'constraint' => 160],
            'name'         => ['type' => 'VARCHAR', 'constraint' => 160],
            'bio'          => ['type' => 'TEXT', 'null' => TRUE],
            'photo_url'    => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => TRUE],
            'specialties'  => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => TRUE], // CSV: vedic,jothisyam,kp
            'languages'    => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE], // CSV: english,tamil,hindi
            'experience_years' => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0],
            'rating'       => ['type' => 'DECIMAL(3,2)', 'default' => '4.50'],
            'reviews_count' => ['type' => 'INT', 'unsigned' => TRUE, 'default' => 0],
            'price_per_session_paise' => ['type' => 'INT', 'unsigned' => TRUE, 'default' => 49900],
            'session_minutes' => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 30],
            'status'       => ['type' => 'ENUM("active","paused","draft")', 'default' => 'active'],
            'created_at'   => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at'   => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('astrologers', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `astrologers` ADD UNIQUE KEY `astrologers_slug_uq` (`slug`)');

        $this->dbforge->add_field([
            'id'            => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'astrologer_id' => ['type' => 'INT', 'unsigned' => TRUE],
            'starts_at'     => ['type' => 'DATETIME'],
            'ends_at'       => ['type' => 'DATETIME'],
            'status'        => ['type' => 'ENUM("open","held","booked","cancelled")', 'default' => 'open'],
            'created_at'    => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['astrologer_id', 'starts_at']);
        $this->dbforge->create_table('astrologer_slots', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        $this->dbforge->add_field([
            'id'            => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'astrologer_id' => ['type' => 'INT', 'unsigned' => TRUE],
            'user_id'       => ['type' => 'INT', 'unsigned' => TRUE],
            'rating'        => ['type' => 'TINYINT', 'unsigned' => TRUE],
            'body'          => ['type' => 'TEXT', 'null' => TRUE],
            'created_at'    => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('astrologer_id');
        $this->dbforge->create_table('reviews', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('reviews', TRUE);
        $this->dbforge->drop_table('astrologer_slots', TRUE);
        $this->dbforge->drop_table('astrologers', TRUE);
    }
}
