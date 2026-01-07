-- Wedding Website Database Schema for Supabase
-- Run this in the Supabase SQL editor to set up your database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Guests table
CREATE TABLE guests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(8) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  group_id UUID,
  has_plus_one BOOLEAN DEFAULT FALSE,
  invited_to_ceremony BOOLEAN DEFAULT TRUE,
  invited_to_reception BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guest members (for tracking individual people within a guest party)
CREATE TABLE guest_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  is_plus_one BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RSVPs table
CREATE TABLE rsvps (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE UNIQUE,
  attending JSONB DEFAULT '{}',
  meal_choices JSONB DEFAULT '{}',
  dietary_restrictions JSONB DEFAULT '{}',
  song_request TEXT,
  recipe_text TEXT,
  recipe_file_url TEXT,
  recipe_file_name VARCHAR(255),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_guests_code ON guests(code);
CREATE INDEX idx_rsvps_guest_id ON rsvps(guest_id);
CREATE INDEX idx_guest_members_guest_id ON guest_members(guest_id);

-- Enable Row Level Security (RLS)
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed)
-- Guests can look up their own info by code
CREATE POLICY "Allow guest lookup by code" ON guests
  FOR SELECT USING (true);

CREATE POLICY "Allow guest members lookup" ON guest_members
  FOR SELECT USING (true);

-- Anyone can submit an RSVP
CREATE POLICY "Allow RSVP select" ON rsvps
  FOR SELECT USING (true);

CREATE POLICY "Allow RSVP insert" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow RSVP update" ON rsvps
  FOR UPDATE USING (true);

-- Anyone can submit a contact message
CREATE POLICY "Allow contact message insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow contact message select" ON contact_messages
  FOR SELECT USING (true);

-- For admin operations, you'll use the service role key
-- which bypasses RLS

-- Create storage bucket for recipe files
INSERT INTO storage.buckets (id, name, public)
VALUES ('recipes', 'recipes', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public uploads to recipes bucket
CREATE POLICY "Allow recipe uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'recipes');

CREATE POLICY "Allow recipe downloads" ON storage.objects
  FOR SELECT USING (bucket_id = 'recipes');

-- Sample data for testing (optional)
-- Uncomment to add test guests

/*
INSERT INTO guests (code, first_name, last_name, email, has_plus_one, invited_to_ceremony, invited_to_reception)
VALUES 
  ('ABC123', 'John', 'Smith', 'john@example.com', true, true, true),
  ('DEF456', 'Jane', 'Doe', 'jane@example.com', false, true, true),
  ('GHI789', 'Bob', 'Wilson', 'bob@example.com', true, false, true);

-- Add member entries for the test guests
INSERT INTO guest_members (guest_id, name, is_plus_one)
SELECT id, first_name || ' ' || last_name, false FROM guests;

INSERT INTO guest_members (guest_id, name, is_plus_one)
SELECT id, 'Plus One', true FROM guests WHERE has_plus_one = true;
*/
