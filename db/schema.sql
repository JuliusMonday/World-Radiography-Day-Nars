-- D1 database wrd2026-cards (binding DB). Safe to run more than once.

-- Card counts per chapter. key = official chapter code (e.g. UNIZIK), "#PRO" for radiographers,
-- or "?TIDY NAME" for typed names that don't match a school yet (pending admin review).
CREATE TABLE IF NOT EXISTS chapters (key TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL);

-- One row per card, for the cards-per-day chart. No personal data.
CREATE TABLE IF NOT EXISTS card_log (ts INTEGER NOT NULL, key TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS card_log_ts ON card_log(ts);

-- Spellings an admin has merged into an official chapter: tidy key -> chapter code.
CREATE TABLE IF NOT EXISTS aliases (raw TEXT PRIMARY KEY, code TEXT NOT NULL, created_at INTEGER NOT NULL);

-- Rate limiting: hashed IP or device keys, deleted after a day.
CREATE TABLE IF NOT EXISTS hits (ip TEXT NOT NULL, ts INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS hits_ip_ts ON hits(ip, ts);
CREATE INDEX IF NOT EXISTS hits_ts ON hits(ts);

-- Quiz attempts, marked on the server. A 10/10 attempt gets a check code; NARS checks it in the admin page and
-- marks it claimed (claimed_at) when a prize is given on WhatsApp. name, chapter and chapter_code are no longer used.
-- Databases created before 7 Nov 2026 need: ALTER TABLE attempts ADD COLUMN claimed_at INTEGER;
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY,
  device TEXT NOT NULL,
  ip TEXT NOT NULL,
  role TEXT NOT NULL,
  qids TEXT NOT NULL,
  answers TEXT NOT NULL DEFAULT '[]',
  score INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  first INTEGER NOT NULL DEFAULT 0,
  code TEXT,
  name TEXT,
  chapter TEXT,
  chapter_code TEXT,
  created_at INTEGER NOT NULL,
  finished_at INTEGER,
  claimed_at INTEGER
);
CREATE INDEX IF NOT EXISTS attempts_device ON attempts(device, finished_at);
CREATE INDEX IF NOT EXISTS attempts_created ON attempts(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS attempts_code ON attempts(code);

