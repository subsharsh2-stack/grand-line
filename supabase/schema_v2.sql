-- Grand Line One Piece Fan Platform - PostgreSQL Schema v2
-- Supabase-optimized schema with RLS, triggers, and seed data
-- Created: 2026-05-30

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USER TABLES
-- ============================================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  country TEXT,
  timezone TEXT DEFAULT 'UTC',
  current_episode INT DEFAULT 1,
  current_arc TEXT DEFAULT 'east_blue',
  berries BIGINT DEFAULT 0,
  bounty BIGINT DEFAULT 0,
  rank TEXT DEFAULT 'cabin_boy',
  haki_level TEXT DEFAULT 'none',
  total_episodes_watched INT DEFAULT 0,
  total_arcs_completed INT DEFAULT 0,
  watch_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_watch_date DATE,
  crew_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_profiles_crew_id ON profiles(crew_id);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'dark',
  notifications_enabled BOOLEAN DEFAULT true,
  spoiler_protection BOOLEAN DEFAULT true,
  spoiler_level INT DEFAULT 0,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ============================================================================
-- CONTENT TABLES
-- ============================================================================

CREATE TABLE sagas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  order_index INT NOT NULL UNIQUE,
  start_episode INT NOT NULL,
  end_episode INT NOT NULL,
  banner_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sagas_order_index ON sagas(order_index);
CREATE INDEX idx_sagas_slug ON sagas(slug);

CREATE TABLE arcs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  saga_id UUID NOT NULL REFERENCES sagas(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  banner_url TEXT,
  thumbnail_url TEXT,
  start_episode INT NOT NULL,
  end_episode INT NOT NULL,
  order_index INT NOT NULL,
  difficulty_rating INT DEFAULT 3 CHECK (difficulty_rating BETWEEN 1 AND 5),
  emotional_rating INT DEFAULT 3 CHECK (emotional_rating BETWEEN 1 AND 5),
  community_rating NUMERIC DEFAULT 0 CHECK (community_rating BETWEEN 0 AND 5),
  is_filler BOOLEAN DEFAULT false,
  reward_berries INT DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_arcs_saga_id ON arcs(saga_id);
CREATE INDEX idx_arcs_slug ON arcs(slug);
CREATE INDEX idx_arcs_start_episode ON arcs(start_episode);

CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  arc_id UUID NOT NULL REFERENCES arcs(id) ON DELETE RESTRICT,
  episode_number INT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  japanese_title TEXT,
  description TEXT,
  summary TEXT,
  thumbnail_url TEXT,
  duration INT,
  air_date DATE,
  importance_score INT DEFAULT 5 CHECK (importance_score BETWEEN 1 AND 10),
  emotional_score INT DEFAULT 5 CHECK (emotional_score BETWEEN 1 AND 10),
  spoiler_level INT DEFAULT 0,
  is_filler BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_episodes_arc_id ON episodes(arc_id);
CREATE INDEX idx_episodes_episode_number ON episodes(episode_number);
CREATE INDEX idx_episodes_air_date ON episodes(air_date);

CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  first_episode INT,
  spoiler_level INT DEFAULT 0,
  image_url TEXT,
  is_major BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_characters_slug ON characters(slug);
CREATE INDEX idx_characters_is_major ON characters(is_major);

CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  spoiler_level INT DEFAULT 0,
  image_url TEXT,
  arc_id UUID REFERENCES arcs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_arc_id ON locations(arc_id);

-- ============================================================================
-- PROGRESSION TABLES
-- ============================================================================

CREATE TABLE watch_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'watched' CHECK (status IN ('watched', 'in_progress', 'skipped')),
  completion_percentage INT DEFAULT 100 CHECK (completion_percentage BETWEEN 0 AND 100),
  quiz_passed BOOLEAN DEFAULT false,
  bounty_earned INT DEFAULT 0,
  berries_earned INT DEFAULT 0,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, episode_id)
);

