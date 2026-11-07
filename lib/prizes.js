// Prize draw rules, applied by the server so the PRO doesn't have to check the winners list by hand.
// A 10/10 winner (first finished attempt on a device) can enter the draw only if they:
//   - downloaded their card, so we have a name and chapter;
//   - finished before the closing time (when one is set);
//   - took at least `minSeconds` for the 10 questions;
//   - gave a real-looking name;
//   - are not the same person (same name and chapter) as an earlier winner code;
//   - have not already won in an earlier draw.
import { chapterKey } from "./match.js";

const JUNK_WORDS = new Set(
  "TEST TESTER TESTING ASDF ASD QWERTY ABC ABCD XYZ NAME MYNAME YOURNAME USER ADMIN NOBODY ANON ANONYMOUS NONE NIL NULL NA FAKE DEMO SAMPLE RADIOGRAPHER STUDENT".split(" ")
);

export const DEFAULT_MIN_SECONDS = 40;

// "Ada  Okafor-Eze" and "OKAFOR EZE ADA" give the same key.
export function personKey(name) {
  return String(name || "")
    .toUpperCase()
    .replace(/[^A-Z]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .sort()
    .join(" ");
}

export function looksFake(name) {
  const words = personKey(name).split(" ").filter(Boolean);
  const letters = words.join("").length;
  if (letters < 3) return true;
  if (words.every((w) => JUNK_WORDS.has(w) || /^(.)\1+$/.test(w))) return true; // "test", "aaa", "xxx xxx"
  return false;
}

// Winners already holding a prize place (or who claimed one) in saved draws.
export function previousWinners(draws) {
  const out = new Map();
  for (const d of draws) {
    for (const p of prizePlaces(d)) if (p.place) out.set(p.code, d.created_at);
    for (const p of d.picks) if (p.status === "claimed") out.set(p.code, d.created_at);
  }
  return out;
}

// Splits the winners list (oldest first) into eligible and excluded, with the reason for each exclusion.
export function checkEntries(winners, { closeAt = 0, minSeconds = DEFAULT_MIN_SECONDS, already = new Map() } = {}) {
  const eligible = [];
  const excluded = [];
  const people = new Map();
  const sorted = winners.slice().sort((a, b) => (a.finished_at || 0) - (b.finished_at || 0));
  for (const w of sorted) {
    let why = "";
    if (already.has(w.code)) why = "Already won in an earlier draw";
    else if (!w.name) why = "Hasn't downloaded a card (no name)";
    else if (closeAt && w.finished_at > closeAt) why = "Finished after the closing time";
    else if (w.seconds != null && w.seconds < minSeconds) why = "Too fast: " + Math.round(w.seconds) + "s for 10 questions";
    else if (looksFake(w.name)) why = "Name looks fake";
    else {
      const key = personKey(w.name) + "|" + (w.chapter_code || chapterKey(w.chapter || ""));
      if (people.has(key)) why = "Same name and chapter as " + people.get(key);
      else people.set(key, w.code);
    }
    if (why) excluded.push({ ...w, why });
    else eligible.push(w);
  }
  return { eligible, excluded };
}

// Picks `count` entries at random (Fisher-Yates with crypto randomness).
export function randomPick(list, count) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const r = new Uint32Array(1);
    crypto.getRandomValues(r);
    const j = r[0] % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}

// Prize places go to the first `prizes` picks that haven't forfeited; the rest are backups, in order.
export function prizePlaces(draw) {
  let place = 0;
  let backup = 0;
  return draw.picks.map((p) => {
    if (p.status === "forfeit") return { ...p, place: 0, backup: 0 };
    if (place < draw.prizes) return { ...p, place: ++place, backup: 0 };
    return { ...p, place: 0, backup: ++backup };
  });
}
