<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Guide KYC + bank + availability submission. Once all three are submitted,
 * `users.onboarding_completed` flips to 1 and the guide becomes admin-reviewable.
 *
 * POST /api/v1/guide/onboarding/document         { doc_type, doc_number?, file_url }
 * POST /api/v1/guide/onboarding/bank-account     { account_name, account_number, ifsc, bank_name? }
 * POST /api/v1/guide/onboarding/availability     { windows: [{day_of_week, start_time, end_time}] }
 * GET  /api/v1/guide/onboarding/status
 */
class Guide_onboarding extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Guide_model');
    }

    private function require_guide(): object
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'guide') {
            $this->fail('FORBIDDEN', 'Guide token required', 403);
            exit;
        }
        return $claims;
    }

    public function document()
    {
        $claims = $this->require_guide();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $doc_type = (string) ($in['doc_type'] ?? '');
        $file_url = (string) ($in['file_url'] ?? '');

        if (!in_array($doc_type, ['pan', 'aadhaar', 'certificate', 'gst', 'other'], true) || $file_url === '') {
            $this->fail('VALIDATION', 'doc_type + file_url required', 422);
            return;
        }

        $this->db->insert('guide_documents', [
            'guide_id'   => (int) $claims->sub,
            'doc_type'   => $doc_type,
            'doc_number' => $in['doc_number'] ?? null,
            'file_url'   => $file_url,
            'status'     => 'submitted',
            'created_at' => date('Y-m-d H:i:s'),
        ]);
        $this->maybe_complete((int) $claims->sub);
        $this->ok(['id' => (int) $this->db->insert_id()], [], 201);
    }

    public function bank_account()
    {
        $claims = $this->require_guide();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $name   = trim((string) ($in['account_name'] ?? ''));
        $number = trim((string) ($in['account_number'] ?? ''));
        $ifsc   = strtoupper(trim((string) ($in['ifsc'] ?? '')));

        if ($name === '' || !preg_match('/^\d{6,18}$/', $number) || !preg_match('/^[A-Z]{4}0[A-Z0-9]{6}$/', $ifsc)) {
            $this->fail('VALIDATION', 'account_name, account_number, IFSC required', 422);
            return;
        }

        // Default new accounts; any existing default is cleared
        $this->db->update('guide_bank_accounts', ['is_default' => 0], ['guide_id' => (int) $claims->sub]);
        $this->db->insert('guide_bank_accounts', [
            'guide_id'       => (int) $claims->sub,
            'account_name'   => $name,
            'account_number' => $number,
            'ifsc'           => $ifsc,
            'bank_name'      => $in['bank_name'] ?? null,
            'is_default'     => 1,
            'created_at'     => date('Y-m-d H:i:s'),
        ]);
        $this->maybe_complete((int) $claims->sub);
        $this->ok(['id' => (int) $this->db->insert_id()], [], 201);
    }

    public function availability()
    {
        $claims = $this->require_guide();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];
        $windows = $in['windows'] ?? [];

        if (!is_array($windows) || empty($windows)) {
            $this->fail('VALIDATION', 'windows[] required', 422);
            return;
        }

        // Replace existing windows
        $this->db->delete('guide_availability', ['guide_id' => (int) $claims->sub]);
        foreach ($windows as $w) {
            $this->db->insert('guide_availability', [
                'guide_id'    => (int) $claims->sub,
                'day_of_week' => (int) ($w['day_of_week'] ?? 0),
                'start_time'  => $w['start_time'] ?? '09:00:00',
                'end_time'    => $w['end_time']   ?? '18:00:00',
                'is_active'   => 1,
            ]);
        }
        $this->maybe_complete((int) $claims->sub);
        $this->ok(['count' => count($windows)]);
    }

    public function status()
    {
        $claims = $this->require_guide();
        $gid = (int) $claims->sub;
        $this->ok([
            'documents_count'  => (int) $this->db->where('guide_id', $gid)->count_all_results('guide_documents'),
            'bank_count'       => (int) $this->db->where('guide_id', $gid)->count_all_results('guide_bank_accounts'),
            'availability_count' => (int) $this->db->where('guide_id', $gid)->count_all_results('guide_availability'),
            'onboarding_completed' => (int) ($this->Guide_model->find($gid)['onboarding_completed'] ?? 0) === 1,
        ]);
    }

    /** If guide has uploaded ≥1 doc + ≥1 bank + ≥1 availability window, flip the flag. */
    private function maybe_complete(int $guide_id): void
    {
        $docs = (int) $this->db->where('guide_id', $guide_id)->count_all_results('guide_documents');
        $bank = (int) $this->db->where('guide_id', $guide_id)->count_all_results('guide_bank_accounts');
        $avail = (int) $this->db->where('guide_id', $guide_id)->count_all_results('guide_availability');

        if ($docs > 0 && $bank > 0 && $avail > 0) {
            $this->db->update('users', ['onboarding_completed' => 1], ['id' => $guide_id, 'role' => 'guide']);
        }
    }
}
