<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Booking-scoped chat between a user and a guide.
 *
 * GET   /api/v1/chat/threads
 * POST  /api/v1/chat/threads                  { guide_id, booking_id? }
 * GET   /api/v1/chat/threads/{id}/messages    ?before_id=N
 * POST  /api/v1/chat/threads/{id}/messages    { body, attachment_url? }
 * POST  /api/v1/chat/threads/{id}/read
 */
class Chat extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model(['Chat_model', 'Notification_model']);
    }

    private function role(object $claims): string
    {
        return ($claims->role ?? 'user') === 'guide' ? 'guide' : 'user';
    }

    public function threads()
    {
        $claims = $this->require_user();
        $this->ok($this->Chat_model->threads_for_user((int) $claims->sub, $this->role($claims)));
    }

    public function ensure_thread()
    {
        $claims = $this->require_user();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];
        $guide_id   = (int) ($in['guide_id'] ?? 0);
        $booking_id = isset($in['booking_id']) ? (int) $in['booking_id'] : null;

        if ($this->role($claims) === 'user') {
            if (!$guide_id) { $this->fail('VALIDATION', 'guide_id required', 422); return; }
            $thread = $this->Chat_model->ensure_thread((int) $claims->sub, $guide_id, $booking_id);
        } else {
            $user_id = (int) ($in['user_id'] ?? 0);
            if (!$user_id) { $this->fail('VALIDATION', 'user_id required', 422); return; }
            $thread = $this->Chat_model->ensure_thread($user_id, (int) $claims->sub, $booking_id);
        }
        $this->ok($thread);
    }

    public function messages($thread_id = 0)
    {
        $claims = $this->require_user();
        $tid = (int) $thread_id;
        if (!$this->Chat_model->thread_visible_to($tid, (int) $claims->sub, $this->role($claims))) {
            $this->fail('FORBIDDEN', 'You do not have access to this thread', 403);
            return;
        }
        $limit     = min(100, max(1, (int) ($this->input->get('limit') ?: 50)));
        $before_id = (int) $this->input->get('before_id') ?: null;
        $this->ok($this->Chat_model->messages($tid, $limit, $before_id));
    }

    public function send($thread_id = 0)
    {
        $claims = $this->require_user();
        $tid = (int) $thread_id;
        if (!$this->Chat_model->thread_visible_to($tid, (int) $claims->sub, $this->role($claims))) {
            $this->fail('FORBIDDEN', 'You do not have access to this thread', 403);
            return;
        }
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];
        $body = trim((string) ($in['body'] ?? ''));
        $attachment = $in['attachment_url'] ?? null;
        if ($body === '' && !$attachment) {
            $this->fail('VALIDATION', 'body or attachment_url required', 422);
            return;
        }
        $id = $this->Chat_model->send($tid, (int) $claims->sub, $this->role($claims), $body, $attachment);

        // TODO: trigger notification to the other party (Notification_model + Fcm_lib)
        $this->ok(['id' => $id], [], 201);
    }

    public function read($thread_id = 0)
    {
        $claims = $this->require_user();
        $tid = (int) $thread_id;
        if (!$this->Chat_model->thread_visible_to($tid, (int) $claims->sub, $this->role($claims))) {
            $this->fail('FORBIDDEN', 'You do not have access to this thread', 403);
            return;
        }
        $this->Chat_model->mark_read($tid, (int) $claims->sub);
        $this->ok(['ok' => true]);
    }
}
