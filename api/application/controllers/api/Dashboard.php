<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Customer-facing dashboard. Read-mostly summary the mobile app + web "My Account" page consume.
 *
 * GET /api/v1/dashboard  →  { upcoming_bookings, past_bookings, unread_notifications, saved_addresses, suggested_guides }
 */
class Dashboard extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->model(['Booking_model', 'Notification_model', 'Address_model']);
    }

    public function index()
    {
        $claims = $this->require_user();
        $phone  = (string) ($claims->phone ?? '');
        $user_id = (int) $claims->sub;

        $all = $this->Booking_model->by_user_phone($phone);
        $now = date('Y-m-d H:i:s');
        $upcoming = array_values(array_filter($all, function ($b) use ($now) {
            return in_array($b['status'], ['pending', 'confirmed'], true)
                && (!$b['slot_iso'] || $b['slot_iso'] >= $now);
        }));
        $past = array_values(array_filter($all, function ($b) {
            return in_array($b['status'], ['cancelled', 'refunded'], true)
                || ($b['status'] === 'confirmed' && $b['slot_iso'] && $b['slot_iso'] < date('Y-m-d H:i:s'));
        }));

        $suggested = $this->db
            ->where('status', 'active')
            ->order_by('rating', 'DESC')
            ->limit(6)
            ->get('astrologers')->result_array();

        $this->ok([
            'upcoming_bookings'    => array_slice($upcoming, 0, 5),
            'past_bookings'        => array_slice($past, 0, 5),
            'unread_notifications' => $this->Notification_model->unread_count($user_id),
            'saved_addresses'      => $this->Address_model->by_user($user_id),
            'suggested_guides'     => $suggested,
        ]);
    }
}
