// Admin API for the PRO. Protected by a password (the ADMIN_PASSWORD secret, see lib/adminauth.js).
//   GET  /api/admin/me               checks the password
//   GET  /api/admin/summary          totals, quiz numbers, cards per day
//   GET  /api/admin/chapters         official chapters with counts, pending names, learned spellings
//   POST /api/admin/merge {from,to}  move a pending name into an official chapter and remember the spelling
//   POST /api/admin/discard {key}    delete a junk pending name
//   GET  /api/admin/check?code=      check a 10/10 code from someone's result or share image
//   POST /api/admin/claim {code,undo} mark a code as claimed (prize given), or undo that
import { checkAdmin } from "../../../lib/adminauth.js";
import { CHAPTERS, CHAPTER_BY_CODE, PENDING, PRO_KEY, cleanCode, json, readBody } from "../../../lib/counter.js";

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
        "COUNT(CASE WHEN finished_at IS NOT NULL AND score = total THEN 1 END) AS perfect, COUNT(claimed_at) AS claimed FROM attempts"
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

async function checkCode(db, url) {
  const code = cleanCode(url.searchParams.get("code"));
  if (!code) return json({ error: "Codes look like WRD-7K3QX." }, 400);
  const a = await db
    .prepare("SELECT code, device, role, score, total, created_at, finished_at, claimed_at FROM attempts WHERE code = ?")
    .bind(code)
    .first();
  if (!a) return json({ valid: false, code }, 404);
  const n = await db
    .prepare("SELECT COUNT(*) AS n FROM attempts WHERE device = ? AND finished_at IS NOT NULL AND finished_at <= ?")
    .bind(a.device, a.finished_at)
    .first();
  return json({
    valid: true, code, role: a.role, score: a.score, total: a.total, finished_at: a.finished_at,
    seconds: Math.round((a.finished_at - a.created_at) / 1000), attempt_no: n.n, claimed_at: a.claimed_at,
  });
}

async function claim(db, body) {
  const code = cleanCode(body.code);
  if (!code) return json({ error: "Codes look like WRD-7K3QX." }, 400);
  if (body.undo === true) {
    const r = await db.prepare("UPDATE attempts SET claimed_at = NULL WHERE code = ?").bind(code).run();
    return r.meta.changes ? json({ ok: true, claimed_at: null }) : json({ error: "Not a real code." }, 404);
  }
  const now = Date.now();
  const r = await db.prepare("UPDATE attempts SET claimed_at = ? WHERE code = ? AND claimed_at IS NULL").bind(now, code).run();
  if (r.meta.changes) return json({ ok: true, claimed_at: now });
  const a = await db.prepare("SELECT claimed_at FROM attempts WHERE code = ?").bind(code).first();
  return a ? json({ error: "Already claimed.", claimed_at: a.claimed_at }, 409) : json({ error: "Not a real code." }, 404);
}

const POSTS = { merge, discard, claim };

export async function onRequest({ request, env, params }) {
  if (!env.DB) return json({ error: "database not configured" }, 503);
  const who = await checkAdmin(request, env, env.DB);
  if (who.status === "setup") return json({ error: "Admin is not available right now. Please try again later." }, 503);
  if (who.status === "locked") return json({ error: "Too many wrong passwords. Try again in an hour." }, 429);
  if (who.status === "signin") return json({ error: "Please enter the admin password." }, 401);
  if (who.status === "wrong") return json({ error: "Wrong password." }, 401);

  const route = (params.path || []).join("/");
  const method = request.method;
  const db = env.DB;
  try {
    if (method === "GET" && route === "me") return json({ ok: true });
    if (method === "GET" && route === "summary") return json(await summary(db));
    if (method === "GET" && route === "chapters") return json(await chapters(db));
    if (method === "GET" && route === "check") return await checkCode(db, new URL(request.url));
    if (method === "POST" && Object.hasOwn(POSTS, route)) {
      const body = await readBody(request);
      if (!body) return json({ error: "invalid request" }, 400);
      return await POSTS[route](db, body);
    }
    return json({ error: "not found" }, 404);
  } catch (e) {
    return json({ error: "admin request failed" }, 500);
  }
}
