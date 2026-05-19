<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Setting_model extends CI_Model
{
    public function all_public(): array
    {
        $rows = $this->db->where('is_public', 1)->get('settings')->result_array();
        $out = [];
        foreach ($rows as $r) $out[$r['setting_key']] = $r['setting_value'];
        return $out;
    }

    public function all_admin(): array
    {
        $rows = $this->db->get('settings')->result_array();
        $out = [];
        foreach ($rows as $r) {
            $out[$r['setting_key']] = ['value' => $r['setting_value'], 'is_public' => (int) $r['is_public']];
        }
        return $out;
    }

    public function get(string $key, ?string $default = null): ?string
    {
        $row = $this->db->get_where('settings', ['setting_key' => $key])->row_array();
        return $row ? $row['setting_value'] : $default;
    }

    public function upsert(string $key, ?string $value, bool $is_public = false): void
    {
        $existing = $this->db->get_where('settings', ['setting_key' => $key])->row_array();
        if ($existing) {
            $this->db->update('settings', [
                'setting_value' => $value,
                'is_public'     => $is_public ? 1 : 0,
                'updated_at'    => date('Y-m-d H:i:s'),
            ], ['setting_key' => $key]);
        } else {
            $this->db->insert('settings', [
                'setting_key'   => $key,
                'setting_value' => $value,
                'is_public'     => $is_public ? 1 : 0,
            ]);
        }
    }
}
