<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| Mileora — overrides only. Copy this file alongside CI3's stock config.php
| from vendor/codeigniter/framework/application/config/config.php and merge.
| The stock file is ~700 lines; we keep only the keys we change here.
*/

$config['base_url']      = $_ENV['SITE_URL'] ?? 'http://localhost/Mileora/api/';
$config['index_page']    = 'index.php';
$config['uri_protocol']  = 'REQUEST_URI';
$config['url_suffix']    = '';
$config['language']      = 'english';
$config['charset']       = 'UTF-8';
$config['enable_hooks']  = TRUE;
$config['subclass_prefix'] = 'MY_';

$config['composer_autoload'] = FCPATH . 'vendor/autoload.php';

$config['permitted_uri_chars'] = 'a-z 0-9~%.:_\-';
$config['allow_get_array']     = TRUE;
$config['enable_query_strings'] = FALSE;

$config['log_threshold'] = 2;          // 1=errors, 2=debug, 3=info, 4=all
$config['log_path']      = APPPATH . 'logs/';
$config['log_file_extension'] = 'log';
$config['log_date_format'] = 'Y-m-d H:i:s';

$config['cache_path'] = APPPATH . 'cache/';
$config['encryption_key'] = $_ENV['ENCRYPTION_KEY'] ?? 'replace-with-32-byte-random-key!!';

$config['sess_driver']            = 'files';
$config['sess_save_path']         = APPPATH . 'cache/sessions';
$config['sess_cookie_name']       = 'mileora_sess';
$config['sess_expiration']        = 7200;
$config['sess_match_ip']          = FALSE;
$config['sess_time_to_update']    = 300;
$config['sess_regenerate_destroy'] = FALSE;

$config['cookie_secure']   = (ENVIRONMENT === 'production');
$config['cookie_httponly'] = TRUE;
$config['cookie_samesite'] = 'Lax';

$config['csrf_protection'] = FALSE;     // disabled — JWT instead
$config['compress_output'] = (ENVIRONMENT === 'production');

$config['proxy_ips'] = '';
