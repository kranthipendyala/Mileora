<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Booking_model extends CI_Model
{
    private string $table = 'bookings';

    public function create(array $row): int
    {
        $this->db->insert($this->table, $row);
        return (int) $this->db->insert_id();
    }

    public function update(int $id, array $row): void
    {
        $row['updated_at'] = date('Y-m-d H:i:s');
        $this->db->update($this->table, $row, ['id' => $id]);
    }

    public function find(int $id): ?array
    {
        $row = $this->db->get_where($this->table, ['id' => $id])->row_array();
        return $row ?: null;
    }

    public function by_order(string $order_id): ?array
    {
        $row = $this->db->get_where($this->table, ['razorpay_order_id' => $order_id])->row_array();
        return $row ?: null;
    }

    public function by_user_phone(string $phone): array
    {
        return $this->db->order_by('created_at', 'DESC')
            ->limit(50)
            ->get_where($this->table, ['user_phone' => $phone])
            ->result_array();
    }
}
