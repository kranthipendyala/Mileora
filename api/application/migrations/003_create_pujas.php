<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_pujas extends CI_Migration
{
    public function up(): void
    {
        $this->dbforge->add_field([
            'id'           => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'slug'         => ['type' => 'VARCHAR', 'constraint' => 160],
            'name'         => ['type' => 'VARCHAR', 'constraint' => 200],
            'deity'        => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => TRUE],
            'temple'       => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE],
            'city'         => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => TRUE],
            'description'  => ['type' => 'TEXT', 'null' => TRUE],
            'image_url'    => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => TRUE],
            'price_paise'  => ['type' => 'INT', 'unsigned' => TRUE, 'default' => 99900],
            'duration_minutes' => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 60],
            'features'     => ['type' => 'TEXT', 'null' => TRUE], // JSON array
            'featured'     => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0],
            'status'       => ['type' => 'ENUM("active","draft")', 'default' => 'active'],
            'created_at'   => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at'   => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('pujas', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `pujas` ADD UNIQUE KEY `pujas_slug_uq` (`slug`)');

        $this->dbforge->add_field([
            'id'         => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'puja_id'    => ['type' => 'INT', 'unsigned' => TRUE],
            'starts_at'  => ['type' => 'DATETIME'],
            'capacity'   => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 100],
            'booked'     => ['type' => 'SMALLINT', 'unsigned' => TRUE, 'default' => 0],
            'status'     => ['type' => 'ENUM("open","closed","cancelled")', 'default' => 'open'],
            'created_at' => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['puja_id', 'starts_at']);
        $this->dbforge->create_table('puja_schedules', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('puja_schedules', TRUE);
        $this->dbforge->drop_table('pujas', TRUE);
    }
}
