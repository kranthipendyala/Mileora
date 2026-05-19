<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('User_model');
    }

    public function register()
    {
        $this->require_server_caller();
        $in = $this->input_json();
        $name  = trim((string) ($in['name'] ?? ''));
        $phone = trim((string) ($in['phone'] ?? ''));
        $email = trim((string) ($in['email'] ?? ''));

        if (!$name || !preg_match('/^[6-9]\d{9}$/', $phone)) {
            $this->fail('VALIDATION', 'Name and valid 10-digit phone are required', 422);
            return;
        }

        $user_id = $this->User_model->upsert_by_phone(['name' => $name, 'phone' => $phone, 'email' => $email]);
        $otp = $this->User_model->issue_otp($user_id);

        // TODO: send OTP via SMS provider (MSG91 / Twilio / Gupshup)
        log_message('debug', "OTP for {$phone}: {$otp}");

        $this->ok(['user_id' => $user_id, 'otp_sent' => true]);
    }

    public function verify_otp()
    {
        $this->require_server_caller();
        $in = $this->input_json();
        $user_id = (int) ($in['user_id'] ?? 0);
        $otp     = trim((string) ($in['otp'] ?? ''));

        if (!$user_id || !preg_match('/^\d{4,6}$/', $otp)) {
            $this->fail('VALIDATION', 'user_id and otp required', 422);
            return;
        }

        if (!$this->User_model->verify_otp($user_id, $otp)) {
            $this->fail('BAD_OTP', 'Incorrect or expired OTP', 401);
            return;
        }

        $user = $this->User_model->find($user_id);
        $token = $this->jwt_lib->encode([
            'sub'   => $user_id,
            'name'  => $user['name'],
            'phone' => $user['phone'],
            'role'  => $user['role'],
        ]);
        $this->ok(['token' => $token, 'user' => $user]);
    }

    public function login()
    {
        $this->require_server_caller();
        // Phone-OTP first; password login optional.
        $this->register();
    }

    /** Guide phone-OTP send. Same as register() but tags the user as 'guide'. */
    public function guide_send_otp()
    {
        $this->require_server_caller();
        $in = $this->input_json();
        $name  = trim((string) ($in['name'] ?? ''));
        $phone = trim((string) ($in['phone'] ?? ''));

        if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
            $this->fail('VALIDATION', 'Valid 10-digit phone required', 422);
            return;
        }

        // Guide must already exist (i.e. have applied via /guide/register).
        $existing = $this->User_model->by_phone($phone);
        if (!$existing || $existing['role'] !== 'guide') {
            $this->fail('NOT_GUIDE', 'No guide account found for this phone. Please apply first.', 404);
            return;
        }

        $otp = $this->User_model->issue_otp((int) $existing['id']);
        log_message('debug', "Guide OTP for {$phone}: {$otp}");
        $this->ok(['user_id' => (int) $existing['id'], 'otp_sent' => true]);
    }

    /** Guide verify-OTP — returns JWT scoped to guide role. */
    public function guide_verify()
    {
        $this->require_server_caller();
        $in = $this->input_json();
        $user_id = (int) ($in['user_id'] ?? 0);
        $otp     = trim((string) ($in['otp'] ?? ''));

        if (!$user_id || !preg_match('/^\d{4,6}$/', $otp)) {
            $this->fail('VALIDATION', 'user_id and otp required', 422);
            return;
        }
        if (!$this->User_model->verify_otp($user_id, $otp)) {
            $this->fail('BAD_OTP', 'Incorrect or expired OTP', 401);
            return;
        }

        $user = $this->User_model->find($user_id);
        if (!$user || $user['role'] !== 'guide') {
            $this->fail('NOT_GUIDE', 'Account is not a guide', 403);
            return;
        }

        $token = $this->jwt_lib->encode([
            'sub'   => $user_id,
            'name'  => $user['name'],
            'phone' => $user['phone'],
            'role'  => 'guide',
        ]);
        $this->ok(['token' => $token, 'user' => $user]);
    }

    /** Admin email + password login — separate flow, no OTP. */
    public function admin_login()
    {
        $this->require_server_caller();
        $in = $this->input_json();
        $email    = trim((string) ($in['email'] ?? ''));
        $password = (string) ($in['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
            $this->fail('VALIDATION', 'Valid email + password (6+ chars) required', 422);
            return;
        }

        $user = $this->User_model->verify_admin_password($email, $password);
        if (!$user) {
            $this->fail('BAD_CREDENTIALS', 'Email or password incorrect', 401);
            return;
        }

        $token = $this->jwt_lib->encode([
            'sub'   => (int) $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => 'admin',
        ]);
        $this->ok(['token' => $token, 'user' => $user]);
    }

    public function refresh()
    {
        $claims = $this->require_user();
        $token = $this->jwt_lib->encode([
            'sub'   => $claims->sub,
            'name'  => $claims->name ?? null,
            'phone' => $claims->phone ?? null,
            'role'  => $claims->role ?? 'user',
        ]);
        $this->ok(['token' => $token]);
    }

    public function me()
    {
        $claims = $this->require_user();
        $user = $this->User_model->find((int) $claims->sub);
        if (!$user) {
            $this->fail('NOT_FOUND', 'User not found', 404);
            return;
        }
        $this->ok($user);
    }

    private function input_json(): array
    {
        $raw = $this->input->raw_input_stream;
        $j = json_decode($raw ?: '[]', true);
        return is_array($j) ? $j : [];
    }
}
