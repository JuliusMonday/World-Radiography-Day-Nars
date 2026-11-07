// Admin sign-in with one shared password.
// The admin page sends the password in the "x-admin-password" header on every request.
//
// Pages secret needed (Settings -> Variables and Secrets, Production):
//   ADMIN_PASSWORD   at least 12 characters
// Local testing: put ADMIN_PASSWORD=... in .dev.vars (git-ignored).
//
// Guessing is slowed down: 10 wrong passwords from one IP address in an hour locks that address out for the hour.
import { ipHash, overLimit, hitStatements } from "./counter.js";

export const MIN_LENGTH = 12;
const MAX_FAILS = 10;

async function digest(text) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(text))));
}

// Compares two strings without leaking how many characters matched.
async function same(a, b) {
  const [x, y] = await Promise.all([digest(a), digest(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

// Returns { status: "ok" } | { status: "setup" } | { status: "signin" } | { status: "wrong" } | { status: "locked" }
export async function checkAdmin(request, env, db) {
  const secret = String(env.ADMIN_PASSWORD || "");
  if (secret.length < MIN_LENGTH) return { status: "setup" };
  const given = request.headers.get("x-admin-password") || "";
  const now = Date.now();
  const key = "admin-fail:" + (await ipHash(request, env));
  if (await overLimit(db, [[key, MAX_FAILS]], now)) return { status: "locked" };
  if (!given) return { status: "signin" };
  if (await same(given, secret)) return { status: "ok" };
  await db.batch(hitStatements(db, [[key]], now));
  await new Promise((r) => setTimeout(r, 600));
  return { status: "wrong" };
}
