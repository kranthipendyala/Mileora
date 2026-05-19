<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * GET  /api/v1/cities             List active cities (?stats=1 for puja counts)
 * GET  /api/v1/cities/{slug}      City detail with localities
 */
class Cities extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model(['City_model', 'Locality_model']);
    }

    public function index()
    {
        $with_stats = (bool) $this->input->get('stats');
        $rows = $with_stats ? $this->City_model->with_stats() : $this->City_model->get_all();
        $this->ok($rows);
    }

    public function show($slug = null)
    {
        $city = $this->City_model->by_slug((string) $slug);
        if (!$city) {
            $this->fail('NOT_FOUND', 'City not found', 404);
            return;
        }
        $city['localities'] = $this->Locality_model->by_city((int) $city['id']);
        $this->ok($city);
    }
}
