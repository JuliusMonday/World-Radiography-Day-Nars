// GET /api/stats -> { total, chapters, top: [{ name, count }] }
import { json, readStats } from "../../lib/counter.js";

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: "counter not configured" }, 503);
  try {
    const stats = await readStats(env.DB);
    return json(stats, 200, { "cache-control": "public, max-age=20" });
  } catch (e) {
    return json({ error: "stats unavailable" }, 500);
  }
}
