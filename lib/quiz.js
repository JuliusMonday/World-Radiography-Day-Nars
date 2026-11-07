// Picks a 10-question quiz on the server. Answers stay here; the page only receives question text and shuffled options.
import { BANK } from "./questions.js";

const byCat = {};
for (const q of BANK) (byCat[q.cat] = byCat[q.cat] || []).push(q);
const CALC_CATS = Object.keys(byCat).filter((c) => c.startsWith("calc-"));

function rnd(n) {
  return crypto.getRandomValues(new Uint32Array(1))[0] % n;
}
export function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = rnd(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Every quiz: 3 patient care, 1 each of protection, positioning, anatomy and history,
   2 of imaging/contrast/digital, and at most 1 physics or calculation question.
   `seen` holds ids this device has already had, so retakes get new questions. */
export function pickQuiz(seen) {
  const seenSet = new Set(Array.isArray(seen) ? seen.slice(-800).map(String) : []);
  const cats = ["care", "care", "care", "protection", "positioning", "anatomy", "history"]
    .concat(shuffle(["modalities", "contrast", "digital"]).slice(0, 2))
    .concat([rnd(2) ? "physics" : shuffle(CALC_CATS)[0]]);
  const picked = [];
  const used = new Set();
  for (const c of cats) {
    const all = byCat[c] || [];
    let pool = all.filter((q) => !seenSet.has(q.id) && !used.has(q.id));
    if (!pool.length) pool = all.filter((q) => !used.has(q.id));
    if (!pool.length) continue;
    const q = pool[rnd(pool.length)];
    used.add(q.id);
    picked.push(q);
  }
  return shuffle(picked);
}

export function publicQuestion(q) {
  return { id: q.id, cat: q.cat, q: q.q, options: shuffle(q.a) };
}
