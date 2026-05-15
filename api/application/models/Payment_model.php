<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Payment_model extends CI_Model
{
    private string $table = 'payments';

    public function insert(array $row): int
    {
        $this->db->insert($this->table, $row);
        return (int) $this->db->insert_id();
    }
}
