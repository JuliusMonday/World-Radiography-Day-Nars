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

export async function readStats(db, limit = 10) {
  const [tot, top] = await db.batch([
    db.prepare("SELECT COALESCE(SUM(count),0) AS total, COUNT(*) AS chapters FROM chapters"),
    db.prepare("SELECT key AS name, count FROM chapters ORDER BY count DESC, updated_at ASC LIMIT ?").bind(limit),
  ]);
  const t = tot.results[0] || { total: 0, chapters: 0 };
  return { total: t.total, chapters: t.chapters, top: top.results };
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
