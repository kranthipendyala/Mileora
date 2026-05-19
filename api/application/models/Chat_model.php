<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Chat_model extends CI_Model
{
    /** Get or create a thread between user and guide (optionally booking-scoped). */
    public function ensure_thread(int $user_id, int $guide_id, ?int $booking_id = null): array
    {
        $where = ['user_id' => $user_id, 'guide_id' => $guide_id];
        if ($booking_id) $where['booking_id'] = $booking_id;

        $existing = $this->db->get_where('chat_threads', $where)->row_array();
        if ($existing) return $existing;

        $this->db->insert('chat_threads', $where + ['created_at' => date('Y-m-d H:i:s')]);
        return $this->db->get_where('chat_threads', ['id' => (int) $this->db->insert_id()])->row_array();
    }

    public function threads_for_user(int $user_id, string $role): array
    {
        $col = $role === 'guide' ? 'guide_id' : 'user_id';
        return $this->db
            ->where($col, $user_id)
            ->order_by('last_message_at', 'DESC')
            ->limit(100)
            ->get('chat_threads')->result_array();
    }

    public function messages(int $thread_id, int $limit = 50, ?int $before_id = null): array
    {
        $this->db->where('thread_id', $thread_id);
        if ($before_id) $this->db->where('id <', $before_id);
        return $this->db->order_by('id', 'DESC')->limit($limit)->get('chat_messages')->result_array();
    }

    public function send(int $thread_id, int $sender_id, string $sender_role, string $body, ?string $attachment_url = null): int
    {
        $now = date('Y-m-d H:i:s');
        $this->db->insert('chat_messages', [
            'thread_id'      => $thread_id,
            'sender_id'      => $sender_id,
            'sender_role'    => $sender_role,
            'body'           => $body,
            'attachment_url' => $attachment_url,
            'created_at'     => $now,
        ]);
        $id = (int) $this->db->insert_id();
        $this->db->update('chat_threads', ['last_message_at' => $now], ['id' => $thread_id]);
        return $id;
    }

    public function mark_read(int $thread_id, int $reader_id): void
    {
        // Mark messages from the *other* party as read
        $this->db->where('thread_id', $thread_id)
            ->where('sender_id !=', $reader_id)
            ->where('read_at', null)
            ->update('chat_messages', ['read_at' => date('Y-m-d H:i:s')]);
    }

    public function thread_visible_to(int $thread_id, int $user_id, string $role): bool
    {
        $col = $role === 'guide' ? 'guide_id' : 'user_id';
        return (bool) $this->db->where(['id' => $thread_id, $col => $user_id])
            ->count_all_results('chat_threads');
    }
}
