"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const FEATURED_ARCS = [
  {
    name: "East Blue",
    episodes: "1–53",
    description: "Where it all begins. 53 episodes that will hook you forever.",
    difficulty: "intro",
    bounty: "2,000",
    color: "#60a5fa",
    island: "🏖️",
    badge: "Perfect Starting Point",
  },
  {
    name: "Alabasta",
    episodes: "92–130",
    description: "Sand, secrets, Baroque Works, and a princess fighting for her kingdom.",
    difficulty: "hard",
    bounty: "2,000",
    color: "#fbbf24",
    island: "🏜️",
    badge: "Fan Favourite",
  },
  {
    name: "Enies Lobby",
    episodes: "264–312",
    description: "The Straw Hats vs. the World Government. The most emotional arc in anime.",
    difficulty: "legendary",
    bounty: "3,000",
    color: "#f5a623",
    island: "⚖️",
    badge: "Most Epic Arc",
  },
  {
    name: "Marineford",
    episodes: "459–489",
    description: "The War of the Best. Nothing will ever be the same.",
    difficulty: "legendary",
    bounty: "5,000",
    color: "#f87171",
    island: "💀",
    badge: "Most Emotional",
  },
  {
    name: "Wano",
    episodes: "890–1085",
    description: "Gear 5. Kaido. The greatest arc in manga history. Witness the Sun God.",
    difficulty: "legendary",
    bounty: "8,000",
    color: "#c084fc",
    island: "🌸",
    badge: "Gear 5 Arc",
  },
];

const DIFFICULTY_COLORS = {
  intro: "#34d399",
  normal: "#60a5fa",
  hard: "#f97316",
  legendary: "#f5a623",
};

const DIFFICULTY_LABELS = {
  intro: "Beginner",
  normal: "Normal",
  hard: "Hard",
  legendary: "Legendary",
};

export function LandingArcs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-6 overflow-hidden" ref={ref}>
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ocean-950/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-ocean-500/10 border border-ocean-500/20 rounded-full px-4 py-1.5 text-xs text-ocean-400 font-semibold tracking-widest uppercase mb-4">
            🗺️ Featured Arcs
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4">
            Every Arc is a <span className="text-ocean-400">New Island</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Don&apos;t know where to start? Don&apos;t worry — your Log Pose will guide you.
            Each arc has its own rewards, challenges, and bounty.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {FEATURED_ARCS.map((arc, i) => (
            <motion.div
              key={arc.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative group rounded-2xl border border-white/[0.08] bg-void-900/60 overflow-hidden hover:border-white/20 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              {/* Badge */}
              <div
                className="absolute top-3 right-3 text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: `${arc.color}20`,
                  color: arc.color,
                  border: `1px solid ${arc.color}40`,
                }}
              >
                {arc.badge}
              </div>

              {/* Island emoji */}
              <div className="text-5xl text-center pt-8 pb-2 transition-transform group-hover:scale-110">
                {arc.island}
              </div>

              {/* Content */}
              <div className="p-4 pt-2">
                <div
                  className="text-[10px] font-bold tracking-widest uppercase mb-1"
                  style={{
                    color: DIFFICULTY_COLORS[arc.difficulty as keyof typeof DIFFICULTY_COLORS],
                  }}
                >
                  {DIFFICULTY_LABELS[arc.difficulty as keyof typeof DIFFICULTY_LABELS]} • Ep {arc.episodes}
                </div>
                <h3 className="font-display font-bold text-white text-sm mb-2">{arc.name} Arc</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-3">{arc.description}</p>
                <div className="flex items-center justify-between">
                  <div
                    className="text-xs font-bold"
                    style={{ color: arc.color }}
                  >
                    ฿{arc.bounty} reward
                  </div>
                  <ArrowRight size={12} className="text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            href="/arcs"
            className="inline-flex items-center gap-2 text-sm text-gold-400 hover:text-gold-300 border border-gold-500/20 hover:border-gold-500/40 px-6 py-3 rounded-xl transition-all"
          >
            View all 32+ arcs on the Grand Line Map
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
