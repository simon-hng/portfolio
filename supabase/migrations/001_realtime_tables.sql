-- Real-time Collaborative Terminal Tables
-- Run this in your Supabase SQL Editor

-- Visitors table (username persistence)
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  username TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Presence table (who's online)
CREATE TABLE IF NOT EXISTS presence (
  session_id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  last_command TEXT,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  location TEXT
);

-- Guestbook entries
CREATE TABLE IF NOT EXISTS guestbook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Canvas pixels (64x32 = 2048 pixels max)
CREATE TABLE IF NOT EXISTS canvas_pixels (
  id TEXT PRIMARY KEY, -- format: "x,y"
  char TEXT NOT NULL DEFAULT ' ',
  username TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (allow all for now - public features)
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE canvas_pixels ENABLE ROW LEVEL SECURITY;

-- Public read/write policies
CREATE POLICY "Allow public read on visitors" ON visitors FOR SELECT USING (true);
CREATE POLICY "Allow public insert on visitors" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on visitors" ON visitors FOR UPDATE USING (true);

CREATE POLICY "Allow public read on presence" ON presence FOR SELECT USING (true);
CREATE POLICY "Allow public insert on presence" ON presence FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on presence" ON presence FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on presence" ON presence FOR DELETE USING (true);

CREATE POLICY "Allow public read on guestbook" ON guestbook FOR SELECT USING (true);
CREATE POLICY "Allow public insert on guestbook" ON guestbook FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on canvas_pixels" ON canvas_pixels FOR SELECT USING (true);
CREATE POLICY "Allow public insert on canvas_pixels" ON canvas_pixels FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on canvas_pixels" ON canvas_pixels FOR UPDATE USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_presence_last_seen ON presence(last_seen);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_canvas_pixels_updated_at ON canvas_pixels(updated_at);

-- Enable Supabase Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE visitors;
ALTER PUBLICATION supabase_realtime ADD TABLE presence;
ALTER PUBLICATION supabase_realtime ADD TABLE guestbook;
ALTER PUBLICATION supabase_realtime ADD TABLE canvas_pixels;
