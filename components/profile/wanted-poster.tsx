"use client";

import { motion } from "framer-motion";
import { Share2, Camera } from "lucide-react";
import { RANK_CONFIG, formatBounty, type Profile } from "@/types";
import { generateWantedPosterEpithet } from "@/lib/gamification";
import toast from "react-hot-toast";

interface Props {
  profile: Profile;
  crew: { name: string; motto: string | null } | null;
  devilFruits: Array<{ devil_fruits?: { name: string; type: string; color_from: string; color_to: string } }>;
  isOwnProfile: boolean;
}

export function WantedPoster({ profile, crew, devilFruits, isOwnProfile }: Props) {
  const rankInfo = RANK_CONFIG[profile.rank];
  const equippedFruit = devilFruits.find(df => df.devil_fruits);

  const epithet = generateWantedPosterEpithet({
    username: profile.username,
    displayName: profile.display_name || profile.username,
    bounty: profile.bounty,
    rank: profile.rank,
    totalEpisodes: profile.total_episodes_watched,
    streak: profile.watch_streak,
    devilFruitName: equippedFruit?.devil_fruits?.name,
    joinedDate: profile.created_at,
  });

  function handleShare() {
    const url = `${window.location.origin}/profile/${profile.username}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Profile link copied! 🏴‍☠️"));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-24"
    >
      {/* THE WANTED POSTER */}
      <div className="wanted-poster rounded-2xl p-1 shadow-2xl">
        <div className="border-4 border-[#92400e]/60 rounded-xl overflow-hidden">
          {/* Header */}
          <div
            className="text-center py-3 px-4"
            style={{ background: "linear-gradient(180deg, #78350f, #92400e)" }}
          >
            <div className="text-[#fef3c7] font-display font-black text-xs tracking-[0.3em] uppercase">
              WORLD GOVERNMENT
            </div>
            <div className="text-[#fde68a] font-display font-black text-2xl tracking-[0.15em] uppercase mt-0.5">
              WANTED
            </div>
            <div className="text-[#fef3c7] font-display font-bold text-xs tracking-[0.2em] uppercase">
              DEAD OR ALIVE
            </div>
          </div>

          {/* Portrait */}
          <div className="relative bg-[#fef9c3] flex items-center justify-center" style={{ height: "200px" }}>
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt={profile.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#fef9c3] to-[#fde68a]">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#92400e]/20 to-[#92400e]/40 border-4 border-[#92400e]/40 flex items-center justify-center">
                  <span className="font-display font-black text-4xl text-[#92400e]">
                    {(profile.display_name || profile.username)[0].toUpperCase()}
                  </span>
                </div>
                {/* Devil fruit visual */}
                {equippedFruit?.devil_fruits && (
                  <div
                    className="absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 border-white/50"
                    style={{
                      background: `linear-gradient(135deg, ${equippedFruit.devil_fruits.color_from}, ${equippedFruit.devil_fruits.color_to})`,
                    }}
                    title={equippedFruit.devil_fruits.name}
                  >
                    🍎
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Name section */}
          <div className="bg-[#92400e] py-2 px-4 text-center">
            <div className="font-display font-black text-[#fde68a] text-lg tracking-wider leading-tight">
              {(profile.display_name || profile.username).toUpperCase()}
            </div>
            <div className="text-[#fef3c7]/70 text-xs italic mt-0.5">
              &ldquo;{epithet}&rdquo;
            </div>
          </div>

          {/* Bounty */}
          <div className="bg-[#fef3c7] py-4 px-4 text-center relative z-10">
            <div className="text-[#92400e] text-xs font-bold tracking-widest uppercase mb-1">
              Bounty
            </div>
            <div
              className="font-display font-black text-3xl text-[#78350f] leading-none"
            >
              ฿{formatBounty(profile.bounty)}
            </div>
            <div className="text-[#92400e]/60 text-xs mt-0.5">
              {profile.bounty.toLocaleString()} Berries
            </div>
          </div>

          {/* Rank & Details */}
          <div className="bg-[#fef9c3] py-3 px-4 space-y-1.5 relative z-10">
            <div className="flex justify-between text-xs">
              <span className="text-[#78350f]/60">Rank</span>
              <span className="font-bold" style={{ color: rankInfo.color }}>
                {rankInfo.icon} {rankInfo.label}
              </span>
            </div>
            {crew && (
              <div className="flex justify-between text-xs">
                <span className="text-[#78350f]/60">Crew</span>
                <span className="font-bold text-[#78350f]">{crew.name}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span className="text-[#78350f]/60">Episodes</span>
              <span className="font-bold text-[#78350f]">{profile.total_episodes_watched.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#78350f]/60">Streak</span>
              <span className="font-bold text-[#78350f]">🔥 {profile.watch_streak} days</span>
            </div>
            {equippedFruit?.devil_fruits && (
              <div className="flex justify-between text-xs">
                <span className="text-[#78350f]/60">Devil Fruit</span>
                <span className="font-bold text-[#78350f]">{equippedFruit.devil_fruits.name}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#92400e] py-1.5 px-4 text-center">
            <div className="text-[#fef3c7]/60 text-[9px] tracking-[0.2em] uppercase">
              grandline.gg/@{profile.username}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 border border-white/[0.1] text-slate-400 hover:text-white hover:border-white/20 py-2.5 rounded-xl text-sm transition-all"
        >
          <Share2 size={13} />
          Share Poster
        </button>
        {isOwnProfile && (
          <button className="flex-1 flex items-center justify-center gap-2 border border-white/[0.1] text-slate-400 hover:text-white hover:border-white/20 py-2.5 rounded-xl text-sm transition-all">
            <Camera size={13} />
            Save as Image
          </button>
        )}
      </div>
    </motion.div>
  );
}
