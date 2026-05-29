-- ============================================================
-- GRAND LINE — Supabase Database Schema
-- Run this in your Supabase SQL Editor to bootstrap the DB
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_rank AS ENUM (
  'east_blue_pirate',
  'rookie',
  'supernova',
  'warlord',
  'yonko_commander',
  'yonko',
  'pirate_king'
);

CREATE TYPE arc_status AS ENUM (
  'not_started',
  'in_progress',
  'completed'
);

CREATE TYPE challenge_type AS ENUM (
  'watch_streak',
  'arc_completion',
  'episode_count',
  'quiz_perfect',
  'crew_challenge',
  'sponsored'
);

CREATE TYPE listing_status AS ENUM (
  'active',
  'sold',
  'removed'
);

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  bounty BIGINT DEFAULT 0,           -- Main XP/currency (Berries)
  rank user_rank DEFAULT 'east_blue_pirate',
  haki_level INTEGER DEFAULT 0,       -- Premium power level
  watch_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_watched_at TIMESTAMPTZ,
  total_episodes_watched INTEGER DEFAULT 0,
  total_arcs_completed INTEGER DEFAULT 0,
  crew_id UUID,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ARCS
-- ============================================================

CREATE TABLE arcs (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  saga TEXT NOT NULL,              -- "East Blue", "Alabasta", "Water 7", etc.
  episode_start INTEGER NOT NULL,
  episode_end INTEGER NOT NULL,
  episode_count INTEGER GENERATED ALWAYS AS (episode_end - episode_start + 1) STORED,
  difficulty TEXT DEFAULT 'normal', -- 'intro', 'normal', 'hard', 'legendary'
  bounty_reward BIGINT DEFAULT 1000,
  cover_image TEXT,
  island_image TEXT,               -- For the Grand Line Map
  map_x FLOAT,                     -- Position on the map (0-100)
  map_y FLOAT,
  is_filler BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EPISODES
-- ============================================================

CREATE TABLE episodes (
  id SERIAL PRIMARY KEY,
  episode_number INTEGER UNIQUE NOT NULL,
  title TEXT NOT NULL,
  arc_id INTEGER REFERENCES arcs(id),
  arc_name TEXT,
  synopsis TEXT,
  thumbnail_url TEXT,
  crunchyroll_url TEXT,
  netflix_url TEXT,
  duration_minutes INTEGER DEFAULT 24,
  bounty_reward INTEGER DEFAULT 50,    -- Base berries for watching
  bonus_bounty INTEGER DEFAULT 25,     -- Extra for quiz pass
  is_filler BOOLEAN DEFAULT FALSE,
  is_recap BOOLEAN DEFAULT FALSE,
  importance_level INTEGER DEFAULT 1 CHECK (importance_level BETWEEN 1 AND 5),
  has_figure_deal BOOLEAN DEFAULT FALSE,
  figure_deal_url TEXT,
  figure_deal_discount INTEGER,        -- Discount percentage
  figure_deal_description TEXT,
  quiz_question TEXT,
  quiz_options JSONB,                  -- Array of {text, is_correct}
  quiz_explanation TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX episodes_arc_id_idx ON episodes(arc_id);
CREATE INDEX episodes_number_idx ON episodes(episode_number);

-- ============================================================
-- USER WATCH PROGRESS
-- ============================================================

CREATE TABLE watch_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  episode_id INTEGER REFERENCES episodes(id),
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  quiz_passed BOOLEAN DEFAULT FALSE,
  quiz_answer INTEGER,               -- Index of chosen answer
  bounty_earned INTEGER DEFAULT 0,
  watch_duration_minutes INTEGER,
  notes TEXT,                        -- User's personal notes on ep
  UNIQUE(user_id, episode_id)
);

CREATE INDEX watch_progress_user_idx ON watch_progress(user_id);
CREATE INDEX watch_progress_episode_idx ON watch_progress(episode_id);
CREATE INDEX watch_progress_watched_at_idx ON watch_progress(watched_at);

-- ============================================================
-- USER ARC PROGRESS
-- ============================================================

CREATE TABLE arc_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  arc_id INTEGER REFERENCES arcs(id),
  status arc_status DEFAULT 'not_started',
  episodes_watched INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  bounty_earned BIGINT DEFAULT 0,
  UNIQUE(user_id, arc_id)
);

