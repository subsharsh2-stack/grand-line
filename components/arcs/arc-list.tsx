"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Lock, CheckCircle, Play, Clock } from "lucide-react";
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
  description: string | null;
  userStatus: string;
  episodesWatched: number;
}

interface Props {
  arcs: ArcWithProgress[];
}

const SAGA_ORDER = [
  "East Blue Saga",
  "Alabasta Saga",
  "Sky Island Saga",
  "Water 7 Saga",
  "Thriller Bark Saga",
  "Summit War Saga",
  "Fish-Man Island Saga",
  "Dressrosa Saga",
  "Whole Cake Island Saga",
  "Wano Saga",
  "Final Saga",
];

export function ArcList({ arcs }: Props) {
  const [expandedSaga, setExpandedSaga] = useState<string>("East Blue Saga");

  // Group arcs by saga
  const sagaGroups = SAGA_ORDER.reduce((acc, saga) => {
    const sagaArcs = arcs.filter((a) => a.saga === saga);
    if (sagaArcs.length > 0) acc[saga] = sagaArcs;
    return acc;
  }, {} as Record<string, ArcWithProgress[]>);

  function getSagaProgress(sagaArcs: ArcWithProgress[]) {
    const completed = sagaArcs.filter(a => a.userStatus === "completed").length;
    return { completed, total: sagaArcs.length };
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-16">
      <h2 className="font-display text-2xl font-black text-white mb-6">Arc by Arc</h2>

      <div className="space-y-3">
        {Object.entries(sagaGroups).map(([saga, sagaArcs]) => {
          const { completed, total } = getSagaProgress(sagaArcs);
          const isExpanded = expandedSaga === saga;

          return (
            <div key={saga} className="border border-white/[0.06] rounded-2xl overflow-hidden">
              {/* Saga header */}
              <button
                onClick={() => setExpandedSaga(isExpanded ? "" : saga)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${completed === total && total > 0 ? "bg-gold-500" : completed > 0 ? "bg-blue-400" : "bg-slate-700"}`} />
                  <div className="text-left">
                    <div className="font-bold text-slate-200 text-sm">{saga}</div>
                    <div className="text-xs text-slate-600">{total} arcs</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xs text-slate-500">
                    {completed}/{total} completed
                  </div>
                  <div className="w-20 h-1 rounded-full bg-void-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gold-500 transition-all duration-500"
                      style={{ width: `${(completed / total) * 100}%` }}
                    />
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-slate-500 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                  />
                </div>
              </button>

              {/* Arc cards */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-t border-white/[0.06] grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-white/[0.03]"
                >
                  {sagaArcs.map((arc) => {
                    const diffConfig = ARC_DIFFICULTY_CONFIG[arc.difficulty as keyof typeof ARC_DIFFICULTY_CONFIG];
                    const progress = arc.episode_count > 0 ? (arc.episodesWatched / arc.episode_count) * 100 : 0;

                    return (
                      <Link
                        key={arc.id}
                        href={`/episodes?arc=${arc.slug}`}
                        className="group block bg-[#080c14] p-4 hover:bg-void-900/80 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                              {arc.name} Arc
                            </div>
                            <div className="text-[10px] text-slate-600 mt-0.5">
                              Ep {arc.episode_start}–{arc.episode_end}
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {arc.userStatus === "completed" && (
                              <CheckCircle size={14} className="text-gold-500" />
                            )}
                            {arc.userStatus === "in_progress" && (
                              <Play size={14} className="text-blue-400" />
                            )}
                            {arc.userStatus === "not_started" && (
                              <Clock size={14} className="text-slate-700" />
                            )}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full h-0.5 bg-void-700 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              background: arc.userStatus === "completed"
                                ? "linear-gradient(90deg, #d97706, #f5a623)"
                                : "linear-gradient(90deg, #1d4ed8, #60a5fa)",
                            }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <span style={{ color: diffConfig?.color }}>
                            {diffConfig?.emoji} {diffConfig?.label}
                          </span>
                          <span className="text-gold-500 font-bold">฿{arc.bounty_reward.toLocaleString()}</span>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
