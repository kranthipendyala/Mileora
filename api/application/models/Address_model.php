<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Address_model extends CI_Model
{
    private string $table = 'addresses';

    public function by_user(int $user_id): array
    {
        return $this->db
            ->where('user_id', $user_id)
            ->order_by('is_default', 'DESC')
            ->order_by('id', 'DESC')
            ->get($this->table)->result_array();
    }

    public function find(int $id, int $user_id): ?array
    {
        return $this->db->get_where($this->table, ['id' => $id, 'user_id' => $user_id])->row_array() ?: null;
    }

    public function create(array $data): int
    {
        $row = $this->sanitize($data);
        $row['created_at'] = date('Y-m-d H:i:s');
        if (!empty($row['is_default'])) {
            $this->db->update($this->table, ['is_default' => 0], ['user_id' => $row['user_id']]);
        }
        $this->db->insert($this->table, $row);
        return (int) $this->db->insert_id();
    }

    public function update(int $id, int $user_id, array $data): bool
    {
        $row = $this->sanitize($data);
        unset($row['user_id']);
        $row['updated_at'] = date('Y-m-d H:i:s');
        if (!empty($row['is_default'])) {
            $this->db->update($this->table, ['is_default' => 0], ['user_id' => $user_id]);
        }
        return (bool) $this->db->update($this->table, $row, ['id' => $id, 'user_id' => $user_id]);
    }

    public function delete(int $id, int $user_id): bool
    {
        return (bool) $this->db->delete($this->table, ['id' => $id, 'user_id' => $user_id]);
    }

    private function sanitize(array $d): array
    {
        return array_filter([
            'user_id'     => isset($d['user_id']) ? (int) $d['user_id'] : null,
            'label'       => $d['label'] ?? 'home',
            'name'        => $d['name'] ?? null,
            'phone'       => $d['phone'] ?? null,
            'line1'       => $d['line1'] ?? null,
            'line2'       => $d['line2'] ?? null,
            'locality_id' => isset($d['locality_id']) ? (int) $d['locality_id'] : null,
            'city_id'     => isset($d['city_id']) ? (int) $d['city_id'] : null,
            'state_id'    => isset($d['state_id']) ? (int) $d['state_id'] : null,
            'pincode'     => $d['pincode'] ?? null,
            'landmark'    => $d['landmark'] ?? null,
            'is_default'  => isset($d['is_default']) ? (int) (bool) $d['is_default'] : 0,
        ], fn($v) => $v !== null);
    }
}
