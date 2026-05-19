<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Guide portal endpoints — used after a guide has signed in.
 * The auth/OTP endpoints live in api/Auth.php (guide_send_otp, guide_verify).
 */
class Guide extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Guide_model');
        $this->load->model('Booking_model');
    }

    /** POST /api/v1/guide/apply — public application submission (server-key gated). */
    public function apply()
    {
        $this->require_server_caller();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $name  = trim((string) ($in['name'] ?? ''));
        $phone = trim((string) ($in['phone'] ?? ''));
        $email = trim((string) ($in['email'] ?? ''));

        if (!$name || !preg_match('/^[6-9]\d{9}$/', $phone)) {
            $this->fail('VALIDATION', 'Name and valid 10-digit phone required', 422);
            return;
        }

        $existing = $this->db->get_where('users', ['phone' => $phone])->row_array();
        if ($existing) {
            $this->fail('PHONE_TAKEN', 'A Mileora account with this phone already exists', 409);
            return;
        }

        $guide_id = $this->Guide_model->apply([
            'name'          => $name,
            'phone'         => $phone,
            'email'         => $email,
            'business_name' => $in['business_name'] ?? null,
            'business_type' => $in['business_type'] ?? null,
        ]);

        $this->ok(['guide_id' => $guide_id, 'status' => 'pending'], [], 201);
    }

    /** GET /api/v1/guide/me — guide pulls own profile (JWT-auth, role=guide). */
    public function me()
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'guide') {
            $this->fail('FORBIDDEN', 'Guide token required', 403);
            return;
        }
        $guide = $this->Guide_model->find((int) $claims->sub);
        if (!$guide) {
            $this->fail('NOT_FOUND', 'Guide not found', 404);
            return;
        }
        $this->ok($guide);
    }

    /** GET /api/v1/guide/dashboard — KPIs for the signed-in guide. */
    public function dashboard()
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'guide') {
            $this->fail('FORBIDDEN', 'Guide token required', 403);
            return;
        }
        $guide = $this->Guide_model->find((int) $claims->sub);
        if (!$guide) {
            $this->fail('NOT_FOUND', 'Guide not found', 404);
            return;
        }

        $astrologer_id = (int) ($guide['astrologer_id'] ?? 0);
        $bookings = $astrologer_id ? $this->db
            ->where('type', 'consultation')
            ->where('item_id', $astrologer_id)
            ->order_by('created_at', 'DESC')
            ->limit(20)
            ->get('bookings')
            ->result_array() : [];

        $month_start = date('Y-m-01 00:00:00');
        $revenue_paise = $astrologer_id ? (int) $this->db
            ->select_sum('amount_paise')
            ->where(['type' => 'consultation', 'item_id' => $astrologer_id, 'status' => 'confirmed'])
            ->where('confirmed_at >=', $month_start)
            ->get('bookings')->row()->amount_paise : 0;

        $this->ok([
            'guide' => $guide,
            'kpis'   => [
                'bookings_total'   => count($bookings),
                'revenue_paise'    => $revenue_paise,
            ],
            'upcoming' => array_slice($bookings, 0, 5),
        ]);
    }
}
