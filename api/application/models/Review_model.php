<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Review_model extends CI_Model
{
    private string $table = 'reviews';

    public function paginate(array $filters, int $page, int $perPage): array
    {
        $this->apply_filters($filters);
        $rows = $this->db
            ->order_by('created_at', 'DESC')
            ->limit($perPage, ($page - 1) * $perPage)
            ->get($this->table)->result_array();
        $this->apply_filters($filters);
        $total = (int) $this->db->count_all_results($this->table);
        return ['rows' => $rows, 'total' => $total];
    }

    public function create(array $data): int
    {
        $this->db->insert($this->table, [
            'astrologer_id' => isset($data['astrologer_id']) ? (int) $data['astrologer_id'] : 0,
            'booking_id'    => isset($data['booking_id']) ? (int) $data['booking_id'] : null,
            'type'          => $data['type'] ?? 'astrologer',
            'user_id'       => (int) $data['user_id'],
            'rating'        => (int) $data['rating'],
            'title'         => $data['title'] ?? null,
            'body'          => $data['body'] ?? null,
            'status'        => 'published',
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
        $id = (int) $this->db->insert_id();
        $this->recompute_rating((int) ($data['astrologer_id'] ?? 0));
        return $id;
    }

    public function set_status(int $id, string $status): bool
    {
        return (bool) $this->db->update($this->table, ['status' => $status], ['id' => $id]);
    }

    public function exists_for_booking(int $booking_id, int $user_id): bool
    {
        return (bool) $this->db->where(['booking_id' => $booking_id, 'user_id' => $user_id])
            ->count_all_results($this->table);
    }

    private function apply_filters(array $f): void
    {
        if (!empty($f['astrologer_id'])) $this->db->where('astrologer_id', (int) $f['astrologer_id']);
        if (!empty($f['type']))          $this->db->where('type', $f['type']);
        if (!empty($f['min_rating']))    $this->db->where('rating >=', (int) $f['min_rating']);
        $this->db->where('status', 'published');
    }

    private function recompute_rating(int $astrologer_id): void
    {
        if (!$astrologer_id) return;
        $row = $this->db
            ->select_avg('rating', 'avg_rating')
            ->select('COUNT(*) AS cnt', false)
            ->where(['astrologer_id' => $astrologer_id, 'status' => 'published'])
            ->get($this->table)->row_array();
        if (!$row || !$row['cnt']) return;
        $this->db->update('astrologers', [
            'rating'        => round((float) $row['avg_rating'], 2),
            'reviews_count' => (int) $row['cnt'],
        ], ['id' => $astrologer_id]);
    }
}
