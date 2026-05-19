<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Device_token_model extends CI_Model
{
    private string $table = 'device_tokens';

    /** Upsert: if token already exists for user+platform, refresh; else insert. */
    public function register(int $user_id, string $platform, string $token, ?string $app_version = null): void
    {
        $existing = $this->db
            ->get_where($this->table, ['user_id' => $user_id, 'token' => $token])
            ->row_array();
        if ($existing) {
            $this->db->update($this->table, [
                'platform'     => $platform,
                'app_version'  => $app_version,
                'is_active'    => 1,
                'last_seen_at' => date('Y-m-d H:i:s'),
            ], ['id' => $existing['id']]);
            return;
        }
        $this->db->insert($this->table, [
            'user_id'      => $user_id,
            'platform'     => $platform,
            'token'        => $token,
            'app_version'  => $app_version,
            'is_active'    => 1,
            'last_seen_at' => date('Y-m-d H:i:s'),
            'created_at'   => date('Y-m-d H:i:s'),
        ]);
    }

    public function deactivate(string $token): void
    {
        $this->db->update($this->table, ['is_active' => 0], ['token' => $token]);
    }

    public function active_tokens_for_user(int $user_id): array
    {
        return $this->db
            ->where(['user_id' => $user_id, 'is_active' => 1])
            ->get($this->table)->result_array();
    }
}
