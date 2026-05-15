<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_leads extends CI_Migration
{
    public function up(): void
    {
        $this->dbforge->add_field([
            'id'         => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'name'       => ['type' => 'VARCHAR', 'constraint' => 160],
            'phone'      => ['type' => 'VARCHAR', 'constraint' => 15],
            'email'      => ['type' => 'VARCHAR', 'constraint' => 190, 'null' => TRUE],
            'interest'   => ['type' => 'ENUM("astrology","numerology","vasthu","jothisyam","puja")'],
            'source'     => ['type' => 'VARCHAR', 'constraint' => 64, 'default' => 'web'],
            'status'     => ['type' => 'ENUM("new","contacted","converted","lost")', 'default' => 'new'],
            'assigned_to' => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE],
            'notes'      => ['type' => 'TEXT', 'null' => TRUE],
            'created_at' => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at' => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('phone');
        $this->dbforge->add_key('status');
        $this->dbforge->add_key('created_at');
        $this->dbforge->create_table('leads', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Articles for blog/SEO + ES indexing.
        $this->dbforge->add_field([
            'id'         => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'slug'       => ['type' => 'VARCHAR', 'constraint' => 200],
            'title'      => ['type' => 'VARCHAR', 'constraint' => 260],
            'excerpt'    => ['type' => 'TEXT', 'null' => TRUE],
            'body'       => ['type' => 'LONGTEXT', 'null' => TRUE],
            'category'   => ['type' => 'VARCHAR', 'constraint' => 60, 'null' => TRUE],
            'tags'       => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => TRUE],
            'cover_url'  => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => TRUE],
            'author'     => ['type' => 'VARCHAR', 'constraint' => 120, 'null' => TRUE],
            'published_at' => ['type' => 'DATETIME', 'null' => TRUE],
            'status'     => ['type' => 'ENUM("draft","published")', 'default' => 'draft'],
            'created_at' => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at' => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('articles', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `articles` ADD UNIQUE KEY `articles_slug_uq` (`slug`)');
    }

    public function down(): void
    {
        $this->dbforge->drop_table('articles', TRUE);
        $this->dbforge->drop_table('leads', TRUE);
    }
}
