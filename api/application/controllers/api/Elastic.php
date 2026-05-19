<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Admin reindex endpoints. Pulls rows from MySQL and pushes into Elasticsearch.
 *
 * POST /api/v1/admin/elastic/reindex/astrologers
 * POST /api/v1/admin/elastic/reindex/pujas
 * POST /api/v1/admin/elastic/reindex/articles
 * POST /api/v1/admin/elastic/ensure-indices    Creates indices with mappings if missing
 */
class Elastic extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->library('elasticsearch_service');
    }

    private function require_admin(): void
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin only', 403);
            exit;
        }
    }

    public function reindex_astrologers()
    {
        $this->require_admin();
        $rows = $this->db->where('status', 'active')->get('astrologers')->result_array();
        foreach ($rows as $r) {
            $r['specialties'] = $r['specialties'] ? array_map('trim', explode(',', (string) $r['specialties'])) : [];
            $r['languages']   = $r['languages'] ? array_map('trim', explode(',', (string) $r['languages'])) : [];
            $this->elasticsearch_service->index('astrologers', (int) $r['id'], $r);
        }
        $this->ok(['indexed' => count($rows)]);
    }

    public function reindex_pujas()
    {
        $this->require_admin();
        $rows = $this->db->where('status', 'active')->get('pujas')->result_array();
        foreach ($rows as $r) {
            $r['features'] = $r['features'] ? json_decode((string) $r['features'], true) : [];
            $r['featured'] = (bool) $r['featured'];
            $this->elasticsearch_service->index('pujas', (int) $r['id'], $r);
        }
        $this->ok(['indexed' => count($rows)]);
    }

    public function reindex_articles()
    {
        $this->require_admin();
        $rows = $this->db->where('status', 'published')->get('articles')->result_array();
        foreach ($rows as $r) {
            $r['tags'] = $r['tags'] ? array_map('trim', explode(',', (string) $r['tags'])) : [];
            $this->elasticsearch_service->index('articles', (int) $r['id'], $r);
        }
        $this->ok(['indexed' => count($rows)]);
    }

    public function ensure_indices()
    {
        $this->require_admin();
        $created = [];
        foreach (['astrologers', 'pujas', 'articles'] as $name) {
            $mapping_path = FCPATH . "../infra/elasticsearch/mappings/{$name}.json";
            if (!file_exists($mapping_path)) continue;
            $mapping = json_decode((string) file_get_contents($mapping_path), true);
            if ($mapping) {
                $this->elasticsearch_service->ensure_index($name, $mapping);
                $created[] = $name;
            }
        }
        $this->ok(['ensured' => $created]);
    }
}
