# Mileora API spec (CodeIgniter 4)

Base URL: `https://api.mileora.com/api/v1` (local: `http://localhost:8080/api/v1`)

All requests/responses are JSON. Auth via `Authorization: Bearer <jwt>` (user context) and/or `X-Mileora-Key: <server-key>` (server-to-server).

## Conventions
- Success: `{ "data": {...}, "meta": {...} }`
- Error: `{ "error": { "code": "STRING", "message": "..." }, "status": 4xx }`
- Pagination: `?page=1&perPage=20` → `meta: { page, perPage, total, totalPages }`
- Timestamps: ISO 8601 UTC.

---

## Auth

| Method | Endpoint              | Auth   | Description                          |
| ------ | --------------------- | ------ | ------------------------------------ |
| POST   | `/auth/register`      | server | Email + phone signup, sends OTP      |
| POST   | `/auth/verify-otp`    | server | Verifies OTP, returns JWT            |
| POST   | `/auth/login`         | server | Email/phone + password, returns JWT  |
| POST   | `/auth/refresh`       | user   | Refresh token                        |
| GET    | `/auth/me`            | user   | Current user profile                 |

## Astrologers

| Method | Endpoint                       | Auth   | Description                              |
| ------ | ------------------------------ | ------ | ---------------------------------------- |
| GET    | `/astrologers`                 | public | Paginated list (filters via query)       |
| GET    | `/astrologers/{slug}`          | public | Single astrologer profile + slots        |
| GET    | `/astrologers/{slug}/reviews`  | public | Reviews for an astrologer                |
| POST   | `/astrologers/{slug}/reviews`  | user   | Submit a review (after a booking)        |

## Pujas & Rituals

| Method | Endpoint              | Auth   | Description                          |
| ------ | --------------------- | ------ | ------------------------------------ |
| GET    | `/pujas`              | public | List all pujas (online + temple)     |
| GET    | `/pujas/{slug}`       | public | Puja detail + available dates        |

## Bookings

| Method | Endpoint                  | Auth | Description                                          |
| ------ | ------------------------- | ---- | ---------------------------------------------------- |
| POST   | `/bookings`               | user | Create pending booking → triggers Razorpay order     |
| GET    | `/bookings`               | user | List my bookings                                     |
| GET    | `/bookings/{id}`          | user | Booking detail                                       |
| POST   | `/bookings/{id}/cancel`   | user | Cancel (subject to policy → refund)                  |

## Payments

| Method | Endpoint                       | Auth   | Description                                |
| ------ | ------------------------------ | ------ | ------------------------------------------ |
| POST   | `/payments/verify`             | user   | Verify Razorpay signature → confirm booking |
| POST   | `/webhooks/razorpay`           | hmac   | Razorpay webhook (signature verified)       |

## Leads

| Method | Endpoint   | Auth   | Description                                    |
| ------ | ---------- | ------ | ---------------------------------------------- |
| POST   | `/leads`   | server | Capture lead (name, phone, interest, source)   |
| GET    | `/leads`   | admin  | List leads (admin dashboard)                   |

## Search (Elasticsearch-backed)

| Method | Endpoint                          | Auth   | Description                                    |
| ------ | --------------------------------- | ------ | ---------------------------------------------- |
| GET    | `/search/astrologers?q=...`       | public | Full-text + facet search                       |
| GET    | `/search/pujas?q=...`             | public | Search pujas + categories                      |
| GET    | `/search/articles?q=...`          | public | Search blog/knowledge-base content             |
| GET    | `/search/suggest?q=...`           | public | Autocomplete suggestions across all indices    |

## Reports / Calculators (lead magnets)

| Method | Endpoint               | Auth   | Description                              |
| ------ | ---------------------- | ------ | ---------------------------------------- |
| POST   | `/reports/kundli`      | server | Generate Vedic birth chart (server-side) |
| POST   | `/reports/numerology`  | server | Numerology number + interpretation       |
| POST   | `/reports/vasthu`      | server | Vasthu compass + recommendations         |

## Admin

| Method | Endpoint                     | Auth  | Description                          |
| ------ | ---------------------------- | ----- | ------------------------------------ |
| GET    | `/admin/dashboard`           | admin | KPIs: bookings, revenue, leads       |
| CRUD   | `/admin/astrologers`         | admin | Manage astrologer profiles           |
| CRUD   | `/admin/pujas`               | admin | Manage puja catalog                  |
| CRUD   | `/admin/articles`            | admin | Manage blog content                  |
