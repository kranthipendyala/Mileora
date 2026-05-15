<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . '/../vendor/chriskacerguis/codeigniter-restserver/src/RestController.php';

use chriskacerguis\RestServer\RestController;

/**
 * Base REST controller for all Mileora API endpoints.
 * Adds:
 *  - JWT decode helper
 *  - Server-key auth helper (for Next.js BFF -> CI3 calls)
 *  - Consistent JSON envelope helpers
 */
class MY_Controller extends RestController
{
    public function __construct()
    {
        parent::__construct();
        $this->load->helper(['url', 'jwt']);
        $this->load->library('jwt_lib');
    }

    /** Returns decoded JWT payload, or sends 401 + dies. */
    protected function require_user(): object
    {
        $auth = $this->input->get_request_header('Authorization', TRUE);
        if (!$auth || !preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
            $this->response(['error' => ['code' => 'NO_TOKEN', 'message' => 'Missing Authorization header']], 401);
            exit;
        }
        try {
            return $this->jwt_lib->decode($m[1]);
        } catch (\Throwable $e) {
            $this->response(['error' => ['code' => 'BAD_TOKEN', 'message' => 'Invalid or expired token']], 401);
            exit;
        }
    }

    /** Returns true if request carries the server-to-server key from Next.js BFF. */
    protected function is_server_caller(): bool
    {
        $key = $this->input->get_request_header('X-Mileora-Key', TRUE);
        return is_string($key) && hash_equals((string) ($_ENV['MILEORA_SERVER_API_KEY'] ?? ''), $key);
    }

    /** Sends 401 unless server-key matches. */
    protected function require_server_caller(): void
    {
        if (!$this->is_server_caller()) {
            $this->response(['error' => ['code' => 'FORBIDDEN', 'message' => 'Server key required']], 401);
            exit;
        }
    }

    protected function ok($data, array $meta = [], int $status = 200): void
    {
        $payload = ['data' => $data];
        if ($meta) $payload['meta'] = $meta;
        $this->response($payload, $status);
    }

    protected function fail(string $code, string $message, int $status = 400): void
    {
        $this->response(['error' => ['code' => $code, 'message' => $message]], $status);
    }
}
