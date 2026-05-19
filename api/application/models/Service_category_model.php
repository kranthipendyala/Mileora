<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Service_category_model extends CI_Model
{
    private string $table = 'service_categories';

    public function all_with_stats(): array
    {
        // For each top-level category, count active guides offering at least one service in it.
        return $this->db->query("
            SELECT c.id, c.parent_id, c.name, c.slug, c.icon, c.description,
                   c.meta_title, c.meta_description, c.sort_order,
                   (
                     SELECT COUNT(DISTINCT gs.guide_id)
                     FROM guide_services gs
                     INNER JOIN users u ON u.id = gs.guide_id AND u.role='guide' AND u.kyc_status='verified'
                     WHERE gs.category_id = c.id AND gs.is_active = 1
                   ) AS active_guide_count,
                   (
                     SELECT COUNT(*) FROM guide_services gs2
                     WHERE gs2.category_id = c.id AND gs2.is_active = 1
                   ) AS active_service_count
            FROM service_categories c
            WHERE c.is_active = 1
              AND c.parent_id IS NULL
            ORDER BY c.sort_order ASC, c.name ASC
        ")->result_array();
    }

    public function all_flat(): array
    {
        return $this->db
            ->where('is_active', 1)
            ->order_by('sort_order', 'ASC')
            ->order_by('name', 'ASC')
            ->get($this->table)->result_array();
    }

    public function by_slug(string $slug): ?array
    {
        return $this->db->get_where($this->table, ['slug' => $slug, 'is_active' => 1])->row_array() ?: null;
    }

    public function find(int $id): ?array
    {
        return $this->db->get_where($this->table, ['id' => $id])->row_array() ?: null;
    }
}