-- ============================================================
-- DEVIL FRUITS (Achievements/Badges)
-- ============================================================

CREATE TABLE devil_fruits (
  id SERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,               -- "Gomu Gomu no Mi"
  type TEXT NOT NULL,               -- "Paramecia", "Logia", "Zoan"
  rarity TEXT DEFAULT 'common',     -- 'common', 'rare', 'legendary', 'mythical'
  description TEXT,
  power_description TEXT,           -- What the user can "do" with it
  icon_url TEXT,
  color_from TEXT,                  -- Gradient start
  color_to TEXT,                    -- Gradient end
  requirement_type TEXT NOT NULL,   -- 'episodes_watched', 'arc_completed', 'streak', etc.
  requirement_value INTEGER,
  requirement_arc_id INTEGER REFERENCES arcs(id),
  bounty_reward INTEGER DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_devil_fruits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  devil_fruit_id INTEGER REFERENCES devil_fruits(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  is_equipped BOOLEAN DEFAULT FALSE, -- Shows on profile
  UNIQUE(user_id, devil_fruit_id)
);

-- ============================================================
-- CREWS (Guild System)
-- ============================================================

CREATE TABLE crews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  motto TEXT,
  description TEXT,
  flag_url TEXT,
  captain_id UUID REFERENCES profiles(id),
  total_bounty BIGINT DEFAULT 0,
  member_count INTEGER DEFAULT 0,
  max_members INTEGER DEFAULT 10,
  is_recruiting BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE crew_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID REFERENCES crews(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'nakama',       -- 'captain', 'first_mate', 'nakama'
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  contribution_bounty BIGINT DEFAULT 0,
  UNIQUE(crew_id, user_id)
);

-- ============================================================
-- CHALLENGES
-- ============================================================

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type challenge_type,
  requirement_value INTEGER,
  requirement_arc_id INTEGER REFERENCES arcs(id),
  bounty_reward BIGINT DEFAULT 1000,
  devil_fruit_reward_id INTEGER REFERENCES devil_fruits(id),
  sponsor_name TEXT,                 -- "Powered by [Brand]"
  sponsor_logo_url TEXT,
  sponsor_url TEXT,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id),
  progress INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  bounty_earned BIGINT DEFAULT 0,
  UNIQUE(user_id, challenge_id)
);

-- ============================================================
-- FAN ART MARKETPLACE
-- ============================================================

CREATE TABLE fan_art_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,           -- Cloudinary URL (watermarked preview)
  full_image_url TEXT,               -- Full res, released after purchase
  arc_tags TEXT[],
  character_tags TEXT[],
  price_cents INTEGER NOT NULL,      -- In cents (USD)
  original_only BOOLEAN DEFAULT FALSE, -- Physical print or digital only
  status listing_status DEFAULT 'active',
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  view_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  platform_fee_pct NUMERIC DEFAULT 10, -- Grand Line takes 10%
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE fan_art_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES fan_art_listings(id),
  buyer_id UUID REFERENCES profiles(id),
  seller_id UUID REFERENCES profiles(id),
  amount_cents INTEGER NOT NULL,
  platform_fee_cents INTEGER NOT NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MERCH / AFFILIATE DEALS
-- ============================================================

CREATE TABLE merch_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id INTEGER REFERENCES episodes(id), -- NULL = sitewide deal
  arc_id INTEGER REFERENCES arcs(id),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  product_url TEXT NOT NULL,          -- Affiliate link
  affiliate_partner TEXT,             -- "crunchyroll", "amiami", "hot_topic"
  discount_pct INTEGER,
  original_price_usd NUMERIC,
  sale_price_usd NUMERIC,
  is_active BOOLEAN DEFAULT TRUE,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BOUNTY TRANSACTION LOG
-- ============================================================

CREATE TABLE bounty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,             -- Positive = earned, Negative = spent
  reason TEXT NOT NULL,               -- "episode_watched", "quiz_bonus", "arc_completed", etc.
  reference_id TEXT,                  -- Episode id, challenge id, etc.
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX bounty_tx_user_idx ON bounty_transactions(user_id);
CREATE INDEX bounty_tx_created_idx ON bounty_transactions(created_at);

-- ============================================================
-- ACTIVITY FEED (Realtime)
-- ============================================================

CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  crew_id UUID REFERENCES crews(id),
  type TEXT NOT NULL,                 -- 'episode_watched', 'arc_completed', 'devil_fruit_earned', etc.
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX activity_feed_user_idx ON activity_feed(user_id);
CREATE INDEX activity_feed_crew_idx ON activity_feed(crew_id);
CREATE INDEX activity_feed_created_idx ON activity_feed(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE arc_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devil_fruits ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_art_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_art_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "profiles_public_read" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_own_insert" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_own_update" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Watch progress: own read/write
CREATE POLICY "watch_progress_own" ON watch_progress
  FOR ALL USING (auth.uid() = user_id);

-- Arc progress: own read/write
CREATE POLICY "arc_progress_own" ON arc_progress
  FOR ALL USING (auth.uid() = user_id);

-- Devil fruits: public read own, insert by system
CREATE POLICY "user_devil_fruits_own" ON user_devil_fruits
  FOR SELECT USING (auth.uid() = user_id);

-- Crew members: read all, write own
CREATE POLICY "crew_members_read" ON crew_members FOR SELECT USING (TRUE);
CREATE POLICY "crew_members_own_write" ON crew_members
  FOR ALL USING (auth.uid() = user_id);

-- Fan art listings: public read, own write
CREATE POLICY "fanart_public_read" ON fan_art_listings FOR SELECT USING (status = 'active');
CREATE POLICY "fanart_own_write" ON fan_art_listings
  FOR ALL USING (auth.uid() = seller_id);

-- Bounty transactions: own read only
CREATE POLICY "bounty_own_read" ON bounty_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Activity feed: public read, own write
CREATE POLICY "activity_feed_read" ON activity_feed FOR SELECT USING (TRUE);
CREATE POLICY "activity_feed_own_write" ON activity_feed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Build base username from metadata or email prefix
  base_username := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'username'), ''),
    LOWER(REGEXP_REPLACE(split_part(NEW.email, '@', 1), '[^a-z0-9_]', '_', 'g'))
  );
  -- Ensure it's at least 3 chars
  IF LENGTH(base_username) < 3 THEN
    base_username := base_username || '_user';
  END IF;
  final_username := base_username;

  -- Handle username collisions by appending a number
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'display_name'), ''), final_username),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  )
  ON CONFLICT (id) DO NOTHING;  -- Safe if profile already exists

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block user creation — log and continue
  RAISE WARNING 'handle_new_user failed for %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update user rank based on bounty
CREATE OR REPLACE FUNCTION update_user_rank(user_id UUID)
RETURNS void AS $$
DECLARE
  current_bounty BIGINT;
  new_rank user_rank;
BEGIN
  SELECT bounty INTO current_bounty FROM profiles WHERE id = user_id;

  new_rank := CASE
    WHEN current_bounty >= 1000000 THEN 'pirate_king'
    WHEN current_bounty >= 100000  THEN 'yonko'
    WHEN current_bounty >= 10000   THEN 'yonko_commander'
    WHEN current_bounty >= 1000    THEN 'warlord'
    WHEN current_bounty >= 500     THEN 'supernova'
    WHEN current_bounty >= 100     THEN 'rookie'
    ELSE 'east_blue_pirate'
  END;

  UPDATE profiles SET rank = new_rank WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Award bounty and log transaction
