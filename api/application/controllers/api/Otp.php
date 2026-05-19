<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Centralized OTP send/verify. Replaces the inline OTP logic in Auth.php
 * for cleaner re-use across user / guide / guide-apply / password-reset flows.
 *
 * POST /api/v1/otp/send    { phone: '98XXXXXXXX', purpose: 'login' }
 * POST /api/v1/otp/verify  { phone, code, purpose }
 *
 * Server-key gated (called by Next.js BFF; never directly from the browser).
 */
class Otp extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Otp_model');
    }

    public function send()
    {
        $this->require_server_caller();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $phone   = trim((string) ($in['phone'] ?? ''));
        $purpose = (string) ($in['purpose'] ?? 'login');

        if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
            $this->fail('VALIDATION', 'Valid 10-digit phone required', 422);
            return;
        }
        if (!in_array($purpose, ['login', 'signup', 'guide_apply', 'password_reset'], true)) {
            $this->fail('VALIDATION', 'Invalid purpose', 422);
            return;
        }

        $cooldown = $this->Otp_model->seconds_until_resend($phone, $purpose);
        if ($cooldown > 0) {
            $this->fail('THROTTLED', "Please wait {$cooldown}s before requesting another OTP", 429);
            return;
        }

        $code = $this->Otp_model->issue($phone, $purpose);
        // TODO: send via MSG91 / Gupshup
        log_message('debug', "[OTP] {$purpose} for {$phone}: {$code}");
        $this->ok(['sent' => true]);
    }

    public function verify()
    {
        $this->require_server_caller();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $phone   = trim((string) ($in['phone'] ?? ''));
        $code    = trim((string) ($in['code'] ?? ''));
        $purpose = (string) ($in['purpose'] ?? 'login');

        if (!preg_match('/^[6-9]\d{9}$/', $phone) || !preg_match('/^\d{4,6}$/', $code)) {
            $this->fail('VALIDATION', 'phone + code required', 422);
            return;
        }

        if (!$this->Otp_model->verify($phone, $purpose, $code)) {
            $this->fail('BAD_OTP', 'Incorrect or expired OTP', 401);
            return;
        }
        $this->ok(['verified' => true]);
    }
}
