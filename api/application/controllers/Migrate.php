<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Browser-callable migration runner.
 * Visit http://localhost/Mileora/api/index.php/migrate to run.
 * Visit http://localhost/Mileora/api/index.php/migrate/seed to load demo data.
 *
 * Restrict in production via .env: MIGRATE_TOKEN=...&visit ?token=...
 */
class Migrate extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->guard();
        $this->load->library('migration');
    }

    public function index()
    {
        if ($this->migration->latest() === FALSE) {
            show_error($this->migration->error_string());
            return;
        }
        echo "Migrations OK — current version: " . $this->migration->current() . "\n";
    }

    public function seed()
    {
        require_once APPPATH . 'database/seeds/DemoSeeder.php';
        (new DemoSeeder($this->db))->run();
        echo "Demo data seeded.\n";
    }

    private function guard(): void
    {
        $expected = (string) ($_ENV['MIGRATE_TOKEN'] ?? '');
        if (ENVIRONMENT === 'production' && $expected !== '') {
            $given = (string) $this->input->get('token');
            if (!hash_equals($expected, $given)) {
                show_error('Forbidden', 403);
            }
        }
    }
}
