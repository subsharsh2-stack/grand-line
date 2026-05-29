"use client";

import { motion } from "framer-motion";
import { Swords, Trophy, Zap, CheckCircle, Clock, Building } from "lucide-react";
import { formatBounty } from "@/types";

interface Challenge {
  id: string;
  title: string;
  description: string | null;
  type: string;
  requirement_value: number | null;
  bounty_reward: number;
  sponsor_name: string | null;
  sponsor_logo_url: string | null;
  sponsor_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  arcs?: { name: string } | null;
}

interface UserChallenge {
  challenge_id: string;
  progress: number;
  completed_at: string | null;
}

interface Props {
  challenges: Challenge[];
  userChallengeMap: Record<string, UserChallenge>;
  profile: {
    total_episodes_watched: number;
    watch_streak: number;
    total_arcs_completed: number;
  };
}

function getChallengeProgress(challenge: Challenge, userChallenge: UserChallenge | undefined, profile: Props["profile"]): number {
  if (userChallenge?.completed_at) return 100;
  const req = challenge.requirement_value || 1;
  let current = 0;
  switch (challenge.type) {
    case "episode_count":    current = profile.total_episodes_watched; break;
    case "watch_streak":     current = profile.watch_streak; break;
    case "arc_completion":   current = profile.total_arcs_completed; break;
    default: current = userChallenge?.progress || 0;
  }
  return Math.min(100, (current / req) * 100);
}

export function ChallengesPage({ challenges, userChallengeMap, profile }: Props) {
  const completedCount = Object.values(userChallengeMap).filter(uc => uc.completed_at).length;
  const sponsoredChallenges = challenges.filter(c => c.sponsor_name);
  const regularChallenges = challenges.filter(c => !c.sponsor_name);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs text-gold-400 font-semibold tracking-widest uppercase mb-2">⚔️ Pirate Trials</div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-black text-white mb-1">Challenges</h1>
            <p className="text-slate-500 text-sm">Conquer trials. Earn extraordinary bounty.</p>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-black text-gold-400">{completedCount}</div>
            <div className="text-xs text-slate-500">completed</div>
          </div>
        </div>
      </div>

      {/* Sponsored challenges */}
      {sponsoredChallenges.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Building size={14} className="text-gold-400" />
            <h2 className="font-bold text-white">Sponsored Challenges</h2>
            <div className="text-xs bg-gold-500/15 text-gold-400 border border-gold-500/20 px-2 py-0.5 rounded-full">
              Exclusive Rewards
            </div>
          </div>
          <div className="space-y-3">
            {sponsoredChallenges.map((challenge, i) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                userChallenge={userChallengeMap[challenge.id]}
                profile={profile}
                index={i}
                sponsored
              />
            ))}
          </div>
        </section>
      )}

      {/* Regular challenges */}
      <section>
        <h2 className="font-bold text-white mb-4">Active Challenges</h2>
        <div className="space-y-3">
          {regularChallenges.map((challenge, i) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              userChallenge={userChallengeMap[challenge.id]}
              profile={profile}
              index={i}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function ChallengeCard({ challenge, userChallenge, profile, index, sponsored }: {
  challenge: Challenge;
  userChallenge: UserChallenge | undefined;
  profile: Props["profile"];
  index: number;
  sponsored?: boolean;
}) {
  const progress = getChallengeProgress(challenge, userChallenge, profile);
  const isCompleted = !!userChallenge?.completed_at;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border p-5 transition-all ${
        isCompleted
          ? "border-gold-500/30 bg-gold-500/[0.05]"
          : sponsored
          ? "border-purple-500/20 bg-purple-500/[0.03]"
          : "border-white/[0.06] bg-void-900/40"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Sponsor tag */}
          {challenge.sponsor_name && (
            <div className="text-[10px] text-purple-400 font-bold tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <Building size={9} />
              Powered by {challenge.sponsor_name}
            </div>
          )}

          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-white">{challenge.title}</h3>
            {isCompleted && <CheckCircle size={14} className="text-gold-400 flex-shrink-0" />}
          </div>

          {challenge.description && (
            <p className="text-sm text-slate-400 mb-3">{challenge.description}</p>
          )}

          {/* Progress */}
          <div className="flex items-center gap-2 mb-1">
            <div className="flex-1 h-1.5 bg-void-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: isCompleted ? "linear-gradient(90deg, #d97706, #f5a623)" : "linear-gradient(90deg, #1d4ed8, #60a5fa)" }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs text-slate-500 flex-shrink-0">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Reward */}
        <div className="text-right flex-shrink-0">
          <div className="font-display text-lg font-black text-gold-400">
            ฿{formatBounty(challenge.bounty_reward)}
          </div>
          <div className="text-[10px] text-slate-600">reward</div>
          {challenge.ends_at && (
            <div className="flex items-center gap-1 text-[10px] text-slate-600 mt-1 justify-end">
              <Clock size={8} />
              {new Date(challenge.ends_at) > new Date()
                ? `Ends ${new Date(challenge.ends_at).toLocaleDateString()}`
                : "Ended"}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
