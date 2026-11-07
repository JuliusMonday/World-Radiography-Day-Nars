// Admin sign-in through Cloudflare Access (one-time code sent by email).
// Cloudflare Access sits in front of /admin and /api/admin and adds a signed token (JWT) to each request.
// We verify that token ourselves too, and only accept the email addresses below.
//
// Pages secrets needed (Settings -> Variables and Secrets):
//   ACCESS_TEAM_DOMAIN  e.g. narswrd.cloudflareaccess.com
//   ACCESS_AUD          the Application Audience (AUD) tag of the Access application
// Optional: ADMIN_EMAILS (comma-separated) to replace the default list.
// Local testing only: DEV_ADMIN_EMAIL in .dev.vars signs you in as that address on localhost.

export const DEFAULT_ADMIN_EMAILS = ["narsnationalinformationbureau@gmail.com", "jutelabsofficial@gmail.com"];

function allowedEmails(env) {
  const list = env.ADMIN_EMAILS ? String(env.ADMIN_EMAILS).split(",") : DEFAULT_ADMIN_EMAILS;
  return list.map((e) => e.trim().toLowerCase()).filter(Boolean);
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlJson(s) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));
}

let certCache = { at: 0, team: "", keys: [] };
async function signingKeys(team) {
  if (certCache.team === team && Date.now() - certCache.at < 3600e3 && certCache.keys.length) return certCache.keys;
  const r = await fetch("https://" + team + "/cdn-cgi/access/certs");
  if (!r.ok) throw new Error("could not load Access certificates");
  const j = await r.json();
  certCache = { at: Date.now(), team, keys: j.keys || [] };
  return certCache.keys;
}

function tokenFrom(request) {
  const h = request.headers.get("Cf-Access-Jwt-Assertion");
  if (h) return h;
  const m = /(?:^|;\s*)CF_Authorization=([^;]+)/.exec(request.headers.get("Cookie") || "");
  return m ? m[1] : "";
}

// Returns { status: "ok", email } | { status: "setup" } | { status: "signin" } | { status: "forbidden", email }
export async function adminIdentity(request, env) {
  const allowed = allowedEmails(env);
  const host = new URL(request.url).hostname;
  if (env.DEV_ADMIN_EMAIL && (host === "127.0.0.1" || host === "localhost")) {
    const email = String(env.DEV_ADMIN_EMAIL).trim().toLowerCase();
    return allowed.includes(email) ? { status: "ok", email } : { status: "forbidden", email };
  }
  const team = String(env.ACCESS_TEAM_DOMAIN || "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const aud = String(env.ACCESS_AUD || "");
  if (!team || !aud) return { status: "setup" };

  const token = tokenFrom(request);
  const parts = token.split(".");
  if (parts.length !== 3) return { status: "signin" };
  try {
    const header = b64urlJson(parts[0]);
    const payload = b64urlJson(parts[1]);
    const keys = await signingKeys(team);
    const jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk || header.alg !== "RS256") return { status: "signin" };
    const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlToBytes(parts[2]), new TextEncoder().encode(parts[0] + "." + parts[1]));
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    const now = Math.floor(Date.now() / 1000);
    if (!ok || !auds.includes(aud) || payload.iss !== "https://" + team || !(payload.exp > now)) return { status: "signin" };
    const email = String(payload.email || "").toLowerCase();
    return allowed.includes(email) ? { status: "ok", email } : { status: "forbidden", email };
  } catch (e) {
    return { status: "signin" };
  }
}
