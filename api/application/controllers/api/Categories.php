<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * GET /api/v1/categories                Public — top-level categories with active-guide counts
 * GET /api/v1/categories/{slug}         Public — single category (used by /services/[category])
 */
class Categories extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Service_category_model');
    }

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
}
