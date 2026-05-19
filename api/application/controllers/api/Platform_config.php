<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Public + admin platform config (feature flags, support contacts, geo scope, etc.).
 *
 * GET  /api/v1/platform/config           Public settings only (cached at the edge)
 * GET  /api/v1/admin/platform/config     All settings (admin JWT)
 * PUT  /api/v1/admin/platform/config     Upsert one or more settings
 */
class Platform_config extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Setting_model');
    }

    public function public_config()
    {
        $this->ok($this->Setting_model->all_public());
    }

    public function admin_index()
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin only', 403);
            return;
        }
        $this->ok($this->Setting_model->all_admin());
    }

    public function admin_update()
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin only', 403);
            return;
        }
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];
        if (!is_array($in) || empty($in)) {
            $this->fail('VALIDATION', 'object of settings required', 422);
            return;
        }
        foreach ($in as $key => $entry) {
            $value     = is_array($entry) ? ($entry['value'] ?? null) : $entry;
            $is_public = is_array($entry) ? (bool) ($entry['is_public'] ?? false) : false;
            $this->Setting_model->upsert((string) $key, $value === null ? null : (string) $value, $is_public);
        }
        $this->ok(['updated' => count($in)]);
    }
}
