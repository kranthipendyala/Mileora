<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * GET  /api/v1/reviews?astrologer_id=N    Public reviews list
 * POST /api/v1/reviews                    Authenticated user creates review (must own a confirmed booking for that target)
 * POST /api/v1/reviews/{id}/hide          Admin only
 */
class Reviews extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model(['Review_model', 'Booking_model']);
    }

    public function index()
    {
        $page    = max(1, (int) $this->input->get('page'));
        $perPage = min(50, max(1, (int) ($this->input->get('perPage') ?: 20)));
        $filters = [
            'astrologer_id' => (int) $this->input->get('astrologer_id'),
            'type'          => $this->input->get('type'),
            'min_rating'    => (int) $this->input->get('min_rating'),
        ];
        $r = $this->Review_model->paginate($filters, $page, $perPage);
        $this->ok($r['rows'], ['page' => $page, 'perPage' => $perPage, 'total' => $r['total']]);
    }

    public function create()
    {
        $claims = $this->require_user();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $booking_id = (int) ($in['booking_id'] ?? 0);
        $rating     = (int) ($in['rating'] ?? 0);

        if ($rating < 1 || $rating > 5) {
            $this->fail('VALIDATION', 'rating must be 1..5', 422);
            return;
        }
        if (!$booking_id) {
            $this->fail('VALIDATION', 'booking_id required', 422);
            return;
        }

        $booking = $this->Booking_model->find($booking_id);
        if (!$booking || $booking['user_phone'] !== ($claims->phone ?? '') || $booking['status'] !== 'confirmed') {
            $this->fail('FORBIDDEN', 'You can only review your own confirmed bookings', 403);
            return;
        }
        if ($this->Review_model->exists_for_booking($booking_id, (int) $claims->sub)) {
            $this->fail('DUPLICATE', 'You already reviewed this booking', 409);
            return;
        }

        $type = $booking['type'] === 'consultation' ? 'astrologer'
              : ($booking['type'] === 'puja' ? 'puja' : 'report');

        $id = $this->Review_model->create([
            'astrologer_id' => $type === 'astrologer' ? (int) $booking['item_id'] : 0,
            'booking_id'    => $booking_id,
            'type'          => $type,
            'user_id'       => (int) $claims->sub,
            'rating'        => $rating,
            'title'         => $in['title'] ?? null,
            'body'          => $in['body'] ?? null,
        ]);
        $this->ok(['id' => $id], [], 201);
    }

    public function hide($id = 0)
    {
        $claims = $this->require_user();
        if (($claims->role ?? null) !== 'admin') {
            $this->fail('FORBIDDEN', 'Admin only', 403);
            return;
        }
        $this->Review_model->set_status((int) $id, 'hidden');
        $this->ok(['hidden' => true]);
    }
}
