// POST /api/card { chapter } -> records one downloaded card for that chapter.
// Stores only a per-chapter count. Visitor IPs are hashed and used for rate limiting, then deleted after a day.
import { chapterKey, json, readStats, sha256 } from "../../lib/counter.js";

const MAX_PER_HOUR = 20;

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "counter not configured" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid request" }, 400);
  }
  const key = chapterKey(body && body.chapter);
  if (!key) return json({ error: "chapter required" }, 400);

  const db = env.DB;
  const now = Date.now();
  const ip = await sha256((request.headers.get("CF-Connecting-IP") || "unknown") + "|wrd2026");

  try {
    const recent = await db.prepare("SELECT COUNT(*) AS n FROM hits WHERE ip = ? AND ts > ?").bind(ip, now - 3600e3).first();
    if (recent && recent.n >= MAX_PER_HOUR) return json({ error: "too many requests" }, 429);

    await db.batch([
      db.prepare("INSERT INTO hits (ip, ts) VALUES (?, ?)").bind(ip, now),
      db.prepare("DELETE FROM hits WHERE ts < ?").bind(now - 86400e3),
      db
        .prepare("INSERT INTO chapters (key, count, updated_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at")
        .bind(key, now),
    ]);

    const mine = await db.prepare("SELECT count FROM chapters WHERE key = ?").bind(key).first();
    const ahead = await db.prepare("SELECT COUNT(*) AS n FROM chapters WHERE count > ?").bind(mine.count).first();
    const stats = await readStats(db);
    return json({ ...stats, chapter: { name: key, count: mine.count, rank: ahead.n + 1 } });
  } catch (e) {
    return json({ error: "could not record" }, 500);
  }
}
