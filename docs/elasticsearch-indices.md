# Mileora — Elasticsearch indices

ES 8.x. All indices share the prefix `mileora_` (set via `ES_INDEX_PREFIX`).

| Index                  | Source         | Refresh trigger                         |
| ---------------------- | -------------- | --------------------------------------- |
| `mileora_astrologers`  | `astrologers`  | After insert/update via `Astrologer_model` (TODO: hook in) |
| `mileora_pujas`        | `pujas`        | After insert/update via `Puja_model`    |
| `mileora_articles`     | `articles`     | After publish via admin                 |

## Mapping highlights

- Custom analyzer **`mileora_text`** — standard tokenizer + lowercase + asciifolding + (where applicable) English stop + stemmer. Handles "Suresh" / "suresh" / "Sureshs" as one stem.
- Custom **`mileora_autocomplete`** edge n-gram analyzer on `name.ac` for typeahead suggestions (used by `/api/v1/search/suggest`).
- All `id` and `slug` fields are `keyword` (exact match, fast filter).
- Money + numeric facets (price, rating, experience) are typed for `range` queries.

## Reindexing from MySQL

A future `scripts/reindex.php` runs through every astrologer/puja/article row and pushes it to ES. Until then, after a schema/mapping change:

1. Delete the affected index in Kibana → Dev Tools (`DELETE /mileora_astrologers`).
2. Re-`PUT` the mapping (see `infra/elasticsearch/mappings/astrologers.json`).
3. Touch each row (e.g. `UPDATE astrologers SET updated_at = NOW()`) to force re-index.

## Search query patterns

- **Astrologer browse** — `bool { must: multi_match(name^3, bio, specialties^2, languages), filter: terms+range }`. Sort by `rating desc, _score`.
- **Autocomplete** — `match_phrase_prefix` on `name.ac`, returns top 5 per index, deduped by `slug`.
- **Article search** — `multi_match` on `title^3, excerpt, body, tags^2` with English stemming.

## Production hosting

Use **Elastic Cloud** or **Bonsai**. Self-hosting ES is doable but means managing JVM tuning, snapshots, and TLS — usually not worth it for a small team.
