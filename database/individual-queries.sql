-- ============================================
-- INDIVIDUAL SQL QUERIES FOR SUPABASE
-- Run these one at a time in order
-- ============================================

-- ============================================
-- QUERY 1: Enable UUID extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ============================================
-- QUERY 2: Create parties table
-- ============================================
CREATE TABLE parties (
  id SERIAL PRIMARY KEY,
  party_name VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  invited_to_ceremony BOOLEAN DEFAULT TRUE,
  invited_to_reception BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================
-- QUERY 3: Create guests table
-- ============================================
CREATE TABLE guests (
  id SERIAL PRIMARY KEY,
  party_id INTEGER REFERENCES parties(party_id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_plus_one BOOLEAN DEFAULT FALSE,
  can_bring_plus_one BOOLEAN DEFAULT FALSE,
  plus_one_for INTEGER REFERENCES guests(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================
-- QUERY 4: Create guest_rsvps table
-- ============================================
CREATE TABLE guest_rsvps (
  id SERIAL PRIMARY KEY,
  guest_id INTEGER REFERENCES guests(id) ON DELETE CASCADE UNIQUE,
  attending BOOLEAN DEFAULT NULL,
  meal_choice VARCHAR(100),
  dietary_requirements TEXT,
  plus_one_first_name VARCHAR(100),
  plus_one_last_name VARCHAR(100),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================
-- QUERY 5: Create party_extras table
-- ============================================
CREATE TABLE party_extras (
  id SERIAL PRIMARY KEY,
  party_id INTEGER REFERENCES parties(id) ON DELETE CASCADE UNIQUE,
  song_request TEXT,
  recipe_title VARCHAR(200),
  recipe_text TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ============================================
-- QUERY 6: Create contact_messages table
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
-- QUERY 7: Create indexes
-- ============================================
CREATE INDEX idx_parties_party_name ON parties(party_name);
CREATE INDEX idx_guests_party_id ON guests(party_id);
CREATE INDEX idx_guests_plus_one_for ON guests(plus_one_for);
CREATE INDEX idx_guest_rsvps_guest_id ON guest_rsvps(guest_id);
CREATE INDEX idx_party_extras_party_id ON party_extras(party_id);


-- ============================================
-- QUERY 8: Enable RLS on all tables
-- ============================================
ALTER TABLE parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE party_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;


-- ============================================
-- QUERY 9: Create RLS policies for parties
-- ============================================
CREATE POLICY "Allow party lookup" ON parties
  FOR SELECT USING (true);


-- ============================================
-- QUERY 10: Create RLS policies for guests
-- ============================================
CREATE POLICY "Allow guests lookup" ON guests
  FOR SELECT USING (true);


-- ============================================
-- QUERY 11: Create RLS policies for guest_rsvps
-- ============================================
CREATE POLICY "Allow guest_rsvps select" ON guest_rsvps
  FOR SELECT USING (true);

CREATE POLICY "Allow guest_rsvps insert" ON guest_rsvps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow guest_rsvps update" ON guest_rsvps
  FOR UPDATE USING (true);


-- ============================================
-- QUERY 12: Create RLS policies for party_extras
-- ============================================
CREATE POLICY "Allow party_extras select" ON party_extras
  FOR SELECT USING (true);

CREATE POLICY "Allow party_extras insert" ON party_extras
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow party_extras update" ON party_extras
  FOR UPDATE USING (true);


-- ============================================
-- QUERY 13: Create RLS policies for contact_messages
-- ============================================
CREATE POLICY "Allow contact message insert" ON contact_messages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow contact message select" ON contact_messages
  FOR SELECT USING (true);


-- ============================================
-- QUERY 14: Create parties_overview view
-- ============================================
CREATE VIEW parties_overview AS
SELECT
    p.id AS party_id,
    p.party_name,
    p.password,
    p.invited_to_ceremony,
    p.invited_to_reception,
    CASE
        WHEN p.invited_to_ceremony THEN 'All Day'
        ELSE 'Evening Only'
    END AS invitation_type,
    COUNT(g.id) AS guest_count,
    p.created_at
FROM parties p
LEFT JOIN guests g ON p.id = g.party_id
GROUP BY p.id, p.party_name, p.password, p.invited_to_ceremony, p.invited_to_reception, p.created_at;s


-- ============================================
-- QUERY 15: Create guests_with_rsvp view
-- ============================================
CREATE VIEW guests_with_rsvp AS
SELECT 
  g.id AS guest_id,
  g.party_id,
  p.party_name,
  g.first_name,
  g.last_name,
  g.first_name || ' ' || g.last_name AS full_name,
  g.is_plus_one,
  g.can_bring_plus_one,
  g.plus_one_for,
  r.attending,
  r.meal_choice,
  r.dietary_requirements,  -- fixed typo
  r.plus_one_first_name,
  r.plus_one_last_name,
  CASE 
    WHEN g.is_plus_one AND r.plus_one_first_name IS NOT NULL 
    THEN r.plus_one_first_name || ' ' || COALESCE(r.plus_one_last_name, '')
    ELSE g.first_name || ' ' || g.last_name
  END AS display_name,
  p.invited_to_ceremony,
  p.invited_to_reception,
  r.submitted_at
FROM guests g
JOIN parties p ON g.party_id = p.id
LEFT JOIN guest_rsvps r ON g.id = r.guest_id;


-- ============================================
-- QUERY 16: Create rsvp_stats view
-- ============================================
CREATE VIEW rsvp_stats AS
SELECT
  (SELECT COUNT(*) FROM parties) AS total_parties,
  (SELECT COUNT(*) FROM guests WHERE is_plus_one = false) AS total_named_guests,
  (SELECT COUNT(*) FROM guests WHERE is_plus_one = true) AS total_plus_one_slots,
  (SELECT COUNT(*) FROM guest_rsvps WHERE attending = true) AS total_attending,
  (SELECT COUNT(*) FROM guest_rsvps WHERE attending = false) AS total_not_attending,
  (SELECT COUNT(*) FROM guests g WHERE NOT EXISTS (SELECT 1 FROM guest_rsvps r WHERE r.guest_id = g.id)) AS total_pending,
  (SELECT COUNT(*) 
   FROM guest_rsvps r 
   JOIN guests g ON r.guest_id = g.id 
   JOIN parties p ON g.party_id = p.id   -- <-- fixed
   WHERE r.attending = true AND p.invited_to_ceremony = true) AS all_day_attending,
  (SELECT COUNT(*) 
   FROM guest_rsvps r 
   JOIN guests g ON r.guest_id = g.id 
   JOIN parties p ON g.party_id = p.id   -- <-- fixed
   WHERE r.attending = true AND p.invited_to_ceremony = false) AS evening_only_attending;