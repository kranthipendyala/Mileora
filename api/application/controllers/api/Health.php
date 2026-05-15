<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Health extends MY_Controller
{
    public function index()
    {
        $this->ok([
            'status'  => 'ok',
            'service' => 'mileora-api',
            'php'     => PHP_VERSION,
            'time'    => gmdate('c'),
        ]);
    }
}
