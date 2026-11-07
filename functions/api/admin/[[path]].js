// Admin API for the PRO. Protected by a password (the ADMIN_PASSWORD secret, see lib/adminauth.js).
//   GET  /api/admin/me               checks the password
//   GET  /api/admin/summary          totals, quiz numbers, cards per day
//   GET  /api/admin/chapters         official chapters with counts, pending names, learned spellings
//   POST /api/admin/merge {from,to}  move a pending name into an official chapter and remember the spelling
//   POST /api/admin/discard {key}    delete a junk pending name
//   GET  /api/admin/winners          10/10 first attempts with their winner codes
//   GET  /api/admin/verify?code=     look up one winner code
//   GET  /api/admin/entries?close=&min=   who can enter the prize draw, and why the others can't
//   POST /api/admin/draw {prizes,backups,closeAt,minSeconds}   run and save a random draw
//   GET  /api/admin/draws            saved draws with prize places and backups
//   POST /api/admin/draw-status {id,code,status}   mark a pick claimed, forfeit or pending
//   POST /api/admin/draw-delete {id}  delete a saved draw (e.g. a practice run)
import { checkAdmin } from "../../../lib/adminauth.js";
import { CHAPTERS, CHAPTER_BY_CODE, PENDING, PRO_KEY, json, readBody, newId } from "../../../lib/counter.js";
import { DEFAULT_MIN_SECONDS, checkEntries, previousWinners, prizePlaces, randomPick } from "../../../lib/prizes.js";

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

async function loadDraws(db) {
  const r = await db.prepare("SELECT id, created_at, prizes, settings, pool, picks FROM draws ORDER BY created_at ASC").all();
  return r.results.map((d) => ({ ...d, settings: JSON.parse(d.settings), picks: JSON.parse(d.picks) }));
}

function drawSettings(src) {
  const closeAt = Math.max(0, Math.floor(Number(src.closeAt) || 0));
  const raw = src.minSeconds;
  const minSeconds = raw === undefined || raw === null || raw === "" ? DEFAULT_MIN_SECONDS : Math.max(0, Math.min(600, Number(raw) || 0));
  return { closeAt, minSeconds };
}

async function entries(db, settings) {
  const [w, draws] = await Promise.all([winners(db), loadDraws(db)]);
  return checkEntries(w.winners, { ...settings, already: previousWinners(draws) });
}

async function runDraw(db, body) {
  const prizes = Math.floor(Number(body.prizes));
  const backups = Math.floor(Number(body.backups) || 0);
  if (!(prizes >= 1 && prizes <= 200)) return json({ error: "number of prizes must be 1 to 200" }, 400);
  if (!(backups >= 0 && backups <= 50)) return json({ error: "number of backups must be 0 to 50" }, 400);
  const settings = drawSettings(body);
  const { eligible } = await entries(db, settings);
  if (!eligible.length) return json({ error: "nobody is eligible for the draw yet" }, 400);
  const picks = randomPick(eligible, prizes + backups).map((w) => ({ code: w.code, status: "pending" }));
  const draw = { id: newId(), created_at: Date.now(), prizes, settings: { ...settings, backups }, pool: eligible.length, picks };
  await db
    .prepare("INSERT INTO draws (id, created_at, prizes, settings, pool, picks) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(draw.id, draw.created_at, prizes, JSON.stringify(draw.settings), draw.pool, JSON.stringify(picks))
    .run();
  return json({ ok: true, id: draw.id });
}

async function listDraws(db) {
  const [draws, w] = await Promise.all([loadDraws(db), winners(db)]);
  const byCode = Object.fromEntries(w.winners.map((x) => [x.code, x]));
  return {
    draws: draws.reverse().map((d) => ({ ...d, picks: prizePlaces(d).map((p) => ({ ...(byCode[p.code] || { code: p.code }), ...p })) })),
  };
}

async function drawStatus(db, body) {
  const id = String(body.id || "");
  const code = String(body.code || "");
  const status = String(body.status || "");
  if (!["pending", "claimed", "forfeit"].includes(status)) return json({ error: "status must be pending, claimed or forfeit" }, 400);
  const row = await db.prepare("SELECT picks FROM draws WHERE id = ?").bind(id).first();
  if (!row) return json({ error: "draw not found" }, 404);
  const picks = JSON.parse(row.picks);
  const pick = picks.find((p) => p.code === code);
  if (!pick) return json({ error: "that code is not in this draw" }, 404);
  pick.status = status;
  await db.prepare("UPDATE draws SET picks = ? WHERE id = ?").bind(JSON.stringify(picks), id).run();
  return json({ ok: true });
}

async function deleteDraw(db, body) {
  const res = await db.prepare("DELETE FROM draws WHERE id = ?").bind(String(body.id || "")).run();
  return res.meta.changes ? json({ ok: true }) : json({ error: "draw not found" }, 404);
}

const POSTS = { merge, discard, draw: runDraw, "draw-status": drawStatus, "draw-delete": deleteDraw };

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
    if (method === "GET" && route === "winners") return json(await winners(db));
    if (method === "GET" && route === "verify") return await verify(db, new URL(request.url));
    if (method === "GET" && route === "entries") {
      const u = new URL(request.url);
      return json(await entries(db, drawSettings({ closeAt: u.searchParams.get("close"), minSeconds: u.searchParams.get("min") })));
    }
    if (method === "GET" && route === "draws") return json(await listDraws(db));
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
