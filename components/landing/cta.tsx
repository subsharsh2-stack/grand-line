"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Anchor, ArrowRight } from "lucide-react";

export function LandingCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-gold-500/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="max-w-3xl mx-auto text-center relative z-10"
      >
        <div className="font-display text-5xl sm:text-6xl font-black text-white mb-6 leading-tight">
          &quot;I&apos;m gonna be
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #f5a623 0%, #fde68a 50%, #f5a623 100%)",
              backgroundSize: "200% 100%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            King of the Pirates
          </span>
          &quot;
        </div>

        <p className="text-slate-400 text-lg mb-4 max-w-xl mx-auto">
          Luffy said it in episode 1. The journey to prove it takes 1,100 episodes.
        </p>
        <p className="text-slate-500 text-base mb-10">
          Start with episode 1. Your bounty awaits.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="group flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-void-950 font-bold px-10 py-4 rounded-2xl text-base transition-all shadow-gold-glow hover:shadow-gold-glow-lg hover:scale-105 active:scale-95"
          >
            <Anchor size={18} />
            Begin Your Voyage
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            Already a pirate? Sign In →
          </Link>
        </div>

        {/* Divider */}
        <div className="divider-gold mt-16 mb-8" />

        <div className="text-xs text-slate-600 tracking-widest uppercase">
          🏴‍☠️ &nbsp; The Grand Line waits for no one &nbsp; 🏴‍☠️
        </div>
      </motion.div>
    </section>
  );
}
