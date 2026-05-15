<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Webhooks extends MY_Controller
{
    public function razorpay()
    {
        $this->load->library('razorpay_service');
        $this->load->model('Booking_model');
        $this->load->model('Payment_model');

        $body = $this->input->raw_input_stream ?: '';
        $signature = $this->input->get_request_header('X-Razorpay-Signature', TRUE) ?? '';

        if (!$this->razorpay_service->verify_webhook($body, $signature)) {
            log_message('error', '[razorpay webhook] bad signature');
            $this->fail('BAD_SIGNATURE', 'Invalid webhook signature', 400);
            return;
        }

        $event = json_decode($body, true) ?: [];
        $type  = $event['event'] ?? '';
        log_message('info', "[razorpay webhook] {$type}");

        switch ($type) {
            case 'payment.captured':
                // Idempotent reconcile.
                $payment = $event['payload']['payment']['entity'] ?? [];
                $order_id = $payment['order_id'] ?? null;
                if ($order_id) {
                    $booking = $this->Booking_model->by_order($order_id);
                    if ($booking && $booking['status'] !== 'confirmed') {
                        $this->Booking_model->update((int) $booking['id'], [
                            'status'              => 'confirmed',
                            'razorpay_payment_id' => $payment['id'] ?? null,
                            'confirmed_at'        => date('Y-m-d H:i:s'),
                        ]);
                    }
                }
                break;
            case 'payment.failed':
                $payment = $event['payload']['payment']['entity'] ?? [];
                $order_id = $payment['order_id'] ?? null;
                if ($order_id) {
                    $booking = $this->Booking_model->by_order($order_id);
                    if ($booking) {
                        $this->Booking_model->update((int) $booking['id'], ['status' => 'failed']);
                    }
                }
                break;
            case 'refund.processed':
                // Mark booking refunded
                break;
        }

        $this->ok(['received' => true]);
    }
}
