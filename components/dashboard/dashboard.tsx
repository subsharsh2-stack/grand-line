"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Trophy, Map, Swords, ArrowRight, Play, Zap } from "lucide-react";
import { RANK_CONFIG, formatBounty, type Profile } from "@/types";
import { getStreakEmoji, getStreakTitle, getRankProgress, getNextRank, getBountyToNextRank } from "@/lib/gamification";
import { formatDistanceToNow } from "date-fns";
import { AIRecommendationWidget } from "@/components/ai/ai-recommendation-widget";

interface Props {
  profile: Profile | null;
  recentActivity: Array<{ id: string; type: string; data: Record<string, unknown>; created_at: string }>;
  totalWatched: number;
  nextEpisode: { id: number; episode_number: number; title: string; arc_name: string | null; bounty_reward: number } | null;
  challenges: Array<{ id: string; title: string; bounty_reward: number; type: string }>;
}

export function Dashboard({ profile, recentActivity, totalWatched, nextEpisode, challenges }: Props) {
  if (!profile) return null;

  const rankInfo = RANK_CONFIG[profile.rank];
  const nextRank = getNextRank(profile.rank);
  const nextRankInfo = nextRank ? RANK_CONFIG[nextRank] : null;
  const rankProgress = getRankProgress(profile.bounty, profile.rank);
  const bountyToNext = getBountyToNextRank(profile.bounty, profile.rank);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-slate-400 text-sm mb-1">Welcome back, Nakama</div>
        <h1 className="font-display text-3xl font-black text-white">
          {profile.display_name || profile.username}
          <span className="ml-2 text-lg" style={{ color: rankInfo.color }}>{rankInfo.icon}</span>
        </h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rank progress card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-void-900/60 border border-white/[0.06] rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-slate-500 tracking-widest uppercase mb-1">Current Rank</div>
                <div className="font-display text-xl font-black" style={{ color: rankInfo.color }}>
                  {rankInfo.icon} {rankInfo.label}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-0.5">Bounty</div>
                <div className="font-display text-2xl font-black text-gold-400">
                  ฿{formatBounty(profile.bounty)}
                </div>
              </div>
            </div>
            {nextRankInfo && bountyToNext !== null && (
              <>
                <div className="w-full h-2 bg-void-700 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full rounded-full progress-gold"
                    initial={{ width: 0 }}
                    animate={{ width: `${rankProgress}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{rankInfo.label}</span>
                  <span>฿{formatBounty(bountyToNext)} to {nextRankInfo.label}</span>
                </div>
              </>
            )}
          </motion.div>

          {/* Next episode CTA */}
          {nextEpisode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-ocean-950/60 to-void-900/60 border border-ocean-500/20 rounded-2xl p-6"
            >
              <div className="text-xs text-ocean-400 font-semibold tracking-widest uppercase mb-2">Up Next</div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-0.5">Episode {nextEpisode.episode_number}</div>
                  <h3 className="font-bold text-white text-base">{nextEpisode.title}</h3>
                  {nextEpisode.arc_name && (
                    <div className="text-xs text-slate-500 mt-0.5">{nextEpisode.arc_name} Arc</div>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="text-xs text-gold-400 font-bold">
                    +฿{nextEpisode.bounty_reward}
                  </div>
                  <Link
                    href={`/episodes`}
                    className="flex items-center gap-1.5 bg-ocean-600 hover:bg-ocean-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all"
                  >
                    <Play size={13} />
                    Watch Now
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Episodes Watched", value: totalWatched.toLocaleString(), icon: Trophy, color: "#f5a623" },
              { label: "Day Streak", value: `${profile.watch_streak}d ${getStreakEmoji(profile.watch_streak)}`, icon: Flame, color: "#f97316" },
              { label: "Arcs Completed", value: profile.total_arcs_completed, icon: Map, color: "#34d399" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="bg-void-900/60 border border-white/[0.06] rounded-xl p-4 text-center"
                >
                  <Icon size={16} className="mx-auto mb-1.5" style={{ color: stat.color }} />
                  <div className="font-display text-xl font-black" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="text-[10px] text-slate-500">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* AI Recommendation Widget */}
          <AIRecommendationWidget />

          {/* Streak card */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-void-900/60 border border-orange-500/20 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs text-orange-400 font-semibold">Watch Streak</span>
            </div>
            <div className="font-display text-3xl font-black text-orange-400 mb-0.5">
              {profile.watch_streak} days
            </div>
            <div className="text-xs text-slate-500">{getStreakTitle(profile.watch_streak)}</div>
            <div className="text-[10px] text-slate-600 mt-1">Best: {profile.longest_streak} days</div>
          </motion.div>

          {/* Active challenges */}
          {challenges.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-void-900/60 border border-white/[0.06] rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Swords size={13} className="text-purple-400" />
                  <span className="text-xs font-semibold text-slate-300">Challenges</span>
                </div>
                <Link href="/challenges" className="text-[10px] text-gold-400 hover:text-gold-300 flex items-center gap-0.5">
                  All <ArrowRight size={9} />
                </Link>
              </div>
              <div className="space-y-2">
                {challenges.map((c) => (
                  <div key={c.id} className="flex items-center justify-between">
                    <div className="text-xs text-slate-400 line-clamp-1 flex-1 mr-2">{c.title}</div>
                    <div className="text-[10px] font-bold text-gold-400 flex-shrink-0">
                      ฿{formatBounty(c.bounty_reward)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recent activity */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-void-900/60 border border-white/[0.06] rounded-2xl p-4"
          >
            <div className="text-xs font-semibold text-slate-300 mb-3">Recent Activity</div>
            {recentActivity.length === 0 ? (
              <div className="text-xs text-slate-600 text-center py-3">
                Start watching to build your log!
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0 mt-1.5" />
                    <div>
                      <div className="text-xs text-slate-400">
                        {item.type === "episode_watched" && (
                          <>Ep {item.data.episode_number as number} watched · <span className="text-gold-400">+฿{item.data.bounty_earned as number}</span></>
                        )}
                        {item.type === "arc_completed" && (
                          <><span className="text-green-400">{item.data.arc_name as string}</span> arc complete!</>
                        )}
                      </div>
                      <div className="text-[9px] text-slate-600">
                        {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
