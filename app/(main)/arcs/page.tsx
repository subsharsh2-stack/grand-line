"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { ChevronDown, Zap, Trophy, Lock } from "lucide-react";

interface Arc {
  id: string | number;
  name: string;
  order_index: number;
  episode_start: number;
  episode_end: number;
  difficulty_level?: number;
  bounty_reward?: number;
  sagas?: { name: string; order_index: number } | null;
}

interface ArcWithProgress extends Arc {
  userStatus: "not_started" | "in_progress" | "completed";
  episodesWatched: number;
}

interface ArcProgress {
  arc_id: string | number;
  status: string;
  episodes_watched: number;
}

const SAGA_ORDER = [
  "East Blue",
  "Alabasta",
  "Sky Island",
  "Water 7",
  "Thriller Bark",
  "Summit War",
  "Fish-Man Island",
  "Dressrosa",
  "Whole Cake Island",
  "Wano Country",
  "Final Saga",
];

function SkullLoader() {
  return (
    <div className="min-h-screen bg-[#060B14] flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="text-6xl"
      >
        ☠️
      </motion.div>
    </div>
  );
}

export default function ArcsPage() {
  const [arcs, setArcs] = useState<ArcWithProgress[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "in_progress" | "completed" | "not_started">("all");
  const [expandedSagas, setExpandedSagas] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;

      if (!userId) {
        setLoading(false);
        return;
      }

      const [{ data: arcsData }, { data: progressData }] = await Promise.all([
        supabase
          .from("arcs")
          .select("*, sagas(name, order_index)")
          .order("order_index"),
        supabase
          .from("arc_progress")
          .select("*")
          .eq("user_id", userId),
      ]);

      const progressMap: Record<string | number, ArcProgress> = {};
      (progressData || []).forEach((p: ArcProgress) => {
        progressMap[p.arc_id] = p;
      });

      const arcsWithProgress = (arcsData || []).map((arc: Arc) => ({
        ...arc,
        userStatus: (progressMap[arc.id]?.status || "not_started") as "not_started" | "in_progress" | "completed",
        episodesWatched: progressMap[arc.id]?.episodes_watched || 0,
      }));

      setArcs(arcsWithProgress);
      setProfile({ userId });
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <SkullLoader />;

  const arcsBySaga = arcs.reduce((acc, arc) => {
    const sagaName = (arc.sagas as any)?.name || "Unknown";
    if (!acc[sagaName]) acc[sagaName] = [];
    acc[sagaName].push(arc);
    return acc;
  }, {} as Record<string, ArcWithProgress[]>);

  const sortedSagas = SAGA_ORDER.filter((saga) => arcsBySaga[saga]);

  const filteredSagas = sortedSagas.map((sagaName) => ({
    saga: sagaName,
    arcs: arcsBySaga[sagaName].filter((arc) => {
      if (selectedFilter === "all") return true;
      return arc.userStatus === selectedFilter;
    }),
  }));

  const stats = {
    totalEpisodes: arcs.reduce((sum, arc) => sum + (arc.episode_end - arc.episode_start + 1), 0),
    arcsCompleted: arcs.filter((a) => a.userStatus === "completed").length,
    arcsRemaining: arcs.filter((a) => a.userStatus !== "completed").length,
  };

  return (
    <div className="min-h-screen bg-[#060B14]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-gradient-to-b from-[#0a0f1a] to-[#060B14]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div>
              <div className="text-xs text-[#f5a623] font-semibold tracking-widest uppercase mb-2">Log Pose Navigation</div>
              <h1 className="font-display text-5xl font-black text-white mb-3">Grand Line Map</h1>
              <p className="text-slate-400 text-base">Your voyage across 32+ arcs. Chart your course through the seas.</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="font-display text-4xl font-black text-[#f5a623]">{stats.totalEpisodes}</div>
                <div className="text-xs text-slate-500 mt-1">Total Episodes</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-black text-emerald-400">{stats.arcsCompleted}</div>
                <div className="text-xs text-slate-500 mt-1">Arcs Completed</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-black text-slate-400">{stats.arcsRemaining}</div>
                <div className="text-xs text-slate-500 mt-1">Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-white/[0.06] bg-[#060B14]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {(["all", "in_progress", "completed", "not_started"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium transition-all ${
                  selectedFilter === filter
                    ? "bg-[#f5a623] text-[#060B14]"
                    : "bg-[#0a0f1a] border border-white/[0.06] text-slate-300 hover:border-white/[0.12]"
                }`}
              >
                {filter === "all" ? "All Sagas" : filter === "in_progress" ? "In Progress" : filter === "completed" ? "Completed" : "Not Started"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Arcs by Saga */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {filteredSagas.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-4xl mb-3">No arcs found</div>
          </div>
        ) : (
          filteredSagas.map(({ saga, arcs: sagaArcs }) => {
            if (sagaArcs.length === 0) return null;
            const completedCount = sagaArcs.filter((a) => a.userStatus === "completed").length;
            const isExpanded = expandedSagas[saga] ?? true;

            return (
              <motion.div key={saga} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Saga Header */}
                <button
                  onClick={() => setExpandedSagas((prev) => ({ ...prev, [saga]: !prev[saga] }))}
                  className="w-full bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-5 flex items-center justify-between hover:border-white/[0.12] transition-all mb-6"
                >
                  <div className="flex-1 text-left">
                    <h2 className="text-xl font-bold text-white">{saga}</h2>
                    <p className="text-sm text-slate-400 mt-1">
                      {completedCount} of {sagaArcs.length} arcs completed
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-40 h-2 bg-[#0a0f1a] rounded-full border border-white/[0.06] overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#f5a623] to-yellow-400"
                        style={{ width: `${(completedCount / sagaArcs.length) * 100}%` }}
                      />
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={20} className="text-slate-400" />
                    </motion.div>
                  </div>
                </button>

                {/* Arc Cards Grid */}
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
                  >
                    {sagaArcs.map((arc) => {
                      const totalEps = arc.episode_end - arc.episode_start + 1;
                      const progressPercent = (arc.episodesWatched / totalEps) * 100;
                      const statusIcon = arc.userStatus === "completed" ? "✓" : arc.userStatus === "in_progress" ? "▶" : "🔒";
                      const statusColor =
                        arc.userStatus === "completed" ? "text-emerald-400" : arc.userStatus === "in_progress" ? "text-[#f5a623]" : "text-slate-500";
                      const borderColor =
                        arc.userStatus === "in_progress" ? "border-[#f5a623]/40" : arc.userStatus === "completed" ? "border-emerald-400/40" : "border-white/[0.06]";

                      return (
                        <motion.div
                          key={arc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ y: -4 }}
                          className={`bg-[#0a0f1a] border ${borderColor} rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-[#f5a623]/10`}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-white">{arc.name}</h3>
                              <p className="text-xs text-slate-500 mt-1">Ep {arc.episode_start}-{arc.episode_end}</p>
                            </div>
                            <span className={`text-lg font-bold ${statusColor}`}>{statusIcon}</span>
                          </div>

                          <div className="space-y-3">
                            {/* Progress */}
                            <div>
                              <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Progress</span>
                                <span>{arc.episodesWatched}/{totalEps}</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#0a0f1a] rounded-full border border-white/[0.06] overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-[#f5a623] to-yellow-400"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPercent}%` }}
                                  transition={{ duration: 0.8 }}
                                />
                              </div>
                            </div>

                            {/* Reward */}
                            <div className="flex items-center gap-2 text-sm font-bold text-[#f5a623]">
                              <Trophy size={14} />
                              +{(arc.bounty_reward || 0).toLocaleString()} Berries
                            </div>

                            {/* Difficulty */}
                            {arc.difficulty_level && (
                              <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      i < arc.difficulty_level ? "bg-[#f5a623]" : "bg-slate-700"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Action Button */}
                            <button className="w-full mt-4 py-2.5 rounded-xl bg-[#f5a623] text-[#060B14] font-bold text-sm hover:bg-yellow-400 transition-all">
                              {arc.userStatus === "completed" ? "Review" : arc.userStatus === "in_progress" ? "Continue" : "Start"}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
