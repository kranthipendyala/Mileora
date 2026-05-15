<?php
defined('BASEPATH') OR exit('No direct script access allowed');

$active_group = 'default';
$query_builder = TRUE;

$db['default'] = [
    'dsn'      => '',
    'hostname' => $_ENV['DB_HOSTNAME'] ?? '127.0.0.1',
    'username' => $_ENV['DB_USERNAME'] ?? 'root',
    'password' => $_ENV['DB_PASSWORD'] ?? '',
    'database' => $_ENV['DB_DATABASE'] ?? 'mileora',
    'dbdriver' => 'mysqli',
    'dbprefix' => '',
    'pconnect' => FALSE,
    'db_debug' => (ENVIRONMENT !== 'production'),
    'cache_on' => FALSE,
    'cachedir' => '',
    'char_set' => $_ENV['DB_CHARSET'] ?? 'utf8mb4',
    'dbcollat' => $_ENV['DB_COLLAT'] ?? 'utf8mb4_unicode_ci',
    'swap_pre' => '',
    'encrypt'  => FALSE,
    'compress' => FALSE,
    'stricton' => FALSE,
    'failover' => [],
    'save_queries' => (ENVIRONMENT !== 'production'),
    'port'     => (int) ($_ENV['DB_PORT'] ?? 3306),
];
