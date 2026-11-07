// Admin API for the PRO. Protected by Cloudflare Access: only the allowed email addresses (lib/access.js) get in.
//   GET  /api/admin/me               who is signed in
//   GET  /api/admin/summary          totals, quiz numbers, cards per day
//   GET  /api/admin/chapters         official chapters with counts, pending names, learned spellings
//   POST /api/admin/merge {from,to}  move a pending name into an official chapter and remember the spelling
//   POST /api/admin/discard {key}    delete a junk pending name
//   GET  /api/admin/winners          10/10 first attempts with their winner codes
//   GET  /api/admin/verify?code=     look up one winner code
import { adminIdentity } from "../../../lib/access.js";
import { CHAPTERS, CHAPTER_BY_CODE, PENDING, PRO_KEY, json, readBody } from "../../../lib/counter.js";

const DAY = 86400e3;
const WAT = 3600e3; // Nigeria is UTC+1: group by Nigerian calendar day

async function summary(db) {
  const now = Date.now();
  const [cards, quiz, perDay] = await db.batch([
    db
      .prepare(
        "SELECT COALESCE(SUM(count),0) AS total, COALESCE(SUM(CASE WHEN key = ? THEN count END),0) AS radiographers, " +
          "COALESCE(SUM(CASE WHEN substr(key,1,1) = ? THEN count END),0) AS pending FROM chapters"
      )
      .bind(PRO_KEY, PENDING),
    db.prepare(
      "SELECT COUNT(*) AS started, COUNT(finished_at) AS finished, AVG(CASE WHEN finished_at IS NOT NULL THEN score END) AS avg_score, " +
        "COUNT(CASE WHEN finished_at IS NOT NULL AND first = 1 THEN 1 END) AS first_attempts, COUNT(code) AS winners, " +
        "COUNT(CASE WHEN code IS NOT NULL AND name IS NOT NULL THEN 1 END) AS winners_named FROM attempts"
    ),
    db
      .prepare("SELECT CAST((ts + ?) / ? AS INTEGER) AS d, COUNT(*) AS n FROM card_log WHERE ts > ? GROUP BY d ORDER BY d")
      .bind(WAT, DAY, now - 30 * DAY),
  ]);
  const c = cards.results[0];
  const q = quiz.results[0];
  return {
    cards: { total: c.total, radiographers: c.radiographers, pending: c.pending, students: c.total - c.radiographers },
    quiz: { ...q, avg_score: q.avg_score == null ? null : Math.round(q.avg_score * 10) / 10 },
    perDay: perDay.results.map((r) => ({ day: new Date(r.d * DAY).toISOString().slice(0, 10), cards: r.n })),
  };
}

async function chapters(db) {
  const [rows, al] = await db.batch([
    db.prepare("SELECT key, count, updated_at FROM chapters ORDER BY count DESC"),
    db.prepare("SELECT raw, code, created_at FROM aliases ORDER BY created_at DESC"),
  ]);
  const counts = {};
  const pending = [];
  for (const r of rows.results) {
    if (r.key === PRO_KEY) continue;
    if (r.key.startsWith(PENDING)) pending.push({ key: r.key, name: r.key.slice(1), count: r.count, updated_at: r.updated_at });
    else counts[r.key] = r.count;
  }
  const official = CHAPTERS.map((c) => ({ code: c.code, name: c.name, state: c.state, accredited: c.accredited, count: counts[c.code] || 0 }));
  official.sort((a, b) => b.count - a.count || a.code.localeCompare(b.code));
  return { official, pending, aliases: al.results };
}

async function merge(db, body) {
  const from = String(body.from || "");
  const to = String(body.to || "");
  if (!from.startsWith(PENDING) || from.length < 2) return json({ error: "from must be a pending name" }, 400);
  if (!CHAPTER_BY_CODE[to]) return json({ error: "unknown chapter" }, 400);
  const row = await db.prepare("SELECT count FROM chapters WHERE key = ?").bind(from).first();
  if (!row) return json({ error: "pending name not found" }, 404);
  const now = Date.now();
  await db.batch([
    db
      .prepare("INSERT INTO chapters (key, count, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET count = count + excluded.count, updated_at = excluded.updated_at")
      .bind(to, row.count, now),
    db.prepare("DELETE FROM chapters WHERE key = ?").bind(from),
    db.prepare("UPDATE card_log SET key = ? WHERE key = ?").bind(to, from),
    db.prepare("UPDATE attempts SET chapter_code = ? WHERE chapter_code = '' AND name IS NOT NULL AND upper(chapter) LIKE ?").bind(to, "%" + from.slice(1) + "%"),
    db.prepare("INSERT INTO aliases (raw, code, created_at) VALUES (?, ?, ?) ON CONFLICT(raw) DO UPDATE SET code = excluded.code").bind(from.slice(1), to, now),
  ]);
  return json({ ok: true, moved: row.count, to });
}

async function discard(db, body) {
  const key = String(body.key || "");
  if (!key.startsWith(PENDING) || key.length < 2) return json({ error: "only pending names can be discarded" }, 400);
  const res = await db.prepare("DELETE FROM chapters WHERE key = ?").bind(key).run();
  await db.prepare("DELETE FROM card_log WHERE key = ?").bind(key).run();
  return json({ ok: true, removed: res.meta.changes });
}

const WINNER_COLS =
  "code, name, chapter, chapter_code, role, score, total, created_at, finished_at, (finished_at - created_at) / 1000 AS seconds";

async function winners(db) {
  const r = await db.prepare("SELECT " + WINNER_COLS + " FROM attempts WHERE code IS NOT NULL ORDER BY finished_at ASC").all();
  return { winners: r.results };
}

async function verify(db, url) {
  const code = (url.searchParams.get("code") || "").trim().toUpperCase();
  if (!/^WRD-[A-Z0-9]{5}$/.test(code)) return json({ error: "codes look like WRD-7K3QX" }, 400);
  const w = await db.prepare("SELECT " + WINNER_COLS + " FROM attempts WHERE code = ?").bind(code).first();
  return w ? json({ valid: true, winner: w }) : json({ valid: false }, 404);
}

export async function onRequest({ request, env, params }) {
  const who = await adminIdentity(request, env);
  if (who.status === "setup") return json({ error: "Admin sign-in is not set up yet: add Cloudflare Access and the ACCESS_TEAM_DOMAIN and ACCESS_AUD secrets." }, 503);
  if (who.status === "signin") return json({ error: "Please sign in." }, 401);
  if (who.status === "forbidden") return json({ error: "This email address does not have admin access.", email: who.email }, 403);
  if (!env.DB) return json({ error: "database not configured" }, 503);

  const route = (params.path || []).join("/");
  const method = request.method;
  const db = env.DB;
  try {
    if (method === "GET" && route === "me") return json({ email: who.email });
    if (method === "GET" && route === "summary") return json(await summary(db));
    if (method === "GET" && route === "chapters") return json(await chapters(db));
    if (method === "GET" && route === "winners") return json(await winners(db));
    if (method === "GET" && route === "verify") return await verify(db, new URL(request.url));
    if (method === "POST" && (route === "merge" || route === "discard")) {
      const body = await readBody(request);
      if (!body) return json({ error: "invalid request" }, 400);
      return route === "merge" ? await merge(db, body) : await discard(db, body);
    }
    return json({ error: "not found" }, 404);
  } catch (e) {
    return json({ error: "admin request failed" }, 500);
  }
}
