# Kimchi Premium — Mobile App

React Native / Expo mobile app for the Kimchi Premium (김치 프리미엄) cryptocurrency tracker.

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Environment Variables](#environment-variables)
3. [Security Checklist](#security-checklist)
4. [RevenueCat Setup](#revenuecat-setup)
5. [Expo Push Notifications Setup](#expo-push-notifications-setup)
6. [Build Commands](#build-commands)
7. [Architecture Notes](#architecture-notes)

---

## Setup Instructions

### Prerequisites

- Node.js 20+
- [Expo CLI](https://docs.expo.dev/get-started/installation/): `npm install -g expo-cli`
- [EAS CLI](https://docs.expo.dev/eas/): `npm install -g eas-cli`
- Xcode 15+ (for iOS builds)
- Android Studio (for Android builds)
- A physical device or simulator for testing

### Install dependencies

```bash
cd mobile
npm install
```

### Configure environment

```bash
cp .env.example .env
# Edit .env and fill in all required values (see Environment Variables section)
```

### Add required assets

Place the following files in `mobile/assets/` (see `assets/README.txt` for specs):

- `icon.png` (1024×1024)
- `splash-icon.png` (200×200)
- `adaptive-icon.png` (1024×1024, Android)
- `favicon.png` (32×32)
- `notification-icon.png` (96×96, Android, white on transparent)
- `coin-placeholder.png` (32×32)

### Run the development server

```bash
npm start          # Start Expo Go / Dev build
npm run ios        # Open in iOS Simulator
npm run android    # Open on Android Emulator
```

> **Note:** Push notifications and RevenueCat purchases require a physical device and a development build (`expo-dev-client`). They will not work in Expo Go.

### Create a development build (for push notifications + purchases)

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

Then install the build on your device and open it from there.

---

## Environment Variables

Copy `.env.example` to `.env` and set:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_BASE_URL` | Your deployed Next.js app URL (HTTPS, no trailing slash) |
| `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS` | RevenueCat iOS API key |
| `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID` | RevenueCat Android API key |
| `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID` | RevenueCat entitlement ID (default: `premium`) |
| `EXPO_PUBLIC_REVENUECAT_PRODUCT_ID_IOS` | App Store product identifier |
| `EXPO_PUBLIC_REVENUECAT_PRODUCT_ID_ANDROID` | Google Play product identifier |
| `EXPO_PUBLIC_PROJECT_ID` | EAS project ID (from `eas init`) |

All `EXPO_PUBLIC_` variables are inlined at build time. Never put secrets in `EXPO_PUBLIC_` variables.

---

## Security Checklist

### Network Security

- [x] HTTPS enforced in `src/api/client.ts` — throws `SecurityError` on `http://` URLs
- [x] 10-second AbortController timeout on all requests
- [x] Single retry on network error; no retry on 4xx/5xx
- [x] `NSAllowsArbitraryLoads: false` in `app.json` (iOS ATS)
- [x] `usesCleartextTraffic: false` in `app.json` (Android)
- [x] Android Network Security Config in `android/app/src/main/res/xml/network_security_config.xml`
- [ ] **TODO**: Replace certificate pin placeholders in `network_security_config.xml` with real SPKI hashes

### Data Storage

- [x] `expo-secure-store` used for all sensitive data (push token, alerts, subscription cache)
- [x] `AsyncStorage` is never used for sensitive data
- [x] Subscription status independently verified via RevenueCat on each app foreground

### Build Security

- [x] ProGuard / R8 enabled for Android release via `expo-build-properties`
- [x] Resource shrinking enabled for Android release
- [x] `minSdkVersion: 26` (Android 8.0+) — modern security baseline
- [x] `deploymentTarget: 15.1` (iOS 15.1+)

### Runtime Security

- [x] `suppressLogsInProduction()` called before any app code — overrides `console.log/warn/info/debug`
- [x] `console.error` preserved for crash reporters
- [x] Jailbreak/root detection in `src/services/security.ts` — warns user, does not block
- [x] All `__DEV__` logging gated so nothing appears in production builds

### Input Validation

- [x] Alert threshold validated: must be finite number, `0.1%–50%`
- [x] Coin symbol validated against allowlist
- [x] Alert direction validated (`above` | `below`)
- [x] Numeric inputs sanitized with `sanitizeNumericInput()` before `parseFloat()`

### Code Secrets

- [x] No API keys or secrets in client code
- [x] All configuration from `EXPO_PUBLIC_` env vars (inlined at build time)
- [x] `.env` file in `.gitignore` (never committed)

### Android Certificate Pinning

To set up certificate pinning:

1. Get your domain's leaf certificate SPKI hash:
   ```bash
   openssl s_client -connect your-domain.com:443 </dev/null \
     | openssl x509 -pubkey -noout \
     | openssl pkey -pubin -outform DER \
     | openssl dgst -sha256 -binary \
     | base64
   ```
2. Get the CA/intermediate certificate SPKI hash similarly (use the CA cert file).
3. Replace the `REPLACE_WITH_YOUR_*` placeholders in `android/app/src/main/res/xml/network_security_config.xml`.
4. Update the `expiration` date to at least 1 year past your cert's expiry.
5. Also replace `your-domain.com` with your actual domain.

**iOS Certificate Pinning:** Use `TrustKit` or a custom `NSURLSessionDelegate`. The current iOS setup uses ATS (App Transport Security) which enforces TLS 1.2+ but does not pin. For production-grade pinning, integrate TrustKit as a native module.

---

## RevenueCat Setup

1. **Create a RevenueCat account** at [app.revenuecat.com](https://app.revenuecat.com)

2. **Create a new Project** in the RevenueCat dashboard.

3. **Add your apps:**
   - iOS: Set the Bundle ID to `com.kimchipremium.app` (or your custom ID from `app.json`)
   - Android: Set the Package Name to `com.kimchipremium.app`

4. **Create Products** in the stores:
   - iOS (App Store Connect):
     - Go to your app → In-App Purchases → Create a new Auto-Renewable Subscription
     - Product ID: `kimchipremium_monthly` (must match `EXPO_PUBLIC_REVENUECAT_PRODUCT_ID_IOS`)
   - Android (Google Play Console):
     - Go to your app → Monetize → Subscriptions → Create subscription
     - Product ID: `kimchipremium_monthly`

5. **Create an Entitlement** in RevenueCat:
   - Name: `premium` (must match `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID`)
   - Attach both products to this entitlement

6. **Create an Offering** in RevenueCat:
   - Create a default offering and add a package that wraps your monthly product

7. **Copy API keys** from RevenueCat → Project Settings → API Keys:
   - Copy the iOS public key → `EXPO_PUBLIC_REVENUECAT_API_KEY_IOS`
   - Copy the Android public key → `EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID`

8. **Test purchases:**
   - iOS: Use Sandbox testing with a Sandbox Apple ID
   - Android: Add yourself as a licensed tester in Google Play Console

---

## Expo Push Notifications Setup

### 1. Initialize EAS

```bash
eas login
eas init   # Follow prompts — this creates the projectId in app.json
```

Copy the generated `projectId` to `EXPO_PUBLIC_PROJECT_ID` in your `.env`.

### 2. Configure credentials

**iOS:**
```bash
eas credentials  # Select iOS → manage push key
# EAS will create or upload an APNs key automatically
```

**Android:**
- Download `google-services.json` from Firebase Console (your project → Project Settings → Your apps → Android)
- Place it at `mobile/google-services.json`
- It's referenced in `app.json` as `"googleServicesFile": "./google-services.json"`

### 3. Build a development build

Push tokens are only available on physical devices with a real development or production build:

```bash
eas build --platform ios --profile development
eas build --platform android --profile development
```

### 4. Testing push notifications

Use the [Expo Push Notification Tool](https://expo.dev/notifications) with a token from your device:

```bash
# The token is printed to the console in __DEV__ mode when registerForPushNotifications() runs
# Format: ExponentPushToken[xxxxxxxxxxxxxxxxxxxxx]
```

### 5. Server-side push (recommended for background alerts)

For reliable background alerts, implement server-side push using the Expo Push API:

```javascript
// Server (Node.js example)
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

const messages = [{
  to: 'ExponentPushToken[xxxxxxx]',
  sound: 'default',
  title: '🌶️ BTC Premium Alert',
  body: 'BTC premium crossed +2.00% vs Binance',
  data: { symbol: 'BTC', premium: 2.15 },
}];

const chunks = expo.chunkPushNotifications(messages);
for (const chunk of chunks) {
  await expo.sendPushNotificationsAsync(chunk);
}
```

---

## Build Commands

### Development

```bash
npm start                           # Start Metro bundler (Expo Go)
npm run ios                         # iOS Simulator
npm run android                     # Android Emulator
npm run type-check                  # TypeScript type checking
npm run lint                        # ESLint
```

### Preview builds (internal testing)

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

### Production builds

```bash
# iOS (submits to App Store Connect for TestFlight / release)
eas build --platform ios --profile production

# Android (generates AAB for Google Play)
eas build --platform android --profile production

# Both platforms simultaneously
eas build --platform all --profile production
```

### Submit to stores

```bash
eas submit --platform ios      # Submit to App Store Connect
eas submit --platform android  # Submit to Google Play
```

### OTA Updates (no store review required for JS-only changes)

```bash
eas update --branch production --message "Fix premium calculation"
```

---

## Architecture Notes

### Data Flow

```
SWR (5s refresh) → fetchPrices() → apiGet() (HTTPS enforced, 10s timeout)
                 → setCoins() → Zustand store
                 → checkAndSendAlerts() → expo-notifications (local)
```

### Persistence

- **Alerts, language, exchange** → `expo-secure-store` (Keychain / EncryptedSharedPreferences)
- **Push token** → `expo-secure-store`
- **Premium status** → `expo-secure-store` (cache) + RevenueCat (source of truth)
- **Coin prices** → in-memory only (SWR cache, not persisted)

### Why not zustand/persist?

`zustand/middleware/persist` defaults to `AsyncStorage`, which is unencrypted plaintext on disk. On a rooted or jailbroken device, any app can read it. We manually persist to `expo-secure-store` instead, which uses the platform's hardware-backed keystore.

### Background alerts (iOS limitation)

iOS restricts background fetch to run only when the OS decides (typically every 15–30+ minutes). For real-time premium alerts while the app is backgrounded, you must implement server-side push notifications. See the [Expo Push Notifications Setup](#expo-push-notifications-setup) section.

### Ad integration (future)

The free tier is ad-supported. To integrate ads:
1. Install `react-native-google-mobile-ads`
2. Gate ad display behind `!isPremium` from the Zustand store
3. Add AdMob app IDs to `app.json` under the `react-native-google-mobile-ads` plugin config