CREATE OR REPLACE FUNCTION award_bounty(
  p_user_id UUID,
  p_amount BIGINT,
  p_reason TEXT,
  p_reference_id TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE profiles SET bounty = bounty + p_amount WHERE id = p_user_id;

  INSERT INTO bounty_transactions (user_id, amount, reason, reference_id)
  VALUES (p_user_id, p_amount, p_reason, p_reference_id);

  PERFORM update_user_rank(p_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Mark episode watched + handle streak
CREATE OR REPLACE FUNCTION mark_episode_watched(
  p_user_id UUID,
  p_episode_id INTEGER,
  p_quiz_passed BOOLEAN DEFAULT FALSE,
  p_quiz_answer INTEGER DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  ep RECORD;
  profile RECORD;
  bounty_earned INTEGER := 0;
  streak_bonus INTEGER := 0;
  new_streak INTEGER;
  last_watch TIMESTAMPTZ;
  result JSONB;
BEGIN
  -- Get episode details
  SELECT * INTO ep FROM episodes WHERE id = p_episode_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Episode not found');
  END IF;

  -- Check if already watched
  IF EXISTS (SELECT 1 FROM watch_progress WHERE user_id = p_user_id AND episode_id = p_episode_id) THEN
    RETURN jsonb_build_object('error', 'Already watched', 'already_watched', TRUE);
  END IF;

  -- Get profile
  SELECT * INTO profile FROM profiles WHERE id = p_user_id;

  -- Calculate bounty
  bounty_earned := ep.bounty_reward;
  IF p_quiz_passed THEN
    bounty_earned := bounty_earned + ep.bonus_bounty;
  END IF;

  -- Streak calculation
  last_watch := profile.last_watched_at;
  IF last_watch IS NULL OR last_watch < NOW() - INTERVAL '48 hours' THEN
    new_streak := 1; -- Reset streak
  ELSIF last_watch < NOW() - INTERVAL '24 hours' THEN
    new_streak := profile.watch_streak + 1; -- Extend streak
    streak_bonus := LEAST(new_streak * 10, 200); -- Cap streak bonus at 200
    bounty_earned := bounty_earned + streak_bonus;
  ELSE
    new_streak := profile.watch_streak; -- Same day, no change
  END IF;

  -- Record watch
  INSERT INTO watch_progress (user_id, episode_id, quiz_passed, quiz_answer, bounty_earned)
  VALUES (p_user_id, p_episode_id, p_quiz_passed, p_quiz_answer, bounty_earned);

  -- Update profile
  UPDATE profiles SET
    total_episodes_watched = total_episodes_watched + 1,
    last_watched_at = NOW(),
    watch_streak = new_streak,
    longest_streak = GREATEST(longest_streak, new_streak)
  WHERE id = p_user_id;

  -- Award bounty
  PERFORM award_bounty(p_user_id, bounty_earned, 'episode_watched', p_episode_id::TEXT);

  -- Update arc progress
  INSERT INTO arc_progress (user_id, arc_id, status, episodes_watched)
  VALUES (p_user_id, ep.arc_id, 'in_progress', 1)
  ON CONFLICT (user_id, arc_id) DO UPDATE SET
    status = CASE WHEN arc_progress.episodes_watched + 1 >= (SELECT episode_count FROM arcs WHERE id = ep.arc_id)
              THEN 'completed' ELSE 'in_progress' END,
    episodes_watched = arc_progress.episodes_watched + 1,
    completed_at = CASE WHEN arc_progress.episodes_watched + 1 >= (SELECT episode_count FROM arcs WHERE id = ep.arc_id)
                    THEN NOW() ELSE NULL END;

  -- Log activity
  INSERT INTO activity_feed (user_id, type, data)
  VALUES (p_user_id, 'episode_watched', jsonb_build_object(
    'episode_id', p_episode_id,
    'episode_number', ep.episode_number,
    'episode_title', ep.title,
    'bounty_earned', bounty_earned,
    'quiz_passed', p_quiz_passed,
    'streak', new_streak
  ));

  result := jsonb_build_object(
    'success', TRUE,
    'bounty_earned', bounty_earned,
    'streak_bonus', streak_bonus,
    'new_streak', new_streak,
    'quiz_passed', p_quiz_passed
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- SEED DATA — ARCS
-- ============================================================

INSERT INTO arcs (slug, name, description, saga, episode_start, episode_end, bounty_reward, order_index, map_x, map_y, difficulty) VALUES
('romance_dawn',     'Romance Dawn',       'The beginning. Luffy sets sail.',                          'East Blue Saga',     1,    3,    200,  1,  5,  80, 'intro'),
('orange_town',      'Orange Town',        'The clown pirate Buggy attacks.',                          'East Blue Saga',     4,    8,    300,  2,  12, 72, 'intro'),
('syrup_village',    'Syrup Village',      'Usopp joins the crew.',                                    'East Blue Saga',     9,    18,   400,  3,  20, 65, 'intro'),
('baratie',          'Baratie',            'Sanji joins the crew. Mihawk appears.',                    'East Blue Saga',     19,   30,   600,  4,  28, 58, 'normal'),
('arlong_park',      'Arlong Park',        'Nami''s past revealed. Arlong''s fishmen.',                'East Blue Saga',     31,   44,   800,  5,  36, 50, 'normal'),
('loguetown',        'Loguetown',          'The city where the Pirate King was born and executed.',    'East Blue Saga',     45,   53,   500,  6,  44, 42, 'normal'),
('reverse_mountain', 'Reverse Mountain',   'Enter the Grand Line.',                                    'Alabasta Saga',      54,   61,   400,  7,  52, 35, 'normal'),
('whisky_peak',      'Whisky Peak',        'Baroque Works revealed.',                                  'Alabasta Saga',      62,   67,   500,  8,  58, 30, 'normal'),
('little_garden',    'Little Garden',      'Two giants wage a 100-year war.',                          'Alabasta Saga',      70,   77,   600,  9,  64, 25, 'normal'),
('drum_island',      'Drum Island',        'Chopper joins. The kingdom of doctors.',                   'Alabasta Saga',      78,   91,   700,  10, 70, 20, 'normal'),
('alabasta',         'Alabasta',           'Baroque Works. Crocodile. The desert kingdom.',            'Alabasta Saga',      92,   130,  2000, 11, 78, 18, 'hard'),
('jaya',             'Jaya',               'Bellamy and the land of dreams.',                          'Sky Island Saga',    144,  152,  600,  12, 82, 15, 'normal'),
('skypiea',          'Skypiea',            'The island in the sky. Enel the God.',                     'Sky Island Saga',    153,  195,  1800, 13, 86, 10, 'hard'),
('long_ring',        'Long Ring Long Land','Davy Back Fight.',                                         'Water 7 Saga',       207,  219,  400,  14, 82, 20, 'normal'),
('water_seven',      'Water Seven',        'Usopp leaves. Robin''s betrayal. The Aqua Laguna.',        'Water 7 Saga',       220,  263,  1500, 15, 78, 30, 'hard'),
('enies_lobby',      'Enies Lobby',        'Straw Hats vs. World Government. I want to live!',         'Water 7 Saga',       264,  312,  3000, 16, 75, 38, 'legendary'),
('post_enies',       'Post-Enies Lobby',   'Thousand Sunny. Farewell Going Merry.',                   'Water 7 Saga',       313,  325,  600,  17, 72, 44, 'normal'),
('thriller_bark',    'Thriller Bark',      'Brook joins. Gecko Moria and zombie island.',              'Thriller Bark Saga', 326,  384,  1500, 18, 68, 50, 'hard'),
('sabaody',          'Sabaody Archipelago','Human trafficking. The Eleven Supernovas. Bartholomew Kuma.', 'Summit War Saga', 385,  405,  1200, 19, 62, 55, 'hard'),
('amazon_lily',      'Amazon Lily',        'Luffy stranded on island of women.',                       'Summit War Saga',    408,  417,  600,  20, 58, 60, 'normal'),
('impel_down',       'Impel Down',         'The underwater prison. Save Ace.',                         'Summit War Saga',    422,  458,  2000, 21, 54, 65, 'hard'),
('marineford',       'Marineford',         'The War of the Best. Ace dies. World shaking.',            'Summit War Saga',    459,  489,  5000, 22, 50, 70, 'legendary'),
('post_marineford',  'Post-Marineford',    'Luffy''s training begins. 2-year timeskip.',               'Summit War Saga',    490,  516,  1000, 23, 46, 74, 'normal'),
('return_sabaody',   'Return to Sabaody', 'Two years later. New powers.',                              'Fish-Man Island Saga', 517, 522, 500, 24, 48, 65, 'normal'),
('fish_man_island',  'Fish-Man Island',    'The island 10,000m under the sea. New World begins.',      'Fish-Man Island Saga', 523, 574, 1800, 25, 52, 60, 'hard'),
('punk_hazard',      'Punk Hazard',        'Caesar Clown. SAD. SMILE. Law alliance.',                  'Dressrosa Saga',     575,  629,  2000, 26, 56, 55, 'hard'),
('dressrosa',        'Dressrosa',          'Doflamingo. SMILE factory. Colosseum. God Usopp.',         'Dressrosa Saga',     630,  746,  4000, 27, 60, 50, 'legendary'),
('zou',              'Zou',                'Mink Tribe. Raizo of the Minks. Road Poneglyphs.',         'Whole Cake Island Saga', 751, 779, 1500, 28, 65, 45, 'hard'),
('whole_cake',       'Whole Cake Island',  'Big Mom. Vinsmoke. Saving Sanji.',                         'Whole Cake Island Saga', 783, 877, 4000, 29, 70, 42, 'legendary'),
('levely',           'Levely',             'World leaders convene. Revolutionary Army.',               'Wano Saga',          878,  889,  800,  30, 74, 40, 'normal'),
('wano',             'Wano',               'Kaido and Big Mom. The raid on Onigashima. Gear 5.',       'Wano Saga',          890,  1085, 8000, 31, 80, 35, 'legendary'),
('egghead',          'Egghead',            'Dr. Vegapunk. The future island.',                         'Final Saga',         1086, 1122, 5000, 32, 86, 30, 'legendary');

-- ============================================================
-- SEED DATA — DEVIL FRUITS (Achievements)
-- ============================================================

INSERT INTO devil_fruits (slug, name, type, rarity, description, power_description, color_from, color_to, requirement_type, requirement_value, bounty_reward) VALUES
('gomu_gomu',     'Gomu Gomu no Mi',    'Paramecia', 'common',    'The fruit that started it all.',                     'Your body is rubber. You can stretch to reach any episode.',  '#ef4444', '#f97316', 'episodes_watched', 1,    100),
('bara_bara',     'Bara Bara no Mi',    'Paramecia', 'common',    'Buggy''s fruit. Immunity to blades.',                'You cannot be cut by distractions.',                          '#3b82f6', '#60a5fa', 'episodes_watched', 10,   200),
('hana_hana',     'Hana Hana no Mi',   'Paramecia', 'rare',      'Robin''s fruit. Bloom body parts anywhere.',         'You have eyes everywhere. Nothing escapes your watch.',       '#ec4899', '#f472b6', 'episodes_watched', 25,   500),
('mera_mera',     'Mera Mera no Mi',   'Logia',     'rare',      'Ace''s fruit. The power of fire.',                   'Your passion for One Piece burns uncontrollably.',            '#f97316', '#fbbf24', 'episodes_watched', 50,   800),
('hie_hie',       'Hie Hie no Mi',     'Logia',     'rare',      'Aokiji''s fruit. The power of ice.',                 'You are unshakeable. A true veteran of the Grand Line.',      '#93c5fd', '#bfdbfe', 'episodes_watched', 100,  1000),
('yomi_yomi',     'Yomi Yomi no Mi',   'Paramecia', 'rare',      'Brook''s fruit. Return from death.',                 'You binged so hard you transcended mortality.',               '#a3a3a3', '#d4d4d4', 'episodes_watched', 150,  1500),
('gura_gura',     'Gura Gura no Mi',   'Paramecia', 'legendary', 'Whitebeard''s fruit. Shake the world.',              'Your dedication shakes the entire fandom.',                   '#7c3aed', '#a78bfa', 'episodes_watched', 300,  5000),
('ope_ope',       'Ope Ope no Mi',     'Paramecia', 'legendary', 'Law''s fruit. Absolute surgical precision.',         'You operate on every episode with surgical precision.',        '#06b6d4', '#67e8f9', 'episodes_watched', 500,  8000),
('zoan_nika',     'Hito Hito no Mi: Nika', 'Mythical Zoan', 'mythical', 'The Sun God Nika. Awakened Gear 5.',         'Joy Boy has returned. You are a legend.',                     '#fbbf24', '#fde68a', 'episodes_watched', 1000, 50000);

-- ============================================================
-- SEED DATA — CHALLENGES
-- ============================================================

INSERT INTO challenges (title, description, type, requirement_value, bounty_reward, is_active) VALUES
('East Blue Initiation',   'Watch all 53 episodes of the East Blue arc',     'arc_completion', 53,   2000,  TRUE),
('Perfect Quizzer',        'Pass 10 episode quizzes in a row',               'quiz_perfect',   10,   1500,  TRUE),
('Weekly Nakama',          'Watch 7 episodes in 7 days',                     'watch_streak',   7,    1000,  TRUE),
('100 Episode Club',       'Watch your 100th episode',                       'episode_count',  100,  3000,  TRUE),
('Marineford Survivor',    'Complete the Marineford arc',                     'arc_completion', 31,   5000,  TRUE),
('Gear 5 Unlocked',        'Watch all 1000+ episodes',                       'episode_count',  1000, 100000,TRUE);

-- ============================================================
-- REALTIME: Enable for live crew activity
-- ============================================================

BEGIN;
  ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
  ALTER PUBLICATION supabase_realtime ADD TABLE crew_members;
  ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
COMMIT;
