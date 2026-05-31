"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface EpisodeData {
  id: string | number;
  episode_number: number;
  title: string;
  arc_id?: string | number | null;
  arcs?: { name: string; saga?: string } | null;
  description?: string | null;
  thumbnail_url?: string | null;
  duration?: number | null;
  is_filler?: boolean;
  importance_score?: number;
  isWatched: boolean;
  quizPassed: boolean;
}

interface Arc {
  id: string | number;
  slug: string;
  name: string;
  saga?: string;
}

interface Props {
  episodes: EpisodeData[];
  arcs: Arc[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  currentArc?: string;
  currentSearch?: string;
}

const SAGA_COLORS: Record<string, string> = {
  "East Blue": "#3b82f6",
  "Alabasta": "#f97316",
  "Sky Island": "#06b6d4",
  "Water 7": "#8b5cf6",
  "Thriller Bark": "#6366f1",
  "Summit War": "#ef4444",
  "Fish-Man Island": "#10b981",
  "Dressrosa": "#ec4899",
  "Whole Cake Island": "#f59e0b",
  "Wano Country": "#14b8a6",
  "Final Saga": "#f5a623",
};

export function EpisodeBrowser({
  episodes,
  arcs,
  totalCount,
  currentPage,
  pageSize,
  currentArc,
  currentSearch,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch || "");
  const [filter, setFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [showFiller, setShowFiller] = useState(true);

  const totalPages = Math.ceil(totalCount / pageSize);

  function updateSearch(value: string) {
    setSearch(value);
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    if (currentArc) params.set("arc", currentArc);
    startTransition(() => {
      router.push(`/episodes?${params.toString()}`);
    });
  }

  function updateArc(slug: string) {
    const params = new URLSearchParams();
    if (slug) params.set("arc", slug);
    if (search) params.set("search", search);
    startTransition(() => {
      router.push(`/episodes?${params.toString()}`);
    });
  }

  function gotoPage(p: number) {
    const params = new URLSearchParams();
    if (currentArc) params.set("arc", currentArc);
    if (search) params.set("search", search);
    params.set("page", String(p));
    startTransition(() => {
      router.push(`/episodes?${params.toString()}`);
    });
  }

  const filteredEpisodes = episodes.filter((ep) => {
    if (!showFiller && ep.is_filler) return false;
    if (filter === "watched" && !ep.isWatched) return false;
    if (filter === "unwatched" && ep.isWatched) return false;
    return true;
  });

  const watchedCount = episodes.filter((e) => e.isWatched).length;
  const quizCount = episodes.filter((e) => e.quizPassed).length;
  const completePercent = Math.round((watchedCount / episodes.length) * 100);

  return (
    <div className="min-h-screen bg-[#060B14]">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0a0f1a]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
            <div>
              <h1 className="font-display text-3xl font-black text-white mb-1">
                {currentArc ? `${arcs.find((a) => a.slug === currentArc)?.name} Arc` : "All Episodes"}
              </h1>
              <p className="text-slate-500 text-sm">{totalCount.toLocaleString()} episodes total</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-[#060B14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Watched</div>
              <div className="font-display text-2xl font-bold text-white">{watchedCount}</div>
            </div>
            <div className="bg-[#060B14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Total</div>
              <div className="font-display text-2xl font-bold text-white">{episodes.length}</div>
            </div>
            <div className="bg-[#060B14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Complete</div>
              <div className="font-display text-2xl font-bold text-[#f5a623]">{completePercent}%</div>
            </div>
            <div className="bg-[#060B14] border border-white/[0.06] rounded-xl p-3">
              <div className="text-xs text-slate-500 mb-1">Quizzes</div>
              <div className="font-display text-2xl font-bold text-emerald-400">{quizCount}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search episodes..."
                className="w-full bg-[#0a0f1a] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-[#f5a623]/50 transition-all"
              />
            </div>

            {/* Arc filter */}
            <select
              value={currentArc || ""}
              onChange={(e) => updateArc(e.target.value)}
              className="bg-[#0a0f1a] border border-white/[0.06] rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-[#f5a623]/50 transition-all"
            >
              <option value="">All Arcs</option>
              {arcs.map((arc) => (
                <option key={arc.id} value={arc.slug}>
                  {arc.name}
                </option>
              ))}
            </select>

            {/* Watch status filter */}
            <div className="flex border border-white/[0.06] rounded-xl overflow-hidden">
              {(["all", "watched", "unwatched"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2.5 text-xs font-medium capitalize transition-all ${
                    filter === f
                      ? "bg-[#f5a623] text-[#060B14]"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Filler toggle */}
            <button
              onClick={() => setShowFiller(!showFiller)}
              className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                !showFiller
                  ? "border-orange-500/30 bg-orange-500/10 text-orange-400"
                  : "border-white/[0.06] text-slate-400 hover:text-slate-300"
              }`}
            >
              <Filter size={14} />
              {showFiller ? "Hide Filler" : "Show Filler"}
            </button>
          </div>
        </div>
      </div>

      {/* Episode Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {filteredEpisodes.length > 0 ? (
            <motion.div
              key={`${currentArc}-${currentPage}-${search}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`grid grid-cols-3 md:grid-cols-4 gap-4 ${isPending ? "opacity-50" : ""}`}
            >
              {filteredEpisodes.map((ep, i) => {
                const arcName = (ep.arcs as any)?.name || "Unknown";
                const saga = (ep.arcs as any)?.saga || "";
                const sagaColor = SAGA_COLORS[saga] || "#64748b";

                return (
                  <motion.div
                    key={ep.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className={`group bg-[#0a0f1a] border border-white/[0.06] rounded-2xl overflow-hidden transition-all hover:border-white/[0.12] ${
                      ep.isWatched ? "opacity-70" : ""
                    }`}
                  >
                    {/* Episode Number Badge */}
                    <div className="relative bg-gradient-to-b from-[#0a0f1a] to-[#060B14] p-3 pb-4">
                      <div
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                          ep.isWatched
                            ? "bg-emerald-400/20 text-emerald-400"
                            : "bg-[#f5a623]/20 text-[#f5a623]"
                        }`}
                      >
                        {ep.isWatched ? "✓" : ""} Ep {ep.episode_number}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-[#f5a623] text-[#060B14] px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-all">
                          Mark Watched
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-3 space-y-2">
                      {/* Title */}
                      <h3 className="text-sm font-bold text-white line-clamp-2">{ep.title}</h3>

                      {/* Arc Name */}
                      <div
                        className="inline-block text-[10px] font-bold text-white px-2 py-1 rounded-full"
                        style={{ backgroundColor: `${sagaColor}20`, color: sagaColor }}
                      >
                        {arcName}
                      </div>

                      {/* Duration */}
                      {ep.duration && (
                        <div className="text-[10px] text-slate-500">{ep.duration} min</div>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1">
                        {ep.is_filler && (
                          <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                            Filler
                          </span>
                        )}
                        {ep.quizPassed && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                            Quiz Passed
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-20 text-slate-500">
              <div className="text-4xl mb-3">No episodes found</div>
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-white/[0.06]">
            <button
              onClick={() => gotoPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="w-10 h-10 rounded-lg border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/[0.12] disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm text-slate-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => gotoPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="w-10 h-10 rounded-lg border border-white/[0.06] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/[0.12] disabled:opacity-30 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
