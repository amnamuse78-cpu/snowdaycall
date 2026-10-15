-- SnowDayCall D1 schema v1
-- Run once: wrangler d1 execute snowdaycall --file=schema.sql

CREATE TABLE IF NOT EXISTS states (
  code TEXT PRIMARY KEY,          -- 'ny'
  name TEXT NOT NULL,             -- 'New York'
  slug TEXT NOT NULL UNIQUE       -- 'new-york'
);

CREATE TABLE IF NOT EXISTS cities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,             -- 'Buffalo'
  state_code TEXT NOT NULL REFERENCES states(code),
  slug TEXT NOT NULL UNIQUE,      -- 'buffalo-ny'
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  nws_zone TEXT,                  -- 'NYZ010'
  population INTEGER
);

CREATE TABLE IF NOT EXISTS districts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,             -- 'Buffalo Public Schools'
  state_code TEXT NOT NULL REFERENCES states(code),
  slug TEXT NOT NULL UNIQUE,      -- 'buffalo-public-schools'
  city_id INTEGER REFERENCES cities(id),
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  nws_zone TEXT,
  official_url TEXT,              -- district closure announcements page
  announce_policy TEXT,           -- 'Usually by 5:30am' (researched)
  student_count INTEGER,
  indexed INTEGER DEFAULT 0       -- 1 = in the SEO sitemap (experiment pages)
);

CREATE TABLE IF NOT EXISTS schools (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  district_id INTEGER NOT NULL REFERENCES districts(id),
  city TEXT,
  state_code TEXT NOT NULL,
  lat REAL,
  lon REAL,
  school_type TEXT,               -- 'elementary' | 'middle' | 'high' | 'other'
  official_url TEXT
);
CREATE INDEX IF NOT EXISTS idx_schools_name ON schools(name);
CREATE INDEX IF NOT EXISTS idx_schools_district ON schools(district_id);

CREATE TABLE IF NOT EXISTS predictions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  district_id INTEGER NOT NULL REFERENCES districts(id),
  forecast_date TEXT NOT NULL,    -- '2026-12-15'
  closed_prob INTEGER NOT NULL,
  delay_prob INTEGER NOT NULL,
  normal_prob INTEGER NOT NULL,
  confidence TEXT,                -- 'High' | 'Medium' | 'Lower'
  model_version TEXT NOT NULL,    -- 'v1'
  weather_snapshot TEXT,          -- JSON of NWS inputs
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_pred_district_date ON predictions(district_id, forecast_date);

CREATE TABLE IF NOT EXISTS outcomes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  district_id INTEGER NOT NULL REFERENCES districts(id),
  date TEXT NOT NULL,
  prediction_id INTEGER REFERENCES predictions(id),
  predicted_closed INTEGER,
  actual_status TEXT NOT NULL,    -- 'closed' | 'delay' | 'normal'
  announcement_time TEXT,         -- '05:42'
  official_source TEXT,
  UNIQUE(district_id, date)
);

CREATE TABLE IF NOT EXISTS community_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  district_id INTEGER NOT NULL REFERENCES districts(id),
  forecast_date TEXT NOT NULL,
  vote TEXT NOT NULL,             -- 'closed' | 'delay' | 'normal'
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_votes_district_date ON community_votes(district_id, forecast_date);

CREATE TABLE IF NOT EXISTS alert_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  district_id INTEGER NOT NULL REFERENCES districts(id),
  channel TEXT NOT NULL,          -- 'email' | 'sms'
  address TEXT NOT NULL,          -- email or phone (hashed at rest in v2)
  threshold INTEGER DEFAULT 70,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(district_id, channel, address)
);
