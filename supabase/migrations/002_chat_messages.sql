-- Chat Messages Table
-- Run this in your Supabase SQL Editor after 001_realtime_tables.sql

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Public read/write policies
CREATE POLICY "Allow public read on chat_messages" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert on chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable Supabase Realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
