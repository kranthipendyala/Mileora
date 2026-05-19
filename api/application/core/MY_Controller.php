<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once APPPATH . '/../vendor/chriskacerguis/codeigniter-restserver/src/RestController.php';

use chriskacerguis\RestServer\RestController;

/**
 * Base REST controller for all Mileora API endpoints.
 * Adds:
 *  - JWT decode helper
 *  - Server-key auth helper (for Next.js BFF -> CI3 calls)
 *  - Consistent JSON envelope helpers
 *
 * The @property annotations below tell IDEs about CI3's magic-loaded
 * properties (Loader, DB, Input, etc. + every model/library we use).
 * They have no runtime effect — pure static-analysis hints.
 *
 * @property CI_Loader             $load
 * @property CI_DB_query_builder   $db
 * @property CI_DB_forge           $dbforge
 * @property CI_Input              $input
 * @property CI_Output             $output
 * @property CI_URI                $uri
 * @property CI_Session            $session
 * @property CI_Form_validation    $form_validation
 * @property CI_Migration          $migration
 *
 * @property User_model              $User_model
 * @property Astrologer_model        $Astrologer_model
 * @property Puja_model              $Puja_model
 * @property Booking_model           $Booking_model
 * @property Payment_model           $Payment_model
 * @property Lead_model              $Lead_model
 * @property Guide_model             $Guide_model
 * @property City_model              $City_model
 * @property Locality_model          $Locality_model
 * @property Address_model           $Address_model
 * @property Review_model            $Review_model
 * @property Notification_model      $Notification_model
 * @property Otp_model               $Otp_model
 * @property Device_token_model      $Device_token_model
 * @property Chat_model              $Chat_model
 * @property Coupon_model            $Coupon_model
 * @property Setting_model           $Setting_model
 * @property Seo_model               $Seo_model
 * @property Service_category_model  $Service_category_model
 * @property Guide_service_model     $Guide_service_model
 *
 * @property Jwt_lib                 $jwt_lib
 * @property Razorpay_service        $razorpay_service
 * @property Elasticsearch_service   $elasticsearch_service
 * @property Fcm_lib                 $fcm_lib
 */
class MY_Controller extends RestController
{
    public function __construct()
    {
        parent::__construct();
        $this->load->helper(['url', 'jwt']);
        $this->load->library('jwt_lib');
    }

    /** Returns decoded JWT payload, or sends 401 + dies. */
    protected function require_user(): object
    {
        $auth = $this->input->get_request_header('Authorization', TRUE);
        if (!$auth || !preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
            $this->response(['error' => ['code' => 'NO_TOKEN', 'message' => 'Missing Authorization header']], 401);
            exit;
        }
        try {
            return $this->jwt_lib->decode($m[1]);
        } catch (\Throwable $e) {
            $this->response(['error' => ['code' => 'BAD_TOKEN', 'message' => 'Invalid or expired token']], 401);
            exit;
        }
    }

    /** Returns true if request carries the server-to-server key from Next.js BFF. */
    protected function is_server_caller(): bool
    {
        $key = $this->input->get_request_header('X-Mileora-Key', TRUE);
        return is_string($key) && hash_equals((string) ($_ENV['MILEORA_SERVER_API_KEY'] ?? ''), $key);
    }

    /** Sends 401 unless server-key matches. */
    protected function require_server_caller(): void
    {
        if (!$this->is_server_caller()) {
            $this->response(['error' => ['code' => 'FORBIDDEN', 'message' => 'Server key required']], 401);
            exit;
        }
    }

    protected function ok($data, array $meta = [], int $status = 200): void
    {
        $payload = ['data' => $data];
        if ($meta) $payload['meta'] = $meta;
        $this->response($payload, $status);
    }

    protected function fail(string $code, string $message, int $status = 400): void
    {
        $this->response(['error' => ['code' => $code, 'message' => $message]], $status);
    }
}
