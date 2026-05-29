// ============================================================
// GRAND LINE — Gamification Engine
// ============================================================

import { UserRank, RANK_CONFIG, formatBounty } from "@/types";

// ---- Rank Calculation ----------------------------------------
export function getRankFromBounty(bounty: number): UserRank {
  if (bounty >= 1_000_000) return "pirate_king";
  if (bounty >= 100_000)   return "yonko";
  if (bounty >= 10_000)    return "yonko_commander";
  if (bounty >= 1_000)     return "warlord";
  if (bounty >= 500)       return "supernova";
  if (bounty >= 100)       return "rookie";
  return "east_blue_pirate";
}

export function getNextRank(currentRank: UserRank): UserRank | null {
  const ranks: UserRank[] = [
    "east_blue_pirate", "rookie", "supernova", "warlord",
    "yonko_commander", "yonko", "pirate_king"
  ];
  const idx = ranks.indexOf(currentRank);
  return idx < ranks.length - 1 ? ranks[idx + 1] : null;
}

export function getBountyToNextRank(bounty: number, currentRank: UserRank): number | null {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) return null;
  return RANK_CONFIG[nextRank].min_bounty - bounty;
}

export function getRankProgress(bounty: number, currentRank: UserRank): number {
  const nextRank = getNextRank(currentRank);
  if (!nextRank) return 100;
  const currentMin = RANK_CONFIG[currentRank].min_bounty;
  const nextMin = RANK_CONFIG[nextRank].min_bounty;
  return Math.min(100, ((bounty - currentMin) / (nextMin - currentMin)) * 100);
}

// ---- Streak Multiplier ----------------------------------------
export function getStreakMultiplier(streak: number): number {
  if (streak >= 30) return 3.0;
  if (streak >= 14) return 2.0;
  if (streak >= 7)  return 1.5;
  if (streak >= 3)  return 1.25;
  return 1.0;
}

export function getStreakTitle(streak: number): string {
  if (streak >= 100) return "The Pirate King's Dedication";
  if (streak >= 50)  return "Yonko-level Commitment";
  if (streak >= 30)  return "Conqueror's Will";
  if (streak >= 14)  return "Two-Week Nakama";
  if (streak >= 7)   return "Weekly Warrior";
  if (streak >= 3)   return "Getting Into It";
  if (streak >= 1)   return "The Journey Begins";
  return "Time to Set Sail";
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 30) return "🔥🔥🔥";
  if (streak >= 14) return "🔥🔥";
  if (streak >= 7)  return "🔥";
  if (streak >= 3)  return "⚡";
  return "💧";
}

// ---- Episode Bounty Calculation -------------------------------
export function calculateEpisodeBounty(
  baseBounty: number,
  bonusBounty: number,
  quizPassed: boolean,
  streak: number
): { total: number; base: number; quiz: number; streak: number } {
  const base = baseBounty;
  const quiz = quizPassed ? bonusBounty : 0;
  const streakMultiplier = getStreakMultiplier(streak);
  const streakBonus = Math.round((base + quiz) * (streakMultiplier - 1));
  return {
    total: base + quiz + streakBonus,
    base,
    quiz,
    streak: streakBonus,
  };
}

// ---- Haki Levels (Premium power indicator) --------------------
export const HAKI_LEVELS = [
  { level: 0, name: "No Haki",           description: "An ordinary person",           color: "#475569" },
  { level: 1, name: "Observation Haki",  description: "You sense things others miss", color: "#60a5fa" },
  { level: 2, name: "Armament Haki",     description: "Your will becomes armor",       color: "#a78bfa" },
  { level: 3, name: "Conqueror's Haki",  description: "One in a million. A king.",    color: "#f5a623" },
];

// ---- Achievement checking -------------------------------------
export interface AchievementCheck {
  devilFruitSlug: string;
  earned: boolean;
  progress: number; // 0-100
}

export function checkDevilFruitProgress(
  episodesWatched: number,
  targetEpisodes: number
): number {
  return Math.min(100, (episodesWatched / targetEpisodes) * 100);
}

// ---- Bounty formatting ----------------------------------------
export { formatBounty };

export function formatBountyFull(bounty: number): string {
  return `฿${bounty.toLocaleString()}`;
}

// ---- Wanted Poster Generation ---------------------------------
export interface WantedPosterData {
  username: string;
  displayName: string;
  bounty: number;
  rank: UserRank;
  totalEpisodes: number;
  streak: number;
  crewName?: string;
  devilFruitName?: string;
  joinedDate: string;
}

export function generateWantedPosterEpithet(
  data: WantedPosterData
): string {
  const { rank, totalEpisodes, streak, devilFruitName } = data;

  if (rank === "pirate_king") return "The Pirate King";
  if (rank === "yonko") return "The Emperor of the New World";
  if (devilFruitName) return `The ${devilFruitName.split(" ")[0]} User`;
  if (streak >= 30) return "The Unstoppable";
  if (totalEpisodes >= 500) return "The Grand Line Veteran";
  if (totalEpisodes >= 100) return "The Determined";
  return "The Aspiring Pirate";
}

// ---- Titles by Accomplishment ----------------------------------
export const SPECIAL_TITLES = [
  { id: "first_blood",    title: "First Drop of Blood",  condition: "First episode watched",    emoji: "⚓" },
  { id: "east_blue_done", title: "Left East Blue",        condition: "Completed East Blue arc", emoji: "🌊" },
  { id: "alabasta_done",  title: "Desert Storm Survivor", condition: "Completed Alabasta arc",  emoji: "🏜️" },
  { id: "skypiea_done",   title: "God Slayer",            condition: "Completed Skypiea arc",   emoji: "⛅" },
  { id: "mf_done",        title: "Marineford Survivor",   condition: "Completed Marineford",    emoji: "💔" },
  { id: "wano_done",      title: "Flower Capital Dancer", condition: "Completed Wano arc",      emoji: "🌸" },
  { id: "gear5_witness",  title: "Witnessed Gear 5",      condition: "Watched episode 1071",    emoji: "☀️" },
  { id: "all_done",       title: "D. Carrier",            condition: "Watched all episodes",    emoji: "🏴‍☠️" },
];
