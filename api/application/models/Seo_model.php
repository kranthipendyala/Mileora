<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Seo_model extends CI_Model
{
    public function by_path(string $path): ?array
    {
        $row = $this->db->get_where('seo_pages', ['path' => $path])->row_array();
        if (!$row) return null;
        if (!empty($row['json_ld']) && is_string($row['json_ld'])) {
            $row['json_ld'] = json_decode($row['json_ld'], true);
        }
        return $row;
    }

    public function upsert(string $path, array $data): int
    {
        $existing = $this->db->get_where('seo_pages', ['path' => $path])->row_array();
        $row = [
            'meta_title'       => $data['meta_title'] ?? null,
            'meta_description' => $data['meta_description'] ?? null,
            'h1'               => $data['h1'] ?? null,
            'noindex'          => isset($data['noindex']) ? (int) (bool) $data['noindex'] : 0,
            'json_ld'          => isset($data['json_ld']) ? json_encode($data['json_ld']) : null,
            'updated_at'       => date('Y-m-d H:i:s'),
        ];
        if ($existing) {
            $this->db->update('seo_pages', $row, ['id' => $existing['id']]);
            return (int) $existing['id'];
        }
        $row['path'] = $path;
        $this->db->insert('seo_pages', $row);
        return (int) $this->db->insert_id();
    }

    public function all(int $limit = 200): array
    {
        return $this->db->order_by('path', 'ASC')->limit($limit)->get('seo_pages')->result_array();
    }
}
