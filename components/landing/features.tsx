"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const FEATURES = [
  {
    emoji: "💰",
    title: "Bounty System",
    subtitle: "XP = Berries",
    description:
      "Every episode watched earns you Berries. Pass the quiz, earn bonus bounty. Build streaks for Haki multipliers. Climb from East Blue Pirate to Yonko.",
    color: "#f5a623",
    glow: "rgba(245,166,35,0.15)",
  },
  {
    emoji: "🧠",
    title: "Episode Quizzes",
    subtitle: "Prove you watched it",
    description:
      "One question per episode. Get it right to unlock bonus Berries. Wrong answers don't punish — they're just lore lessons. Knowledge = power.",
    color: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
  },
  {
    emoji: "🗺️",
    title: "Grand Line Map",
    subtitle: "Your voyage, visualized",
    description:
      "See every arc as an island on the Grand Line. Watch your ship sail further with each episode. The map updates in real-time as you progress.",
    color: "#34d399",
    glow: "rgba(52,211,153,0.15)",
  },
  {
    emoji: "🍎",
    title: "Devil Fruits",
    subtitle: "Rare achievement badges",
    description:
      "Unlock iconic Devil Fruits as you hit milestones. Gomu Gomu for your first episode. Gura Gura after 300 episodes. Only the dedicated earn Nika.",
    color: "#c084fc",
    glow: "rgba(192,132,252,0.15)",
  },
  {
    emoji: "🏴‍☠️",
    title: "Crew System",
    subtitle: "Sail together",
    description:
      "Form a crew with friends. Crew leaderboards track your collective bounty. Crew challenges unlock exclusive rewards no solo pirate can get.",
    color: "#f87171",
    glow: "rgba(248,113,113,0.15)",
  },
  {
    emoji: "📜",
    title: "Wanted Poster",
    subtitle: "Your legendary profile",
    description:
      "Your profile IS your Wanted Poster — complete with bounty, rank, Devil Fruit, and crew. Shareable. Epic. Uniquely yours.",
    color: "#fbbf24",
    glow: "rgba(251,191,36,0.15)",
  },
  {
    emoji: "🔥",
    title: "Watch Streaks",
    subtitle: "The Haki multiplier",
    description:
      "Watch daily to stack your streak. After 7 days you unlock Observation Haki — a 1.5× bounty multiplier. After 30, Conqueror's Haki.",
    color: "#f97316",
    glow: "rgba(249,115,22,0.15)",
  },
  {
    emoji: "⚔️",
    title: "Arc Challenges",
    subtitle: "Sponsored epic events",
    description:
      "Complete the Enies Lobby Arc Challenge to earn the Sogeking badge. Some challenges are sponsored by brands — win exclusive real-world rewards.",
    color: "#818cf8",
    glow: "rgba(129,140,248,0.15)",
  },
];

export function LandingFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 text-xs text-gold-400 font-semibold tracking-widest uppercase mb-4">
            ⚔️ Features
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white mb-4">
            Built for the <span className="text-gold-400">Grand Line</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Every feature is designed to make watching One Piece feel like{" "}
            <em>being</em> in One Piece.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative rounded-2xl p-5 border border-white/[0.06] bg-void-900/50 hover:border-white/[0.12] transition-all duration-300 hover:-translate-y-1"
              style={{
                boxShadow: `0 0 0 0 ${feat.glow}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 30px ${feat.glow}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${feat.glow}`;
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform group-hover:scale-110"
                style={{ background: `${feat.glow}`, border: `1px solid ${feat.color}30` }}
              >
                {feat.emoji}
              </div>

              {/* Content */}
              <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: feat.color }}>
                {feat.subtitle}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
