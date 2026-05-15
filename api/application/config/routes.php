<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$route['default_controller'] = 'home';
$route['404_override']       = '';
$route['translate_uri_dashes'] = FALSE;

// ---------------------------------------------------------------------
// REST API v1
// ---------------------------------------------------------------------

// Health
$route['api/v1/health']['get'] = 'api/health/index';

// Auth
$route['api/v1/auth/register']['post']    = 'api/auth/register';
$route['api/v1/auth/verify-otp']['post']  = 'api/auth/verify_otp';
$route['api/v1/auth/login']['post']       = 'api/auth/login';
$route['api/v1/auth/refresh']['post']     = 'api/auth/refresh';
$route['api/v1/auth/me']['get']           = 'api/auth/me';

// Astrologers
$route['api/v1/astrologers']['get']                    = 'api/astrologers/index';
$route['api/v1/astrologers/(:any)']['get']             = 'api/astrologers/show/$1';
$route['api/v1/astrologers/(:any)/reviews']['get']     = 'api/astrologers/reviews/$1';
$route['api/v1/astrologers/(:any)/reviews']['post']    = 'api/astrologers/add_review/$1';

// Pujas
$route['api/v1/pujas']['get']         = 'api/pujas/index';
$route['api/v1/pujas/(:any)']['get']  = 'api/pujas/show/$1';

// Bookings
$route['api/v1/bookings']['post']             = 'api/bookings/create';
$route['api/v1/bookings']['get']              = 'api/bookings/index';
$route['api/v1/bookings/(:num)']['get']       = 'api/bookings/show/$1';
$route['api/v1/bookings/(:num)/cancel']['post'] = 'api/bookings/cancel/$1';

// Payments + webhooks
$route['api/v1/payments/verify']['post']      = 'api/payments/verify';
$route['api/v1/webhooks/razorpay']['post']    = 'api/webhooks/razorpay';

// Leads
$route['api/v1/leads']['post'] = 'api/leads/create';
$route['api/v1/leads']['get']  = 'api/leads/index';

// Search (Elasticsearch-backed)
$route['api/v1/search/astrologers']['get'] = 'api/search/astrologers';
$route['api/v1/search/pujas']['get']       = 'api/search/pujas';
$route['api/v1/search/articles']['get']    = 'api/search/articles';
$route['api/v1/search/suggest']['get']     = 'api/search/suggest';

// Reports / calculators
$route['api/v1/reports/kundli']['post']     = 'api/reports/kundli';
$route['api/v1/reports/numerology']['post'] = 'api/reports/numerology';
$route['api/v1/reports/vasthu']['post']     = 'api/reports/vasthu';

// Migration runner (visit in browser to run / seed)
$route['migrate']['get']      = 'migrate/index';
$route['migrate/seed']['get'] = 'migrate/seed';
