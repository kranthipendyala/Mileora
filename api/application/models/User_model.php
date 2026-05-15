<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class User_model extends CI_Model
{
    private string $table = 'users';

    public function find(int $id): ?array
    {
        $row = $this->db->get_where($this->table, ['id' => $id])->row_array();
        if (!$row) return null;
        unset($row['otp_hash'], $row['otp_expires_at']);
        return $row;
    }

    public function by_phone(string $phone): ?array
    {
        $row = $this->db->get_where($this->table, ['phone' => $phone])->row_array();
        return $row ?: null;
    }

    public function upsert_by_phone(array $data): int
    {
        $existing = $this->by_phone($data['phone']);
        if ($existing) {
            $this->db->update($this->table, [
                'name'  => $data['name'] ?: $existing['name'],
                'email' => $data['email'] ?: $existing['email'],
                'updated_at' => date('Y-m-d H:i:s'),
            ], ['id' => $existing['id']]);
            return (int) $existing['id'];
        }
        $this->db->insert($this->table, [
            'name'       => $data['name'],
            'phone'      => $data['phone'],
            'email'      => $data['email'] ?? '',
            'role'       => 'user',
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        return (int) $this->db->insert_id();
    }

    public function issue_otp(int $user_id): string
    {
        $otp = str_pad((string) random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
        $this->db->update($this->table, [
            'otp_hash'       => password_hash($otp, PASSWORD_BCRYPT),
            'otp_expires_at' => date('Y-m-d H:i:s', time() + 600),
        ], ['id' => $user_id]);
        return $otp;
    }

    public function verify_otp(int $user_id, string $otp): bool
    {
        $row = $this->db->get_where($this->table, ['id' => $user_id])->row_array();
        if (!$row || empty($row['otp_hash'])) return false;
        if (strtotime($row['otp_expires_at'] ?? '') < time()) return false;
        if (!password_verify($otp, $row['otp_hash'])) return false;
        $this->db->update($this->table, ['otp_hash' => null, 'otp_expires_at' => null, 'phone_verified_at' => date('Y-m-d H:i:s')], ['id' => $user_id]);
        return true;
    }
}
