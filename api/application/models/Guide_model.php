<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Guide profile lives in the `users` table (role='guide') with extra columns
 * (business_name, business_type, kyc_status, onboarding_completed, astrologer_id).
 *
 * The public-facing astrologer listing lives in the `astrologers` table; an
 * approved guide gets a row there and we link via users.astrologer_id.
 */
class Guide_model extends CI_Model
{
    private string $table = 'users';

    public function find(int $id): ?array
    {
        $row = $this->db->get_where($this->table, ['id' => $id, 'role' => 'guide'])->row_array();
        if (!$row) return null;
        unset($row['otp_hash'], $row['otp_expires_at'], $row['password_hash']);
        return $row;
    }

    public function by_phone(string $phone): ?array
    {
        $row = $this->db->get_where($this->table, ['phone' => $phone, 'role' => 'guide'])->row_array();
        if (!$row) return null;
        unset($row['otp_hash'], $row['otp_expires_at'], $row['password_hash']);
        return $row;
    }

    /** Submit a guide application. Creates a users row with role='guide', kyc_status='pending'. */
    public function apply(array $data): int
    {
        $this->db->insert($this->table, [
            'name'                 => $data['name'],
            'phone'                => $data['phone'],
            'email'                => $data['email'] ?? null,
            'role'                 => 'guide',
            'business_name'        => $data['business_name'] ?? null,
            'business_type'        => $data['business_type'] ?? null,
            'kyc_status'           => 'pending',
            'onboarding_completed' => 0,
            'created_at'           => date('Y-m-d H:i:s'),
        ]);
        return (int) $this->db->insert_id();
    }

    public function update_onboarding(int $guide_id, array $data): void
    {
        $data['updated_at'] = date('Y-m-d H:i:s');
        $this->db->update($this->table, $data, ['id' => $guide_id, 'role' => 'guide']);
    }

    /** Admin: approve a guide — set kyc_status=verified and create the astrologer profile. */
    public function approve(int $guide_id, int $astrologer_id): void
    {
        $this->db->update($this->table, [
            'kyc_status'           => 'verified',
            'onboarding_completed' => 1,
            'astrologer_id'        => $astrologer_id,
            'updated_at'           => date('Y-m-d H:i:s'),
        ], ['id' => $guide_id, 'role' => 'guide']);
    }

    public function pending_applications(int $limit = 100): array
    {
        return $this->db
            ->where(['role' => 'guide', 'kyc_status' => 'pending'])
            ->order_by('created_at', 'DESC')
            ->limit($limit)
            ->get($this->table)
            ->result_array();
    }
}
