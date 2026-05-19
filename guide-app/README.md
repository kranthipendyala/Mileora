# Mileora Guide — operator mobile app

React Native (Expo) app for **guides** — astrologers, jothidars, vasthu experts, pujari — to manage their bookings, conversations with seekers, availability, and payouts.

Companion to:
- **`/mobile/`** — customer-facing app (seekers browse + book guides)
- **`/web/`** at `/guide/*` — the desktop web portal for guides

All three talk to the same CI3 backend with role-scoped JWTs.

## App identity

| | |
|---|---|
| App name | Mileora Guide |
| Bundle ID | `com.mileora.guide` |
| Expo slug | `mileora-guide` |
| Deep-link scheme | `mileoraguide://` |

Distinct from the customer app so they can be installed side by side and have independent push tokens.

## Setup

```powershell
cd c:\xampp2\htdocs\Mileora\guide-app
copy .env.example .env
npm install
npx expo start
```

- Press `a` for Android emulator (uses `EXPO_PUBLIC_API_URL=http://10.0.2.2/...`)
- Press `i` for iOS simulator
- Scan QR with **Expo Go** on a real device

## Folder layout

```
guide-app/
├── app/                             # expo-router
│   ├── _layout.tsx                  # Stack + QueryClient + SafeArea + StatusBar
│   ├── (tabs)/
│   │   ├── _layout.tsx              # 4 tabs: Dashboard, Bookings, Earnings, Profile
│   │   ├── index.tsx                # Dashboard — KPIs + upcoming consultations
│   │   ├── bookings.tsx             # Filterable list (upcoming / completed / cancelled)
│   │   ├── earnings.tsx             # Payouts (next + history + CSV download)
│   │   └── profile.tsx              # Profile + KYC + weekly availability + pause toggle
│   ├── booking/[id].tsx             # Booking detail — customer, birth details, video/chat/call
│   └── chat/[threadId].tsx          # 1:1 chat thread with the customer
├── src/lib/
│   ├── api.ts                       # fetch wrapper with guide JWT auto-attached
│   └── format.ts                    # formatINR, timeAgo, fmtTime
├── app.json                         # Expo config (bundle id, splash, icons)
├── eas.json                         # EAS Build profiles (dev / preview / prod)
├── babel.config.js                  # NativeWind + Reanimated
├── tailwind.config.js               # Shared color palette with web
├── global.css                       # Tailwind directives
└── .env.example                     # EXPO_PUBLIC_API_URL etc.
```

## Wiring with the backend

Every screen has `// TODO: api.get(...)` comments where the mock data lives. Once CI3 is reachable, swap with:

- Dashboard      → `GET /api/v1/guide/dashboard`
- Bookings list  → derives from `GET /api/v1/guide/dashboard`
- Booking detail → `GET /api/v1/bookings/{id}` (with guide JWT)
- Earnings       → `GET /api/v1/guide/earnings` *(endpoint to add)*
- Profile        → `GET /api/v1/guide/me`
- Availability   → `POST /api/v1/guide/onboarding/availability`
- Chat list      → `GET /api/v1/chat/threads`
- Chat thread    → `GET /api/v1/chat/threads/{id}/messages` and `POST /messages`

Auth flow (to be added in a follow-up):
1. Phone OTP → `POST /auth/expert/send-otp` then `/auth/expert/verify` (these are the existing CI3 endpoints; we kept `expert_send_otp` in `api/Auth.php` even after the `vendor→guide` rename — those will be aliased to `guide_send_otp` in the next CI3 round).
2. Store token via `setGuideToken()` in `src/lib/api.ts` and a persistent store (AsyncStorage / SecureStore — to be wired).
3. App boot reads token from store, attaches to every request.

## Build for distribution

```powershell
npm install -g eas-cli
eas login
eas build --profile development --platform android      # internal dev build (needed for native modules like razorpay)
eas build --profile preview     --platform all          # internal TestFlight / APK
eas build --profile production  --platform all
eas submit --platform ios
eas submit --platform android
```

## Pending

- Persistent token storage (AsyncStorage)
- Push notifications (Expo Push or Firebase) — wire into the CI3 `device_tokens` table
- In-app video calling integration (Zoom SDK / Twilio Video / Daily) — currently the "Start video call" button shows an alert
- Real BFF wiring (every screen currently uses mock data; comments mark the swap site)
- Login flow (currently the app launches straight into the tabs — needs a `/auth/login` modal before the Stack)
