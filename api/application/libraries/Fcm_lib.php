<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use GuzzleHttp\Client;

/**
 * Firebase Cloud Messaging — sends push notifications to user devices.
 * Uses the HTTP v1 API. Requires a Google service-account JSON path in
 * $_ENV['FCM_SA_PATH'] and the project id in $_ENV['FCM_PROJECT_ID'].
 *
 * For local dev / staging without FCM credentials, send() is a no-op
 * and logs the message instead — keeps the flow walkable.
 */
class Fcm_lib
{
    private ?string $project_id;
    private ?string $sa_path;
    private Client $http;

    public function __construct()
    {
        $this->project_id = $_ENV['FCM_PROJECT_ID'] ?? null;
        $this->sa_path    = $_ENV['FCM_SA_PATH'] ?? null;
        $this->http = new Client(['timeout' => 10]);
    }

    /**
     * Send a notification to one device token.
     * @return bool true if a real send occurred (or stubbed in non-prod)
     */
    public function send(string $token, string $title, string $body, array $data = []): bool
    {
        if (!$this->project_id || !$this->sa_path || !file_exists($this->sa_path)) {
            log_message('info', "[FCM stub] {$title} → " . substr($token, 0, 12) . '...');
            return ENVIRONMENT !== 'production';
        }

        try {
            $access = $this->get_access_token();
            $url = "https://fcm.googleapis.com/v1/projects/{$this->project_id}/messages:send";
            $this->http->post($url, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $access,
                    'Content-Type'  => 'application/json',
                ],
                'json' => [
                    'message' => [
                        'token'        => $token,
                        'notification' => ['title' => $title, 'body' => $body],
                        'data'         => array_map('strval', $data),
                    ],
                ],
            ]);
            return true;
        } catch (\Throwable $e) {
            log_message('error', '[FCM] send failed: ' . $e->getMessage());
            return false;
        }
    }

    public function send_multi(array $tokens, string $title, string $body, array $data = []): int
    {
        $ok = 0;
        foreach ($tokens as $t) {
            if ($this->send($t, $title, $body, $data)) $ok++;
        }
        return $ok;
    }

    /**
     * OAuth2 access token from service-account JSON.
     * Tokens are short-lived (1h) — caching could be added later.
     */
    private function get_access_token(): string
    {
        $sa = json_decode((string) file_get_contents((string) $this->sa_path), true);
        if (!$sa) throw new \RuntimeException('Bad FCM SA file');

        $now = time();
        $claim = [
            'iss'   => $sa['client_email'],
            'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
            'aud'   => 'https://oauth2.googleapis.com/token',
            'iat'   => $now,
            'exp'   => $now + 3600,
        ];

        $jwt = $this->jwt_rs256($claim, $sa['private_key']);
        $res = $this->http->post('https://oauth2.googleapis.com/token', [
            'form_params' => [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion'  => $jwt,
            ],
        ]);
        $body = json_decode((string) $res->getBody(), true);
        return (string) ($body['access_token'] ?? '');
    }

    private function jwt_rs256(array $claim, string $private_key): string
    {
        $header = $this->b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT']));
        $body   = $this->b64(json_encode($claim));
        $input  = $header . '.' . $body;
        $sig    = '';
        openssl_sign($input, $sig, $private_key, OPENSSL_ALGO_SHA256);
        return $input . '.' . $this->b64($sig);
    }

    private function b64(string $s): string
    {
        return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
    }
}
