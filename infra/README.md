# Mileora — local infrastructure

Docker Compose stack for local development. Run alongside (or instead of) XAMPP MySQL.

## Services

| Service        | URL                       | Credentials                          |
| -------------- | ------------------------- | ------------------------------------ |
| MySQL 8        | `localhost:3306`          | user `mileora` / pass `mileora`      |
| phpMyAdmin     | http://localhost:8081     | user `root` / pass `rootpass`        |
| Elasticsearch  | http://localhost:9200     | (security disabled for local)        |
| Kibana         | http://localhost:5601     | —                                    |

## Start

```powershell
docker compose up -d
```

## Apply Elasticsearch mappings

After ES is healthy:

```powershell
curl -X PUT http://localhost:9200/mileora_astrologers -H "Content-Type: application/json" -d "@elasticsearch/mappings/astrologers.json"
curl -X PUT http://localhost:9200/mileora_pujas       -H "Content-Type: application/json" -d "@elasticsearch/mappings/pujas.json"
curl -X PUT http://localhost:9200/mileora_articles    -H "Content-Type: application/json" -d "@elasticsearch/mappings/articles.json"
```

(Or import via Kibana → Dev Tools.)

## Stop / wipe

```powershell
docker compose down            # stop, keep data
docker compose down -v         # stop + delete volumes (full reset)
```

## Already running MySQL via XAMPP?

Comment out the `mysql:` and `phpmyadmin:` services in `docker-compose.yml`, and point the API at your XAMPP MySQL instead by editing `api/application/config/.env`:

```
DB_HOSTNAME=127.0.0.1
DB_USERNAME=root
DB_PASSWORD=
```
