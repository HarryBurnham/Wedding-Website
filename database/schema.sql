-- Wedding Website Database Schema for Supabase
-- Run this in the Supabase SQL editor to set up your database

-- Enable UUID extension (still useful for some internal IDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PARTIES TABLE
-- Groups of guests who login together
-- ============================================
CREATE TABLE parties (
  id SERIAL PRIMARY KEY,  -- Auto-incrementing: 1, 2, 3...
  party_name VARCHAR(100) UNIQUE NOT NULL,  -- Used as login name
  password VARCHAR(100) NOT NULL,  -- Password for RSVP access
  invited_to_ceremony BOOLEAN DEFAULT TRUE,
  invited_to_reception BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to format party ID as 001, 002, etc.
CREATE OR REPLACE FUNCTION get_party_code(party_id INTEGER)
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(party_id::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GUESTS TABLE
-- Individual people within a party
-- ============================================
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,  -- Auto-incrementing: 1, 2, 3...
  party_id INTEGER REFERENCES parties(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_plus_one BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a function to format guest ID as 001, 002, etc.
CREATE OR REPLACE FUNCTION get_guest_code(guest_id INTEGER)
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(guest_id::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- RSVPS TABLE
-- Responses from parties
-- ============================================
CREATE TABLE rsvps (
  id SERIAL PRIMARY KEY,
  party_id INTEGER REFERENCES parties(id) ON DELETE CASCADE UNIQUE,
  attending JSONB DEFAULT '{}',  -- { "guest_id": true/false, ... }
  meal_choices JSONB DEFAULT '{}',  -- { "guest_id": "meal_option", ... }
  dietary_restrictions JSONB DEFAULT '{}',  -- { "guest_id": "restrictions", ... }
  song_request TEXT,
  recipe_text TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONTACT MESSAGES TABLE
-- Messages from the contact form
-- ============================================
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_parties_party_name ON parties(party_name);
CREATE INDEX idx_guests_party_id ON guests(party_id);
CREATE INDEX idx_rsvps_party_id ON rsvps(party_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Policies for public access
CREATE POLICY "Allow party lookup" ON parties
  FOR SELECT USING (true);

CREATE POLICY "Allow guests lookup" ON guests
  FOR SELECT USING (true);

CREATE POLICY "Allow RSVP select" ON rsvps
  FOR SELECT USING (true);

CREATE POLICY "Allow RSVP insert" ON rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow RSVP update" ON rsvps
  FOR UPDATE USING (true);

CREATE POLICY "Allow contact message insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow contact message select" ON contact_messages
  FOR SELECT USING (true);

-- ============================================
-- HELPFUL VIEWS
-- ============================================

-- View to see parties with their formatted codes
CREATE VIEW parties_with_codes AS
SELECT 
  id,
  get_party_code(id) AS party_code,
  party_name,
  password,
  invited_to_ceremony,
  invited_to_reception,
  created_at
FROM parties;

-- View to see guests with their formatted codes and party info
CREATE VIEW guests_with_details AS
SELECT 
  g.id,
  get_guest_code(g.id) AS guest_code,
  g.first_name,
  g.last_name,
  g.first_name || ' ' || g.last_name AS full_name,
  g.is_plus_one,
  g.party_id,
  get_party_code(p.id) AS party_code,
  p.party_name
FROM guests g
JOIN parties p ON g.party_id = p.id;

-- View to see RSVP summary
CREATE VIEW rsvp_summary AS
SELECT 
  r.id,
  r.party_id,
  get_party_code(p.id) AS party_code,
  p.party_name,
  r.attending,
  r.meal_choices,
  r.dietary_restrictions,
  r.song_request,
  r.recipe_text,
  r.submitted_at
FROM rsvps r
JOIN parties p ON r.party_id = p.id;

-- ============================================
-- SAMPLE DATA (Optional - uncomment to use)
-- ============================================

/*
-- Insert sample parties
INSERT INTO parties (party_name, password, invited_to_ceremony, invited_to_reception)
VALUES 
  ('The Smith Family', 'smith2026', true, true),
  ('John & Jane Doe', 'doe2026', true, true),
  ('Bob Wilson', 'wilson2026', false, true);

-- Insert sample guests
-- Party 1: The Smith Family (2 adults + plus one)
INSERT INTO guests (party_id, first_name, last_name, is_plus_one)
VALUES 
  (1, 'David', 'Smith', false),
  (1, 'Sarah', 'Smith', false),
  (1, 'Plus', 'One', true);

-- Party 2: John & Jane Doe
INSERT INTO guests (party_id, first_name, last_name, is_plus_one)
VALUES 
  (2, 'John', 'Doe', false),
  (2, 'Jane', 'Doe', false);

-- Party 3: Bob Wilson (solo + plus one)
INSERT INTO guests (party_id, first_name, last_name, is_plus_one)
VALUES 
  (3, 'Bob', 'Wilson', false),
  (3, 'Plus', 'One', true);
*/
