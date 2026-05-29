"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Anchor, ArrowRight, Zap, Users, Trophy } from "lucide-react";

const STATS = [
  { label: "Episodes", value: "1,100+", icon: "🎬" },
  { label: "Active Pirates", value: "12,400+", icon: "🏴‍☠️" },
  { label: "Berries Earned", value: "48M+", icon: "💰" },
  { label: "Arcs Completed", value: "89K+", icon: "🗺️" },
];

const BOUNTY_TICKER = [
  { name: "Monkey D. Luffy", bounty: "3,000,000,000", title: "The Fifth Emperor" },
  { name: "Roronoa Zoro", bounty: "1,111,000,000", title: "The World's Strongest Swordsman" },
  { name: "Nami", bounty: "366,000,000", title: "The Cat Burglar" },
  { name: "Usopp", bounty: "500,000,000", title: "God Usopp" },
  { name: "Sanji", bounty: "1,032,000,000", title: "Vinsmoke Sanji" },
];

export function LandingHero() {
  const [tickerIdx, setTickerIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setTickerIdx((i) => (i + 1) % BOUNTY_TICKER.length);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 starfield" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#080c14]" />

      {/* Ocean glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-ocean-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Bounty Ticker at top */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 mb-8 bg-void-900/80 border border-gold-500/20 rounded-full px-4 py-2 flex items-center gap-2 text-xs backdrop-blur-sm"
      >
        <span className="text-gold-500 font-bold">WORLD GOVERNMENT</span>
        <span className="text-void-500">|</span>
        <motion.span
          key={tickerIdx}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-slate-300"
        >
          {BOUNTY_TICKER[tickerIdx].name} — ฿{BOUNTY_TICKER[tickerIdx].bounty} — &quot;{BOUNTY_TICKER[tickerIdx].title}&quot;
        </motion.span>
        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full animate-pulse" />
      </motion.div>

      {/* Main heading */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="font-display text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-2 leading-none">
            <span className="text-white">SET SAIL ON THE</span>
            <br />
            <span
              className="bounty-shimmer"
              style={{
                background: "linear-gradient(135deg, #f5a623 0%, #fde68a 40%, #f5a623 70%, #d97706 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer 3s linear infinite",
              }}
            >
              GRAND LINE
            </span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg sm:text-xl text-slate-400 mt-6 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          1,100 episodes. Countless adventures. The world&apos;s most epic anime —
          and now a world to match it. Track your voyage, earn Berries,
          <span className="text-gold-400 font-medium"> level up your bounty</span>, and sail with your crew.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/signup"
            className="group relative flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-void-950 font-bold px-8 py-4 rounded-2xl text-base transition-all shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 active:scale-95"
          >
            <Anchor size={18} />
            Start Your Voyage
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/arcs"
            className="flex items-center gap-2 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 px-8 py-4 rounded-2xl text-base transition-all hover:bg-white/[0.03]"
          >
            View the Grand Line Map
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-2 mt-8 text-sm text-slate-500"
        >
          <div className="flex -space-x-2">
            {["L", "Z", "N", "S", "U"].map((letter, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-void-800 flex items-center justify-center text-xs font-bold bg-gradient-to-br from-gold-500/20 to-void-800 text-gold-400"
              >
                {letter}
              </div>
            ))}
          </div>
          <span>12,400+ pirates already sailing</span>
        </motion.div>
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="relative z-10 mt-16 w-full max-w-4xl mx-auto px-6"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06]">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="bg-[#080c14] px-6 py-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-black text-gold-400 font-display">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
      >
        <span className="text-xs tracking-widest uppercase">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent"
        />
      </motion.div>
    </section>
  );
}
