"use client";

import { motion } from "framer-motion";
import { DEVIL_FRUIT_RARITY_CONFIG } from "@/types";

interface Props {
  devilFruits: Array<{
    earned_at: string;
    devil_fruits?: {
      name: string;
      type: string;
      rarity: string;
      description: string | null;
      power_description: string | null;
      color_from: string;
      color_to: string;
    };
  }>;
}

export function DevilFruitCollection({ devilFruits }: Props) {
  const fruits = devilFruits.filter((df) => df.devil_fruits);

  return (
    <div className="bg-void-900/60 border border-white/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-slate-500 font-semibold tracking-widest uppercase mb-0.5">Devil Fruits</div>
          <div className="text-base font-bold text-white">Achievement Badges</div>
        </div>
        <div className="text-sm text-slate-500">{fruits.length} earned</div>
      </div>

      {fruits.length === 0 ? (
        <div className="text-center py-6 text-slate-600">
          <div className="text-3xl mb-2">🍎</div>
          <div className="text-sm">No Devil Fruits yet. Keep watching!</div>
          <div className="text-xs mt-1 text-slate-700">First fruit: watch episode 1</div>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {fruits.map((df, i) => {
            const fruit = df.devil_fruits!;
            const rarityConfig = DEVIL_FRUIT_RARITY_CONFIG[fruit.rarity as keyof typeof DEVIL_FRUIT_RARITY_CONFIG];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative flex flex-col items-center gap-2 p-3 rounded-xl border border-white/[0.06] hover:border-white/[0.15] transition-all cursor-default"
                title={`${fruit.name} — ${fruit.power_description}`}
              >
                {/* Fruit icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg relative"
                  style={{
                    background: `linear-gradient(135deg, ${fruit.color_from}, ${fruit.color_to})`,
                    boxShadow: `0 0 15px ${rarityConfig.glow}`,
                  }}
                >
                  🍎
                </div>

                {/* Rarity badge */}
                <div
                  className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    color: rarityConfig.color,
                    background: `${rarityConfig.color}15`,
                    border: `1px solid ${rarityConfig.color}30`,
                  }}
                >
                  {rarityConfig.label.toUpperCase()}
                </div>

                {/* Name */}
                <div className="text-[9px] text-slate-400 text-center leading-tight line-clamp-2">
                  {fruit.name}
                </div>

                {/* Tooltip on hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 bg-void-800 border border-white/10 rounded-xl p-3 text-xs text-slate-300 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl">
                  <div className="font-bold text-white mb-1">{fruit.name}</div>
                  <div className="text-slate-500 italic mb-1">{fruit.type}</div>
                  <div className="text-slate-400">{fruit.power_description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