CREATE INDEX idx_watch_progress_user_id ON watch_progress(user_id);
CREATE INDEX idx_watch_progress_episode_id ON watch_progress(episode_id);
CREATE INDEX idx_watch_progress_watched_at ON watch_progress(watched_at);

CREATE TABLE arc_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  arc_id UUID NOT NULL REFERENCES arcs(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  episodes_watched INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, arc_id)
);

CREATE INDEX idx_arc_progress_user_id ON arc_progress(user_id);
CREATE INDEX idx_arc_progress_arc_id ON arc_progress(arc_id);

CREATE TABLE bounty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  reason TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bounty_transactions_user_id ON bounty_transactions(user_id);
CREATE INDEX idx_bounty_transactions_created_at ON bounty_transactions(created_at);

CREATE TABLE berries_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  reason TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_berries_transactions_user_id ON berries_transactions(user_id);
CREATE INDEX idx_berries_transactions_created_at ON berries_transactions(created_at);

CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_watch_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_streaks_user_id ON streaks(user_id);

-- ============================================================================
-- GAMIFICATION TABLES
-- ============================================================================

CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical')),
  icon TEXT,
  reward_berries INT DEFAULT 0,
  reward_bounty INT DEFAULT 0,
  criteria JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_rarity ON achievements(rarity);

CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE RESTRICT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);

CREATE TABLE devil_fruits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical')),
  description TEXT,
  spoiler_level INT DEFAULT 0,
  image_url TEXT,
  reward_berries INT DEFAULT 500,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_devil_fruits_slug ON devil_fruits(slug);
CREATE INDEX idx_devil_fruits_rarity ON devil_fruits(rarity);

CREATE TABLE user_devil_fruits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  devil_fruit_id UUID NOT NULL REFERENCES devil_fruits(id) ON DELETE RESTRICT,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, devil_fruit_id)
);

CREATE INDEX idx_user_devil_fruits_user_id ON user_devil_fruits(user_id);
CREATE INDEX idx_user_devil_fruits_devil_fruit_id ON user_devil_fruits(devil_fruit_id);

CREATE TABLE haki_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  required_streak INT NOT NULL UNIQUE,
  description TEXT,
  unlocked_ability TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_haki_levels_name ON haki_levels(name);
CREATE INDEX idx_haki_levels_required_streak ON haki_levels(required_streak);

CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  difficulty TEXT DEFAULT 'normal' CHECK (difficulty IN ('easy', 'normal', 'hard', 'legendary')),
  category TEXT,
  reward_berries INT DEFAULT 0,
  reward_bounty INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  criteria JSONB,
  arc_id UUID REFERENCES arcs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenges_is_active ON challenges(is_active);
CREATE INDEX idx_challenges_arc_id ON challenges(arc_id);
CREATE INDEX idx_challenges_start_date ON challenges(start_date);

CREATE TABLE user_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  progress INT DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

CREATE INDEX idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX idx_user_challenges_challenge_id ON user_challenges(challenge_id);

-- ============================================================================
-- CREW SYSTEM TABLES
-- ============================================================================

CREATE TABLE crews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  banner_url TEXT,
  captain_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  total_bounty BIGINT DEFAULT 0,
  member_count INT DEFAULT 1,
  max_members INT DEFAULT 20 CHECK (max_members > 0),
  season_rank INT,
  is_recruiting BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crews_slug ON crews(slug);
CREATE INDEX idx_crews_captain_id ON crews(captain_id);
CREATE INDEX idx_crews_is_recruiting ON crews(is_recruiting);

CREATE TABLE crew_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'recruit',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crew_members_crew_id ON crew_members(crew_id);
CREATE INDEX idx_crew_members_user_id ON crew_members(user_id);

CREATE TABLE crew_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crew_id UUID NOT NULL REFERENCES crews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  inviter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_crew_invites_crew_id ON crew_invites(crew_id);
CREATE INDEX idx_crew_invites_user_id ON crew_invites(user_id);
CREATE INDEX idx_crew_invites_status ON crew_invites(status);

