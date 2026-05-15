<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Astrologers extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Astrologer_model');
    }

    public function index()
    {
        $page    = max(1, (int) $this->input->get('page'));
        $perPage = min(50, max(1, (int) ($this->input->get('perPage') ?: 20)));
        $filters = [
            'specialty' => $this->input->get('specialty'),
            'language'  => $this->input->get('language'),
            'minPrice'  => $this->input->get('minPrice'),
            'maxPrice'  => $this->input->get('maxPrice'),
        ];

        $rows  = $this->Astrologer_model->paginate($page, $perPage, $filters);
        $total = $this->Astrologer_model->count($filters);
        $this->ok($rows, [
            'page' => $page, 'perPage' => $perPage,
            'total' => $total, 'totalPages' => (int) ceil($total / $perPage),
        ]);
    }

    public function show($slug = null)
    {
        $row = $this->Astrologer_model->by_slug((string) $slug);
        if (!$row) {
            $this->fail('NOT_FOUND', 'Astrologer not found', 404);
            return;
        }
        $row['slots'] = $this->Astrologer_model->upcoming_slots((int) $row['id']);
        $this->ok($row);
    }

    public function reviews($slug = null)
    {
        $astrologer = $this->Astrologer_model->by_slug((string) $slug);
        if (!$astrologer) {
            $this->fail('NOT_FOUND', 'Astrologer not found', 404);
            return;
        }
        $this->ok($this->Astrologer_model->reviews((int) $astrologer['id']));
    }

    public function add_review($slug = null)
    {
        $claims = $this->require_user();
        $astrologer = $this->Astrologer_model->by_slug((string) $slug);
        if (!$astrologer) {
            $this->fail('NOT_FOUND', 'Astrologer not found', 404);
            return;
        }

        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];
        $rating = (int) ($in['rating'] ?? 0);
        $body   = trim((string) ($in['body'] ?? ''));
        if ($rating < 1 || $rating > 5) {
            $this->fail('VALIDATION', 'rating must be 1..5', 422);
            return;
        }

        $id = $this->Astrologer_model->add_review([
            'astrologer_id' => (int) $astrologer['id'],
            'user_id'       => (int) $claims->sub,
            'rating'        => $rating,
            'body'          => $body,
            'created_at'    => date('Y-m-d H:i:s'),
        ]);
        $this->ok(['id' => $id], [], 201);
    }
}
