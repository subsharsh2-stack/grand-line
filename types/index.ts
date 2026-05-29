// ============================================================
// GRAND LINE — TypeScript Types
// ============================================================

export type UserRank =
  | "east_blue_pirate"
  | "rookie"
  | "supernova"
  | "warlord"
  | "yonko_commander"
  | "yonko"
  | "pirate_king";

export type ArcStatus = "not_started" | "in_progress" | "completed";
export type ListingStatus = "active" | "sold" | "removed";
export type DevilFruitRarity = "common" | "rare" | "legendary" | "mythical";

// ---- Profile ------------------------------------------------
export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  bounty: number;
  rank: UserRank;
  haki_level: number;
  watch_streak: number;
  longest_streak: number;
  last_watched_at: string | null;
  total_episodes_watched: number;
  total_arcs_completed: number;
  crew_id: string | null;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

// ---- Arc ----------------------------------------------------
export interface Arc {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  saga: string;
  episode_start: number;
  episode_end: number;
  episode_count: number;
  difficulty: "intro" | "normal" | "hard" | "legendary";
  bounty_reward: number;
  cover_image: string | null;
  island_image: string | null;
  map_x: number | null;
  map_y: number | null;
  is_filler: boolean;
  order_index: number;
}

// ---- Episode ------------------------------------------------
export interface Episode {
  id: number;
  episode_number: number;
  title: string;
  arc_id: number | null;
  arc_name: string | null;
  synopsis: string | null;
  thumbnail_url: string | null;
  crunchyroll_url: string | null;
  netflix_url: string | null;
  duration_minutes: number;
  bounty_reward: number;
  bonus_bounty: number;
  is_filler: boolean;
  is_recap: boolean;
  importance_level: number;
  has_figure_deal: boolean;
  figure_deal_url: string | null;
  figure_deal_discount: number | null;
  figure_deal_description: string | null;
  quiz_question: string | null;
  quiz_options: QuizOption[] | null;
  quiz_explanation: string | null;
  tags: string[] | null;
}

export interface QuizOption {
  text: string;
  is_correct: boolean;
}

// ---- Watch Progress -----------------------------------------
export interface WatchProgress {
  id: string;
  user_id: string;
  episode_id: number;
  watched_at: string;
  quiz_passed: boolean;
  bounty_earned: number;
}

// ---- Arc Progress -------------------------------------------
export interface ArcProgress {
  id: string;
  user_id: string;
  arc_id: number;
  status: ArcStatus;
  episodes_watched: number;
  completed_at: string | null;
  bounty_earned: number;
}

// ---- Devil Fruit (Achievement) --------------------------------
export interface DevilFruit {
  id: number;
  slug: string;
  name: string;
  type: string;
  rarity: DevilFruitRarity;
  description: string | null;
  power_description: string | null;
  icon_url: string | null;
  color_from: string;
  color_to: string;
  requirement_type: string;
  requirement_value: number | null;
  bounty_reward: number;
}

export interface UserDevilFruit {
  id: string;
  user_id: string;
  devil_fruit_id: number;
  earned_at: string;
  is_equipped: boolean;
  devil_fruits?: DevilFruit;
}

// ---- Crew ---------------------------------------------------
export interface Crew {
  id: string;
  name: string;
  slug: string;
  motto: string | null;
  description: string | null;
  flag_url: string | null;
  captain_id: string | null;
  total_bounty: number;
  member_count: number;
  max_members: number;
  is_recruiting: boolean;
  created_at: string;
  captain?: Profile;
  members?: CrewMember[];
}

export interface CrewMember {
  id: string;
  crew_id: string;
  user_id: string;
  role: "captain" | "first_mate" | "nakama";
  joined_at: string;
  contribution_bounty: number;
  profile?: Profile;
}

// ---- Challenge ----------------------------------------------
export interface Challenge {
  id: string;
  title: string;
  description: string | null;
  type: string;
  requirement_value: number | null;
  bounty_reward: number;
  devil_fruit_reward_id: number | null;
  sponsor_name: string | null;
  sponsor_logo_url: string | null;
  sponsor_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  completed_at: string | null;
  challenge?: Challenge;
}

// ---- Fan Art Marketplace ------------------------------------
export interface FanArtListing {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  image_url: string;
  arc_tags: string[] | null;
  character_tags: string[] | null;
  price_cents: number;
  original_only: boolean;
  status: ListingStatus;
  view_count: number;
  sales_count: number;
  created_at: string;
  seller?: Profile;
}

// ---- Merch Deal ---------------------------------------------
export interface MerchDeal {
  id: string;
  episode_id: number | null;
  arc_id: number | null;
  title: string;
  description: string | null;
  image_url: string | null;
  product_url: string;
  affiliate_partner: string | null;
  discount_pct: number | null;
  original_price_usd: number | null;
  sale_price_usd: number | null;
  is_active: boolean;
}

// ---- Activity Feed ------------------------------------------
export interface ActivityItem {
  id: string;
  user_id: string;
  crew_id: string | null;
  type: string;
  data: Record<string, unknown>;
  created_at: string;
  profile?: Profile;
}

// ---- Bounty Transaction -------------------------------------
export interface BountyTransaction {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  reference_id: string | null;
  created_at: string;
}

// ---- UI Helpers ---------------------------------------------
export const RANK_CONFIG: Record<UserRank, { label: string; color: string; min_bounty: number; icon: string }> = {
  east_blue_pirate: { label: "East Blue Pirate",   color: "#94a3b8", min_bounty: 0,       icon: "⚓" },
  rookie:           { label: "Rookie Pirate",       color: "#60a5fa", min_bounty: 100,     icon: "🏴‍☠️" },
  supernova:        { label: "Supernova",            color: "#34d399", min_bounty: 500,     icon: "⚡" },
  warlord:          { label: "Warlord of the Sea",  color: "#a78bfa", min_bounty: 1000,    icon: "⚔️" },
  yonko_commander:  { label: "Yonko Commander",     color: "#f97316", min_bounty: 10000,   icon: "🔥" },
  yonko:            { label: "Yonko",               color: "#f5a623", min_bounty: 100000,  icon: "👑" },
  pirate_king:      { label: "Pirate King",         color: "#fde68a", min_bounty: 1000000, icon: "☀️" },
};

export const ARC_DIFFICULTY_CONFIG = {
  intro:     { label: "Beginner",   color: "#34d399", emoji: "🌱" },
  normal:    { label: "Normal",     color: "#60a5fa", emoji: "⚔️" },
  hard:      { label: "Hard",       color: "#f97316", emoji: "🔥" },
  legendary: { label: "Legendary", color: "#f5a623", emoji: "💀" },
};

export const DEVIL_FRUIT_RARITY_CONFIG: Record<DevilFruitRarity, { label: string; color: string; glow: string }> = {
  common:    { label: "Common",    color: "#94a3b8", glow: "rgba(148,163,184,0.4)" },
  rare:      { label: "Rare",      color: "#60a5fa", glow: "rgba(96,165,250,0.4)"  },
  legendary: { label: "Legendary",color: "#f5a623", glow: "rgba(245,166,35,0.4)"  },
  mythical:  { label: "Mythical", color: "#c084fc", glow: "rgba(192,132,252,0.4)" },
};

export function formatBounty(bounty: number): string {
  if (bounty >= 1_000_000_000) return `${(bounty / 1_000_000_000).toFixed(1)}B`;
  if (bounty >= 1_000_000)     return `${(bounty / 1_000_000).toFixed(1)}M`;
  if (bounty >= 1_000)         return `${(bounty / 1_000).toFixed(1)}K`;
  return bounty.toString();
}
