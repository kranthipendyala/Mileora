<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Locality_model extends CI_Model
{
    private string $table = 'localities';

    public function by_city(int $city_id): array
    {
        return $this->db
            ->where(['city_id' => $city_id, 'is_active' => 1])
            ->order_by('name', 'ASC')
            ->get($this->table)->result_array();
    }

    public function by_pincode(string $pincode): array
    {
        return $this->db
            ->where(['pincode' => $pincode, 'is_active' => 1])
            ->get($this->table)->result_array();
    }

    public function find(int $id): ?array
    {
        return $this->db->get_where($this->table, ['id' => $id])->row_array() ?: null;
    }
}
