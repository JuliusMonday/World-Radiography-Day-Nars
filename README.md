# World Radiography Day 2026 Card Maker (NARS National)

A web page where radiographers and radiography students take a 10-question quiz, add their name, chapter and photo, and download a personalised World Radiography Day 2026 card in HD (2160 × 2700 PNG).

Developed by [Jutelabs Limited](https://www.linkedin.com/in/chimaobi-julius-monday).

## Project structure

| Path | What it is |
|---|---|
| `src/app.html` | The card maker page: layout, styles, quiz screens, skeleton animation, card rendering |
| `src/admin.html` | Private admin page (`/admin`) for the NARS National Information Bureau |
| `src/flyer-bg.jpg`, `src/nars-logo.jpg`, `src/public/` | Flyer background, logo, link preview image, icons |
| `src/build.py` | Builds the site into `site/` |
| `lib/questions.js` | Quiz question bank (server only, so the answers never reach the page) |
| `lib/quiz.js` | Picks each 10-question quiz |
| `lib/chapters.json` | Official chapter list (RRBN, June 2026) with short names and alternative spellings |
| `lib/match.js` | Matches typed chapter names to official chapters (used by the API and the page) |
| `lib/counter.js`, `lib/access.js` | Shared API helpers; admin sign-in check |
| `functions/api/` | API: `quiz/start`, `quiz/answer`, `card`, `stats`, `admin/*` |
| `db/schema.sql` | Database tables (D1 `wrd2026-cards`) |
| `wrangler.toml` | Pages config and the D1 binding |

## How the quiz and prizes work

- The page asks the API for 10 questions (no answers included); each answer is marked by the server.
- Only a device's first finished quiz counts. A 10/10 first attempt gets a winner code like `WRD-7K3QX`.
- When a winner downloads their card, their name and chapter are saved with the code. Nothing personal is stored for anyone else.
- The admin page lists winners, checks codes and runs a random draw.

## Admin access

`/admin` is protected by Cloudflare Access (email one-time code). Only the addresses in `lib/access.js` are accepted, and the API verifies the Access token itself. Pages secrets: `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` (and optionally `ADMIN_EMAILS`, `IP_SALT`).

For local testing, put `DEV_ADMIN_EMAIL=you@example.com` in `.dev.vars` (git-ignored) and run:

```bash
python src/build.py && npx wrangler pages dev site
```

## Build

```bash
python3 src/build.py
```

This writes `site/index.html`, one self-contained file with no server needed.

## Deploy (Cloudflare Pages)

Connect this repository in Cloudflare Pages with:

- Framework preset: None
- Build command: `python3 src/build.py`
- Build output directory: `site`

Every push to `main` deploys automatically.
