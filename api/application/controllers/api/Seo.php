<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Dynamic SEO metadata overrides for any URL path. The Next.js BFF calls
 * GET /api/v1/seo?path=/astrology and merges the response into generateMetadata().
 *
 * GET   /api/v1/seo?path=/astrology         Public
 * GET   /api/v1/admin/seo                   Admin: list all overrides
 * PUT   /api/v1/admin/seo                   Admin: upsert
 */
class Seo extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Seo_model');
    }

    public function index()
    {
        $path = (string) $this->input->get('path');
        if ($path === '') {
            $this->fail('VALIDATION', 'path query param required', 422);
            return;
        }
        $row = $this->Seo_model->by_path($path);
        $this->ok($row ?? (object) []);
    }

    public function admin_index()
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin only', 403);
            return;
        }
        $this->ok($this->Seo_model->all());
    }

    public function admin_upsert()
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin only', 403);
            return;
        }
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];
        $path = (string) ($in['path'] ?? '');
        if ($path === '' || $path[0] !== '/') {
            $this->fail('VALIDATION', 'path required (must start with /)', 422);
            return;
        }
        $id = $this->Seo_model->upsert($path, $in);
        $this->ok(['id' => $id]);
    }
}
