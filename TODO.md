# To do

## Done (7 Nov 2026)

- [x] Official chapter list (RRBN, June 2026: 41 universities) with common short forms, in `lib/chapters.json`
- [x] Chapter field suggests schools as you type; names that don't match go to a pending pile off the leaderboard
- [x] Alternative names map to chapters (e.g. "Nnamdi Azikiwe University", "NAU", "Nnewi" → UNIZIK)
- [x] Admin merge tool for pending names (spellings are remembered); discard for junk
- [x] Public threshold lowered to 50 cards; ranking shows official chapters only
- [x] Fixed "1 radiographers"
- [x] Private `/admin` page: totals, students vs radiographers, quiz numbers, cards per day, chapters, CSV export
- [x] Server-side marking (the page never gets the answers)
- [x] Prizes removed from the site: NARS runs 10/10 prizes on WhatsApp

## Needs doing in the Cloudflare dashboard

- [x] Admin sign-in uses the `ADMIN_PASSWORD` secret (Cloudflare Access removed)
- [ ] Optional: set the `IP_SALT` secret and redeploy

## Decisions for NARS

- [ ] Confirm qualified radiographers may use the NARS-branded flyer
