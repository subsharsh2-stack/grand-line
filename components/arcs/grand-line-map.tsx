"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ARC_DIFFICULTY_CONFIG } from "@/types";

interface ArcWithProgress {
  id: number;
  slug: string;
  name: string;
  saga: string;
  episode_start: number;
  episode_end: number;
  episode_count: number;
  difficulty: string;
  bounty_reward: number;
  map_x: number | null;
  map_y: number | null;
  order_index: number;
  userStatus: string;
  episodesWatched: number;
}

interface Props {
  arcs: ArcWithProgress[];
}

const SAGA_COLORS: Record<string, string> = {
  "East Blue Saga":          "#60a5fa",
  "Alabasta Saga":           "#fbbf24",
  "Sky Island Saga":         "#34d399",
  "Water 7 Saga":            "#f97316",
  "Thriller Bark Saga":      "#a78bfa",
  "Summit War Saga":         "#f87171",
  "Fish-Man Island Saga":    "#06b6d4",
  "Dressrosa Saga":          "#f5a623",
  "Whole Cake Island Saga":  "#ec4899",
  "Wano Saga":               "#c084fc",
  "Final Saga":              "#fde68a",
};

const ARC_EMOJIS: Record<string, string> = {
  romance_dawn: "⚓", orange_town: "🤡", syrup_village: "🔭", baratie: "🍽️",
  arlong_park: "🐟", loguetown: "🏙️", reverse_mountain: "🌊", whisky_peak: "🍺",
  little_garden: "🦕", drum_island: "🏔️", alabasta: "🏜️", jaya: "🌴",
  skypiea: "☁️", long_ring: "🏝️", water_seven: "🌊", enies_lobby: "⚖️",
  post_enies: "⛵", thriller_bark: "🧟", sabaody: "🫧", amazon_lily: "💐",
  impel_down: "🔒", marineford: "💔", post_marineford: "🕊️", return_sabaody: "✨",
  fish_man_island: "🐠", punk_hazard: "☣️", dressrosa: "🌹", zou: "🐘",
  whole_cake: "🎂", levely: "👑", wano: "🌸", egghead: "🤖",
};

