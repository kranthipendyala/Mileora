# Mileora — Database schema

MySQL 8 (`utf8mb4 / utf8mb4_unicode_ci`). All tables `InnoDB`. Migrations in `api/application/migrations/`.

## ER overview

```
users (1) ─── (∞) bookings (∞) ─── (1) astrologers / pujas
                  │
                  └── (1) ── (∞) payments

astrologers (1) ─── (∞) astrologer_slots
astrologers (1) ─── (∞) reviews ──── (∞) ── (1) users

pujas (1) ─── (∞) puja_schedules

leads (standalone)
articles (standalone, indexed in ES)
```

## Tables

### users
| col                | type                                        | notes                       |
| ------------------ | ------------------------------------------- | --------------------------- |
| id                 | INT UNSIGNED PK AI                          |                             |
| name               | VARCHAR(120)                                |                             |
| phone              | VARCHAR(15) UNIQUE                          | India: 10-digit + optional +91 |
| email              | VARCHAR(190) NULL                           |                             |
| role               | ENUM(user, astrologer, admin)               | default `user`              |
| phone_verified_at  | DATETIME NULL                               |                             |
| otp_hash           | VARCHAR(190) NULL                           | bcrypt of OTP               |
| otp_expires_at     | DATETIME NULL                               |                             |
| created_at, updated_at | DATETIME                                |                             |

### astrologers
| col                       | type                              |
| ------------------------- | --------------------------------- |
| id                        | INT PK                            |
| slug                      | VARCHAR(160) UNIQUE               |
| name, bio, photo_url      |                                   |
| specialties               | VARCHAR(500)  CSV: vedic,kp,…     |
| languages                 | VARCHAR(200)  CSV: english,tamil…  |
| experience_years          | TINYINT                           |
| rating                    | DECIMAL(3,2)                      |
| reviews_count             | INT                               |
| price_per_session_paise   | INT  (₹ × 100)                    |
| session_minutes           | SMALLINT                          |
| status                    | ENUM(active, paused, draft)       |

### astrologer_slots
`(id, astrologer_id, starts_at, ends_at, status)` — scheduling.

### reviews
`(id, astrologer_id, user_id, rating 1-5, body, created_at)`

### pujas
`(id, slug, name, deity, temple, city, description, image_url, price_paise, duration_minutes, features JSON, featured, status)`

### puja_schedules
`(id, puja_id, starts_at, capacity, booked, status)` — recurring or one-off available dates.

### bookings
| col                  | type                                                    |
| -------------------- | ------------------------------------------------------- |
| id                   | INT PK                                                  |
| type                 | ENUM(consultation, puja, report)                        |
| item_id              | INT (astrologer_id or puja_id, depending on `type`)     |
| item_slug            | VARCHAR(160)                                            |
| slot_iso             | DATETIME NULL                                           |
| amount_paise         | INT                                                     |
| currency             | CHAR(3) default 'INR'                                   |
| status               | ENUM(pending, confirmed, failed, cancelled, refunded)   |
| razorpay_order_id    | VARCHAR(80) NULL                                        |
| razorpay_payment_id  | VARCHAR(80) NULL                                        |
| user_name, user_phone, user_email |                                            |
| created_at, updated_at, confirmed_at, cancelled_at |                              |

### payments
`(id, booking_id, razorpay_order_id, razorpay_payment_id, amount_paise, currency, status, method, created_at)`

### leads
`(id, name, phone, email, interest, source, status, assigned_to, notes, created_at, updated_at)`

### articles
Blog/knowledge-base posts; mirrored to ES `articles` index.

## Conventions

- **Money** is stored in **paise** (smallest INR unit) as `INT UNSIGNED`. Display layer divides by 100. Avoid `DECIMAL` to dodge rounding bugs in checkout math.
- **Times** are stored as `DATETIME` UTC. PHP returns ISO 8601 to clients; clients format in IST.
- **Booleans** are `TINYINT(1)` because phpMyAdmin renders ENUMs awkwardly.
- **Soft deletes:** not used. Use `status` columns (`paused`, `cancelled`, `draft`) for visibility control.
- **Indexes:** added on every FK-ish column + columns used in WHERE / ORDER BY in our controllers.

## Backups

- phpMyAdmin → Export → Custom → SQL → gzip. Daily for prod.
- Or `mysqldump --single-transaction --routines --triggers mileora > mileora-YYYY-MM-DD.sql.gz`.
