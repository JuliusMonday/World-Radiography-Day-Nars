# To do

## Done (7 Nov 2026)

- [x] Official chapter list (RRBN, June 2026: 41 universities) with common short forms, in `lib/chapters.json`
- [x] Chapter field suggests schools as you type; names that don't match go to a pending pile off the leaderboard
- [x] Alternative names map to chapters (e.g. "Nnamdi Azikiwe University", "NAU", "Nnewi" → UNIZIK)
- [x] Admin merge tool for pending names (spellings are remembered); discard for junk
- [x] Public threshold lowered to 50 cards; ranking shows official chapters only
- [x] Fixed "1 radiographers"
- [x] Private `/admin` page: totals, students vs radiographers, quiz numbers, cards per day, chapters, CSV export
- [x] Fair prizes: server-side marking (the page never gets the answers), only a device's first finished quiz counts
- [x] Winner codes (e.g. `WRD-7K3QX`) on the result screen and share image, checkable in admin, with a random draw

## Needs doing in the Cloudflare dashboard

- [ ] Set up Cloudflare Access for `/admin` and `/api/admin` (only narsnationalinformationbureau@gmail.com and jutelabsofficial@gmail.com), then add the `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` secrets
- [ ] Optional: set the `IP_SALT` secret and redeploy

## Decisions for NARS

- [ ] Prize rules (all 10/10 first attempts, first X, or a random draw) and how winners are contacted
- [ ] Confirm qualified radiographers may use the NARS-branded flyer
