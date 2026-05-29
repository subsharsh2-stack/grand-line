"use client";

import { motion } from "framer-motion";
import { CheckCircle, Trophy, Gift, Star, Play } from "lucide-react";

interface EpisodeData {
  id: number;
  episode_number: number;
  title: string;
  bounty_reward: number;
  bonus_bounty: number;
  is_filler: boolean;
  importance_level: number;
  has_figure_deal: boolean;
  figure_deal_discount: number | null;
  isWatched: boolean;
  quizPassed: boolean;
}

interface Props {
  episode: EpisodeData;
  index: number;
  onMarkWatched: () => void;
}

export function EpisodeCard({ episode, index, onMarkWatched }: Props) {
  const isImportant = episode.importance_level >= 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.5) }}
      className={`group relative rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
        episode.isWatched
          ? "border-gold-500/30 bg-gold-500/[0.06]"
          : "border-white/[0.06] bg-void-900/40 hover:border-white/[0.15] hover:bg-void-900/80"
      } ${episode.is_filler ? "opacity-60" : ""}`}
      onClick={!episode.isWatched ? onMarkWatched : undefined}
    >
      {/* Importance indicator */}
      {isImportant && !episode.is_filler && (
        <div className="absolute top-1.5 left-1.5 z-10">
          <div className="flex gap-0.5">
            {Array.from({ length: episode.importance_level - 3 }).map((_, i) => (
              <Star key={i} size={8} fill="#f5a623" className="text-gold-500" />
            ))}
          </div>
        </div>
      )}

      {/* Figure deal badge */}
      {episode.has_figure_deal && !episode.isWatched && (
        <div className="absolute top-1.5 right-1.5 z-10 bg-gold-500 text-void-950 rounded-full w-5 h-5 flex items-center justify-center" title="Figure deal available!">
          <Gift size={9} />
        </div>
      )}

      {/* Filler badge */}
      {episode.is_filler && (
        <div className="absolute top-1.5 right-1.5 z-10 bg-void-700 text-slate-400 text-[8px] font-bold px-1.5 py-0.5 rounded">
          FILLER
        </div>
      )}

      {/* Thumbnail / Episode number display */}
      <div className={`aspect-video flex items-center justify-center relative ${
        episode.isWatched
          ? "bg-gradient-to-br from-gold-500/20 to-void-900"
          : "bg-void-800/50 group-hover:bg-void-800/80"
      }`}>
        {episode.isWatched ? (
          <div className="flex flex-col items-center gap-1">
            <CheckCircle size={20} className="text-gold-500" />
            {episode.quizPassed && (
              <div className="flex items-center gap-0.5 text-[9px] text-gold-400 font-bold">
                <Trophy size={7} />
                Quiz ✓
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play size={18} className="text-white" />
            <span className="text-[9px] text-white font-medium">Mark watched</span>
          </div>
        )}

        {/* Episode number */}
        <div className="absolute bottom-1 left-2 text-xs font-black text-white/80">
          {episode.episode_number}
        </div>
      </div>

      {/* Info */}
      <div className="p-2">
        <div className="text-[10px] text-slate-400 leading-tight line-clamp-2 min-h-[2.4em]">
          {episode.title}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-0.5 text-[9px] font-bold text-gold-500">
            <span>฿{episode.bounty_reward}</span>
          </div>
          {!episode.isWatched && (
            <div className="text-[9px] text-slate-600">
              +{episode.bonus_bounty} quiz
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
