# Instant Photo — Photographer (Partner) app

Location-based photographer booking app, photographer side. React + TypeScript, packaged for Android with Capacitor.

## Status

UI-only pass — all screens are built and wired together with mock data (`src/mock/data.ts`). No backend calls yet. `App.tsx` starts on `Home` (simulating an already-approved photographer); set its initial screen to `'login'` to preview the full onboarding flow.

## Screens (`src/screens/`)

1. **Login** — mobile number + OTP (Firebase Phone Auth, mocked)
2. **Register** — profile photo, name, address + KYC (Aadhar, PAN) upload
3. **PendingApproval** — shown while admin reviews KYC; account inactive until approved
4. **Home** — profile summary, online/offline toggle, today's/week's earnings
5. **EditProfile** — edit photo, name, address (mobile locked)
6. **Incoming** — full-screen incoming-request alert with ringing animation + 15s countdown, Accept/Decline
7. **Active** — accepted booking: customer contact, map/route card, status stepper (Accepted → On the way → Arrived → Completed)

## Next (backend wiring)

- `POST /auth/otp-request.php` / `POST /auth/otp-verify.php` → `Login.tsx`
- `POST /photographers/register.php` (multipart, KYC files) → `Register.tsx`
- `GET /photographers/me.php` polling or push → `PendingApproval.tsx` auto-navigates once `kycStatus` is `approved`
- `POST /photographers/status.php` (online/offline) + a background location watch (every 5–10s) sending lat/lng while online → `Home.tsx`
- Realtime booking broadcast (Firebase Cloud Messaging, high-priority data message + full-screen intent so the phone rings even when locked) → drives `Incoming.tsx`
- `POST /bookings/accept.php` — must be an atomic "first accept wins" update on the server; a late accept should show "already assigned" instead of navigating to Active
- `POST /bookings/update-status.php` → each step button in `Active.tsx`
- `POST /photographers/update-profile.php` → `EditProfile.tsx`'s save

## Dev

```bash
npm install
npm run dev        # http://localhost:5174
npm run build       # type-checks + builds to dist/
npm run cap:sync    # sync web build into the Capacitor Android shell
npm run cap:android # open the Android project in Android Studio
```

> Note: dependencies couldn't be installed from the environment this was built in (registry access is blocked there), so the build hasn't been verified by a real `tsc`/`vite build` run — the GitHub Actions workflow (`.github/workflows/build-android.yml`) builds and produces a debug APK on every push to `main`.
