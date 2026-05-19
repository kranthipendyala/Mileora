<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Geo + Addresses for Mileora:
 *  - states / cities / localities — used for in-person vasthu audits and
 *    location-based puja booking (e.g. Kashi Vishwanath in Varanasi)
 *  - addresses — user address book (prasad delivery, in-person vasthu visits)
 *
 * Ported from Servora's geo schema and lightly adapted (kept seed-ready
 * for major Indian states + tier-1/2 cities).
 */
class Migration_Add_geo_tables extends CI_Migration
{
    public function up(): void
    {
        // States
        $this->dbforge->add_field([
            'id'         => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'name'       => ['type' => 'VARCHAR', 'constraint' => 80],
            'slug'       => ['type' => 'VARCHAR', 'constraint' => 80],
            'iso_code'   => ['type' => 'CHAR', 'constraint' => 5, 'null' => TRUE],
            'is_active'  => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'created_at' => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->create_table('states', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `states` ADD UNIQUE KEY `states_slug_uq` (`slug`)');

        // Cities
        $this->dbforge->add_field([
            'id'          => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'state_id'    => ['type' => 'INT', 'unsigned' => TRUE],
            'name'        => ['type' => 'VARCHAR', 'constraint' => 120],
            'slug'        => ['type' => 'VARCHAR', 'constraint' => 120],
            'is_active'   => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'meta_title'  => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE],
            'meta_description' => ['type' => 'TEXT', 'null' => TRUE],
            'latitude'    => ['type' => 'DECIMAL(10,7)', 'null' => TRUE],
            'longitude'   => ['type' => 'DECIMAL(10,7)', 'null' => TRUE],
            'created_at'  => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('state_id');
        $this->dbforge->create_table('cities', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
        $this->db->query('ALTER TABLE `cities` ADD UNIQUE KEY `cities_slug_uq` (`slug`)');

        // Localities (neighbourhoods)
        $this->dbforge->add_field([
            'id'          => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'city_id'     => ['type' => 'INT', 'unsigned' => TRUE],
            'name'        => ['type' => 'VARCHAR', 'constraint' => 150],
            'slug'        => ['type' => 'VARCHAR', 'constraint' => 180],
            'pincode'     => ['type' => 'VARCHAR', 'constraint' => 10, 'null' => TRUE],
            'is_active'   => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
            'created_at'  => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['city_id', 'slug']);
        $this->dbforge->create_table('localities', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Addresses (user address book — for prasad shipping + vasthu visits)
        $this->dbforge->add_field([
            'id'           => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'user_id'      => ['type' => 'INT', 'unsigned' => TRUE],
            'label'        => ['type' => 'VARCHAR', 'constraint' => 40, 'default' => 'home',
                               'comment' => 'home, office, mom, etc.'],
            'name'         => ['type' => 'VARCHAR', 'constraint' => 160],
            'phone'        => ['type' => 'VARCHAR', 'constraint' => 15],
            'line1'        => ['type' => 'VARCHAR', 'constraint' => 200],
            'line2'        => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE],
            'locality_id'  => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE],
            'city_id'      => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE],
            'state_id'     => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE],
            'pincode'      => ['type' => 'VARCHAR', 'constraint' => 10],
            'landmark'     => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE],
            'is_default'   => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0],
            'created_at'   => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at'   => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('user_id');
        $this->dbforge->add_key('pincode');
        $this->dbforge->create_table('addresses', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Seed a starter row in each so demo doesn't 404
        $this->db->insert('states', ['name' => 'Tamil Nadu', 'slug' => 'tamil-nadu', 'iso_code' => 'TN']);
        $tn_id = (int) $this->db->insert_id();
        $this->db->insert('states', ['name' => 'Karnataka', 'slug' => 'karnataka', 'iso_code' => 'KA']);
        $this->db->insert('states', ['name' => 'Maharashtra', 'slug' => 'maharashtra', 'iso_code' => 'MH']);
        $this->db->insert('states', ['name' => 'Uttar Pradesh', 'slug' => 'uttar-pradesh', 'iso_code' => 'UP']);

        $this->db->insert('cities', ['state_id' => $tn_id, 'name' => 'Chennai', 'slug' => 'chennai',
            'latitude' => 13.0827, 'longitude' => 80.2707]);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('addresses', TRUE);
        $this->dbforge->drop_table('localities', TRUE);
        $this->dbforge->drop_table('cities', TRUE);
        $this->dbforge->drop_table('states', TRUE);
    }
}
