<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| chriskacerguis/codeigniter-restserver config — only the keys we customize.
| Copy the package's full rest.php from vendor/chriskacerguis/codeigniter-restserver/src/config/rest.php
| and merge these overrides on top.
*/

$config['rest_default_format'] = 'json';
$config['force_https']         = (ENVIRONMENT === 'production');

$config['rest_auth']           = FALSE;        // We use JWT in our own filter, not REST_Controller's basic auth
$config['allow_auth_and_keys'] = TRUE;
$config['rest_enable_keys']    = FALSE;        // Mileora uses one server-key in headers, not the keys table

$config['rest_enable_logging'] = (ENVIRONMENT !== 'production');
$config['rest_logs_table']     = 'rest_logs';

$config['allowed_cors_headers'] = [
    'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization',
    'X-Mileora-Key',
];
$config['allowed_cors_methods'] = ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'];
$config['check_cors']           = TRUE;
$config['allow_any_cors_domain'] = FALSE;
$config['allowed_cors_origins'] = [
    'http://localhost:3000',
    'https://mileora.com',
    'https://staging.mileora.com',
    'https://www.mileora.com',
];
