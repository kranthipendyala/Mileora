<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Adds:
 *  - chat_threads / chat_messages — booking-scoped chat between user and guide
 *  - guide_documents              — KYC docs (PAN, Aadhaar, certificate scans)
 *  - guide_bank_accounts          — payout bank details
 *  - guide_availability           — recurring weekly availability windows
 */
class Migration_Add_chat_and_guide_kyc extends CI_Migration
{
    public function up(): void
    {
        // Chat threads — one per booking, but a thread can exist before a booking too
        $this->dbforge->add_field([
            'id'           => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'booking_id'   => ['type' => 'INT', 'unsigned' => TRUE, 'null' => TRUE],
            'user_id'      => ['type' => 'INT', 'unsigned' => TRUE],
            'guide_id'     => ['type' => 'INT', 'unsigned' => TRUE],
            'last_message_at' => ['type' => 'DATETIME', 'null' => TRUE],
            'created_at'   => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['user_id', 'guide_id']);
        $this->dbforge->add_key('booking_id');
        $this->dbforge->create_table('chat_threads', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Chat messages
        $this->dbforge->add_field([
            'id'         => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'thread_id'  => ['type' => 'INT', 'unsigned' => TRUE],
            'sender_id'  => ['type' => 'INT', 'unsigned' => TRUE],
            'sender_role' => ['type' => "ENUM('user','guide','system')", 'default' => 'user'],
            'body'       => ['type' => 'TEXT', 'null' => TRUE],
            'attachment_url' => ['type' => 'VARCHAR', 'constraint' => 500, 'null' => TRUE],
            'read_at'    => ['type' => 'DATETIME', 'null' => TRUE],
            'created_at' => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['thread_id', 'created_at']);
        $this->dbforge->create_table('chat_messages', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Guide KYC documents
        $this->dbforge->add_field([
            'id'           => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'guide_id'     => ['type' => 'INT', 'unsigned' => TRUE],
            'doc_type'     => ['type' => "ENUM('pan','aadhaar','certificate','gst','other')"],
            'doc_number'   => ['type' => 'VARCHAR', 'constraint' => 100, 'null' => TRUE],
            'file_url'     => ['type' => 'VARCHAR', 'constraint' => 500],
            'status'       => ['type' => "ENUM('submitted','verified','rejected')", 'default' => 'submitted'],
            'rejection_reason' => ['type' => 'VARCHAR', 'constraint' => 200, 'null' => TRUE],
            'created_at'   => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
            'verified_at'  => ['type' => 'DATETIME', 'null' => TRUE],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('guide_id');
        $this->dbforge->create_table('guide_documents', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Guide bank accounts (for payouts)
        $this->dbforge->add_field([
            'id'           => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'guide_id'     => ['type' => 'INT', 'unsigned' => TRUE],
            'account_name' => ['type' => 'VARCHAR', 'constraint' => 120],
            'account_number' => ['type' => 'VARCHAR', 'constraint' => 32],
            'ifsc'         => ['type' => 'VARCHAR', 'constraint' => 16],
            'bank_name'    => ['type' => 'VARCHAR', 'constraint' => 80, 'null' => TRUE],
            'is_default'   => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 0],
            'verified_at'  => ['type' => 'DATETIME', 'null' => TRUE],
            'created_at'   => ['type' => 'DATETIME', 'default' => 'CURRENT_TIMESTAMP'],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key('guide_id');
        $this->dbforge->create_table('guide_bank_accounts', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);

        // Recurring weekly availability windows for guides
        $this->dbforge->add_field([
            'id'           => ['type' => 'INT', 'unsigned' => TRUE, 'auto_increment' => TRUE],
            'guide_id'     => ['type' => 'INT', 'unsigned' => TRUE],
            'day_of_week'  => ['type' => 'TINYINT', 'unsigned' => TRUE,
                               'comment' => '0=Sunday, 6=Saturday'],
            'start_time'   => ['type' => 'TIME'],
            'end_time'     => ['type' => 'TIME'],
            'is_active'    => ['type' => 'TINYINT', 'unsigned' => TRUE, 'default' => 1],
        ]);
        $this->dbforge->add_key('id', TRUE);
        $this->dbforge->add_key(['guide_id', 'day_of_week']);
        $this->dbforge->create_table('guide_availability', TRUE, ['ENGINE' => 'InnoDB', 'CHARSET' => 'utf8mb4']);
    }

    public function down(): void
    {
        $this->dbforge->drop_table('guide_availability', TRUE);
        $this->dbforge->drop_table('guide_bank_accounts', TRUE);
        $this->dbforge->drop_table('guide_documents', TRUE);
        $this->dbforge->drop_table('chat_messages', TRUE);
        $this->dbforge->drop_table('chat_threads', TRUE);
    }
}
