// POST /api/quiz/start { role, device, seen:[ids] } -> { attempt, questions:[{id, cat, q, options}] }
// The answers stay on the server; each answer is marked by /api/quiz/answer.
import { cleanDevice, hitStatements, ipHash, json, methodNotAllowed, newId, overLimit, readBody } from "../../../lib/counter.js";
import { pickQuiz, publicQuestion } from "../../../lib/quiz.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "quiz not configured" }, 503);
  const body = await readBody(request);
  if (!body) return json({ error: "invalid request" }, 400);
  const device = cleanDevice(body.device);
  if (!device) return json({ error: "device required" }, 400);

  const db = env.DB;
  const now = Date.now();
  const ip = await ipHash(request, env);
  const limits = [["q:" + ip, 600], ["qd:" + device, 30]];
  try {
    if (await overLimit(db, limits, now)) return json({ error: "too many requests" }, 429);
    const qs = pickQuiz(body.seen);
    const id = newId();
    await db.batch(
      hitStatements(db, limits, now).concat([
        db
          .prepare("INSERT INTO attempts (id, device, ip, role, qids, answers, score, total, created_at) VALUES (?, ?, ?, ?, ?, '[]', 0, ?, ?)")
          .bind(id, device, ip, body.role === "pro" ? "pro" : "student", JSON.stringify(qs.map((q) => q.id)), qs.length, now),
      ])
    );
    return json({ attempt: id, questions: qs.map(publicQuestion) });
  } catch (e) {
    return json({ error: "could not start quiz" }, 500);
  }
}

export const onRequest = () => methodNotAllowed("POST");
