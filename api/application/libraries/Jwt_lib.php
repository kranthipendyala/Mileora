<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class Jwt_lib
{
    private string $secret;
    private string $issuer;
    private int $ttl;

    public function __construct()
    {
        $this->secret = (string) ($_ENV['JWT_SECRET'] ?? 'change-me');
        $this->issuer = (string) ($_ENV['JWT_ISSUER'] ?? 'mileora.com');
        $this->ttl    = (int) ($_ENV['JWT_TTL_SECONDS'] ?? 86400);
    }

    public function encode(array $claims): string
    {
        $now = time();
        $payload = array_merge([
            'iss' => $this->issuer,
            'iat' => $now,
            'nbf' => $now,
            'exp' => $now + $this->ttl,
        ], $claims);
        return JWT::encode($payload, $this->secret, 'HS256');
    }

    public function decode(string $token): object
    {
        return JWT::decode($token, new Key($this->secret, 'HS256'));
    }
}
