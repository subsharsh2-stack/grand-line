"use client";

import { motion } from "framer-motion";
import { RANK_CONFIG, formatBounty, type Profile } from "@/types";
import { getStreakTitle, getStreakEmoji, getRankProgress, getBountyToNextRank, getNextRank } from "@/lib/gamification";
import { Flame, Trophy, Map, Zap, Star } from "lucide-react";

interface Props {
  profile: Profile;
  completedArcs: Array<{ arcs?: { name: string; slug: string } }>;
}

export function ProfileStats({ profile, completedArcs }: Props) {
  const rankInfo = RANK_CONFIG[profile.rank];
  const nextRank = getNextRank(profile.rank);
  const nextRankInfo = nextRank ? RANK_CONFIG[nextRank] : null;
  const progress = getRankProgress(profile.bounty, profile.rank);
  const bountyToNext = getBountyToNextRank(profile.bounty, profile.rank);

  return (
    <div className="space-y-4">
      {/* Rank Progress Card */}
      <div className="bg-void-900/60 border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-slate-500 font-semibold tracking-widest uppercase mb-1">Current Rank</div>
            <div className="font-display text-xl font-black" style={{ color: rankInfo.color }}>
              {rankInfo.icon} {rankInfo.label}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500 mb-1">Total Bounty</div>
            <div className="font-display text-2xl font-black text-gold-400">
              ฿{formatBounty(profile.bounty)}
            </div>
          </div>
        </div>

        {/* Progress to next rank */}
        {nextRankInfo && bountyToNext !== null && (
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span className="text-slate-500">{rankInfo.label}</span>
              <span style={{ color: nextRankInfo.color }}>{nextRankInfo.icon} {nextRankInfo.label}</span>
            </div>
            <div className="w-full h-2 bg-void-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full progress-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="text-xs text-slate-600 mt-1.5 text-right">
              ฿{formatBounty(bountyToNext)} to next rank
            </div>
          </div>
        )}
        {!nextRankInfo && (
          <div className="text-center text-sm text-gold-400 font-bold">
            ☀️ Maximum Rank Achieved
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-void-900/60 border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs text-slate-500">Watch Streak</span>
          </div>
          <div className="font-display text-2xl font-black text-orange-400">
            {profile.watch_streak}
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            {getStreakEmoji(profile.watch_streak)} {getStreakTitle(profile.watch_streak)}
          </div>
          <div className="text-[10px] text-slate-600 mt-1">
            Best: {profile.longest_streak} days
          </div>
        </div>

        <div className="bg-void-900/60 border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={14} className="text-gold-400" />
            <span className="text-xs text-slate-500">Episodes Watched</span>
          </div>
          <div className="font-display text-2xl font-black text-gold-400">
            {profile.total_episodes_watched.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            of 1,100+ episodes
          </div>
          <div className="w-full h-1 bg-void-700 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full bg-gold-500"
              style={{ width: `${Math.min((profile.total_episodes_watched / 1122) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-void-900/60 border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Map size={14} className="text-green-400" />
            <span className="text-xs text-slate-500">Arcs Completed</span>
          </div>
          <div className="font-display text-2xl font-black text-green-400">
            {completedArcs.length}
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            of 32+ arcs
          </div>
        </div>

        <div className="bg-void-900/60 border border-white/[0.06] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={14} className="text-purple-400" />
            <span className="text-xs text-slate-500">Haki Level</span>
          </div>
          <div className="font-display text-2xl font-black text-purple-400">
            {profile.haki_level}
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5">
            {profile.haki_level >= 3 ? "Conqueror's Haki" : profile.haki_level >= 2 ? "Armament Haki" : profile.haki_level >= 1 ? "Observation Haki" : "No Haki"}
          </div>
        </div>
      </div>

      {/* Completed arcs showcase */}
      {completedArcs.length > 0 && (
        <div className="bg-void-900/60 border border-white/[0.06] rounded-xl p-4">
          <div className="text-xs text-slate-500 font-semibold tracking-widest uppercase mb-3">
            Conquered Islands
          </div>
          <div className="flex flex-wrap gap-2">
            {completedArcs.slice(0, 12).map((ap, i) => (
              <div
                key={i}
                className="text-xs bg-gold-500/10 border border-gold-500/20 text-gold-400 px-2 py-1 rounded-lg"
              >
                ✓ {ap.arcs?.name}
              </div>
            ))}
            {completedArcs.length > 12 && (
              <div className="text-xs text-slate-500 px-2 py-1">
                +{completedArcs.length - 12} more
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
