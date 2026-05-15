<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Astrologer_model extends CI_Model
{
    private string $table = 'astrologers';

    public function paginate(int $page, int $perPage, array $filters = []): array
    {
        $this->apply_filters($filters);
        return $this->db->order_by('rating', 'DESC')
            ->limit($perPage, ($page - 1) * $perPage)
            ->get($this->table)->result_array();
    }

    public function count(array $filters = []): int
    {
        $this->apply_filters($filters);
        return (int) $this->db->count_all_results($this->table);
    }

    private function apply_filters(array $filters): void
    {
        if (!empty($filters['specialty'])) {
            $this->db->like('specialties', (string) $filters['specialty']);
        }
        if (!empty($filters['language'])) {
            $this->db->like('languages', (string) $filters['language']);
        }
        if (!empty($filters['minPrice'])) {
            $this->db->where('price_per_session_paise >=', (int) $filters['minPrice'] * 100);
        }
        if (!empty($filters['maxPrice'])) {
            $this->db->where('price_per_session_paise <=', (int) $filters['maxPrice'] * 100);
        }
        $this->db->where('status', 'active');
    }

    public function by_slug(string $slug): ?array
    {
        $row = $this->db->get_where($this->table, ['slug' => $slug, 'status' => 'active'])->row_array();
        return $row ?: null;
    }

    public function upcoming_slots(int $astrologer_id): array
    {
        return $this->db->get_where('astrologer_slots', [
            'astrologer_id' => $astrologer_id,
            'status' => 'open',
            'starts_at >=' => date('Y-m-d H:i:s'),
        ])->result_array();
    }

    public function reviews(int $astrologer_id): array
    {
        return $this->db->order_by('created_at', 'DESC')
            ->get_where('reviews', ['astrologer_id' => $astrologer_id])
            ->result_array();
    }

    public function add_review(array $row): int
    {
        $this->db->insert('reviews', $row);
        return (int) $this->db->insert_id();
    }
}
