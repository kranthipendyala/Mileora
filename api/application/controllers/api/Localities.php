<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * GET /api/v1/localities?city_id=N
 * GET /api/v1/localities?pincode=600001   — pincode lookup (no city scope)
 */
class Localities extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Locality_model');
    }

    public function index()
    {
        $city_id = (int) $this->input->get('city_id');
        $pincode = trim((string) $this->input->get('pincode'));

        if ($pincode !== '') {
            $this->ok($this->Locality_model->by_pincode($pincode));
            return;
        }
        if (!$city_id) {
            $this->fail('VALIDATION', 'city_id or pincode required', 422);
            return;
        }
        $this->ok($this->Locality_model->by_city($city_id));
    }
}
