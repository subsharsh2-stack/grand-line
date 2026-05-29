"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CheckCircle, Circle, Trophy, Zap, Filter, ChevronLeft, ChevronRight, Gift } from "lucide-react";
import { EpisodeCard } from "./episode-card";
import { EpisodeQuizModal } from "./episode-quiz-modal";

interface EpisodeData {
  id: number;
  episode_number: number;
  title: string;
  arc_id: number | null;
  arc_name: string | null;
  synopsis: string | null;
  thumbnail_url: string | null;
  crunchyroll_url: string | null;
  netflix_url: string | null;
  bounty_reward: number;
  bonus_bounty: number;
  is_filler: boolean;
  importance_level: number;
  has_figure_deal: boolean;
  figure_deal_url: string | null;
  figure_deal_discount: number | null;
  figure_deal_description: string | null;
  quiz_question: string | null;
  quiz_options: Array<{ text: string; is_correct: boolean }> | null;
  isWatched: boolean;
  quizPassed: boolean;
}

interface Arc {
  id: number;
  slug: string;
  name: string;
  saga: string;
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

export function EpisodeBrowser({
  episodes, arcs, totalCount, currentPage, pageSize, currentArc, currentSearch
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch || "");
  const [quizEpisode, setQuizEpisode] = useState<EpisodeData | null>(null);
  const [filter, setFilter] = useState<"all" | "watched" | "unwatched">("all");
  const [showFiller, setShowFiller] = useState(true);

  const totalPages = Math.ceil(totalCount / pageSize);

  function updateSearch(value: string) {
    setSearch(value);
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    if (currentArc) params.set("arc", currentArc);
    startTransition(() => { router.push(`/episodes?${params.toString()}`); });
  }

  function updateArc(slug: string) {
    const params = new URLSearchParams();
    if (slug) params.set("arc", slug);
    if (search) params.set("search", search);
    startTransition(() => { router.push(`/episodes?${params.toString()}`); });
  }

  function gotoPage(p: number) {
    const params = new URLSearchParams();
    if (currentArc) params.set("arc", currentArc);
    if (search) params.set("search", search);
    params.set("page", String(p));
    startTransition(() => { router.push(`/episodes?${params.toString()}`); });
  }

  const filteredEpisodes = episodes.filter((ep) => {
    if (!showFiller && ep.is_filler) return false;
    if (filter === "watched" && !ep.isWatched) return false;
    if (filter === "unwatched" && ep.isWatched) return false;
    return true;
  });

  const watchedCount = episodes.filter((e) => e.isWatched).length;
  const quizCount = episodes.filter((e) => e.quizPassed).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-black text-white mb-1">
            {currentArc ? `${arcs.find(a => a.slug === currentArc)?.name} Arc` : "All Episodes"}
          </h1>
          <p className="text-slate-500 text-sm">{totalCount.toLocaleString()} episodes total</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-xl px-4 py-2">
            <CheckCircle size={14} className="text-gold-500" />
            <span className="text-sm font-bold text-gold-400">{watchedCount}</span>
            <span className="text-xs text-slate-500">watched</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2">
            <Trophy size={14} className="text-blue-400" />
            <span className="text-sm font-bold text-blue-400">{quizCount}</span>
            <span className="text-xs text-slate-500">quizzes</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search episodes..."
            className="w-full bg-void-900/60 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-all"
          />
        </div>

        {/* Arc filter */}
        <select
          value={currentArc || ""}
          onChange={(e) => updateArc(e.target.value)}
          className="bg-void-900/60 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-gold-500/50 transition-all"
        >
          <option value="">All Arcs</option>
          {arcs.map((arc) => (
            <option key={arc.id} value={arc.slug}>{arc.name}</option>
          ))}
        </select>

        {/* Watch status filter */}
        <div className="flex border border-white/[0.08] rounded-xl overflow-hidden">
          {(["all", "watched", "unwatched"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 text-xs font-medium capitalize transition-all ${
                filter === f ? "bg-gold-500/20 text-gold-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Filler toggle */}
        <button
          onClick={() => setShowFiller(!showFiller)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
            showFiller ? "border-white/[0.08] text-slate-400" : "border-orange-500/30 bg-orange-500/10 text-orange-400"
          }`}
        >
          <Filter size={12} />
          {showFiller ? "Hide Filler" : "Show Filler"}
        </button>
      </div>

      {/* Episode grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${currentArc}-${currentPage}-${search}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 ${isPending ? "opacity-50" : ""}`}
        >
          {filteredEpisodes.map((ep, i) => (
            <EpisodeCard
              key={ep.id}
              episode={ep}
              index={i}
              onMarkWatched={() => setQuizEpisode(ep)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredEpisodes.length === 0 && (
        <div className="text-center py-20 text-slate-500">
          <div className="text-4xl mb-3">🗺️</div>
          <div className="text-sm">No episodes found for these filters</div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => gotoPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => gotoPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Quiz modal */}
      {quizEpisode && (
        <EpisodeQuizModal
          episode={quizEpisode}
          onClose={() => setQuizEpisode(null)}
          onSuccess={() => {
            setQuizEpisode(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
