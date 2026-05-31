"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Check, ArrowRight, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const STEPS = [
  { id: 1, label: "Welcome" },
  { id: 2, label: "Pirate Name" },
  { id: 3, label: "Current Episode" },
  { id: 4, label: "Your Goal" },
  { id: 5, label: "All Set!" },
];

const GOALS = [
  { id: "casual", emoji: "⛵", title: "Casual Sailor", desc: "Enjoy at my own pace with no pressure." },
  { id: "future_yonko", emoji: "👑", title: "Future Yonko", desc: "I will conquer the Grand Line and reach the top!" },
  { id: "binge", emoji: "🔥", title: "Binge Mode", desc: "Maximum speed! I want to catch up fast." },
  { id: "lore_hunter", emoji: "📖", title: "Lore Hunter", desc: "I want to learn everything about the world." },
  { id: "completionist", emoji: "🏆", title: "Completionist", desc: "100% completion is the only way." },
];

const ARC_OPTIONS = [
  { label: "East Blue Saga", range: "Eps 1–61" },
  { label: "Alabasta Saga", range: "Eps 62–135" },
  { label: "Sky Island Saga", range: "Eps 136–206" },
  { label: "Water Seven Saga", range: "Eps 207–325" },
  { label: "Thriller Bark Saga", range: "Eps 326–384" },
  { label: "Summit War Saga", range: "Eps 385–516" },
  { label: "Fish-Man Island Saga", range: "Eps 517–574" },
  { label: "Dressrosa Saga", range: "Eps 575–746" },
  { label: "Whole Cake Island Saga", range: "Eps 747–877" },
  { label: "Wano Country Saga", range: "Eps 878–1085" },
  { label: "Egghead Island Saga", range: "Eps 1086+" },
];

