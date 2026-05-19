<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * POST /api/v1/coupons/quote   { code, amount_paise, booking_type }
 *   Returns: { discount_paise, final_paise } or { error }
 */
class Coupons extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Coupon_model');
    }

    public function quote()
    {
        $claims = $this->require_user();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $code         = strtoupper(trim((string) ($in['code'] ?? '')));
        $amount_paise = (int) ($in['amount_paise'] ?? 0);
        $booking_type = (string) ($in['booking_type'] ?? '');

        if ($code === '' || $amount_paise < 100 || !in_array($booking_type, ['consultation', 'puja', 'report'], true)) {
            $this->fail('VALIDATION', 'code, amount_paise (>=100), booking_type required', 422);
            return;
        }

        $q = $this->Coupon_model->quote($code, $amount_paise, $booking_type, (int) $claims->sub);
        if (!$q['ok']) {
            $this->fail('COUPON_' . $q['reason'], 'Coupon cannot be applied: ' . $q['reason'], 422);
            return;
        }

        $this->ok([
            'discount_paise' => $q['discount_paise'],
            'final_paise'    => $q['final_paise'],
            'code'           => $q['coupon']['code'],
        ]);
    }
}
