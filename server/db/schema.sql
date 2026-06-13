-- Run once: psql $DATABASE_URL -f server/db/schema.sql

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  github_uid  TEXT UNIQUE NOT NULL,
  username    TEXT NOT NULL,
  avatar_url  TEXT,
  email       TEXT,
  coins       INTEGER DEFAULT 500,
  gems        INTEGER DEFAULT 10,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_skins (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  skin_id     TEXT NOT NULL,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skin_id)
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id           UUID PRIMARY KEY,
  game_type    TEXT NOT NULL,
  player_count INTEGER NOT NULL,
  winner_uid   TEXT,
  played_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leaderboard (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_type   TEXT NOT NULL,
  score       INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