export default function SignupPage() {
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [currentEp, setCurrentEp] = useState(1);
  const [selectedArc, setSelectedArc] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const progressPct = ((step + 1) / STEPS.length) * 100;

  async function handleStep0(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setStep(1);
  }

  async function handleFinalSignup() {
    if (!goal) { toast.error("Choose your goal to continue"); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: {
        data: {
          username: username || email.split("@")[0],
          display_name: username || email.split("@")[0],
          current_episode: currentEp,
          goal,
        },
      },
    });
    if (error) { toast.error(error.message); setLoading(false); return; }
    // Try create profile
    if (data.user) {
      const un = (username || email.split("@")[0]).toLowerCase().replace(/[^a-z0-9_]/g, "_");
      await supabase.from("profiles").upsert({ id: data.user.id, username: un, display_name: un, current_episode: currentEp }).select().maybeSingle();
    }
    setStep(4);
    setLoading(false);
  }

  const steps = [
    // Step 0: Account
    <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🌊</div>
        <h2 className="font-display text-2xl font-black text-white mb-2">The Grand Line Awaits!</h2>
        <p className="text-slate-500 text-sm">Create your account to begin your pirate journey.</p>
      </div>
      <form onSubmit={handleStep0} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nakama@example.com"
              className="w-full h-11 pl-10 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 placeholder:text-slate-700 text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 8 characters"
              className="w-full h-11 pl-10 pr-10 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 placeholder:text-slate-700 text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400">
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <button type="submit" className="w-full h-12 bg-[#f5a623] hover:bg-[#fbbf24] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f5a623]/20">
          Next <ArrowRight size={16} />
        </button>
      </form>
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span className="text-xs text-slate-600">or</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/api/auth/callback` } })}
          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] text-sm font-medium transition-all">
          <svg width="15" height="15" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Google
        </button>
        <button onClick={() => supabase.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: `${window.location.origin}/api/auth/callback` } })}
          className="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] text-sm font-medium transition-all">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.01.052.037.1.079.131 2.052 1.508 4.04 2.423 5.993 3.029a.078.078 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994.021-.04.01-.088-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028c1.961-.607 3.95-1.522 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
          Discord
        </button>
      </div>
    </motion.div>,

    // Step 1: Pirate Name
    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">⚓</div>
        <h2 className="font-display text-2xl font-black text-white mb-2">What Is Your Pirate Name?</h2>
        <p className="text-slate-500 text-sm">This will be your legend in the Grand Line.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pirate Name (Username)</label>
          <div className="relative">
            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
            <input type="text" value={username} onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))} placeholder="e.g. monkey_d_harsh"
              className="w-full h-11 pl-10 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 placeholder:text-slate-700 text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all" />
          </div>
          <p className="text-xs text-slate-700">Only lowercase letters, numbers, and underscores. Min 3 characters.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2">
          {["RedStorm", "Monkey D Harsh", "PirateKing", "StrawHat Harsh"].map(s => (
            <button key={s} onClick={() => setUsername(s.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
              className="py-2 px-3 text-xs border border-white/[0.08] rounded-xl text-slate-400 hover:border-[#f5a623]/30 hover:text-[#f5a623] transition-all">
              {s}
            </button>
          ))}
        </div>
        <button onClick={() => { if (username.length >= 3) setStep(2); else toast.error("Enter a pirate name (min 3 chars)"); }}
          className="w-full h-12 bg-[#f5a623] hover:bg-[#fbbf24] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f5a623]/20">
          Next <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>,

    // Step 2: Current Episode
    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🗺️</div>
        <h2 className="font-display text-2xl font-black text-white mb-2">Where Are You In Your Journey?</h2>
        <p className="text-slate-500 text-sm">Select the arc or episode you're currently on.</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Episode</label>
          <input type="number" min={1} max={1200} value={currentEp} onChange={e => setCurrentEp(Number(e.target.value))}
            className="w-full h-11 px-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 text-sm focus:outline-none focus:border-[#f5a623]/50 transition-all text-center font-bold text-lg" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Or choose an arc</label>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {ARC_OPTIONS.map(arc => (
              <button key={arc.label} onClick={() => setSelectedArc(arc.label)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm transition-all ${selectedArc === arc.label ? "border-[#f5a623]/50 bg-[#f5a623]/10 text-[#f5a623]" : "border-white/[0.06] bg-white/[0.02] text-slate-300 hover:border-white/[0.12]"}`}>
                <span className="font-medium">{arc.label}</span>
                <span className="text-xs text-slate-600">{arc.range}</span>
              </button>
            ))}
          </div>
        </div>
        <button onClick={() => setStep(3)} className="w-full h-12 bg-[#f5a623] hover:bg-[#fbbf24] text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f5a623]/20">
          Next <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>,

    // Step 3: Goal
    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">🏆</div>
        <h2 className="font-display text-2xl font-black text-white mb-2">What Is Your Goal, Pirate?</h2>
        <p className="text-slate-500 text-sm">We'll customize your experience to match your ambition.</p>
      </div>
      <div className="space-y-2 mb-6">
        {GOALS.map(g => (
          <button key={g.id} onClick={() => setGoal(g.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${goal === g.id ? "border-[#f5a623]/50 bg-[#f5a623]/10" : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"}`}>
            <span className="text-2xl shrink-0">{g.emoji}</span>
            <div className="flex-1">
              <div className={`text-sm font-bold ${goal === g.id ? "text-[#f5a623]" : "text-slate-200"}`}>{g.title}</div>
              <div className="text-xs text-slate-500">{g.desc}</div>
            </div>
            {goal === g.id && <Check size={16} className="text-[#f5a623] shrink-0" />}
          </button>
        ))}
      </div>
      <button onClick={handleFinalSignup} disabled={loading || !goal}
        className="w-full h-12 bg-[#f5a623] hover:bg-[#fbbf24] disabled:opacity-50 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f5a623]/20">
        {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><span className="font-display tracking-wider">START MY VOYAGE</span> 🏴‍☠️</>}
      </button>
    </motion.div>,

    // Step 4: All Set!
    <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
      <div className="text-7xl mb-6 animate-bounce">🏴‍☠️</div>
      <h2 className="font-display text-3xl font-black text-white mb-3">Welcome to the Crew, {username || "Nakama"}!</h2>
      <p className="text-slate-400 mb-2">Your pirate legend begins now.</p>
      <p className="text-slate-600 text-sm mb-8">Check your email to verify your account, then begin your voyage.</p>
      <div className="bg-[#0a0f1a] border border-white/[0.06] rounded-2xl p-4 mb-6 text-left space-y-2">
        {[
          { label: "Pirate Name", value: username },
          { label: "Starting Episode", value: `Episode ${currentEp}` },
          { label: "Goal", value: GOALS.find(g => g.id === goal)?.title || "" },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <span className="text-slate-500">{item.label}</span>
            <span className="text-slate-200 font-medium">{item.value}</span>
          </div>
        ))}
      </div>
      <a href="/dashboard" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#f5a623] hover:bg-[#fbbf24] text-black font-bold rounded-xl transition-all shadow-lg shadow-[#f5a623]/20">
        <span className="font-display tracking-wider">BEGIN VOYAGE</span> <ArrowRight size={16} />
      </a>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen bg-[#060B14] flex items-center justify-center px-4 py-12">
      {/* Stars */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/20" style={{ width: Math.random()*2+1, height: Math.random()*2+1, left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, opacity: Math.random()*0.4+0.1 }} />
        ))}
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#f5a623] to-[#d97706] flex items-center justify-center text-xl">☠️</div>
            <span className="font-display font-black text-base tracking-widest text-[#f5a623]">GRAND LINE</span>
          </Link>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">Step {step + 1} of {STEPS.length - 1}</span>
              <span className="text-xs text-[#f5a623] font-medium">{STEPS[step].label}</span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-[#d97706] to-[#f5a623]"
                animate={{ width: `${progressPct}%` }} transition={{ duration: 0.4 }} />
            </div>
            <div className="flex justify-between mt-2">
              {STEPS.slice(0, -1).map((s, i) => (
                <div key={s.id} className={`text-[10px] ${i <= step ? "text-[#f5a623]" : "text-slate-700"}`}>{s.label}</div>
              ))}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-[#0a0f1a] border border-white/[0.08] rounded-3xl p-8 shadow-2xl">
          {step > 0 && step < 4 && (
            <button onClick={() => setStep(step - 1)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mb-6 transition-colors">
              <ChevronLeft size={14} /> Back
            </button>
          )}
          <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>
        </div>

        {step === 0 && (
          <p className="text-center text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#f5a623] hover:text-[#fbbf24] font-semibold transition-colors">Log In</Link>
          </p>
        )}
      </div>
    </div>
  );
}
