<?php
/**
 * Mileora API — CodeIgniter 3 front controller (PHP 8.1).
 *
 * This is a minimal, opinionated bootstrap. The full CI3 framework
 * (`system/`) must be downloaded once via:
 *
 *   composer install
 *   # then copy vendor/codeigniter/framework/system to ./system
 *   # and vendor/codeigniter/framework/application/* defaults you don't
 *   # already override into ./application
 *
 * On a fresh CI3 install the file you're reading replaces CI3's stock
 * `index.php` — we add PHP-8.1-friendly error handling and dotenv loading.
 */

// 1. Environment ------------------------------------------------------------
$envFile = __DIR__ . '/application/config/.env';
if (file_exists($envFile) && class_exists(\Dotenv\Dotenv::class)) {
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/application/config', '.env');
    $dotenv->safeLoad();
}

define('ENVIRONMENT', $_ENV['CI_ENV'] ?? $_SERVER['CI_ENV'] ?? 'development');

switch (ENVIRONMENT) {
    case 'development':
        // PHP 8.1 + CI3 = noisy deprecations. Show errors but skip notices.
        error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED & ~E_NOTICE);
        ini_set('display_errors', '1');
        break;
    case 'testing':
    case 'production':
        ini_set('display_errors', '0');
        error_reporting(E_ERROR | E_PARSE | E_WARNING);
        break;
    default:
        http_response_code(503);
        echo 'The application environment is not set correctly.';
        exit(1);
}

// 2. Composer autoload ------------------------------------------------------
$autoload = __DIR__ . '/vendor/autoload.php';
if (file_exists($autoload)) {
    require_once $autoload;
}

// 3. CI3 path constants -----------------------------------------------------
$system_path = 'system';
$application_folder = 'application';

define('SELF', pathinfo(__FILE__, PATHINFO_BASENAME));
define('BASEPATH', str_replace('\\', '/', __DIR__ . '/' . $system_path . '/'));
define('FCPATH', __DIR__ . '/');
define('SYSDIR', basename(BASEPATH));
define('APPPATH', __DIR__ . '/' . $application_folder . '/');
define('VIEWPATH', APPPATH . 'views/');

// 4. Boot CI3 ---------------------------------------------------------------
if (!is_dir(BASEPATH)) {
    http_response_code(500);
    echo 'CodeIgniter system folder is missing. Run `composer install` and copy '
        . 'vendor/codeigniter/framework/system to ./system.';
    exit(1);
}

require_once BASEPATH . 'core/CodeIgniter.php';
