<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_bookings extends CI_Migration
{
    public function up(): void
    {
        $this->dbforge->add_field([
            'id'            => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'type'          => ['type' => 'ENUM("consultation","puja","report")'],
            'item_id'       => ['type' => 'INT', 'unsigned' => TRUE, 'default' => 0],
            'item_slug'     => ['type' => 'VARCHAR', 'constraint' => 160],
            'slot_iso'      => ['type' => 'DATETIME', 'null' => TRUE],
            'amount_paise'  => ['type' => 'INT', 'unsigned' => TRUE],
            'currency'      => ['type' => 'CHAR', 'constraint' => 3, 'default' => 'INR'],
            'status'        => ['type' => 'ENUM("pending","confirmed","failed","cancelled","refunded")', 'default' => 'pending'],
            'razorpay_order_id'   => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => TRUE],
            'razorpay_payment_id' => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => TRUE],
            'user_name'     => ['type' => 'VARCHAR', 'constraint' => 160],
            'user_phone'    => ['type' => 'VARCHAR', 'constraint' => 15],
            'user_email'    => ['type' => 'VARCHAR', 'constraint' => 190],
            'notes'         => ['type' => 'TEXT', 'null' => TRUE],
            'created_at'    => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'updated_at'    => ['type' => 'DATETIME', 'null' => TRUE],
            'confirmed_at'  => ['type' => 'DATETIME', 'null' => TRUE],
            'cancelled_at'  => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('user_phone');
        $this->dbforge->add_key('razorpay_order_id');
        $this->dbforge->add_key(['type', 'item_id']);
        $this->dbforge->create_table('bookings', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('bookings', TRUE);
    }
}
