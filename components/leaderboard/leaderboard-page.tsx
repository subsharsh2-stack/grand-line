"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Flame, Crown } from "lucide-react";

interface Props {
  globalTop: any[];
  weeklyTop: any[];
  myProfile: any | null;
  myRankPosition: number;
}

const RANK_TIERS: Record<string, { color: string; label: string }> = {
  "Rookie": { color: "#64748b", label: "Rookie" },
  "Sailor": { color: "#3b82f6", label: "Sailor" },
  "Navigator": { color: "#10b981", label: "Navigator" },
  "Captain": { color: "#f59e0b", label: "Captain" },
  "Admiral": { color: "#f5a623", label: "Admiral" },
  "Yonko": { color: "#ef4444", label: "Yonko" },
};

function formatBounty(n: number) {
  return (n / 1000000).toFixed(1) + "M";
}

function RankMedal({ position }: { position: number }) {
  if (position === 1) return <span className="text-2xl">👑</span>;
  if (position === 2) return <span className="text-xl">🥈</span>;
  if (position === 3) return <span className="text-xl">🥉</span>;
  return <span className="text-sm font-bold text-slate-500">#{position}</span>;
}

function LeaderRow({
  position,
  profile,
  metric,
  isCurrentUser,
  isTop3,
}: {
  position: number;
  profile: any;
  metric: { value: string | number; label: string };
  isCurrentUser: boolean;
  isTop3: boolean;
}) {
  const rank = profile.rank || "Rookie";
  const rankInfo = RANK_TIERS[rank] || RANK_TIERS["Rookie"];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: position * 0.03 }}
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all ${
        isCurrentUser
          ? "bg-[#f5a623]/10 border-[#f5a623]/40"
          : isTop3
            ? "bg-[#0a0f1a] border-white/[0.06]"
            : "border-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      {/* Position */}
      <div className="w-8 flex items-center justify-center flex-shrink-0">
        <RankMedal position={position} />
      </div>

      {/* Avatar */}
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 text-white"
        style={{
          background: `linear-gradient(135deg, ${rankInfo.color}20, ${rankInfo.color}40)`,
          border: `1px solid ${rankInfo.color}40`,
        }}
      >
        {(profile.display_name || profile.username || "?")[0].toUpperCase()}
      </div>

      {/* Name + rank */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/profile/${profile.username}`}
          className="block text-sm font-semibold text-white hover:text-[#f5a623] transition-colors truncate"
        >
          {profile.display_name || profile.username}
          {isCurrentUser && <span className="ml-1 text-xs text-[#f5a623]">(you)</span>}
        </Link>
        <div className="text-[10px] text-slate-500">{rankInfo.label}</div>
      </div>

      {/* Metric */}
      <div className="text-right flex-shrink-0">
        <div className="text-sm font-black text-[#f5a623]">
          {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
        </div>
        <div className="text-[10px] text-slate-600">{metric.label}</div>
      </div>
    </motion.div>
  );
}

export function LeaderboardPage({
  globalTop,
  weeklyTop,
  myProfile,
  myRankPosition,
}: Props) {
  const [tab, setTab] = useState<"global" | "weekly">("global");

  return (
    <div className="min-h-screen bg-[#060B14]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0a0f1a]">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <div className="text-xs text-[#f5a623] font-semibold tracking-widest uppercase mb-2">
            World Bounty
          </div>
          <h1 className="font-display text-4xl font-black text-white mb-3">
            Leaderboard
          </h1>
          <p className="text-slate-400 text-sm">
            Rank the strongest pirates across the Grand Line
          </p>
        </div>
      </div>

      {/* My Rank Banner */}
      {myProfile && myRankPosition > 0 && (
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="bg-gradient-to-r from-[#f5a623]/20 to-yellow-400/10 border border-[#f5a623]/40 rounded-2xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="text-[#f5a623]" size={24} />
              <div>
                <div className="text-sm font-bold text-white">Your Rank</div>
                <div className="text-xs text-slate-500">
                  Keep watching to climb higher
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-3xl font-black text-[#f5a623]">
                #{myRankPosition}
              </div>
              <div className="text-xs text-slate-400">
                {formatBounty(myProfile.bounty)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[1, 0, 2].map((idx) => {
            const profile = globalTop[idx];
            if (!profile) return <div key={idx} />;

            const positions = [2, 1, 3];
            const actualPos = positions[idx === 0 ? 1 : idx === 1 ? 0 : 2];
            const heightClass = idx === 1 ? "md:order-first" : "";
            const bgClass =
              idx === 1
                ? "bg-gradient-to-b from-[#f5a623]/20 to-[#0a0f1a] border-[#f5a623]/40"
                : "bg-[#0a0f1a] border-white/[0.06]";

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`${heightClass}`}
              >
                <Link href={`/profile/${profile.username}`}>
                  <div
                    className={`flex flex-col items-center justify-between rounded-2xl border p-6 text-center ${bgClass} transition-all hover:border-[#f5a623]/60`}
                  >
                    {idx === 1 && (
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-3xl mb-2"
                      >
                        👑
                      </motion.div>
                    )}

                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl text-white mb-4"
                      style={{
                        background: `linear-gradient(135deg, #f5a623 20%, #f5a623 40%)`,
                        border: "2px solid #f5a623",
                      }}
                    >
                      {(profile.display_name || profile.username)[0].toUpperCase()}
                    </div>

                    <h3 className="font-bold text-white text-sm mb-1 truncate w-full">
                      {profile.display_name || profile.username}
                    </h3>
                    <p className="text-[#f5a623] font-display text-2xl font-black mb-2">
                      {formatBounty(profile.bounty)}
                    </p>
                    <p className="text-[10px] text-slate-500">#{actualPos}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex border border-white/[0.06] rounded-xl overflow-hidden w-fit">
            <button
              onClick={() => setTab("global")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${
                tab === "global"
                  ? "bg-[#f5a623] text-[#060B14]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Crown size={16} /> Global
            </button>
            <button
              onClick={() => setTab("weekly")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${
                tab === "weekly"
                  ? "bg-[#f5a623] text-[#060B14]"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Flame size={16} /> Weekly
            </button>
            <div className="px-4 py-3 text-xs text-slate-500">
              Season resets in 5 days
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-2">
          {tab === "global" ? (
            globalTop.slice(3).map((profile: any, i: number) => (
              <LeaderRow
                key={profile.id}
                position={i + 4}
                profile={profile}
                metric={{
                  value: formatBounty(profile.bounty),
                  label: "total bounty",
                }}
                isCurrentUser={profile.id === myProfile?.id}
                isTop3={false}
              />
            ))
          ) : (
            weeklyTop.map((profile: any, i: number) => (
              <LeaderRow
                key={profile.user_id}
                position={i + 1}
                profile={profile}
                metric={{
                  value: formatBounty(profile.total),
                  label: "this week",
                }}
                isCurrentUser={profile.user_id === myProfile?.id}
                isTop3={i < 3}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
