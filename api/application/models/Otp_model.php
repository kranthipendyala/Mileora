<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Centralized OTP storage. Replaces the inline otp_hash/otp_expires_at
 * columns on the users table (which remain only for backward-compat).
 */
class Otp_model extends CI_Model
{
    private string $table = 'otps';

    public function issue(string $identifier, string $purpose = 'login', string $channel = 'phone', int $ttl_seconds = 600): string
    {
        $code = str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
        $this->db->insert($this->table, [
            'channel'    => $channel,
            'identifier' => $identifier,
            'purpose'    => $purpose,
            'code_hash'  => password_hash($code, PASSWORD_BCRYPT),
            'expires_at' => date('Y-m-d H:i:s', time() + $ttl_seconds),
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        return $code;
    }

    /** Verify against the most recent unverified, unexpired OTP. */
    public function verify(string $identifier, string $purpose, string $code): bool
    {
        $row = $this->db
            ->where(['identifier' => $identifier, 'purpose' => $purpose, 'verified_at' => null])
            ->where('expires_at >', date('Y-m-d H:i:s'))
            ->where('attempts <', 5)
            ->order_by('id', 'DESC')
            ->limit(1)
            ->get($this->table)->row_array();
        if (!$row) return false;

        $this->db->set('attempts', 'attempts + 1', false)->where('id', $row['id'])->update($this->table);

        if (!password_verify($code, $row['code_hash'])) return false;
        $this->db->update($this->table, ['verified_at' => date('Y-m-d H:i:s')], ['id' => $row['id']]);
        return true;
    }

    /** Throttle: returns seconds until you can request another OTP. */
    public function seconds_until_resend(string $identifier, string $purpose, int $cooldown = 30): int
    {
        $latest = $this->db
            ->where(['identifier' => $identifier, 'purpose' => $purpose])
            ->order_by('id', 'DESC')
            ->limit(1)
            ->get($this->table)->row_array();
        if (!$latest) return 0;
        $elapsed = time() - strtotime($latest['created_at']);
        return max(0, $cooldown - $elapsed);
    }
}
