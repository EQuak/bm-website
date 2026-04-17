# Mobile app (Expo)

React Native app using [Expo](https://expo.dev/) SDK 54, [Expo Router](https://docs.expo.dev/router/introduction/), and shared packages from this monorepo (`@repo/api`, `@repo/db`, etc.).

## Prerequisites

- **Node.js** — v22 recommended (see repo root `.nvmrc`); `>=20` is required.
- **pnpm** — same version as the repo (`packageManager` in root `package.json`).
- **For iOS (simulator or device):** Xcode (macOS) and CocoaPods tooling as needed for native builds.
- **For Android:** Android Studio (SDK, emulator, or USB debugging).

Install dependencies from the **repository root** (not only `apps/mobile`):

```bash
pnpm install
```

## Environment variables

`app.config.ts` loads `.env` from the repo root (`../../.env` or `../../../.env`) and maps Supabase settings into `extra` for the app.

Set at least:

| Variable | Notes |
| -------- | ----- |
| `EXPO_PUBLIC_SUPABASE_URL` | Preferred for this app |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Preferred for this app |

If those are missing, the config falls back to `NEXT_PUBLIC_SUPABASE_*` or `SUPABASE_URL` / `SUPABASE_ANON_KEY`, so you can often reuse the same `.env` as the web app.

`env.ts` reads values from `Constants.expoConfig.extra`. In production builds, invalid env can throw; in development, missing values may only warn in the console.

## Run the dev server

From **this directory**:

```bash
pnpm start
```

Or from the **repo root**:

```bash
pnpm --filter mobile start
```

This starts the Metro bundler and prints a QR code (Expo Go) and shortcuts for platforms.

### Useful scripts

| Command | Description |
| ------- | ----------- |
| `pnpm start` | `expo start` — interactive dev UI |
| `pnpm dev:mobile` | `expo start -c` — same with **cache cleared** (use when things look stale) |
| `pnpm ios` | Start and open **iOS** simulator (macOS) |
| `pnpm android` | Start and open **Android** emulator |
| `pnpm web` | Run in the **browser** (Metro web bundler) |
| `pnpm typecheck` | `tsc --noEmit` |

### Physical device (Expo Go)

1. Install **Expo Go** from the App Store or Play Store.
2. Run `pnpm start` on your machine.
3. Scan the QR code (Android: Expo Go; iOS: Camera app, then open in Expo Go).

Your phone must reach your dev machine (same Wi‑Fi, or tunnel mode if you use Expo’s tunnel option in the CLI).

## Troubleshooting

- **Env not applied:** Restart Metro after changing `.env`; for stubborn cache issues use `pnpm dev:mobile`.
- **Workspace packages out of date:** Run `pnpm install` from the repo root after pulling changes.
- **Type errors:** Run `pnpm typecheck` from `apps/mobile`.

## Project layout (short)

- `src/app/` — Expo Router routes (`(auth)`, `(application)`, etc.)
- `src/components/` — UI and forms
- `src/utils/` — Supabase client, helpers
- `app.config.ts` — Expo app name, icons, `extra` env wiring
- `assets/` — Icons and splash images
