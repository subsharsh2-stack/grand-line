"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, RefreshCw, Map } from "lucide-react";

interface Recommendation {
  message: string;
  tip: string;
  urgency: "low" | "medium" | "high";
}

interface ArcRec {
  arcName: string;
  reason: string;
  hypeLevel: "high" | "extreme" | "legendary";
}

const URGENCY_COLORS = {
  low: "border-ocean-500/30 bg-ocean-950/40",
  medium: "border-gold-500/30 bg-gold-500/5",
  high: "border-orange-500/40 bg-orange-500/5",
};

const HYPE_BADGE: Record<string, string> = {
  high: "text-ocean-400 bg-ocean-400/10 border-ocean-400/20",
  extreme: "text-gold-400 bg-gold-400/10 border-gold-400/20",
  legendary: "text-red-400 bg-red-400/10 border-red-400/20",
};

export function AIRecommendationWidget() {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [arcRec, setArcRec] = useState<ArcRec | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"next" | "arc">("next");

  async function fetchRec() {
    setLoading(true);
    try {
      const [recRes, arcRes] = await Promise.all([
        fetch("/api/ai/recommend?type=recommendation"),
        fetch("/api/ai/recommend?type=arc"),
      ]);
      if (recRes.ok) setRec(await recRes.json());
      if (arcRes.ok) setArcRec(await arcRes.json());
    } catch {
      // silently fail — widget is non-critical
    }
    setLoading(false);
  }

  useEffect(() => { fetchRec(); }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className={`border rounded-2xl p-4 transition-colors ${
        rec ? URGENCY_COLORS[rec.urgency] : "border-white/[0.06] bg-void-900/60"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-gold-400" />
          <span className="text-xs font-semibold text-slate-300">Den Den Mushi Says</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Tab toggle */}
          <div className="flex bg-void-800/60 border border-white/[0.06] rounded-lg overflow-hidden">
            <button
              onClick={() => setTab("next")}
              className={`px-2.5 py-1 text-[10px] font-semibold transition-all ${
                tab === "next" ? "bg-gold-500/20 text-gold-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Next Up
            </button>
            <button
              onClick={() => setTab("arc")}
              className={`px-2.5 py-1 text-[10px] font-semibold transition-all ${
                tab === "arc" ? "bg-gold-500/20 text-gold-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Arc
            </button>
          </div>
          <button
            onClick={fetchRec}
            disabled={loading}
            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all"
            title="Refresh"
          >
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 py-2"
          >
            <span className="text-xl">🐌</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 bg-slate-600 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        ) : tab === "next" && rec ? (
          <motion.div
            key="rec"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
          >
            <div className="flex gap-2 mb-2">
              <span className="text-lg flex-shrink-0">🐌</span>
              <p className="text-xs text-slate-200 leading-relaxed">{rec.message}</p>
            </div>
            {rec.tip && (
              <div className="mt-2 pl-7">
                <div className="text-[10px] text-gold-400/80 font-semibold uppercase tracking-wider mb-0.5">Insider Tip</div>
                <p className="text-[11px] text-slate-500 italic leading-relaxed">{rec.tip}</p>
              </div>
            )}
          </motion.div>
        ) : tab === "arc" && arcRec ? (
          <motion.div
            key="arc"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
          >
            <div className="flex items-start gap-2 mb-2">
              <Map size={14} className="text-ocean-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-white">{arcRec.arcName}</span>
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border ${HYPE_BADGE[arcRec.hypeLevel]}`}>
                    {arcRec.hypeLevel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{arcRec.reason}</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="empty" className="text-xs text-slate-600 py-2 text-center">
            🐌 Den Den Mushi is off-grid…
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
