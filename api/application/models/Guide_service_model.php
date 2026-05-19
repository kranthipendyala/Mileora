<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Per-guide service offerings. Each row is one guide × one category × one
 * pricing line (e.g. Pandit Suresh's "30-min Vedic Reading" at ₹999).
 */
class Guide_service_model extends CI_Model
{
    private string $table = 'guide_services';

    /** Owner-side: all services (active + inactive) for the signed-in guide. */
    public function by_guide(int $guide_id, bool $only_active = false): array
    {
        $this->db->select('s.*, c.name AS category_name, c.slug AS category_slug, c.icon AS category_icon')
            ->from("{$this->table} s")
            ->join('service_categories c', 'c.id = s.category_id', 'left')
            ->where('s.guide_id', $guide_id);
        if ($only_active) $this->db->where('s.is_active', 1);
        return $this->db
            ->order_by('s.sort_order', 'ASC')
            ->order_by('s.created_at', 'DESC')
            ->get()->result_array();
    }

    /** Public browse: active services in a category, optionally filtered by city/language via guide. */
    public function by_category(string $category_slug, int $limit = 60, int $offset = 0): array
    {
        return $this->db->query("
            SELECT s.*,
                   c.name AS category_name, c.slug AS category_slug,
                   u.name AS guide_name, u.id AS guide_user_id,
                   a.slug AS guide_slug, a.photo_url AS guide_photo,
                   a.rating AS guide_rating, a.reviews_count AS guide_reviews,
                   a.experience_years AS guide_experience, a.languages AS guide_languages
            FROM guide_services s
            INNER JOIN service_categories c ON c.id = s.category_id AND c.slug = ?
            INNER JOIN users u             ON u.id = s.guide_id AND u.role = 'guide' AND u.kyc_status = 'verified'
            LEFT JOIN astrologers a        ON a.id = u.astrologer_id AND a.status = 'active'
            WHERE s.is_active = 1
            ORDER BY a.rating DESC, s.base_price_paise ASC
            LIMIT ? OFFSET ?
        ", [$category_slug, $limit, $offset])->result_array();
    }

    public function find_owned(int $service_id, int $guide_id): ?array
    {
        return $this->db->get_where($this->table, ['id' => $service_id, 'guide_id' => $guide_id])->row_array() ?: null;
    }

    public function create(int $guide_id, array $data): int
    {
        $row = $this->sanitize($data);
        $row['guide_id']   = $guide_id;
        $row['slug']       = $this->unique_slug_for_guide($guide_id, $row['name']);
        $row['created_at'] = date('Y-m-d H:i:s');
        $this->db->insert($this->table, $row);
        return (int) $this->db->insert_id();
    }

    public function update(int $service_id, int $guide_id, array $data): bool
    {
        $row = $this->sanitize($data, true);
        if (isset($data['name'])) {
            $row['slug'] = $this->unique_slug_for_guide($guide_id, $data['name'], $service_id);
        }
        $row['updated_at'] = date('Y-m-d H:i:s');
        return (bool) $this->db
            ->where(['id' => $service_id, 'guide_id' => $guide_id])
            ->update($this->table, $row);
    }

    public function delete(int $service_id, int $guide_id): bool
    {
        $this->db->delete('guide_service_variants', ['service_id' => $service_id]);
        return (bool) $this->db->delete($this->table, ['id' => $service_id, 'guide_id' => $guide_id]);
    }

    public function set_active(int $service_id, int $guide_id, bool $active): bool
    {
        return (bool) $this->db
            ->where(['id' => $service_id, 'guide_id' => $guide_id])
            ->update($this->table, ['is_active' => $active ? 1 : 0, 'updated_at' => date('Y-m-d H:i:s')]);
    }

    /** Bulk replace (used by the onboarding wizard's Services step). */
    public function bulk_replace_for_guide(int $guide_id, array $services): int
    {
        $this->db->delete($this->table, ['guide_id' => $guide_id]);
        $count = 0;
        foreach ($services as $s) {
            $this->create($guide_id, $s);
            $count++;
        }
        return $count;
    }

    private function sanitize(array $d, bool $partial = false): array
    {
        $allowed = [
            'category_id'           => fn($v) => (int) $v,
            'name'                  => fn($v) => trim((string) $v),
            'description'           => fn($v) => $v === null ? null : trim((string) $v),
            'base_price_paise'      => fn($v) => max(0, (int) $v),
            'discounted_price_paise' => fn($v) => $v === null ? null : max(0, (int) $v),
            'price_unit'            => fn($v) => in_array($v, ['fixed','per_session','per_hour','per_report'], true) ? $v : 'fixed',
            'duration_minutes'      => fn($v) => max(5, min(300, (int) $v)),
            'delivery_mode'         => fn($v) => in_array($v, ['video','voice','chat','in_person','async_report','online_puja'], true) ? $v : 'video',
            'image_url'             => fn($v) => $v === null ? null : (string) $v,
            'sort_order'            => fn($v) => max(0, (int) $v),
            'is_active'             => fn($v) => (int) (bool) $v,
        ];
        $out = [];
        foreach ($allowed as $k => $cast) {
            if (!$partial && !array_key_exists($k, $d)) continue;
            if (array_key_exists($k, $d)) $out[$k] = $cast($d[$k]);
        }
        return $out;
    }

    private function unique_slug_for_guide(int $guide_id, string $source, ?int $ignore_id = null): string
    {
        $base = trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower(trim($source))), '-') ?: 'service';
        $slug = $base;
        $n = 2;
        while (true) {
            $this->db->where(['guide_id' => $guide_id, 'slug' => $slug]);
            if ($ignore_id !== null) $this->db->where('id !=', $ignore_id);
            if ((int) $this->db->count_all_results($this->table) === 0) break;
            $slug = $base . '-' . $n++;
        }
        return $slug;
    }
}
