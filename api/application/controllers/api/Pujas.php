<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Pujas extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Puja_model');
    }

    public function index()
    {
        $page    = max(1, (int) $this->input->get('page'));
        $perPage = min(50, max(1, (int) ($this->input->get('perPage') ?: 20)));
        $rows    = $this->Puja_model->paginate($page, $perPage);
        $total   = $this->Puja_model->count();
        $this->ok($rows, ['page' => $page, 'perPage' => $perPage, 'total' => $total]);
    }

    public function show($slug = null)
    {
        $row = $this->Puja_model->by_slug((string) $slug);
        if (!$row) {
            $this->fail('NOT_FOUND', 'Puja not found', 404);
            return;
        }
        $row['available_dates'] = $this->Puja_model->available_dates((int) $row['id']);
        $this->ok($row);
    }
}
