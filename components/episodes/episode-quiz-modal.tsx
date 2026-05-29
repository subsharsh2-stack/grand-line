"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Trophy, Zap, CheckCircle, XCircle, Gift, Flame, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface QuizOption {
  text: string;
  is_correct: boolean;
}

interface EpisodeData {
  id: number;
  episode_number: number;
  title: string;
  bounty_reward: number;
  bonus_bounty: number;
  crunchyroll_url: string | null;
  netflix_url: string | null;
  has_figure_deal: boolean;
  figure_deal_url: string | null;
  figure_deal_discount: number | null;
  figure_deal_description: string | null;
  quiz_question: string | null;
  quiz_options: QuizOption[] | null;
}

interface Props {
  episode: EpisodeData;
  onClose: () => void;
  onSuccess: () => void;
}

type ModalStep = "watch_prompt" | "generating_quiz" | "quiz" | "result";

export function EpisodeQuizModal({ episode, onClose, onSuccess }: Props) {
  const supabase = createClient();
  const [step, setStep] = useState<ModalStep>("watch_prompt");
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<{
    passed: boolean;
    bountyEarned: number;
    streakBonus: number;
    newStreak: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  // Live quiz data — may be populated on-the-fly by AI generation
  const [liveQuizQuestion, setLiveQuizQuestion] = useState<string | null>(episode.quiz_question);
  const [liveQuizOptions, setLiveQuizOptions] = useState<QuizOption[] | null>(episode.quiz_options);

  const hasQuiz = !!(liveQuizQuestion && liveQuizOptions?.length);

  // Fetch AI-generated quiz on demand when the user taps "I watched it!"
  async function ensureQuiz(): Promise<boolean> {
    if (hasQuiz) return true;
    setStep("generating_quiz");
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ episodeId: episode.id }),
      });
      const data = await res.json();
      if (data.quiz) {
        setLiveQuizQuestion(data.quiz.question);
        setLiveQuizOptions(data.quiz.options);
        return true;
      }
      // Graceful fallback — no quiz generated, mark as watched without quiz
      return false;
    } catch {
      return false;
    }
  }

  async function submitWatch(withQuiz: boolean, answerIdx?: number) {
    setLoading(true);
    const quizPassed = withQuiz && answerIdx !== undefined
      ? liveQuizOptions?.[answerIdx]?.is_correct || false
      : false;

    const { data, error } = await supabase.rpc("mark_episode_watched", {
      p_episode_id: episode.id,
      p_quiz_passed: quizPassed,
      p_quiz_answer: answerIdx ?? null,
    });

    if (error) {
      if (error.message.includes("Already watched")) {
        toast.error("You already marked this episode as watched!");
        onClose();
      } else {
        toast.error("Something went wrong. Try again.");
      }
    } else {
      setQuizResult({
        passed: quizPassed,
        bountyEarned: data.bounty_earned,
        streakBonus: data.streak_bonus,
        newStreak: data.new_streak,
      });
      setStep("result");
    }
    setLoading(false);
  }

  function handleQuizSubmit() {
    if (selectedAnswer === null) return;
    submitWatch(true, selectedAnswer);
  }

  function skipQuiz() {
    submitWatch(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-[#0f172a] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden z-10"
      >
        <AnimatePresence mode="wait">

          {/* STEP 1: Watch Prompt */}
          {step === "watch_prompt" && (
            <motion.div
              key="watch"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                <X size={14} />
              </button>

              <div className="text-center mb-6">
                <div className="text-4xl mb-3">📺</div>
                <div className="text-xs text-gold-400 font-semibold tracking-widest uppercase mb-1">
                  Episode {episode.episode_number}
                </div>
                <h2 className="text-lg font-bold text-white leading-snug">{episode.title}</h2>
              </div>

              {/* Watch links */}
              <div className="space-y-2 mb-6">
                <p className="text-xs text-slate-500 text-center mb-3">Watch on:</p>
                {episode.crunchyroll_url && (
                  <a
                    href={episode.crunchyroll_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-sm text-orange-300 hover:bg-orange-500/20 transition-all"
                  >
                    <span className="font-medium">🎬 Crunchyroll</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {episode.netflix_url && (
                  <a
                    href={episode.netflix_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300 hover:bg-red-500/20 transition-all"
                  >
                    <span className="font-medium">🔴 Netflix</span>
                    <ExternalLink size={12} />
                  </a>
                )}
                {!episode.crunchyroll_url && !episode.netflix_url && (
                  <p className="text-xs text-slate-600 text-center italic">
                    Search for &quot;One Piece Episode {episode.episode_number}&quot; on your preferred platform
                  </p>
                )}
              </div>

              {/* Bounty preview */}
              <div className="bg-gold-500/[0.07] border border-gold-500/20 rounded-xl px-4 py-3 mb-6">
                <div className="text-xs text-slate-400 mb-2 text-center">Rewards for this episode</div>
                <div className="flex items-center justify-around">
                  <div className="text-center">
                    <div className="text-lg font-black text-gold-400">฿{episode.bounty_reward}</div>
                    <div className="text-[10px] text-slate-500">Base</div>
                  </div>
                  {hasQuiz && (
                    <>
                      <div className="text-slate-600 text-lg">+</div>
                      <div className="text-center">
                        <div className="text-lg font-black text-blue-400">฿{episode.bonus_bounty}</div>
                        <div className="text-[10px] text-slate-500">Quiz Bonus</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={async () => {
                  // If already has quiz, go straight to quiz step
                  if (hasQuiz) { setStep("quiz"); return; }
                  // Otherwise try to generate one — if it works go to quiz, else mark watched directly
                  const quizReady = await ensureQuiz();
                  if (quizReady) {
                    setStep("quiz");
                  } else {
                    submitWatch(false);
                  }
                }}
                disabled={loading}
                className="w-full bg-gold-500 hover:bg-gold-400 text-void-950 font-bold py-4 rounded-xl text-sm transition-all shadow-gold-glow hover:shadow-gold-glow-lg"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin mx-auto" />
                ) : (
                  "I watched it! Take the Quiz →"
                )}
              </button>
            </motion.div>
          )}

          {/* STEP 1.5: Generating Quiz */}
          {step === "generating_quiz" && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-10 flex flex-col items-center justify-center gap-4"
            >
              <div className="relative">
                <span className="text-5xl">🐌</span>
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
              </div>
              <div className="text-center">
                <div className="text-white font-bold text-sm mb-1">Den Den Mushi is crafting your quiz…</div>
                <div className="text-slate-500 text-xs">Consulting the Grand Line archives</div>
              </div>
              <div className="flex gap-1.5 mt-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-gold-500/50 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: Quiz */}
          {step === "quiz" && hasQuiz && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-slate-500 hover:text-white hover:bg-white/[0.06] transition-all">
                <X size={14} />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-2 py-0.5 text-xs text-blue-400 font-bold">
                    QUIZ
                  </div>
                  <div className="text-xs text-slate-500">+฿{episode.bonus_bounty} for correct answer</div>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {liveQuizQuestion}
                </h3>
              </div>

              <div className="space-y-2 mb-6">
                {liveQuizOptions!.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(i)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      selectedAnswer === i
                        ? "border-gold-500 bg-gold-500/15 text-white"
                        : "border-white/[0.08] text-slate-400 hover:border-white/[0.15] hover:text-white"
                    }`}
                  >
                    <span className="font-bold mr-2 text-slate-500">
                      {["A", "B", "C", "D"][i]}.
                    </span>
                    {option.text}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={skipQuiz}
                  disabled={loading}
                  className="flex-1 border border-white/[0.08] text-slate-500 hover:text-slate-300 py-3 rounded-xl text-sm transition-all"
                >
                  Skip quiz
                </button>
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswer === null || loading}
                  className="flex-1 bg-gold-500 hover:bg-gold-400 disabled:opacity-40 text-void-950 font-bold py-3 rounded-xl text-sm transition-all"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin mx-auto" />
                  ) : "Submit →"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Result */}
          {step === "result" && quizResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 text-center"
            >
              {/* Animated bounty */}
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.6, delay: 0.1 }}
                className="mb-4"
              >
                <div className="text-5xl mb-2">
                  {quizResult.passed ? "🎉" : "✅"}
                </div>
                <div className="font-display text-4xl font-black text-gold-400">
                  +฿{quizResult.bountyEarned.toLocaleString()}
                </div>
                <div className="text-xs text-slate-500 mt-1">Berries earned</div>
              </motion.div>

              {/* Breakdown */}
              <div className="bg-void-800/50 rounded-xl p-4 mb-4 text-left space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Episode bounty</span>
                  <span className="text-slate-200 font-bold">฿{episode.bounty_reward}</span>
                </div>
                {quizResult.passed && (
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-400 flex items-center gap-1"><Trophy size={11} /> Quiz bonus</span>
                    <span className="text-blue-400 font-bold">+฿{episode.bonus_bounty}</span>
                  </div>
                )}
                {quizResult.streakBonus > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-400 flex items-center gap-1"><Flame size={11} /> Streak bonus ({quizResult.newStreak}d)</span>
                    <span className="text-orange-400 font-bold">+฿{quizResult.streakBonus}</span>
                  </div>
                )}
                <div className="border-t border-white/[0.06] pt-2 flex justify-between text-sm">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-gold-400 font-black">฿{quizResult.bountyEarned}</span>
                </div>
              </div>

              {/* Streak */}
              {quizResult.newStreak > 0 && (
                <div className="flex items-center justify-center gap-1.5 mb-4 text-sm text-orange-400">
                  <Flame size={14} />
                  <span className="font-bold">{quizResult.newStreak} day streak!</span>
                </div>
              )}

              {/* Figure deal */}
              {episode.has_figure_deal && episode.figure_deal_url && (
                <a
                  href={episode.figure_deal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-gold-500/10 border border-gold-500/30 rounded-xl mb-4 text-left hover:bg-gold-500/15 transition-all"
                >
                  <Gift size={16} className="text-gold-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-gold-400">
                      🎁 {episode.figure_deal_discount}% OFF — Exclusive Figure Deal
                    </div>
                    <div className="text-[10px] text-slate-500">{episode.figure_deal_description}</div>
                  </div>
                </a>
              )}

              <button
                onClick={onSuccess}
                className="w-full bg-gold-500 hover:bg-gold-400 text-void-950 font-bold py-3.5 rounded-xl text-sm transition-all"
              >
                Keep Sailing 🏴‍☠️
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}
