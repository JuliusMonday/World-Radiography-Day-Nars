// Shared helpers for the card counter API (functions/api/*).

// Words that don't identify a chapter, so "NARS UNIZIK CHAPTER", "Unizik chapter" and "UNIZIK" all count together.
const STOP = new Set(["NARS", "CHAPTER", "CHAP", "THE", "OF", "STUDENT", "STUDENTS", "ASSOCIATION", "NIGERIAN", "RADIOGRAPHY", "RADIOGRAPHERS"]);

export function chapterKey(raw) {
  return String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w))
    .join(" ")
    .slice(0, 40);
}

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });
}

// Qualified radiographers are counted in the total under this key, but kept out of the chapter ranking.
// chapterKey() only returns A-Z, 0-9 and spaces, so it can never collide with "#PRO".
export const PRO_KEY = "#PRO";

// A chapter needs this many cards before it shows in the public ranking, so one-off typos and junk entries stay off it.
export const MIN_RANKED = 3;

export async function readStats(db, limit = 10) {
  const [tot, top] = await db.batch([
    db
      .prepare(
        "SELECT COALESCE(SUM(count),0) AS total, " +
          "COALESCE(SUM(CASE WHEN key = ? THEN count END),0) AS radiographers, " +
          "COUNT(CASE WHEN key <> ? THEN 1 END) AS chapters FROM chapters"
      )
      .bind(PRO_KEY, PRO_KEY),
    db
      .prepare("SELECT key AS name, count FROM chapters WHERE key <> ? AND count >= ? ORDER BY count DESC, updated_at ASC LIMIT ?")
      .bind(PRO_KEY, MIN_RANKED, limit),
  ]);
  const t = tot.results[0] || { total: 0, radiographers: 0, chapters: 0 };
  return { total: t.total, radiographers: t.radiographers, chapters: t.chapters, top: top.results };
}

export function methodNotAllowed(allow) {
  return json({ error: "method not allowed" }, 405, { allow });
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
