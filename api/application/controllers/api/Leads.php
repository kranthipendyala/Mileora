<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Leads extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Lead_model');
    }

    public function create()
    {
        $this->require_server_caller();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $name     = trim((string) ($in['name'] ?? ''));
        $phone    = trim((string) ($in['phone'] ?? ''));
        $email    = trim((string) ($in['email'] ?? ''));
        $interest = (string) ($in['interest'] ?? '');
        $source   = (string) ($in['source'] ?? 'web');

        if (!$name || !preg_match('/^[6-9]\d{9}$/', $phone)) {
            $this->fail('VALIDATION', 'Name and valid phone required', 422);
            return;
        }
        if (!in_array($interest, ['astrology', 'numerology', 'vasthu', 'jothisyam', 'puja'], true)) {
            $this->fail('VALIDATION', 'Invalid interest', 422);
            return;
        }

        $id = $this->Lead_model->create([
            'name'       => $name,
            'phone'      => $phone,
            'email'      => $email,
            'interest'   => $interest,
            'source'     => $source,
            'status'     => 'new',
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        // TODO: dispatch internal notification (Slack / email / WhatsApp).
        $this->ok(['id' => $id], [], 201);
    }

    public function index()
    {
        $claims = $this->require_user();
        if (($claims->role ?? 'user') !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin only', 403);
            return;
        }
        $rows = $this->Lead_model->all_recent(200);
        $this->ok($rows);
    }
}
