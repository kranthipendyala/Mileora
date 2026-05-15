<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Bookings extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Booking_model');
        $this->load->model('Astrologer_model');
        $this->load->model('Puja_model');
        $this->load->library('razorpay_service');
    }

    /**
     * Create a pending booking AND a Razorpay order in one shot.
     * Called by Next.js BFF /api/razorpay/order — uses server key.
     */
    public function create()
    {
        $this->require_server_caller();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $type     = (string) ($in['type'] ?? '');
        $itemSlug = (string) ($in['itemSlug'] ?? '');
        $slot     = (string) ($in['slotIso'] ?? '');
        $user     = $in['user'] ?? [];

        if (!in_array($type, ['consultation', 'puja', 'report'], true) || !$itemSlug) {
            $this->fail('VALIDATION', 'type and itemSlug required', 422);
            return;
        }
        if (empty($user['name']) || empty($user['phone']) || empty($user['email'])) {
            $this->fail('VALIDATION', 'user.name, user.phone, user.email required', 422);
            return;
        }

        // Resolve item + price
        $price_paise = 0;
        $item_id = 0;
        if ($type === 'consultation') {
            $a = $this->Astrologer_model->by_slug($itemSlug);
            if (!$a) { $this->fail('NOT_FOUND', 'Astrologer not found', 404); return; }
            $item_id = (int) $a['id'];
            $price_paise = (int) $a['price_per_session_paise'];
        } elseif ($type === 'puja') {
            $p = $this->Puja_model->by_slug($itemSlug);
            if (!$p) { $this->fail('NOT_FOUND', 'Puja not found', 404); return; }
            $item_id = (int) $p['id'];
            $price_paise = (int) $p['price_paise'];
        } else {
            $price_paise = 49900; // ₹499 default for paid reports
        }

        $booking_id = $this->Booking_model->create([
            'type'         => $type,
            'item_id'      => $item_id,
            'item_slug'    => $itemSlug,
            'slot_iso'     => $slot ?: null,
            'amount_paise' => $price_paise,
            'currency'     => 'INR',
            'status'       => 'pending',
            'user_name'    => $user['name'],
            'user_phone'   => $user['phone'],
            'user_email'   => $user['email'],
            'created_at'   => date('Y-m-d H:i:s'),
        ]);

        $order = $this->razorpay_service->create_order(
            $price_paise,
            "MIL-{$booking_id}",
            ['booking_id' => $booking_id, 'type' => $type, 'slug' => $itemSlug]
        );

        $this->Booking_model->update($booking_id, ['razorpay_order_id' => $order['id']]);

        $this->ok([
            'booking_id'        => $booking_id,
            'razorpay_order_id' => $order['id'],
            'amount'            => $order['amount'],
            'currency'          => $order['currency'],
            'key_id'            => $this->razorpay_service->key_id(),
        ]);
    }

    public function index()
    {
        $claims = $this->require_user();
        $rows = $this->Booking_model->by_user_phone((string) $claims->phone);
        $this->ok($rows);
    }

    public function show($id = 0)
    {
        $claims = $this->require_user();
        $row = $this->Booking_model->find((int) $id);
        if (!$row || $row['user_phone'] !== $claims->phone) {
            $this->fail('NOT_FOUND', 'Booking not found', 404);
            return;
        }
        $this->ok($row);
    }

    public function cancel($id = 0)
    {
        $claims = $this->require_user();
        $row = $this->Booking_model->find((int) $id);
        if (!$row || $row['user_phone'] !== $claims->phone) {
            $this->fail('NOT_FOUND', 'Booking not found', 404);
            return;
        }
        if ($row['status'] !== 'confirmed' && $row['status'] !== 'pending') {
            $this->fail('NOT_CANCELLABLE', 'Booking cannot be cancelled', 409);
            return;
        }
        $this->Booking_model->update((int) $id, ['status' => 'cancelled', 'cancelled_at' => date('Y-m-d H:i:s')]);
        // TODO: trigger refund via Razorpay if confirmed.
        $this->ok(['status' => 'cancelled']);
    }
}
