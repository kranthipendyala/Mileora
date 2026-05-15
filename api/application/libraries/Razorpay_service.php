<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use Razorpay\Api\Api;

class Razorpay_service
{
    private Api $api;
    private string $key_id;
    private string $secret;

    public function __construct()
    {
        $this->key_id = (string) ($_ENV['RAZORPAY_KEY_ID'] ?? '');
        $this->secret = (string) ($_ENV['RAZORPAY_KEY_SECRET'] ?? '');
        $this->api = new Api($this->key_id, $this->secret);
    }

    public function key_id(): string
    {
        return $this->key_id;
    }

    /** @param int $amount_paise */
    public function create_order(int $amount_paise, string $receipt, array $notes = []): array
    {
        $order = $this->api->order->create([
            'amount'   => $amount_paise,
            'currency' => 'INR',
            'receipt'  => $receipt,
            'notes'    => $notes,
            'payment_capture' => 1,
        ]);
        return [
            'id'       => $order['id'],
            'amount'   => $order['amount'],
            'currency' => $order['currency'],
            'receipt'  => $order['receipt'],
        ];
    }

    public function verify_signature(string $order_id, string $payment_id, string $signature): bool
    {
        $expected = hash_hmac('sha256', $order_id . '|' . $payment_id, $this->secret);
        return hash_equals($expected, $signature);
    }

    public function verify_webhook(string $body, string $signature): bool
    {
        $secret = (string) ($_ENV['RAZORPAY_WEBHOOK_SECRET'] ?? '');
        $expected = hash_hmac('sha256', $body, $secret);
        return hash_equals($expected, $signature);
    }
}
