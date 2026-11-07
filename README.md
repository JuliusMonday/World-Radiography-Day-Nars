# World Radiography Day 2026 Card Maker (NARS National)

A web page where radiographers and radiography students take a 10-question quiz, add their name, chapter and photo, and download a personalised World Radiography Day 2026 card in HD (2160 × 2700 PNG).

Developed by [Jutelabs Limited](https://www.linkedin.com/in/chimaobi-julius-monday).

## Project structure

| Path | What it is |
|---|---|
| `src/app.html` | The page: layout, styles, quiz, skeleton animation, card rendering |
| `src/questions.js` | Question bank (hand-written and generated calculation questions) |
| `src/flyer-bg.jpg` | Clean 2160 × 2700 flyer background |
| `src/nars-logo.jpg` | NARS logo used in the quiz |
| `src/public/` | Link preview image (`og.jpg`), favicons and web manifest, copied into the site as is |
| `src/build.py` | Builds the site into `site/` |
| `functions/api/` | Card counter API: `POST /api/card` records a downloaded card for a chapter, `GET /api/stats` returns totals and the chapter ranking |
| `lib/counter.js` | Shared helpers for the API (chapter name tidying, stats query) |
| `wrangler.toml` | Pages config: output folder and the D1 database binding (`DB` → `wrd2026-cards`) |

The counter stores only a count per chapter. Visitor IPs are hashed, used for rate limiting (20 cards an hour) and deleted after a day. The public counter stays hidden until 100 cards; add `?stats=1` to the URL to preview it.
| `world Radiography day.svg` / `.png` | Original flyer design files |

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