-- ============================================================================
-- COMMUNITY TABLES
-- ============================================================================

CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  arc_id UUID REFERENCES arcs(id) ON DELETE SET NULL,
  episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL,
  post_type TEXT DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'theory', 'artwork', 'news', 'poll')),
  spoiler_level INT DEFAULT 0,
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_community_posts_user_id ON community_posts(user_id);
CREATE INDEX idx_community_posts_arc_id ON community_posts(arc_id);
CREATE INDEX idx_community_posts_episode_id ON community_posts(episode_id);
CREATE INDEX idx_community_posts_post_type ON community_posts(post_type);
CREATE INDEX idx_community_posts_is_pinned ON community_posts(is_pinned);
CREATE INDEX idx_community_posts_created_at ON community_posts(created_at DESC);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  spoiler_level INT DEFAULT 0,
  upvotes INT DEFAULT 0,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_reactions_user_id ON reactions(user_id);
CREATE INDEX idx_reactions_target_id ON reactions(target_id);

CREATE TABLE polls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_polls_post_id ON polls(post_id);

CREATE TABLE poll_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  votes INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);

-- ============================================================================
-- MARKETPLACE TABLES
-- ============================================================================

CREATE TABLE merch_deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price NUMERIC NOT NULL CHECK (price > 0),
  affiliate_url TEXT,
  category TEXT,
  brand TEXT,
  arc_id UUID REFERENCES arcs(id) ON DELETE SET NULL,
  episode_id UUID REFERENCES episodes(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_merch_deals_is_active ON merch_deals(is_active);
CREATE INDEX idx_merch_deals_category ON merch_deals(category);
CREATE INDEX idx_merch_deals_ends_at ON merch_deals(ends_at);

CREATE TABLE fan_art_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'sold')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fan_art_listings_user_id ON fan_art_listings(user_id);
CREATE INDEX idx_fan_art_listings_status ON fan_art_listings(status);

CREATE TABLE marketplace_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_marketplace_clicks_user_id ON marketplace_clicks(user_id);
CREATE INDEX idx_marketplace_clicks_clicked_at ON marketplace_clicks(clicked_at);

-- ============================================================================
-- AI & EVENTS TABLES
-- ============================================================================

CREATE TABLE world_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'ended')),
  event_type TEXT NOT NULL,
  reward_berries INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_world_events_status ON world_events(status);
CREATE INDEX idx_world_events_start_date ON world_events(start_date);

CREATE TABLE activity_feed (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX idx_activity_feed_created_at ON activity_feed(created_at DESC);

CREATE TABLE ai_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  memory_key TEXT NOT NULL,
  memory_value TEXT NOT NULL,
  importance INT DEFAULT 5 CHECK (importance BETWEEN 1 AND 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, memory_key)
);

