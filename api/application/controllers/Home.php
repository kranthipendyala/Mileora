<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Home extends CI_Controller
{
    public function index()
    {
        header('Content-Type: application/json');
        echo json_encode([
            'service' => 'mileora-api',
            'docs'    => '/api/v1/health',
        ]);
    }
}
