<?php
defined('BASEPATH') OR exit('No direct script access allowed');

use Elastic\Elasticsearch\ClientBuilder;
use Elastic\Elasticsearch\Client;

/**
 * Thin wrapper over the Elastic PHP client.
 * Index naming: {ES_INDEX_PREFIX}{name}, e.g. mileora_astrologers.
 */
class Elasticsearch_service
{
    private Client $client;
    private string $prefix;

    public function __construct()
    {
        $hosts = explode(',', (string) ($_ENV['ES_HOSTS'] ?? 'http://localhost:9200'));
        $builder = ClientBuilder::create()->setHosts($hosts);

        $user = $_ENV['ES_USERNAME'] ?? '';
        $pass = $_ENV['ES_PASSWORD'] ?? '';
        if ($user !== '' && $pass !== '') {
            $builder->setBasicAuthentication($user, $pass);
        }

        $this->client = $builder->build();
        $this->prefix = (string) ($_ENV['ES_INDEX_PREFIX'] ?? 'mileora_');
    }

    public function index_name(string $name): string
    {
        return $this->prefix . $name;
    }

    public function index(string $name, string|int $id, array $doc): void
    {
        $this->client->index([
            'index' => $this->index_name($name),
            'id'    => (string) $id,
            'body'  => $doc,
            'refresh' => 'wait_for',
        ]);
    }

    public function delete(string $name, string|int $id): void
    {
        try {
            $this->client->delete(['index' => $this->index_name($name), 'id' => (string) $id]);
        } catch (\Throwable $e) {
            // Safe to ignore — may already be gone.
        }
    }

    public function search(string $name, array $body): array
    {
        $res = $this->client->search([
            'index' => $this->index_name($name),
            'body'  => $body,
        ]);
        return $res->asArray();
    }

    public function ensure_index(string $name, array $mapping): void
    {
        $idx = $this->index_name($name);
        if (!$this->client->indices()->exists(['index' => $idx])->asBool()) {
            $this->client->indices()->create([
                'index' => $idx,
                'body'  => $mapping,
            ]);
        }
    }
}
