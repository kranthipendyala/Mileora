<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Notification_model extends CI_Model
{
    private string $table = 'notifications';

    public function by_user(int $user_id, int $perPage, int $offset): array
    {
        $rows = $this->db
            ->where('user_id', $user_id)
            ->order_by('created_at', 'DESC')
            ->limit($perPage, $offset)
            ->get($this->table)->result_array();
        $total = (int) $this->db->where('user_id', $user_id)->count_all_results($this->table);
        return ['rows' => $rows, 'total' => $total];
    }

    public function unread_count(int $user_id): int
    {
        return (int) $this->db
            ->where(['user_id' => $user_id, 'read_at' => null])
            ->count_all_results($this->table);
    }

    public function mark_read(int $id, int $user_id): void
    {
        $this->db->update($this->table, ['read_at' => date('Y-m-d H:i:s')],
            ['id' => $id, 'user_id' => $user_id, 'read_at' => null]);
    }

    public function mark_all_read(int $user_id): void
    {
        $this->db->update($this->table, ['read_at' => date('Y-m-d H:i:s')],
            ['user_id' => $user_id, 'read_at' => null]);
    }

    /** Insert a new notification (does not push — caller should also call Fcm_lib::send). */
    public function create(array $data): int
    {
        $this->db->insert($this->table, [
            'user_id'   => (int) $data['user_id'],
            'type'      => $data['type'],
            'title'     => $data['title'],
            'body'      => $data['body'] ?? null,
            'data_json' => isset($data['data']) ? json_encode($data['data']) : null,
            'cta_url'   => $data['cta_url'] ?? null,
            'created_at'=> date('Y-m-d H:i:s'),
        ]);
        return (int) $this->db->insert_id();
    }
}
