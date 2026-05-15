<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Puja_model extends CI_Model
{
    private string $table = 'pujas';

    public function paginate(int $page, int $perPage): array
    {
        return $this->db->where('status', 'active')
            ->order_by('featured', 'DESC')
            ->limit($perPage, ($page - 1) * $perPage)
            ->get($this->table)->result_array();
    }

    public function count(): int
    {
        return (int) $this->db->where('status', 'active')->count_all_results($this->table);
    }

    public function by_slug(string $slug): ?array
    {
        $row = $this->db->get_where($this->table, ['slug' => $slug, 'status' => 'active'])->row_array();
        return $row ?: null;
    }

    public function available_dates(int $puja_id): array
    {
        return $this->db->where('puja_id', $puja_id)
            ->where('starts_at >=', date('Y-m-d H:i:s'))
            ->where('status', 'open')
            ->order_by('starts_at', 'ASC')
            ->get('puja_schedules')->result_array();
    }
}