CREATE INDEX idx_ai_memories_user_id ON ai_memories(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE arc_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE bounty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE berries_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devil_fruits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read all, update own
CREATE POLICY profiles_read_all ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY profiles_delete_own ON profiles FOR DELETE USING (auth.uid() = id);

-- User Settings: users can read/write own
CREATE POLICY user_settings_read_own ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_settings_insert_own ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_settings_update_own ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY user_settings_delete_own ON user_settings FOR DELETE USING (auth.uid() = user_id);

-- Watch Progress: users can read/write own
CREATE POLICY watch_progress_read_own ON watch_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY watch_progress_insert_own ON watch_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY watch_progress_update_own ON watch_progress FOR UPDATE USING (auth.uid() = user_id);

-- Arc Progress: users can read/write own
CREATE POLICY arc_progress_read_own ON arc_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY arc_progress_insert_own ON arc_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY arc_progress_update_own ON arc_progress FOR UPDATE USING (auth.uid() = user_id);

-- Bounty Transactions: users can read own, insert own
CREATE POLICY bounty_transactions_read_own ON bounty_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY bounty_transactions_insert_own ON bounty_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Berries Transactions: users can read own, insert own
CREATE POLICY berries_transactions_read_own ON berries_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY berries_transactions_insert_own ON berries_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks: users can read/write own
CREATE POLICY streaks_read_own ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY streaks_insert_own ON streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY streaks_update_own ON streaks FOR UPDATE USING (auth.uid() = user_id);

-- Community Posts: all can read, authenticated can insert, owner can update/delete
CREATE POLICY community_posts_read_all ON community_posts FOR SELECT USING (true);
CREATE POLICY community_posts_insert_authenticated ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY community_posts_update_own ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY community_posts_delete_own ON community_posts FOR DELETE USING (auth.uid() = user_id);

-- Comments: all can read, authenticated can insert, owner can update/delete
CREATE POLICY comments_read_all ON comments FOR SELECT USING (true);
CREATE POLICY comments_insert_authenticated ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY comments_update_own ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY comments_delete_own ON comments FOR DELETE USING (auth.uid() = user_id);

-- Reactions: authenticated can manage own
CREATE POLICY reactions_read_own ON reactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY reactions_insert_own ON reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY reactions_delete_own ON reactions FOR DELETE USING (auth.uid() = user_id);

-- Crew Members: authenticated can read, users can manage own
CREATE POLICY crew_members_read_all ON crew_members FOR SELECT USING (true);
CREATE POLICY crew_members_insert_own ON crew_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY crew_members_delete_own ON crew_members FOR DELETE USING (auth.uid() = user_id);

-- Crew Invites: authenticated can read, users can manage own
CREATE POLICY crew_invites_read_authenticated ON crew_invites FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY crew_invites_insert_own ON crew_invites FOR INSERT WITH CHECK (auth.uid() = inviter_id);
CREATE POLICY crew_invites_update_own ON crew_invites FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = inviter_id);

-- User Achievements: users can read/write own
CREATE POLICY user_achievements_read_own ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_achievements_insert_own ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Devil Fruits: users can read/write own
CREATE POLICY user_devil_fruits_read_own ON user_devil_fruits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_devil_fruits_insert_own ON user_devil_fruits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Challenges: users can read/write own
CREATE POLICY user_challenges_read_own ON user_challenges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY user_challenges_insert_own ON user_challenges FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY user_challenges_update_own ON user_challenges FOR UPDATE USING (auth.uid() = user_id);

-- Activity Feed: users can read own
CREATE POLICY activity_feed_read_own ON activity_feed FOR SELECT USING (auth.uid() = user_id);

-- AI Memories: users can read/write own
CREATE POLICY ai_memories_read_own ON ai_memories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ai_memories_insert_own ON ai_memories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ai_memories_update_own ON ai_memories FOR UPDATE USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function: Handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_username TEXT;
  v_counter INT := 0;
