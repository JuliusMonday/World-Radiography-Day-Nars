// Shared helpers for the API (functions/api/*).
import CHAPTERS from "./chapters.json";
import { chapterKey, matchChapter } from "./match.js";

export { CHAPTERS, chapterKey };

// Counted in the total but never ranked. Tidy keys only contain A-Z, 0-9 and spaces, so these can't collide.
export const PRO_KEY = "#PRO";
// Typed chapter names that don't match an official school wait here ("?TIDY KEY") until an admin merges them.
export const PENDING = "?";
export const CHAPTER_BY_CODE = Object.fromEntries(CHAPTERS.map((c) => [c.code, c]));

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });
}

export function methodNotAllowed(allow) {
  return json({ error: "method not allowed" }, 405, { allow });
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function readBody(request) {
  try {
    const b = await request.json();
    return b && typeof b === "object" && !Array.isArray(b) ? b : null;
  } catch {
    return null;
  }
}

export function cleanText(v, max) {
  return String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

export function cleanDevice(v) {
  const d = String(v || "");
  return /^[A-Za-z0-9_-]{8,64}$/.test(d) ? d : "";
}

export async function ipHash(request, env) {
  // Set IP_SALT as a secret in the Pages project to keep hashed IPs unguessable; the fallback still works.
  return sha256((request.headers.get("CF-Connecting-IP") || "unknown") + "|" + (env.IP_SALT || "wrd2026"));
}

/* Rate limiting. Many Nigerian mobile users share one IP (carrier NAT), so the per-IP ceiling is generous
   and the tighter limit is per device. Rows are kept for a day. */
export async function overLimit(db, keys, now) {
  for (const [key, max] of keys) {
    if (!key) continue;
    const r = await db.prepare("SELECT COUNT(*) AS n FROM hits WHERE ip = ? AND ts > ?").bind(key, now - 3600e3).first();
    if (r && r.n >= max) return true;
  }
  return false;
}
export function hitStatements(db, keys, now) {
  const out = keys.filter(([k]) => k).map(([k]) => db.prepare("INSERT INTO hits (ip, ts) VALUES (?, ?)").bind(k, now));
  out.push(db.prepare("DELETE FROM hits WHERE ts < ?").bind(now - 86400e3));
  return out;
}

export async function learnedAliases(db) {
  const r = await db.prepare("SELECT raw, code FROM aliases").all();
  const map = {};
  for (const row of r.results || []) map[row.raw] = row.code;
  return map;
}

export function resolveChapter(text, aliases) {
  const code = matchChapter(text, CHAPTERS, aliases);
  if (code) return { key: code, code, pending: false };
  const key = chapterKey(text);
  return key ? { key: PENDING + key, code: "", pending: true } : null;
}

/* Public stats: only official chapters are ranked. */
export async function readStats(db, limit = 10) {
  const [tot, top] = await db.batch([
    db
      .prepare(
        "SELECT COALESCE(SUM(count),0) AS total, " +
          "COALESCE(SUM(CASE WHEN key = ? THEN count END),0) AS radiographers, " +
          "COUNT(CASE WHEN key <> ? AND substr(key,1,1) <> ? THEN 1 END) AS chapters FROM chapters"
      )
      .bind(PRO_KEY, PRO_KEY, PENDING),
    db
      .prepare("SELECT key AS code, count FROM chapters WHERE key <> ? AND substr(key,1,1) <> ? ORDER BY count DESC, updated_at ASC LIMIT ?")
      .bind(PRO_KEY, PENDING, limit),
  ]);
  const t = tot.results[0] || { total: 0, radiographers: 0, chapters: 0 };
  return { total: t.total, radiographers: t.radiographers, chapters: t.chapters, top: top.results };
}

export function newId() {
  return [...crypto.getRandomValues(new Uint8Array(12))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
