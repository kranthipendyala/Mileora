<?php
// Drop-in replacement for api/application/config/config.php in production.
// Copy with:
//   cp deploy/config-production.php api/application/config/config.php
//
// Differences from dev:
//   - HTTPS-only base URL
//   - Stricter error reporting suppression
//   - Secure cookies
//   - Compressed output
//   - Higher log threshold (errors only)

defined('BASEPATH') OR exit('No direct script access allowed');

$config['base_url']     = $_ENV['SITE_URL'] ?? 'https://api.mileora.com/';
$config['index_page']   = 'index.php';
$config['uri_protocol'] = 'REQUEST_URI';
$config['url_suffix']   = '';
$config['language']     = 'english';
$config['charset']      = 'UTF-8';
$config['enable_hooks'] = TRUE;
$config['subclass_prefix'] = 'MY_';

$config['composer_autoload'] = FCPATH . 'vendor/autoload.php';

$config['permitted_uri_chars'] = 'a-z 0-9~%.:_\-';
$config['allow_get_array']     = TRUE;
$config['enable_query_strings'] = FALSE;

// Errors only in prod
$config['log_threshold']      = 1;
$config['log_path']           = APPPATH . 'logs/';
$config['log_file_extension'] = 'log';
$config['log_date_format']    = 'Y-m-d H:i:s';

$config['cache_path']     = APPPATH . 'cache/';
$config['encryption_key'] = $_ENV['ENCRYPTION_KEY'] ?? '';

// Sessions in DB for horizontal scaling
$config['sess_driver']             = 'database';
$config['sess_save_path']          = 'ci_sessions';
$config['sess_cookie_name']        = 'mileora_sess';
$config['sess_expiration']         = 86400;
$config['sess_match_ip']           = FALSE;
$config['sess_time_to_update']     = 300;
$config['sess_regenerate_destroy'] = FALSE;

$config['cookie_secure']   = TRUE;
$config['cookie_httponly'] = TRUE;
$config['cookie_samesite'] = 'Lax';

$config['csrf_protection'] = FALSE;     // JWT, not CSRF
$config['compress_output'] = TRUE;

// Add CloudFlare / your CDN proxy IPs here
$config['proxy_ips'] = $_ENV['PROXY_IPS'] ?? '';
