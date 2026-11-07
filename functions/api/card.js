// POST /api/card { chapter, role, device, attempt, name } -> records one downloaded card.
// Students count towards their chapter (official schools ranked, other names pending until an admin merges them);
// qualified radiographers (role "pro") count in their own group. Only counts are kept, plus a timestamp log.
// If `attempt` is a winning quiz attempt, the winner's name and chapter are saved with their code for prize checks.
import {
  PRO_KEY, cleanDevice, cleanText, hitStatements, ipHash, json, learnedAliases, methodNotAllowed,
  overLimit, readBody, readStats, resolveChapter,
} from "../../lib/counter.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "counter not configured" }, 503);
  const body = await readBody(request);
  if (!body) return json({ error: "invalid request" }, 400);

  const db = env.DB;
  const now = Date.now();
  const pro = body.role === "pro";
  const chapterText = cleanText(body.chapter, 60);
  const device = cleanDevice(body.device);
  const ip = await ipHash(request, env);

  try {
    const aliases = pro ? {} : await learnedAliases(db);
    const ch = pro ? { key: PRO_KEY, code: "", pending: false } : resolveChapter(chapterText, aliases);
    if (!ch) return json({ error: "chapter required" }, 400);

    const limits = [["c:" + ip, 300], device ? ["cd:" + device, 20] : ["c1:" + ip, 20]];
    if (await overLimit(db, limits, now)) return json({ error: "too many requests" }, 429);

    const stmts = hitStatements(db, limits, now);
    stmts.push(
      db
        .prepare("INSERT INTO chapters (key, count, updated_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1, updated_at = excluded.updated_at")
        .bind(ch.key, now),
      db.prepare("INSERT INTO card_log (ts, key) VALUES (?, ?)").bind(now, ch.key)
    );
    // Link a winner's name and chapter to their code (only for winning attempts, only once).
    const attempt = typeof body.attempt === "string" && /^[a-f0-9]{24}$/.test(body.attempt) ? body.attempt : "";
    const name = cleanText(body.name, 40);
    if (attempt && name) {
      stmts.push(
        db
          .prepare("UPDATE attempts SET name = ?, chapter = ?, chapter_code = ? WHERE id = ? AND code IS NOT NULL AND name IS NULL")
          .bind(name, chapterText, pro ? "" : ch.code || "", attempt)
      );
    }
    await db.batch(stmts);

    const stats = await readStats(db);
    if (pro) return json({ ...stats, chapter: null });
    if (ch.pending) return json({ ...stats, chapter: { code: "", pending: true } });
    const mine = await db.prepare("SELECT count FROM chapters WHERE key = ?").bind(ch.key).first();
    const ahead = await db
      .prepare("SELECT COUNT(*) AS n FROM chapters WHERE count > ? AND key <> ? AND substr(key,1,1) <> '?'")
      .bind(mine.count, PRO_KEY)
      .first();
    return json({ ...stats, chapter: { code: ch.code, count: mine.count, rank: ahead.n + 1 } });
  } catch (e) {
    return json({ error: "could not record" }, 500);
  }
}

// Any other method on /api/card
export const onRequest = () => methodNotAllowed("POST");
