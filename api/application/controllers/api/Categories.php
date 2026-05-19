<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Public:
 *   GET    /api/v1/categories                  All top-level categories with stats
 *   GET    /api/v1/categories/{slug}           Single category by slug
 *
 * Admin (JWT, role=admin):
 *   GET    /api/v1/admin/categories            Full list (active + inactive, flat)
 *   POST   /api/v1/admin/categories            Create
 *   PUT    /api/v1/admin/categories/{id}       Update
 *   DELETE /api/v1/admin/categories/{id}       Soft-delete (set is_active=0)
 */
class Categories extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Service_category_model');
    }

    // ---------- Public ----------

    public function index()
    {
        $this->ok($this->Service_category_model->all_with_stats());
    }

    public function show($slug = null)
    {
        $c = $this->Service_category_model->by_slug((string) $slug);
        if (!$c) {
            $this->fail('NOT_FOUND', 'Category not found', 404);
            return;
        }
        $this->ok($c);
    }

    // ---------- Admin ----------

    private function require_admin(): void
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin only', 403);
            exit;
        }
    }

    public function admin_index()
    {
        $this->require_admin();
        $this->ok($this->Service_category_model->all_flat());
    }

    public function admin_create()
    {
        $this->require_admin();
        $in = $this->input_json();
        $err = $this->validate($in);
        if ($err) { $this->fail('VALIDATION', $err, 422); return; }

        $slug = $this->slugify((string) $in['name']);
        if ($this->Service_category_model->by_slug($slug)) {
            $this->fail('SLUG_TAKEN', "A category with slug '{$slug}' already exists", 409);
            return;
        }

        $this->db->insert('service_categories', [
            'parent_id'        => isset($in['parent_id']) ? (int) $in['parent_id'] : null,
            'name'             => trim((string) $in['name']),
            'slug'             => $slug,
            'icon'             => $in['icon'] ?? null,
            'description'      => $in['description'] ?? null,
            'meta_title'       => $in['meta_title'] ?? null,
            'meta_description' => $in['meta_description'] ?? null,
            'sort_order'       => (int) ($in['sort_order'] ?? 0),
            'is_active'        => isset($in['is_active']) ? (int) (bool) $in['is_active'] : 1,
            'created_at'       => date('Y-m-d H:i:s'),
        ]);
        $this->ok(['id' => (int) $this->db->insert_id()], [], 201);
    }

    public function admin_update($id = 0)
    {
        $this->require_admin();
        $existing = $this->Service_category_model->find((int) $id);
        if (!$existing) { $this->fail('NOT_FOUND', 'Category not found', 404); return; }

        $in = $this->input_json();
        $update = [];
        foreach (['name','icon','description','meta_title','meta_description'] as $f) {
            if (array_key_exists($f, $in)) $update[$f] = $in[$f];
        }
        if (array_key_exists('parent_id', $in)) $update['parent_id'] = $in['parent_id'] === null ? null : (int) $in['parent_id'];
        if (array_key_exists('sort_order', $in)) $update['sort_order'] = (int) $in['sort_order'];
        if (array_key_exists('is_active', $in))  $update['is_active'] = (int) (bool) $in['is_active'];

        if (isset($update['name'])) {
            $new_slug = $this->slugify((string) $update['name']);
            if ($new_slug !== $existing['slug']) {
                $conflict = $this->db
                    ->where(['slug' => $new_slug])
                    ->where('id !=', (int) $id)
                    ->count_all_results('service_categories');
                if ($conflict > 0) {
                    $this->fail('SLUG_TAKEN', "A category with slug '{$new_slug}' already exists", 409);
                    return;
                }
                $update['slug'] = $new_slug;
            }
        }

        $this->db->update('service_categories', $update, ['id' => (int) $id]);
        $this->ok(['updated' => true]);
    }

    public function admin_delete($id = 0)
    {
        $this->require_admin();
        $existing = $this->Service_category_model->find((int) $id);
        if (!$existing) { $this->fail('NOT_FOUND', 'Category not found', 404); return; }

        // Soft-delete — preserves referential integrity with guide_services rows.
        $this->db->update('service_categories', ['is_active' => 0], ['id' => (int) $id]);
        $this->ok(['archived' => true]);
    }

    private function validate(array $in): ?string
    {
        if (empty($in['name']) || strlen((string) $in['name']) < 2) return 'name (2+ chars) required';
        return null;
    }

    private function slugify(string $s): string
    {
        $s = strtolower(trim($s));
        $s = (string) preg_replace('/[^a-z0-9]+/', '-', $s);
        return trim($s, '-');
    }

    private function input_json(): array
    {
        $raw = $this->input->raw_input_stream;
        $j = json_decode($raw ?: '[]', true);
        return is_array($j) ? $j : [];
    }
}
