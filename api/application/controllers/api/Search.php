<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Search extends MY_Controller
{
    public function __construct()
    {
        parent::__construct();
        $this->load->library('elasticsearch_service');
    }

    public function astrologers()
    {
        $q        = (string) $this->input->get('q');
        $page     = max(1, (int) $this->input->get('page'));
        $perPage  = min(50, max(1, (int) ($this->input->get('perPage') ?: 20)));
        $minPrice = (int) $this->input->get('minPrice');
        $maxPrice = (int) $this->input->get('maxPrice');
        $language = $this->input->get('language');
        $specialty = $this->input->get('specialty');

        $must = [];
        if ($q !== '') {
            $must[] = ['multi_match' => ['query' => $q, 'fields' => ['name^3', 'bio', 'specialties^2', 'languages']]];
        }
        $filter = [];
        if ($language)  $filter[] = ['term' => ['languages' => $language]];
        if ($specialty) $filter[] = ['term' => ['specialties' => $specialty]];
        if ($minPrice || $maxPrice) {
            $range = [];
            if ($minPrice) $range['gte'] = $minPrice * 100;
            if ($maxPrice) $range['lte'] = $maxPrice * 100;
            $filter[] = ['range' => ['price_per_session_paise' => $range]];
        }

        $body = [
            'from'  => ($page - 1) * $perPage,
            'size'  => $perPage,
            'query' => ['bool' => ['must' => $must ?: [['match_all' => (object) []]], 'filter' => $filter]],
            'sort'  => [['rating' => 'desc'], '_score'],
            'aggs'  => [
                'languages'   => ['terms' => ['field' => 'languages', 'size' => 20]],
                'specialties' => ['terms' => ['field' => 'specialties', 'size' => 20]],
            ],
        ];

        try {
            $res = $this->elasticsearch_service->search('astrologers', $body);
            $hits = array_map(fn($h) => $h['_source'] + ['_id' => $h['_id']], $res['hits']['hits'] ?? []);
            $this->ok($hits, [
                'total' => $res['hits']['total']['value'] ?? 0,
                'page'  => $page,
                'perPage' => $perPage,
                'aggregations' => $res['aggregations'] ?? new stdClass(),
            ]);
        } catch (\Throwable $e) {
            log_message('error', '[search] ES error: ' . $e->getMessage());
            $this->fail('SEARCH_UNAVAILABLE', 'Search is temporarily unavailable', 503);
        }
    }

    public function pujas()
    {
        $q = (string) $this->input->get('q');
        $body = [
            'size' => 20,
            'query' => $q !== ''
                ? ['multi_match' => ['query' => $q, 'fields' => ['name^3', 'description', 'temple', 'deity^2']]]
                : ['match_all' => (object) []],
        ];
        try {
            $res = $this->elasticsearch_service->search('pujas', $body);
            $hits = array_map(fn($h) => $h['_source'] + ['_id' => $h['_id']], $res['hits']['hits'] ?? []);
            $this->ok($hits, ['total' => $res['hits']['total']['value'] ?? 0]);
        } catch (\Throwable $e) {
            $this->fail('SEARCH_UNAVAILABLE', 'Search is temporarily unavailable', 503);
        }
    }

    public function articles()
    {
        $q = (string) $this->input->get('q');
        $body = [
            'size' => 20,
            'query' => $q !== ''
                ? ['multi_match' => ['query' => $q, 'fields' => ['title^3', 'excerpt', 'body', 'tags^2']]]
                : ['match_all' => (object) []],
        ];
        try {
            $res = $this->elasticsearch_service->search('articles', $body);
            $hits = array_map(fn($h) => $h['_source'] + ['_id' => $h['_id']], $res['hits']['hits'] ?? []);
            $this->ok($hits, ['total' => $res['hits']['total']['value'] ?? 0]);
        } catch (\Throwable $e) {
            $this->fail('SEARCH_UNAVAILABLE', 'Search is temporarily unavailable', 503);
        }
    }

    public function suggest()
    {
        $q = (string) $this->input->get('q');
        if ($q === '') { $this->ok([]); return; }

        $suggestions = [];
        foreach (['astrologers' => 'name', 'pujas' => 'name', 'articles' => 'title'] as $idx => $field) {
            try {
                $res = $this->elasticsearch_service->search($idx, [
                    'size' => 5,
                    'query' => ['match_phrase_prefix' => [$field => $q]],
                    '_source' => [$field, 'slug'],
                ]);
                foreach ($res['hits']['hits'] ?? [] as $h) {
                    $suggestions[] = [
                        'type'  => $idx,
                        'label' => $h['_source'][$field] ?? '',
                        'slug'  => $h['_source']['slug'] ?? '',
                    ];
                }
            } catch (\Throwable $e) { /* skip index */ }
        }
        $this->ok($suggestions);
    }
}
