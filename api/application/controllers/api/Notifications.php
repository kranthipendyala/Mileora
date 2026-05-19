<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * In-app notification feed + device-token registration for push.
 *
 * GET   /api/v1/notifications                  Paginated feed
 * GET   /api/v1/notifications/unread-count     Badge counter
 * POST  /api/v1/notifications/{id}/read
 * POST  /api/v1/notifications/read-all
 * POST  /api/v1/notifications/register-device  Save FCM token
 */
class Notifications extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model(['Notification_model', 'Device_token_model']);
    }

    public function index()
    {
        $claims  = $this->require_user();
        $page    = max(1, (int) $this->input->get('page'));
        $perPage = min(50, max(1, (int) ($this->input->get('perPage') ?: 20)));
        $r = $this->Notification_model->by_user((int) $claims->sub, $perPage, ($page - 1) * $perPage);
        $this->ok($r['rows'], [
            'total'   => $r['total'],
            'page'    => $page,
            'perPage' => $perPage,
        ]);
    }

    public function unread_count()
    {
        $claims = $this->require_user();
        $this->ok(['unread_count' => $this->Notification_model->unread_count((int) $claims->sub)]);
    }

    public function mark_read($id = 0)
    {
        $claims = $this->require_user();
        $this->Notification_model->mark_read((int) $id, (int) $claims->sub);
        $this->ok(['ok' => true]);
    }

    public function mark_all_read()
    {
        $claims = $this->require_user();
        $this->Notification_model->mark_all_read((int) $claims->sub);
        $this->ok(['ok' => true]);
    }

    public function register_device()
    {
        $claims = $this->require_user();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $platform = (string) ($in['platform'] ?? '');
        $token    = (string) ($in['token'] ?? '');
        $version  = $in['app_version'] ?? null;

        if (!in_array($platform, ['ios', 'android', 'web'], true) || $token === '') {
            $this->fail('VALIDATION', 'platform + token required', 422);
            return;
        }

        $this->Device_token_model->register((int) $claims->sub, $platform, $token, $version);
        $this->ok(['registered' => true]);
    }
}
