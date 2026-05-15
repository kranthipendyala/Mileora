# Mileora Mobile (Expo · React Native)

iOS + Android app for Mileora. Talks to the same CodeIgniter 3 REST API as the Next.js web app.

## Setup

```powershell
cd c:\xampp2\htdocs\Mileora\mobile
copy .env.example .env
npm install
npx expo start
```

- Press `a` for Android emulator
- Press `i` for iOS simulator (macOS only)
- Or scan the QR code with the **Expo Go** app on your physical device

## Connecting to the local CI3 API

The default `EXPO_PUBLIC_API_URL=http://10.0.2.2/Mileora/api/index.php/api/v1` works for **Android emulator** (`10.0.2.2` is the host machine's loopback).

- iOS simulator → `http://localhost/Mileora/api/index.php/api/v1`
- Physical device on Wi-Fi → use your machine's LAN IP, e.g. `http://192.168.1.10/Mileora/api/index.php/api/v1`

## Folder layout

```
mobile/
├── app/                       # Expo Router (file-based routing)
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # Home
│   │   ├── astrologers.tsx    # Browse astrologers
│   │   ├── bookings.tsx
│   │   └── account.tsx
│   ├── astrologer/[slug].tsx  # Profile + book
│   └── puja/[slug].tsx
├── src/
│   └── lib/api.ts             # fetch wrapper (mirrors web/src/lib/api-client.ts)
├── assets/                    # icon, splash, adaptive-icon (placeholder)
├── app.json                   # Expo config
├── eas.json                   # EAS Build profiles (dev/preview/prod)
├── babel.config.js            # NativeWind + reanimated
├── tailwind.config.js         # Same palette as web
└── global.css                 # NativeWind entry
```

## Building & shipping

```powershell
npm install -g eas-cli
eas login
eas build --profile preview --platform all       # internal TestFlight / APK
eas build --profile production --platform all
eas submit --platform ios
eas submit --platform android
```

## Notes

- Razorpay native SDK (`react-native-razorpay`) requires a **dev build** (not Expo Go) the first time you wire it up. Run `eas build --profile development` and install the resulting build on your device.
- Push notifications: enable Expo Notifications later for daily horoscope nudges and booking confirmations.
- Shared types live in `../shared/src/` and are imported via the `@shared/*` alias.
