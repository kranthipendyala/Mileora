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
// Dev ports 3000–3010 are all whitelisted because Next.js falls forward to
// the next available port when the previous one is held by an orphan process.
$config['allowed_cors_origins'] = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:3006',
    'http://localhost:3007',
    'http://localhost:3008',
    'http://localhost:3009',
    'http://localhost:3010',
    'https://mileora.com',
    'https://www.mileora.com',
    'https://staging.mileora.com',
];
