# Lookout

Peer-to-peer car rentals from private hosts at all **63 U.S. national parks**. Guests book a local car in the gateway town. Hosts list from the park gate. Same account on the website, iPhone, and Android.

Live product includes sign-in, trips, host listings, ranger desk, Lookout Protection (a contractual waiver, not a licensed policy), help desk, claims, privacy/terms, and account deletion.

## Stack

- React 19 + [TanStack Start](https://tanstack.com/start) (file routes, server functions)
- Tailwind CSS v4
- Better Auth (Google, X, email/password)
- Postgres (Neon in production, PGLite in preview)
- Capacitor 8 — iOS and Android store wrap (no Mac required; GitHub Actions compiles iPhone)

## Run

```bash
npm install
npm run dev
```

```bash
npm run build
npm run typecheck
```

## What’s in the app

| Path | What it does |
|---|---|
| `/` | Homepage — park search, featured cars |
| `/parks` | All 63 parks, region filters |
| `/parks/:parkSlug` | Park page + local fleet |
| `/cars` | Fleet with filters |
| `/cars/:carId` | Detail, calendar, protection, book |
| `/login` | Google, X, or email |
| `/account` | Profile, your cars, delete account |
| `/trips` | Confirmed trips |
| `/host` | List a car |
| `/admin` | Ranger desk (first account) |
| `/protection` | Trail / Ridge / Summit waiver |
| `/help` · `/support` · `/claims` | Help, tickets, incidents |
| `/privacy` · `/terms` | Store-required legal |
| `/get-the-app` | Home-screen install + App Store / Play wrap status |

Catalog: `src/lib/catalog.ts` + `src/lib/catalog-federal.ts`. Photography under `public/images/`.

## iPhone and Android

Home-screen install works today (Safari → Add to Home Screen; Chrome → Install app).

Native store shells live in `ios/` and `android/` (`app.lookout.parks`). Cloud build: `.github/workflows/store-build.yml`. Listing assets: `store/`. After Apple Developer ($99/yr) and Play Console ($25) accounts are ready, set GitHub variable `LOOKOUT_SERVER_URL` to the public Lookout origin.

## Import into Lovable

1. Create a Lovable project from this GitHub repo (`wgargan-glitch/lookout`).
2. Lovable’s default stack is Vite + React Router. This app uses **TanStack Start** (`src/routes/`, `src/router.tsx`, `createServerFn` in `src/lib/api.ts`). If the import doesn’t boot as-is, keep `src/` UI, `public/images`, and the catalog, then let Lovable rewire routing onto its template.
3. Auth and database need the platform’s `DATABASE_URL` and auth env, or a rewire. Do not commit `.env` files.

Lookout is not affiliated with the National Park Service.
