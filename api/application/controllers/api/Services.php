<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Services — per-guide offerings. Read endpoints are public; CRUD requires a guide JWT.
 *
 * Public browse:
 *   GET    /api/v1/services?category={slug}             List active services in a category, joined with guide
 *
 * Guide-side (JWT, role=guide):
 *   GET    /api/v1/guide/services                       My services (active + inactive)
 *   POST   /api/v1/guide/services                       Add one
 *   PUT    /api/v1/guide/services/{id}                  Edit one
 *   DELETE /api/v1/guide/services/{id}                  Delete one
 *   POST   /api/v1/guide/services/{id}/toggle           Flip is_active
 *   POST   /api/v1/guide/services/bulk-replace          Replace entire service list (onboarding wizard step)
 */
class Services extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Guide_service_model');
    }

    // ---------- Public browse ----------

    public function browse()
    {
        $category = trim((string) $this->input->get('category'));
        if ($category === '') {
            $this->fail('VALIDATION', 'category slug required', 422);
            return;
        }
        $page    = max(1, (int) $this->input->get('page'));
        $perPage = min(60, max(1, (int) ($this->input->get('perPage') ?: 30)));
        $rows = $this->Guide_service_model->by_category($category, $perPage, ($page - 1) * $perPage);
        $this->ok($rows, ['page' => $page, 'perPage' => $perPage, 'category' => $category]);
    }

    // ---------- Guide-side ----------

    private function require_guide(): object
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'guide') {
            $this->fail('FORBIDDEN', 'Guide token required', 403);
            exit;
        }
        return $claims;
    }

    public function mine()
    {
        $claims = $this->require_guide();
        $this->ok($this->Guide_service_model->by_guide((int) $claims->sub));
    }

    public function create()
    {
        $claims = $this->require_guide();
        $in = $this->input_json();
        $err = $this->validate($in);
        if ($err) { $this->fail('VALIDATION', $err, 422); return; }
        $id = $this->Guide_service_model->create((int) $claims->sub, $in);
        $this->ok(['id' => $id], [], 201);
    }

    public function update($id = 0)
    {
        $claims = $this->require_guide();
        $existing = $this->Guide_service_model->find_owned((int) $id, (int) $claims->sub);
        if (!$existing) { $this->fail('NOT_FOUND', 'Service not found', 404); return; }
        $in = $this->input_json();
        $this->Guide_service_model->update((int) $id, (int) $claims->sub, $in);
        $this->ok(['updated' => true]);
    }

    public function delete($id = 0)
    {
        $claims = $this->require_guide();
        $existing = $this->Guide_service_model->find_owned((int) $id, (int) $claims->sub);
        if (!$existing) { $this->fail('NOT_FOUND', 'Service not found', 404); return; }
        $this->Guide_service_model->delete((int) $id, (int) $claims->sub);
        $this->ok(['deleted' => true]);
    }

    public function toggle($id = 0)
    {
        $claims = $this->require_guide();
        $existing = $this->Guide_service_model->find_owned((int) $id, (int) $claims->sub);
        if (!$existing) { $this->fail('NOT_FOUND', 'Service not found', 404); return; }
        $next = (int) ($existing['is_active'] ?? 0) === 0;
        $this->Guide_service_model->set_active((int) $id, (int) $claims->sub, $next);
        $this->ok(['is_active' => $next ? 1 : 0]);
    }

    public function bulk_replace()
    {
        $claims = $this->require_guide();
        $in = $this->input_json();
        $services = $in['services'] ?? null;
        if (!is_array($services)) {
            $this->fail('VALIDATION', 'services[] required', 422);
            return;
        }
        foreach ($services as $i => $s) {
            $err = $this->validate($s);
            if ($err) {
                $this->fail('VALIDATION', "services[{$i}]: {$err}", 422);
                return;
            }
        }
        $count = $this->Guide_service_model->bulk_replace_for_guide((int) $claims->sub, $services);
        $this->ok(['count' => $count]);
    }

    // ---------- helpers ----------

    private function validate(array $s): ?string
    {
        if (empty($s['category_id']) || (int) $s['category_id'] <= 0) return 'category_id required';
        if (empty($s['name']) || strlen((string) $s['name']) < 3)     return 'name (3+ chars) required';
        if (!isset($s['base_price_paise']) || (int) $s['base_price_paise'] < 0) return 'base_price_paise required';
        if (isset($s['duration_minutes']) && ((int) $s['duration_minutes'] < 5 || (int) $s['duration_minutes'] > 300)) {
            return 'duration_minutes must be 5..300';
        }
        return null;
    }

    private function input_json(): array
    {
        $raw = $this->input->raw_input_stream;
        $j = json_decode($raw ?: '[]', true);
        return is_array($j) ? $j : [];
    }
}
