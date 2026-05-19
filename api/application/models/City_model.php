<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class City_model extends CI_Model
{
    private string $table = 'cities';

    public function get_all(): array
    {
        return $this->db
            ->select('c.id, c.name, c.slug, c.state_id, c.is_active, s.name AS state_name, s.slug AS state_slug')
            ->from('cities c')
            ->join('states s', 's.id = c.state_id', 'left')
            ->where('c.is_active', 1)
            ->order_by('c.name', 'ASC')
            ->get()->result_array();
    }

    public function by_slug(string $slug): ?array
    {
        $row = $this->db
            ->select('c.*, s.name AS state_name, s.slug AS state_slug')
            ->from('cities c')
            ->join('states s', 's.id = c.state_id', 'left')
            ->where('c.slug', $slug)
            ->get()->row_array();
        if (!$row) return null;

        $row['locality_count'] = (int) $this->db->where('city_id', $row['id'])->count_all_results('localities');
        return $row;
    }

    public function find(int $id): ?array
    {
        return $this->db->get_where($this->table, ['id' => $id])->row_array() ?: null;
    }

    /** Cities with the count of active astrologers/pujas in each (for sitemap + city landing pages). */
    public function with_stats(): array
    {
        return $this->db->query("
            SELECT c.id, c.name, c.slug, c.state_id,
                   s.name AS state_name,
                   (SELECT COUNT(*) FROM pujas p WHERE p.city = c.name AND p.status='active') AS puja_count
            FROM cities c
            LEFT JOIN states s ON s.id = c.state_id
            WHERE c.is_active = 1
            ORDER BY puja_count DESC, c.name ASC
        ")->result_array();
    }

    public function create(array $data): int
    {
        $this->db->insert($this->table, [
            'state_id'         => (int) ($data['state_id'] ?? 0),
            'name'             => $data['name'],
            'slug'             => $data['slug'] ?? $this->slugify($data['name']),
            'is_active'        => (int) ($data['is_active'] ?? 1),
            'meta_title'       => $data['meta_title'] ?? null,
            'meta_description' => $data['meta_description'] ?? null,
            'latitude'         => $data['latitude'] ?? null,
            'longitude'        => $data['longitude'] ?? null,
            'created_at'       => date('Y-m-d H:i:s'),
        ]);
        return (int) $this->db->insert_id();
    }

    private function slugify(string $s): string
    {
        return trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower(trim($s))), '-');
    }
}