BEGIN
  v_username := COALESCE(NEW.raw_user_meta_data->>'username',
                         SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTR(NEW.id::TEXT, 1, 8));

  -- Check for collision and add counter if needed
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = v_username) LOOP
    v_counter := v_counter + 1;
    v_username := COALESCE(NEW.raw_user_meta_data->>'username',
                           SPLIT_PART(NEW.email, '@', 1)) || '_' || v_counter;
  END LOOP;

  INSERT INTO profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    v_username,
    COALESCE(NEW.raw_user_meta_data->>'display_name', v_username),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO streaks (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function: Update arc progress on watch progress insert
CREATE OR REPLACE FUNCTION update_arc_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO arc_progress (user_id, arc_id, status, episodes_watched)
  SELECT NEW.user_id, e.arc_id, 'in_progress', 1
  FROM episodes e
  WHERE e.id = NEW.episode_id
  ON CONFLICT (user_id, arc_id) DO UPDATE
  SET episodes_watched = arc_progress.episodes_watched + 1,
      updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_watch_progress_insert
AFTER INSERT ON watch_progress
FOR EACH ROW EXECUTE FUNCTION update_arc_progress();

-- Function: Update profile stats on watch progress
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET total_episodes_watched = total_episodes_watched + 1,
      updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_watch_progress_update_stats
AFTER INSERT ON watch_progress
FOR EACH ROW EXECUTE FUNCTION update_profile_stats();

-- Function: Update crew bounty on bounty transaction
CREATE OR REPLACE FUNCTION update_crew_bounty()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE crews
  SET total_bounty = total_bounty + NEW.amount
  WHERE captain_id IN (
    SELECT cm.crew_id FROM crew_members cm WHERE cm.user_id = NEW.user_id
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_bounty_transaction_insert
AFTER INSERT ON bounty_transactions
FOR EACH ROW EXECUTE FUNCTION update_crew_bounty();

-- Function: Update streak on watch progress
CREATE OR REPLACE FUNCTION update_streak()
RETURNS TRIGGER AS $$
DECLARE
  v_last_date DATE;
  v_current_streak INT;
BEGIN
  SELECT last_watch_date INTO v_last_date FROM streaks WHERE user_id = NEW.user_id;

  IF v_last_date IS NULL THEN
    UPDATE streaks
    SET current_streak = 1,
        longest_streak = GREATEST(longest_streak, 1),
        last_watch_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSIF v_last_date = CURRENT_DATE THEN
    -- Same day, no change
    NULL;
  ELSIF v_last_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day, increment streak
    UPDATE streaks
    SET current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        last_watch_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  ELSE
    -- Streak broken, reset
    UPDATE streaks
    SET current_streak = 1,
        last_watch_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE user_id = NEW.user_id;
  END IF;

  -- Update profile watch_streak
  SELECT current_streak INTO v_current_streak FROM streaks WHERE user_id = NEW.user_id;
  UPDATE profiles
  SET watch_streak = v_current_streak,
      updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_watch_progress_update_streak
AFTER INSERT ON watch_progress
FOR EACH ROW EXECUTE FUNCTION update_streak();

-- Function: Award berries on watch progress
CREATE OR REPLACE FUNCTION award_berries()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO berries_transactions (user_id, amount, reason, source)
  VALUES (NEW.user_id, 50, 'Episode watched', 'watch_progress');

  UPDATE profiles
  SET berries = berries + 50,
      updated_at = NOW()
  WHERE id = NEW.user_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_watch_progress_award_berries
AFTER INSERT ON watch_progress
FOR EACH ROW EXECUTE FUNCTION award_berries();

-- ============================================================================
-- SEED DATA
-- ============================================================================

DO $$
BEGIN
  -- Insert Sagas
  INSERT INTO sagas (name, slug, description, order_index, start_episode, end_episode, banner_url, thumbnail_url)
  VALUES
    ('East Blue Saga', 'east_blue', 'The beginning of Luffy''s adventure', 1, 1, 61, NULL, NULL),
    ('Alabasta Saga', 'alabasta', 'Desert kingdom and dreams', 2, 62, 135, NULL, NULL),
    ('Sky Island Saga', 'sky_island', 'Adventure in the clouds', 3, 136, 206, NULL, NULL),
    ('Water Seven Saga', 'water_seven', 'Aquatic city and betrayal', 4, 207, 325, NULL, NULL),
    ('Thriller Bark Saga', 'thriller_bark', 'Shadows and zombies', 5, 326, 384, NULL, NULL),
    ('Summit War Saga', 'summit_war', 'The greatest war', 6, 385, 516, NULL, NULL),
    ('Fish-Man Island Saga', 'fish_man_island', 'Beneath the sea', 7, 517, 574, NULL, NULL),
    ('Dressrosa Saga', 'dressrosa', 'Doll kingdom', 8, 575, 746, NULL, NULL),
    ('Whole Cake Island Saga', 'whole_cake_island', 'Mother''s cake', 9, 747, 877, NULL, NULL),
    ('Wano Country Saga', 'wano', 'Samurai and tradition', 10, 878, 1085, NULL, NULL),
    ('Egghead Saga', 'egghead', 'Future technology', 11, 1086, 1200, NULL, NULL)
  ON CONFLICT (name) DO NOTHING;

  -- Insert Arcs for East Blue
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Romance Dawn', 'romance_dawn', 'The beginning', 1, 3, 1, 1, 2, 4.5, false, 500
  FROM sagas WHERE slug = 'east_blue'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Shells Town', 'shells_town', 'First village', 4, 8, 2, 1, 2, 4.2, false, 500
  FROM sagas WHERE slug = 'east_blue'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Kaya''s Village', 'kayas_village', 'The captain''s treasure', 9, 20, 3, 2, 3, 4.1, false, 750
  FROM sagas WHERE slug = 'east_blue'
  ON CONFLICT (slug) DO NOTHING;

  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Baratie', 'baratie', 'Floating restaurant', 21, 30, 4, 2, 4, 4.6, false, 1000
  FROM sagas WHERE slug = 'east_blue'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Alabasta
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Alabasta Arc', 'alabasta_main', 'Desert kingdom rebellion', 62, 135, 1, 4, 5, 4.8, false, 2000
  FROM sagas WHERE slug = 'alabasta'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Sky Island
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Sky Island Arc', 'sky_island_main', 'In the clouds', 136, 206, 1, 4, 4, 4.5, false, 1500
  FROM sagas WHERE slug = 'sky_island'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Water Seven
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Water Seven Arc', 'water_seven_main', 'City of water', 207, 325, 1, 4, 5, 4.7, false, 2000
  FROM sagas WHERE slug = 'water_seven'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Thriller Bark
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Thriller Bark Arc', 'thriller_bark_main', 'Shadow island', 326, 384, 1, 4, 4, 4.4, false, 1500
  FROM sagas WHERE slug = 'thriller_bark'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Summit War
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Summit War of Marineford', 'marineford', 'Greatest war', 385, 516, 1, 5, 5, 4.9, false, 3000
  FROM sagas WHERE slug = 'summit_war'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Fish-Man Island
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Fish-Man Island Arc', 'fish_man_island_main', 'Under the sea', 517, 574, 1, 3, 4, 4.3, false, 1500
  FROM sagas WHERE slug = 'fish_man_island'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Dressrosa
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Dressrosa Arc', 'dressrosa_main', 'Kingdom of dolls', 575, 746, 1, 4, 4, 4.6, false, 2000
  FROM sagas WHERE slug = 'dressrosa'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Whole Cake Island
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Whole Cake Island Arc', 'whole_cake_main', 'Mother''s domain', 747, 877, 1, 4, 5, 4.7, false, 2000
  FROM sagas WHERE slug = 'whole_cake_island'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Wano
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Wano Country Arc', 'wano_main', 'Samurai nation', 878, 1085, 1, 5, 5, 4.8, false, 3000
  FROM sagas WHERE slug = 'wano'
  ON CONFLICT (slug) DO NOTHING;

  -- Insert Arcs for Egghead
  INSERT INTO arcs (saga_id, name, slug, description, start_episode, end_episode, order_index, difficulty_rating, emotional_rating, community_rating, is_filler, reward_berries)
  SELECT id, 'Egghead Arc', 'egghead_main', 'Island of science', 1086, 1200, 1, 5, 4, 4.5, false, 2500
  FROM sagas WHERE slug = 'egghead'
  ON CONFLICT (slug) DO NOTHING;

EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Insert Haki Levels
DO $$
BEGIN
  INSERT INTO haki_levels (name, type, required_streak, description, unlocked_ability)
  VALUES
    ('observation_basic', 'Observation', 3, 'Basic observation haki unlocked', 'Sense nearby presence'),
    ('armament_basic', 'Armament', 7, 'Basic armament haki unlocked', 'Harden body'),
    ('advanced_armament', 'Armament', 30, 'Advanced armament haki', 'Internal destruction'),
    ('advanced_observation', 'Observation', 60, 'Advanced observation haki', 'Future sight'),
    ('conquerors', 'Conqueror', 90, 'Conqueror''s haki', 'King''s will'),
    ('advanced_conquerors', 'Conqueror', 365, 'Advanced conqueror''s haki', 'Imbue with conqueror''s haki')
  ON CONFLICT (name) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Insert Achievements
DO $$
BEGIN
  INSERT INTO achievements (title, description, category, rarity, icon, reward_berries, reward_bounty, criteria)
  VALUES
    ('First Steps', 'Watch your first episode', 'Journey', 'common', '🎬', 100, 0, '{"episodes_watched": 1}'),
    ('East Blue Explorer', 'Complete the East Blue Saga', 'Journey', 'uncommon', '🗺️', 500, 1000, '{"arcs_completed": 1, "saga": "east_blue"}'),
    ('Century Milestone', 'Watch 100 episodes', 'Journey', 'uncommon', '💯', 1000, 5000, '{"episodes_watched": 100}'),
    ('Thousand Watcher', 'Watch 1000 episodes', 'Journey', 'epic', '🎯', 5000, 25000, '{"episodes_watched": 1000}'),
    ('Streak Master', 'Maintain a 30-day watch streak', 'Community', 'rare', '🔥', 2000, 10000, '{"watch_streak": 30}'),
    ('Legendary Streak', 'Maintain a 365-day watch streak', 'Community', 'legendary', '⭐', 10000, 100000, '{"watch_streak": 365}'),
    ('Theory Crafter', 'Create 10 discussion posts', 'Community', 'uncommon', '🧠', 500, 2000, '{"posts_created": 10}'),
    ('Community Voice', 'Get 1000 upvotes on posts', 'Community', 'rare', '📢', 3000, 15000, '{"total_upvotes": 1000}'),
    ('Collector', 'Own 5 devil fruits', 'Collector', 'uncommon', '😈', 1000, 5000, '{"devil_fruits": 5}'),
    ('Fruit Master', 'Own 10 devil fruits', 'Collector', 'epic', '🌺', 5000, 25000, '{"devil_fruits": 10}'),
    ('Achievement Seeker', 'Unlock 10 achievements', 'Legendary', 'uncommon', '🏆', 1000, 5000, '{"achievements": 10}'),
    ('Master of All', 'Unlock 50 achievements', 'Legendary', 'legendary', '👑', 10000, 100000, '{"achievements": 50}'),
    ('Berry Banker', 'Accumulate 100,000 berries', 'Collector', 'rare', '💰', 2000, 10000, '{"berries": 100000}'),
    ('Bounty Hunter', 'Reach 1,000,000 bounty', 'Legendary', 'epic', '🎖️', 5000, 50000, '{"bounty": 1000000}'),
    ('Crew Captain', 'Create and lead a crew', 'Community', 'rare', '⚓', 3000, 15000, '{"is_crew_captain": true}'),
    ('Quiz Master', 'Pass 50 episode quizzes', 'Journey', 'rare', '❓', 2000, 10000, '{"quizzes_passed": 50}'),
    ('Speed Reader', 'Watch 10 episodes in a day', 'Journey', 'uncommon', '⚡', 500, 5000, '{"episodes_in_day": 10}'),
    ('Night Owl', 'Watch an episode at 2 AM', 'Hidden', 'uncommon', '🌙', 250, 1000, '{"night_watch": true}'),
    ('Weekend Warrior', 'Watch 5 episodes on weekends', 'Journey', 'common', '🎮', 300, 2000, '{"weekend_episodes": 5}'),
    ('Grand Finale Watcher', 'Watch the final episode of an arc', 'Journey', 'rare', '🎊', 2000, 10000, '{"arc_complete": true}')
  ON CONFLICT (title) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Insert Devil Fruits
DO $$
BEGIN
  INSERT INTO devil_fruits (name, slug, type, rarity, description, spoiler_level, image_url, reward_berries)
  VALUES
    ('Gum-Gum Fruit', 'gum_gum', 'Paramecia', 'rare', 'Grants rubber body elasticity', 0, NULL, 1000),
    ('Slice-Slice Fruit', 'slice_slice', 'Paramecia', 'epic', 'Cut anything like paper', 1, NULL, 2000),
    ('Spike-Spike Fruit', 'spike_spike', 'Paramecia', 'uncommon', 'Create sharp spikes', 0, NULL, 500),
    ('Bomb-Bomb Fruit', 'bomb_bomb', 'Paramecia', 'uncommon', 'Turn into a bomb', 0, NULL, 500),
    ('Chop-Chop Fruit', 'chop_chop', 'Paramecia', 'rare', 'Separate body parts at will', 0, NULL, 1000),
    ('Flame-Flame Fruit', 'flame_flame', 'Logia', 'legendary', 'Control and become fire', 2, NULL, 5000),
    ('Ice-Ice Fruit', 'ice_ice', 'Logia', 'legendary', 'Control and become ice', 2, NULL, 5000),
    ('Sand-Sand Fruit', 'sand_sand', 'Logia', 'legendary', 'Control and become sand', 1, NULL, 5000),
    ('Dark-Dark Fruit', 'dark_dark', 'Logia', 'mythical', 'Absorb darkness and gravity', 3, NULL, 10000),
    ('Quake-Quake Fruit', 'quake_quake', 'Paramecia', 'mythical', 'Create devastating earthquakes', 3, NULL, 10000)
  ON CONFLICT (name) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- Insert Default Challenges
DO $$
BEGIN
  INSERT INTO challenges (title, description, type, difficulty, category, reward_berries, reward_bounty, is_active, criteria)
  VALUES
    ('Episode Blitz', 'Watch 5 episodes in one day', 'speed', 'normal', 'watch', 500, 2000, true, '{"target_episodes": 5, "timeframe": "1_day"}'),
    ('Arc Master', 'Complete an entire arc', 'completion', 'hard', 'watch', 1500, 10000, true, '{"arc_completion": true}'),
    ('Quiz Champion', 'Pass 10 episode quizzes without failing', 'quiz', 'normal', 'knowledge', 800, 5000, true, '{"consecutive_passes": 10}'),
    ('Social Butterfly', 'Create 5 community posts', 'community', 'easy', 'social', 600, 3000, true, '{"posts": 5}'),
    ('Streak Keeper', 'Maintain a 7-day watch streak', 'streaks', 'normal', 'consistency', 700, 4000, true, '{"streak_days": 7}')
  ON CONFLICT (title) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  NULL;
END $$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Create views for commonly accessed data
CREATE OR REPLACE VIEW user_stats_view AS
SELECT
  p.id,
  p.username,
  p.display_name,
  p.total_episodes_watched,
  p.total_arcs_completed,
  p.berries,
  p.bounty,
  p.rank,
  p.haki_level,
  s.current_streak,
  s.longest_streak,
  COUNT(DISTINCT ua.achievement_id) as achievements_earned,
  COUNT(DISTINCT udf.devil_fruit_id) as devil_fruits_owned
FROM profiles p
LEFT JOIN streaks s ON p.id = s.user_id
LEFT JOIN user_achievements ua ON p.id = ua.user_id
LEFT JOIN user_devil_fruits udf ON p.id = udf.user_id
GROUP BY p.id, s.id;

CREATE OR REPLACE VIEW leaderboard_view AS
SELECT
  p.id,
  p.username,
  p.display_name,
  p.avatar_url,
  p.total_episodes_watched,
  p.bounty,
  p.rank,
  ROW_NUMBER() OVER (ORDER BY p.bounty DESC) as bounty_rank,
  ROW_NUMBER() OVER (ORDER BY p.total_episodes_watched DESC) as episodes_rank
FROM profiles p
ORDER BY p.bounty DESC;

-- ============================================================================
-- End of Schema
-- ============================================================================
