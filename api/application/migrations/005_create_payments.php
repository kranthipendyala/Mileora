<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Migration_Create_payments extends CI_Migration
{
    public function up(): void
    {
        $this->dbforge->add_field([
            'id'                  => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'booking_id'          => ['type' => 'INT', 'unsigned' => TRUE],
            'razorpay_order_id'   => ['type' => 'VARCHAR', 'constraint' => 80],
            'razorpay_payment_id' => ['type' => 'VARCHAR', 'constraint' => 80],
            'amount_paise'        => ['type' => 'INT', 'unsigned' => TRUE],
            'currency'            => ['type' => 'CHAR', 'constraint' => 3, 'default' => 'INR'],
            'status'              => ['type' => 'ENUM("created","authorized","captured","refunded","failed")', 'default' => 'created'],
            'method'              => ['type' => 'VARCHAR', 'constraint' => 32, 'null' => TRUE],
            'created_at'          => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('booking_id');
        $this->dbforge->add_key('razorpay_payment_id');
        $this->dbforge->create_table('payments', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('payments', TRUE);
    }
}
