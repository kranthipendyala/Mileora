<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Lead_model extends CI_Model
{
    private string $table = 'leads';

    public function create(array $row): int
    {
        $this->db->insert($this->table, $row);
        return (int) $this->db->insert_id();
    }

    public function all_recent(int $limit = 200): array
    {
        return $this->db->order_by('created_at', 'DESC')->limit($limit)->get($this->table)->result_array();
    }
}
