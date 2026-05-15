<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Payments extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model('Booking_model');
        $this->load->model('Payment_model');
        $this->load->library('razorpay_service');
    }

    public function verify()
    {
        $this->require_server_caller();
        $in = json_decode($this->input->raw_input_stream ?: '[]', true) ?: [];

        $booking_id = (int) ($in['booking_id'] ?? 0);
        $order_id   = (string) ($in['razorpay_order_id'] ?? '');
        $payment_id = (string) ($in['razorpay_payment_id'] ?? '');
        $signature  = (string) ($in['razorpay_signature'] ?? '');

        $booking = $this->Booking_model->find($booking_id);
        if (!$booking || $booking['razorpay_order_id'] !== $order_id) {
            $this->fail('NOT_FOUND', 'Booking/order mismatch', 404);
            return;
        }

        if (!$this->razorpay_service->verify_signature($order_id, $payment_id, $signature)) {
            $this->Booking_model->update($booking_id, ['status' => 'failed']);
            $this->fail('BAD_SIGNATURE', 'Signature verification failed', 400);
            return;
        }

        $this->Payment_model->insert([
            'booking_id'          => $booking_id,
            'razorpay_order_id'   => $order_id,
            'razorpay_payment_id' => $payment_id,
            'amount_paise'        => (int) $booking['amount_paise'],
            'currency'            => 'INR',
            'status'              => 'captured',
            'created_at'          => date('Y-m-d H:i:s'),
        ]);
        $this->Booking_model->update($booking_id, [
            'status'             => 'confirmed',
            'razorpay_payment_id' => $payment_id,
            'confirmed_at'       => date('Y-m-d H:i:s'),
        ]);

        // TODO: send confirmation email + SMS + push notification
        $this->ok(['status' => 'confirmed', 'booking_id' => $booking_id]);
    }
}
