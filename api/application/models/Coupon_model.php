<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Coupon_model extends CI_Model
{
    public function by_code(string $code): ?array
    {
        return $this->db->get_where('coupons', ['code' => strtoupper($code), 'is_active' => 1])->row_array() ?: null;
    }

    /**
     * Quote a coupon against an amount. Returns either:
     *   ['ok' => true, 'discount_paise' => N, 'final_paise' => N, 'coupon' => row]
     *   ['ok' => false, 'reason' => 'CODE_INVALID|EXPIRED|MIN_AMOUNT|LIMIT_REACHED|TYPE_MISMATCH']
     */
    public function quote(string $code, int $amount_paise, string $booking_type, int $user_id): array
    {
        $c = $this->by_code($code);
        if (!$c) return ['ok' => false, 'reason' => 'CODE_INVALID'];

        $now = date('Y-m-d H:i:s');
        if (!empty($c['starts_at']) && $c['starts_at'] > $now) return ['ok' => false, 'reason' => 'NOT_YET_ACTIVE'];
        if (!empty($c['expires_at']) && $c['expires_at'] < $now) return ['ok' => false, 'reason' => 'EXPIRED'];

        if ($c['applies_to'] !== 'all' && $c['applies_to'] !== $booking_type) {
            return ['ok' => false, 'reason' => 'TYPE_MISMATCH'];
        }
        if ($amount_paise < (int) $c['min_amount_paise']) {
            return ['ok' => false, 'reason' => 'MIN_AMOUNT'];
        }

        if (!empty($c['usage_limit'])) {
            $used = (int) $this->db->where('coupon_id', (int) $c['id'])->count_all_results('coupon_redemptions');
            if ($used >= (int) $c['usage_limit']) return ['ok' => false, 'reason' => 'LIMIT_REACHED'];
        }
        if (!empty($c['per_user_limit'])) {
            $user_used = (int) $this->db->where(['coupon_id' => (int) $c['id'], 'user_id' => $user_id])
                ->count_all_results('coupon_redemptions');
            if ($user_used >= (int) $c['per_user_limit']) return ['ok' => false, 'reason' => 'LIMIT_REACHED'];
        }

        $discount = $c['discount_type'] === 'percent'
            ? (int) floor($amount_paise * (int) $c['discount_value'] / 100)
            : (int) $c['discount_value'];
        if (!empty($c['max_discount_paise'])) {
            $discount = min($discount, (int) $c['max_discount_paise']);
        }
        $discount = min($discount, $amount_paise);

        return [
            'ok'             => true,
            'discount_paise' => $discount,
            'final_paise'    => $amount_paise - $discount,
            'coupon'         => $c,
        ];
    }

    public function redeem(int $coupon_id, int $user_id, ?int $booking_id, int $discount_paise): void
    {
        $this->db->insert('coupon_redemptions', [
            'coupon_id'      => $coupon_id,
            'user_id'        => $user_id,
            'booking_id'     => $booking_id,
            'discount_paise' => $discount_paise,
            'created_at'     => date('Y-m-d H:i:s'),
        ]);
    }
}
