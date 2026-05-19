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

// Auth — user (phone OTP)
$route['api/v1/auth/register']['post']        = 'api/auth/register';
$route['api/v1/auth/verify-otp']['post']      = 'api/auth/verify_otp';
$route['api/v1/auth/login']['post']           = 'api/auth/login';
$route['api/v1/auth/refresh']['post']         = 'api/auth/refresh';
$route['api/v1/auth/me']['get']               = 'api/auth/me';

// Auth — guide (phone OTP, must already exist via /guide/apply)
$route['api/v1/auth/guide/send-otp']['post'] = 'api/auth/guide_send_otp';
$route['api/v1/auth/guide/verify']['post']   = 'api/auth/guide_verify';

// Auth — admin (email + password, no OTP)
$route['api/v1/auth/admin/login']['post']     = 'api/auth/admin_login';

// Guide portal (require guide JWT unless noted)
$route['api/v1/guide/apply']['post']     = 'api/guide/apply';
$route['api/v1/guide/me']['get']         = 'api/guide/me';
$route['api/v1/guide/dashboard']['get']  = 'api/guide/dashboard';

// Admin console (require admin JWT)
$route['api/v1/admin/dashboard']['get']               = 'api/admin/dashboard';
$route['api/v1/admin/users']['get']                   = 'api/admin/users';
$route['api/v1/admin/guides']['get']                 = 'api/admin/guides';
$route['api/v1/admin/guides/(:num)/approve']['post'] = 'api/admin/approve_guide/$1';

// Astrologers
$route['api/v1/astrologers']['get']                    = 'api/astrologers/index';
$route['api/v1/astrologers/(:any)']['get']             = 'api/astrologers/show/$1';
$route['api/v1/astrologers/(:any)/services']['get']    = 'api/astrologers/services/$1';
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

// Geo
$route['api/v1/cities']['get']           = 'api/cities/index';
$route['api/v1/cities/(:any)']['get']    = 'api/cities/show/$1';
$route['api/v1/localities']['get']       = 'api/localities/index';

// User address book (JWT)
$route['api/v1/addresses']['get']                  = 'api/addresses/index';
$route['api/v1/addresses']['post']                 = 'api/addresses/create';
$route['api/v1/addresses/(:num)']['put']           = 'api/addresses/update/$1';
$route['api/v1/addresses/(:num)']['delete']        = 'api/addresses/delete/$1';

// Reviews
$route['api/v1/reviews']['get']                    = 'api/reviews/index';
$route['api/v1/reviews']['post']                   = 'api/reviews/create';
$route['api/v1/reviews/(:num)/hide']['post']       = 'api/reviews/hide/$1';

// OTP (centralized — server-key gated)
$route['api/v1/otp/send']['post']                  = 'api/otp/send';
$route['api/v1/otp/verify']['post']                = 'api/otp/verify';

// Notifications + push (JWT)
$route['api/v1/notifications']['get']              = 'api/notifications/index';
$route['api/v1/notifications/unread-count']['get'] = 'api/notifications/unread_count';
$route['api/v1/notifications/(:num)/read']['post'] = 'api/notifications/mark_read/$1';
$route['api/v1/notifications/read-all']['post']    = 'api/notifications/mark_all_read';
$route['api/v1/notifications/register-device']['post'] = 'api/notifications/register_device';

// Chat (JWT — user or guide)
$route['api/v1/chat/threads']['get']                       = 'api/chat/threads';
$route['api/v1/chat/threads']['post']                      = 'api/chat/ensure_thread';
$route['api/v1/chat/threads/(:num)/messages']['get']       = 'api/chat/messages/$1';
$route['api/v1/chat/threads/(:num)/messages']['post']      = 'api/chat/send/$1';
$route['api/v1/chat/threads/(:num)/read']['post']          = 'api/chat/read/$1';

// Customer dashboard
$route['api/v1/dashboard']['get']                  = 'api/dashboard/index';

// Guide onboarding (guide JWT)
$route['api/v1/guide/onboarding/document']['post']     = 'api/guide_onboarding/document';
$route['api/v1/guide/onboarding/bank-account']['post'] = 'api/guide_onboarding/bank_account';
$route['api/v1/guide/onboarding/availability']['post'] = 'api/guide_onboarding/availability';
$route['api/v1/guide/onboarding/status']['get']        = 'api/guide_onboarding/status';

// Coupons (JWT — quote against an amount before checkout)
$route['api/v1/coupons/quote']['post']             = 'api/coupons/quote';

// Platform config
$route['api/v1/platform/config']['get']            = 'api/platform_config/public_config';
$route['api/v1/admin/platform/config']['get']      = 'api/platform_config/admin_index';
$route['api/v1/admin/platform/config']['put']      = 'api/platform_config/admin_update';

// SEO overrides
$route['api/v1/seo']['get']                        = 'api/seo/index';
$route['api/v1/admin/seo']['get']                  = 'api/seo/admin_index';
$route['api/v1/admin/seo']['put']                  = 'api/seo/admin_upsert';

// Service catalog (public browse)
$route['api/v1/categories']['get']                = 'api/categories/index';
$route['api/v1/categories/(:any)']['get']         = 'api/categories/show/$1';
$route['api/v1/services']['get']                  = 'api/services/browse';

// Admin: category catalog CRUD
$route['api/v1/admin/categories']['get']           = 'api/categories/admin_index';
$route['api/v1/admin/categories']['post']          = 'api/categories/admin_create';
$route['api/v1/admin/categories/(:num)']['put']    = 'api/categories/admin_update/$1';
$route['api/v1/admin/categories/(:num)']['delete'] = 'api/categories/admin_delete/$1';

// Guide-side services (require guide JWT)
$route['api/v1/guide/services']['get']                  = 'api/services/mine';
$route['api/v1/guide/services']['post']                 = 'api/services/create';
$route['api/v1/guide/services/(:num)']['put']           = 'api/services/update/$1';
$route['api/v1/guide/services/(:num)']['delete']        = 'api/services/delete/$1';
$route['api/v1/guide/services/(:num)/toggle']['post']   = 'api/services/toggle/$1';
$route['api/v1/guide/services/bulk-replace']['post']    = 'api/services/bulk_replace';

// Elasticsearch admin tools
$route['api/v1/admin/elastic/ensure-indices']['post']       = 'api/elastic/ensure_indices';
$route['api/v1/admin/elastic/reindex/astrologers']['post']  = 'api/elastic/reindex_astrologers';
$route['api/v1/admin/elastic/reindex/pujas']['post']        = 'api/elastic/reindex_pujas';
$route['api/v1/admin/elastic/reindex/articles']['post']     = 'api/elastic/reindex_articles';

// Migration runner (visit in browser to run / seed)
$route['migrate']['get']      = 'migrate/index';
$route['migrate/seed']['get'] = 'migrate/seed';
