<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Admin console endpoints. All routes here require a JWT with role='admin'.
 * The admin login itself is in api/Auth.php (admin_login).
 */
class Admin extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model(['User_model', 'Guide_model', 'Lead_model', 'Booking_model']);
    }

    private function require_admin(): object
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin token required', 403);
            exit;
        }
        return $claims;
    }

    /** GET /api/v1/admin/dashboard — top-line KPIs. */
    public function dashboard()
    {
        $this->require_admin();

        $month_start = date('Y-m-01 00:00:00');

        $revenue_paise = (int) $this->db
            ->select_sum('amount_paise')
            ->where(['status' => 'confirmed'])
            ->where('confirmed_at >=', $month_start)
            ->get('bookings')->row()->amount_paise;

        $active_users = (int) $this->db->where(['role' => 'user'])->count_all_results('users');
        $active_guides = (int) $this->db->where(['role' => 'guide', 'kyc_status' => 'verified'])->count_all_results('users');
        $pending_guides = (int) $this->db->where(['role' => 'guide', 'kyc_status' => 'pending'])->count_all_results('users');
        $new_leads = (int) $this->db->where('status', 'new')->count_all_results('leads');

        $this->ok([
            'revenue_paise_month' => $revenue_paise,
            'active_users'        => $active_users,
            'active_guides'      => $active_guides,
            'pending_guides'     => $pending_guides,
            'new_leads'           => $new_leads,
        ]);
    }

    /** GET /api/v1/admin/users — paginated user list. */
    public function users()
    {
        $this->require_admin();
        $page = max(1, (int) $this->input->get('page'));
        $per  = min(200, max(1, (int) ($this->input->get('perPage') ?: 50)));

        $rows = $this->db
            ->where('role', 'user')
            ->order_by('created_at', 'DESC')
            ->limit($per, ($page - 1) * $per)
            ->get('users')
            ->result_array();

        foreach ($rows as &$r) {
            unset($r['otp_hash'], $r['otp_expires_at'], $r['password_hash']);
        }

        $total = (int) $this->db->where('role', 'user')->count_all_results('users');
        $this->ok($rows, ['page' => $page, 'perPage' => $per, 'total' => $total]);
    }

    /** GET /api/v1/admin/guides — guide list (active + pending). */
    public function guides()
    {
        $this->require_admin();
        $rows = $this->db
            ->where('role', 'guide')
            ->order_by('kyc_status', 'ASC')
            ->order_by('created_at', 'DESC')
            ->limit(200)
            ->get('users')
            ->result_array();
        foreach ($rows as &$r) {
            unset($r['otp_hash'], $r['otp_expires_at'], $r['password_hash']);
        }
        $this->ok($rows);
    }

    /** POST /api/v1/admin/guides/{id}/approve — accepts a pending guide application. */
    public function approve_guide($guide_id = 0)
    {
        $this->require_admin();
        $guide = $this->Guide_model->find((int) $guide_id);
        if (!$guide) {
            $this->fail('NOT_FOUND', 'Guide not found', 404);
            return;
        }
        if ((int) ($guide['onboarding_completed'] ?? 0) === 1) {
            $this->fail('ALREADY_APPROVED', 'Guide already approved', 409);
            return;
        }

        // Create the public-facing astrologer row
        $slug = $this->slugify($guide['name']) . '-' . $guide_id;
        $this->db->insert('astrologers', [
            'slug'          => $slug,
            'name'          => $guide['name'],
            'bio'           => $guide['business_name'] ?? '',
            'specialties'   => $guide['business_type'] ?? 'vedic',
            'languages'     => 'english',
            'experience_years' => 0,
            'rating'        => 4.50,
            'price_per_session_paise' => 99900,
            'session_minutes' => 30,
            'status'        => 'active',
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
        $astrologer_id = (int) $this->db->insert_id();

        $this->Guide_model->approve((int) $guide_id, $astrologer_id);
        $this->ok(['guide_id' => (int) $guide_id, 'astrologer_id' => $astrologer_id, 'status' => 'verified']);
    }

    private function slugify(string $s): string
    {
        $s = strtolower(trim($s));
        $s = preg_replace('/[^a-z0-9]+/', '-', $s);
        return trim((string) $s, '-');
    }
}