export function GrandLineMap({ arcs }: Props) {
  const [hoveredArc, setHoveredArc] = useState<ArcWithProgress | null>(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });

  function getNodeColor(arc: ArcWithProgress) {
    if (arc.userStatus === "completed") return "#f5a623";
    if (arc.userStatus === "in_progress") return "#60a5fa";
    return "#1e293b";
  }

  function getNodeBorder(arc: ArcWithProgress) {
    if (arc.userStatus === "completed") return "rgba(245,166,35,0.8)";
    if (arc.userStatus === "in_progress") return "rgba(96,165,250,0.8)";
    const sagaColor = SAGA_COLORS[arc.saga] || "#475569";
    return `${sagaColor}40`;
  }

  // Sort arcs by order_index for the path
  const sortedArcs = [...arcs].sort((a, b) => a.order_index - b.order_index);

  return (
    <div className="relative mx-6 my-8 rounded-2xl border border-white/[0.06] bg-void-900/40 overflow-hidden">
      <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-300">
          🗺️ Interactive Grand Line Map
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-gold-500" />
            Completed
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
            In Progress
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600" />
            Not Started
          </div>
        </div>
      </div>

      {/* Map SVG */}
      <div className="relative overflow-x-auto">
        <svg
          viewBox="0 0 1100 400"
          className="w-full"
          style={{ minWidth: "800px", minHeight: "300px" }}
        >
          {/* Ocean background */}
          <defs>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#082f49" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#080c14" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <rect width="1100" height="400" fill="url(#oceanGrad)" />

          {/* Dotted path line */}
          {sortedArcs.slice(0, -1).map((arc, i) => {
            const next = sortedArcs[i + 1];
            if (!arc.map_x || !arc.map_y || !next.map_x || !next.map_y) return null;
            const x1 = (arc.map_x / 100) * 1060 + 20;
            const y1 = (arc.map_y / 100) * 360 + 20;
            const x2 = (next.map_x / 100) * 1060 + 20;
            const y2 = (next.map_y / 100) * 360 + 20;
            return (
              <line
                key={arc.id}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(245,166,35,0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 6"
              />
            );
          })}

          {/* Arc nodes */}
          {sortedArcs.map((arc) => {
            if (!arc.map_x || !arc.map_y) return null;
            const cx = (arc.map_x / 100) * 1060 + 20;
            const cy = (arc.map_y / 100) * 360 + 20;
            const isCompleted = arc.userStatus === "completed";
            const isInProgress = arc.userStatus === "in_progress";
            const radius = arc.difficulty === "legendary" ? 18 : arc.difficulty === "hard" ? 16 : 13;

            return (
              <g key={arc.id}>
                {/* Glow ring for completed/in-progress */}
                {(isCompleted || isInProgress) && (
                  <circle
                    cx={cx} cy={cy} r={radius + 6}
                    fill="none"
                    stroke={isCompleted ? "rgba(245,166,35,0.3)" : "rgba(96,165,250,0.3)"}
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                )}

                {/* Main node */}
                <Link href={`/episodes?arc=${arc.slug}`}>
                  <circle
                    cx={cx} cy={cy} r={radius}
                    fill={getNodeColor(arc)}
                    stroke={getNodeBorder(arc)}
                    strokeWidth="2"
                    className="cursor-pointer transition-all"
                    onMouseEnter={(e) => {
                      setHoveredArc(arc);
                      const rect = (e.target as SVGCircleElement).closest('svg')!.getBoundingClientRect();
                      setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                    }}
                    onMouseLeave={() => setHoveredArc(null)}
                  />
                </Link>

                {/* Emoji */}
                <text x={cx} y={cy + 5} textAnchor="middle" fontSize={radius > 14 ? "12" : "9"} style={{ pointerEvents: "none", userSelect: "none" }}>
                  {ARC_EMOJIS[arc.slug] || "🏝️"}
                </text>

                {/* Arc name label */}
                <text
                  x={cx} y={cy + radius + 12}
                  textAnchor="middle"
                  fontSize="7"
                  fill={isCompleted ? "#f5a623" : isInProgress ? "#60a5fa" : "#475569"}
                  fontFamily="sans-serif"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {arc.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredArc && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-20 bg-void-900 border border-white/10 rounded-xl p-3 pointer-events-none shadow-2xl w-52"
            style={{
              left: Math.min(tooltip.x + 10, 850),
              top: Math.max(tooltip.y - 80, 10),
            }}
          >
            <div className="text-xs font-semibold tracking-widest uppercase text-slate-500 mb-1">{hoveredArc.saga}</div>
            <div className="font-bold text-white text-sm mb-1">{hoveredArc.name} Arc</div>
            <div className="text-xs text-slate-500 mb-2">Episodes {hoveredArc.episode_start}–{hoveredArc.episode_end}</div>
            <div className="flex items-center justify-between text-xs">
              <span
                className="font-bold"
                style={{ color: ARC_DIFFICULTY_CONFIG[hoveredArc.difficulty as keyof typeof ARC_DIFFICULTY_CONFIG]?.color }}
              >
                {ARC_DIFFICULTY_CONFIG[hoveredArc.difficulty as keyof typeof ARC_DIFFICULTY_CONFIG]?.emoji}{" "}
                {ARC_DIFFICULTY_CONFIG[hoveredArc.difficulty as keyof typeof ARC_DIFFICULTY_CONFIG]?.label}
              </span>
              <span className="text-gold-400 font-bold">฿{hoveredArc.bounty_reward.toLocaleString()}</span>
            </div>
            <div className="mt-2 text-xs">
              {hoveredArc.userStatus === "completed" && <span className="text-gold-400">✓ Completed</span>}
              {hoveredArc.userStatus === "in_progress" && <span className="text-blue-400">⚡ {hoveredArc.episodesWatched}/{hoveredArc.episode_count} episodes</span>}
              {hoveredArc.userStatus === "not_started" && <span className="text-slate-600">○ Not started</span>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
