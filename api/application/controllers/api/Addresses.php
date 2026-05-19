<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Authenticated user address book — prasad shipping, in-person vasthu audits.
 *
 * GET    /api/v1/addresses
 * POST   /api/v1/addresses
 * PUT    /api/v1/addresses/{id}
 * DELETE /api/v1/addresses/{id}
 */
class Addresses extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Address_model');
    }

    public function index()
    {
        $claims = $this->require_user();
        $this->ok($this->Address_model->by_user((int) $claims->sub));
    }

    public function create()
    {
        $claims = $this->require_user();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $err = $this->validate($in);
        if ($err) { $this->fail('VALIDATION', $err, 422); return; }

        $in['user_id'] = (int) $claims->sub;
        $id = $this->Address_model->create($in);
        $this->ok(['id' => $id], [], 201);
    }

    public function update($id = 0)
    {
        $claims = $this->require_user();
        $existing = $this->Address_model->find((int) $id, (int) $claims->sub);
        if (!$existing) { $this->fail('NOT_FOUND', 'Address not found', 404); return; }

        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];
        $this->Address_model->update((int) $id, (int) $claims->sub, $in);
        $this->ok(['updated' => true]);
    }

    public function delete($id = 0)
    {
        $claims = $this->require_user();
        $existing = $this->Address_model->find((int) $id, (int) $claims->sub);
        if (!$existing) { $this->fail('NOT_FOUND', 'Address not found', 404); return; }

        $this->Address_model->delete((int) $id, (int) $claims->sub);
        $this->ok(['deleted' => true]);
    }

    private function validate(array $in): ?string
    {
        if (empty($in['name']) || strlen((string) $in['name']) < 2) return 'name required';
        if (empty($in['phone']) || !preg_match('/^[6-9]\d{9}$/', (string) $in['phone'])) return 'Valid 10-digit phone required';
        if (empty($in['line1'])) return 'line1 required';
        if (empty($in['pincode']) || !preg_match('/^\d{6}$/', (string) $in['pincode'])) return 'Valid 6-digit pincode required';
        return null;
    }
}
