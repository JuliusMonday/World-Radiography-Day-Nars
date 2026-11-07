// POST /api/quiz/answer { attempt, index, choice } -> { correct, answer, fact, done, score?, total? }
// Answers must come in order, once each.
import { json, methodNotAllowed, readBody } from "../../../lib/counter.js";
import { BY_ID } from "../../../lib/questions.js";

const MAX_AGE = 3 * 3600e3; // an attempt must be finished within 3 hours

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "quiz not configured" }, 503);
  const body = await readBody(request);
  if (!body || typeof body.attempt !== "string" || !/^[a-f0-9]{24}$/.test(body.attempt)) return json({ error: "invalid request" }, 400);
  const index = Number(body.index);
  const choice = typeof body.choice === "string" ? body.choice : "";

  const db = env.DB;
  const now = Date.now();
  try {
    const a = await db.prepare("SELECT * FROM attempts WHERE id = ?").bind(body.attempt).first();
    if (!a) return json({ error: "quiz not found" }, 404);
    if (a.finished_at) return json({ error: "quiz already finished" }, 409);
    if (now - a.created_at > MAX_AGE) return json({ error: "quiz expired" }, 410);

    const qids = JSON.parse(a.qids);
    const answers = JSON.parse(a.answers);
    if (!Number.isInteger(index) || index !== answers.length || index >= qids.length) return json({ error: "answer out of order" }, 409);
    const q = BY_ID[qids[index]];
    if (!q) return json({ error: "question missing" }, 500);
    if (!q.a.includes(choice)) return json({ error: "invalid choice" }, 400);

    const correct = choice === q.a[0];
    const newAnswers = JSON.stringify(answers.concat([correct ? 1 : 0]));
    const score = a.score + (correct ? 1 : 0);
    const done = index === qids.length - 1;

    // Optimistic update: only succeeds if nobody answered this question in the meantime.
    const res = await db
      .prepare("UPDATE attempts SET answers = ?, score = ?, finished_at = ? WHERE id = ? AND answers = ? AND finished_at IS NULL")
      .bind(newAnswers, score, done ? now : null, a.id, a.answers)
      .run();
    if (!res || !res.meta || res.meta.changes !== 1) return json({ error: "answer already recorded" }, 409);

    const out = { correct, answer: q.a[0], fact: q.f || "", done };
    if (done) Object.assign(out, { score, total: a.total });
    return json(out);
  } catch (e) {
    return json({ error: "could not record answer" }, 500);
  }
}

export const onRequest = () => methodNotAllowed("POST");
