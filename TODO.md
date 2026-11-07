# To do

## Chapter leaderboard (on hold)

The live counter and ranking are built but hidden until 100 cards. Before relying on the ranking:

- [ ] Get the official list of NARS chapters (with common short forms) from the PRO
- [ ] Replace the free-text chapter field with a searchable chapter list; "My chapter isn't listed" goes to a pending pile that stays off the leaderboard
- [ ] Map alternative names to each chapter (e.g. "Nnamdi Azikiwe University", "NAU" → UNIZIK)
- [ ] Admin merge tool for duplicate chapter names; merge the cards already recorded
- [ ] Lower the public threshold from 100 to 50 cards
- [ ] Below 3 cards per chapter, show "Chapters appear once they have 3 cards" instead of "No chapters yet"
- [ ] Fix grammar: "1 radiographers" → "1 radiographer"

## Admin page and prizes (not started)

- [ ] Private `/admin` page behind Cloudflare Access (PRO + developer emails): totals, students vs radiographers, cards per day, full chapter list, CSV export
- [ ] Fair prizes for 10/10: server-side marking (questions sent without answers), only the first attempt counts
- [ ] Winner code (e.g. `WRD-7K3Q`) on the result and share image, checkable in the admin page
- [ ] Decide prize rules (all 10/10 scorers, first X, or random draw) and contact method (winner code only, or a consented WhatsApp form)

## Other

- [ ] Optional: set the `IP_SALT` secret in the Pages project and redeploy
- [ ] Confirm with NARS that qualified radiographers may use the NARS-branded flyer
