"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Plus } from "lucide-react";

interface Props {
  challenges: any[];
  userChallengeMap: Record<string, any>;
  profile: {
    total_episodes_watched: number;
    watch_streak: number;
    total_arcs_completed: number;
  };
}

const DIFFICULTY_COLORS: Record<string, { bg: string; text: string }> = {
  Easy: { bg: "#10b98120", text: "#10b981" },
  Normal: { bg: "#3b82f620", text: "#3b82f6" },
  Hard: { bg: "#f9731620", text: "#f97316" },
  Legendary: { bg: "#ef444420", text: "#ef4444" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  Daily: { bg: "#3b82f620", text: "#3b82f6" },
  Weekly: { bg: "#8b5cf620", text: "#8b5cf6" },
  Monthly: { bg: "#f5a62320", text: "#f5a623" },
  Seasonal: { bg: "#ef444420", text: "#ef4444" },
};

const DEFAULT_CHALLENGES = [
  {
    id: "default-1",
    title: "Weekly Watcher",
    description: "Watch 10 episodes this week",
    type: "Weekly",
    difficulty: "Easy",
    reward: 500000,
    status: "active",
  },
  {
    id: "default-2",
    title: "Quiz Master",
    description: "Complete 3 quizzes today",
    type: "Daily",
    difficulty: "Normal",
    reward: 250000,
    status: "active",
  },
  {
    id: "default-3",
    title: "Consistent Sailor",
    description: "Reach a 7-day watch streak",
    type: "Weekly",
    difficulty: "Hard",
    reward: 750000,
    status: "active",
  },
  {
    id: "default-4",
    title: "Arc Completionist",
    description: "Complete 2 arcs this month",
    type: "Monthly",
    difficulty: "Normal",
    reward: 1000000,
    status: "active",
  },
  {
    id: "default-5",
    title: "Perfect Score",
    description: "Score 100% on 5 quizzes",
    type: "Weekly",
    difficulty: "Hard",
    reward: 800000,
    status: "active",
  },
  {
    id: "default-6",
    title: "Community Helper",
    description: "Help 3 community members",
    type: "Daily",
    difficulty: "Easy",
    reward: 300000,
    status: "active",
  },
];

function formatBounty(n: number) {
  return (n / 1000000).toFixed(1) + "M";
}

function ChallengeCard({
  challenge,
  isCompleted,
  progress,
  index,
}: {
  challenge: any;
  isCompleted: boolean;
  progress: number;
  index: number;
}) {
  const typeColor = TYPE_COLORS[challenge.type] || TYPE_COLORS["Daily"];
  const diffColor =
    DIFFICULTY_COLORS[challenge.difficulty] || DIFFICULTY_COLORS["Normal"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-[#0a0f1a] border rounded-2xl p-5 transition-all ${
        isCompleted
          ? "border-emerald-400/40 bg-emerald-400/[0.05]"
          : "border-white/[0.06] hover:border-white/[0.12]"
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-white">{challenge.title}</h3>
            {isCompleted && (
              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-slate-400">
            {challenge.description}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="font-display text-lg font-black text-[#f5a623]">
            {formatBounty(challenge.reward || 500000)}
          </div>
          <div className="text-[10px] text-slate-600">bounty</div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-lg"
          style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
        >
          {challenge.type}
        </span>
        <span
          className="text-[10px] font-bold px-2 py-1 rounded-lg"
          style={{ backgroundColor: diffColor.bg, color: diffColor.text }}
        >
          {challenge.difficulty || "Normal"}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-[#0a0f1a] rounded-full border border-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: isCompleted
                ? "linear-gradient(90deg, #10b981, #34d399)"
                : "linear-gradient(90deg, #f5a623, #fbbf24)",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Action Button */}
      <button
        className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all ${
          isCompleted
            ? "bg-emerald-400/20 text-emerald-400 border border-emerald-400/40"
            : "bg-[#f5a623] text-[#060B14] hover:bg-yellow-400"
        }`}
      >
        {isCompleted ? "Completed ✓" : "In Progress"}
      </button>
    </motion.div>
  );
}

export function ChallengesPage({
  challenges: serverChallenges,
  userChallengeMap,
  profile,
}: Props) {
  const [selectedTab, setSelectedTab] = useState<
    "All" | "Daily" | "Weekly" | "Monthly" | "Seasonal" | "Crew"
  >("All");

  const challenges = serverChallenges.length > 0 ? serverChallenges : DEFAULT_CHALLENGES;
  const completedCount = Object.values(userChallengeMap).filter(
    (uc: any) => uc.completed_at
  ).length;
  const activeCount = challenges.length - completedCount;

  const filteredChallenges = challenges.filter((c: any) => {
    if (selectedTab === "All") return true;
    return c.type === selectedTab;
  });

  const tabs = [
    "All",
    "Daily",
    "Weekly",
    "Monthly",
    "Seasonal",
    "Crew",
  ] as const;
  const comingSoonTabs = ["Seasonal", "Crew"];

  return (
    <div className="min-h-screen bg-[#060B14]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0a0f1a]">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-end justify-between gap-6 mb-2">
            <div>
              <div className="text-xs text-[#f5a623] font-semibold tracking-widest uppercase mb-2">
                Pirate Trials
              </div>
              <h1 className="font-display text-4xl font-black text-white mb-1">
                Challenges
              </h1>
              <p className="text-slate-400 text-sm">
                Conquer trials and earn extraordinary bounty
              </p>
            </div>
            <button className="bg-[#f5a623] text-[#060B14] px-4 py-2 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-all flex items-center gap-2">
              <Plus size={16} /> Create Challenge
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-[#060B14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Active</div>
              <div className="font-display text-2xl font-bold text-white">
                {activeCount}
              </div>
            </div>
            <div className="bg-[#060B14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Completed</div>
              <div className="font-display text-2xl font-bold text-emerald-400">
                {completedCount}
              </div>
            </div>
            <div className="bg-[#060B14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Streak</div>
              <div className="font-display text-2xl font-bold text-[#f5a623]">
                {profile.watch_streak}d
              </div>
            </div>
            <div className="bg-[#060B14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Available</div>
              <div className="font-display text-2xl font-bold text-blue-400">
                {formatBounty(3000000)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="border-b border-white/[0.06] bg-[#060B14]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => !comingSoonTabs.includes(tab) && setSelectedTab(tab)}
                disabled={comingSoonTabs.includes(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedTab === tab && !comingSoonTabs.includes(tab)
                    ? "bg-[#f5a623] text-[#060B14]"
                    : "bg-[#0a0f1a] border border-white/[0.06] text-slate-400 hover:border-white/[0.12]"
                }`}
              >
                {tab}
                {comingSoonTabs.includes(tab) && (
                  <span className="ml-1 text-[10px]">Coming Soon</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredChallenges.map((challenge: any, index: number) => {
            const userChallenge = userChallengeMap[challenge.id];
            const isCompleted = !!userChallenge?.completed_at;
            let progress = 0;

            if (isCompleted) {
              progress = 100;
            } else if (challenge.type === "Daily") {
              progress = Math.min(50, Math.random() * 60);
            } else if (challenge.type === "Weekly") {
              progress = Math.min(70, Math.random() * 80);
            } else if (challenge.type === "Monthly") {
              progress = Math.min(40, Math.random() * 50);
            }

            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isCompleted={isCompleted}
                progress={progress}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
