# Nachódex — A Nachological Survey

A bold, hand-crafted field journal for the lifelong nacho enthusiast. Track
every plate worth remembering, score it across four dimensions, and watch the
data become charts and pins on a map.

Built with Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 ·
Motion · Recharts · Leaflet · Firebase Admin · Google Places.

## What's inside

- **Dashboard (`/`)** — animated stat cards, a hand-tinted world map with
  custom tortilla-chip pins, score-distribution bar chart, dimension radar,
  monthly area chart, reviewer-share split, leaderboard and recent feed.
- **Reviews archive (`/reviews`)** — searchable, filterable, sortable card
  grid with hover animation and a chip-based score visualisation.
- **Submit (`/submit`)** — a multi-step form with a Google Places typeahead
  for the restaurant (the same flow as the previous Streamlit version) and
  an interactive scoring guide. Submissions land in the approval queue.
- **Admin (`/admin`)** — password-gated approval queue (default password is
  `queso`). Approve moves a plate from `pending_reviews` to
  `approved_reviews`; reject deletes it.

## Database

By default the app uses **Firestore** with two collections — matching the
previous version of this site for forward compatibility:

- `pending_reviews` — submissions awaiting approval.
- `approved_reviews` — public reviews shown on the dashboard.

Each document is keyed by an 8-character `review_id` and uses the same field
names as the previous app (`name`, `meal`, `meal_description`,
`quantity_score`, `taste_score`, `atmosphere_score`, `overall_score`,
`reviewer`, `price`, `comments`, `date`, `latitude`, `longitude`) plus a new
optional `currency` field. Legacy records without `currency` default to
`GBP`.

If no Firestore credentials are configured, the app silently falls back to a
local JSON file at `data/reviews.json`, seeded from `data/reviews.seed.ts`.
This makes local dev frictionless.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in only what you need
npm run dev                  # http://localhost:3000
```

For local hacking you don't need Firestore or a Places key — the JSON
fallback boots with the bundled seed and the Places typeahead degrades to a
plain warning.

## Configuration

| Variable                          | Required | Description                                                                |
| --------------------------------- | -------- | -------------------------------------------------------------------------- |
| `ADMIN_PASSWORD`                  | no       | Password for the `/admin` queue and admin-only API. Defaults to `queso`.   |
| `FIREBASE_SERVICE_ACCOUNT_JSON`   | one of   | Inline JSON for the Firebase service account (good for env-based deploys). |
| `GOOGLE_APPLICATION_CREDENTIALS`  | one of   | Path to a service-account JSON file on disk.                               |
| `GOOGLE_CLOUD_PROJECT`            | no       | Override the project ID if it can't be inferred from credentials.          |
| `FIRESTORE_DATABASE_ID`           | no       | Use a non-default Firestore database.                                      |
| `GOOGLE_PLACES_API_KEY`           | no       | Enables Google Places lookup in the submit form.                           |
| `MAPS_API_KEY`                    | no       | Alias accepted for compatibility with the previous version.                |

If neither Firebase variable is set, the JSON file fallback is used.

## Deploy

A multi-stage `Dockerfile` builds a tiny standalone runtime image. To run
locally:

```bash
docker build -t nachodex .
docker run --rm -p 3000:3000 \
  -e ADMIN_PASSWORD=queso \
  -e GOOGLE_PLACES_API_KEY=… \
  -e FIREBASE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}' \
  nachodex
```

The image runs as a non-root user, listens on `:3000`, and writes its
JSON-fallback database to `/app/data` (mount a volume there if you skip
Firestore and still want persistence across container restarts).

## API

| Method | Path                          | Auth   | Description                                  |
| ------ | ----------------------------- | ------ | -------------------------------------------- |
| GET    | `/api/reviews?status=...`     | public | List reviews (default: approved)             |
| POST   | `/api/reviews`                | public | Create a pending review                      |
| GET    | `/api/reviews/[id]`           | public | Fetch one review                             |
| PATCH  | `/api/reviews/[id]`           | admin  | Update status (`approved` / `pending`)       |
| DELETE | `/api/reviews/[id]`           | admin  | Permanently delete (== reject)               |
| GET    | `/api/places/search?q=…`      | public | Google Places text search proxy              |
| POST   | `/api/admin/check`            | admin  | Verify the admin password                    |

Admin endpoints expect the password in the `x-nacho-admin` header.

## Scoring guide

Pulled forward from the previous version of this app so reviewers calibrate
the same way. Every plate is scored 1–10 across four axes:

- **Taste** — flavour and how the meal hangs together.
- **Quantity** — would it feed a child or a horse?
- **Atmosphere** — vibes of the place.
- **Overall** — your gut score, weighing all of the above plus value.

Bands: 1–3 dealbreaker · 4–6 average · 7–8 recommend · 9–10 hall of fame.

## Design notes

- **Aesthetic** — cantina-meets-editorial: parchment background with grain
  overlay, hand-drawn wavy underlines, paper grid, gradient meshes, a stamp,
  hatched fills, and chip confetti drifting in the background.
- **Typography** — Caprasimo for chunky display, Fraunces for italic serif
  body, Manrope for sans, JetBrains Mono for mono accents.
- **Motion** — staggered page-load reveals, animated counters, cheese-pull
  area chart, layout transitions on filter changes, list spring-ins.
