"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const STEPS = ["Create Account", "Choose Username", "Pick Your Role"];

const PIRATE_ROLES = [
  { id: "new_viewer",  emoji: "🌱", title: "Brand New",    desc: "Never seen One Piece. Ready to start." },
  { id: "mid_way",     emoji: "⚔️", title: "Mid Journey",  desc: "Already watching, logging my progress." },
  { id: "veteran",     emoji: "🔥", title: "Veteran",      desc: "Seen most/all of it. Here for the community." },
  { id: "lapsed",      emoji: "💤", title: "Lapsed Fan",   desc: "Dropped it. Need motivation to continue." },
];

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleStep0(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setStep(1);
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (username.length < 3) { toast.error("Username must be at least 3 characters"); return; }
    if (!/^[a-z0-9_]+$/.test(username)) { toast.error("Username can only contain letters, numbers, underscores"); return; }
    setStep(2);
  }

  async function handleFinalSignup() {
    if (!role) { toast.error("Choose your role to continue"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName || username, role },
      },
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome aboard, Nakama! 🏴‍☠️ Your voyage begins!");
      router.push("/arcs");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#080c14] starfield flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-2xl shadow-gold-glow">
              🏴‍☠️
            </div>
            <span className="font-display font-black text-2xl tracking-wider text-gold-400">
              GRAND LINE
            </span>
          </Link>
          <p className="text-slate-500 text-sm mt-2">Your voyage starts here</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < step ? "bg-gold-500 text-void-950" :
                i === step ? "bg-gold-500/20 border border-gold-500 text-gold-400" :
                "bg-void-800 text-slate-600"
              }`}>
                {i < step ? <CheckCircle size={12} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px ${i < step ? "bg-gold-500" : "bg-void-700"} transition-all`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-void-900/80 border border-white/[0.08] rounded-2xl p-8 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {/* Step 0: Email & Password */}
            {step === 0 && (
              <motion.form
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleStep0}
                className="space-y-4"
              >
                <h2 className="text-lg font-bold text-white mb-4">Create your account</h2>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-void-800/50 border border-white/[0.08] rounded-xl pl-9 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-all"
                      placeholder="pirate@grandline.gg" required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-void-800/50 border border-white/[0.08] rounded-xl pl-9 pr-10 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-all"
                      placeholder="8+ characters" required minLength={8}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <button type="submit" className="w-full bg-gold-500 hover:bg-gold-400 text-void-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-gold-glow mt-2">
                  Continue →
                </button>
              </motion.form>
            )}

            {/* Step 1: Username */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleStep1}
                className="space-y-4"
              >
                <h2 className="text-lg font-bold text-white mb-4">Choose your pirate name</h2>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Username (permanent)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">@</span>
                    <input
                      type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())}
                      className="w-full bg-void-800/50 border border-white/[0.08] rounded-xl pl-7 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-all"
                      placeholder="monkey_d_luffy" required minLength={3} maxLength={20}
                    />
                  </div>
                  <p className="text-xs text-slate-600 mt-1">lowercase letters, numbers, underscores only</p>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1.5 font-medium">Display Name (optional)</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-void-800/50 border border-white/[0.08] rounded-xl pl-9 pr-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-gold-500/50 transition-all"
                      placeholder="Monkey D. Luffy" maxLength={40}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setStep(0)} className="flex-1 border border-white/[0.08] text-slate-400 hover:text-white py-3.5 rounded-xl text-sm transition-all">
                    ← Back
                  </button>
                  <button type="submit" className="flex-1 bg-gold-500 hover:bg-gold-400 text-void-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-gold-glow">
                    Continue →
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 2: Role Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-lg font-bold text-white mb-1">Where are you on your journey?</h2>
                <p className="text-xs text-slate-500 mb-5">This helps us tailor your experience</p>
                <div className="space-y-2 mb-5">
                  {PIRATE_ROLES.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                        role === r.id
                          ? "border-gold-500/60 bg-gold-500/10 text-white"
                          : "border-white/[0.06] text-slate-400 hover:border-white/[0.12] hover:text-slate-200"
                      }`}
                    >
                      <span className="text-xl">{r.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold">{r.title}</div>
                        <div className="text-xs text-slate-500">{r.desc}</div>
                      </div>
                      {role === r.id && <CheckCircle size={14} className="ml-auto text-gold-400 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="flex-1 border border-white/[0.08] text-slate-400 hover:text-white py-3.5 rounded-xl text-sm transition-all">
                    ← Back
                  </button>
                  <button
                    onClick={handleFinalSignup}
                    disabled={!role || loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-void-950 font-bold py-3.5 rounded-xl text-sm transition-all shadow-gold-glow"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-void-950/30 border-t-void-950 rounded-full animate-spin" />
                    ) : (
                      <><Anchor size={14} /> Begin Voyage</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gold-400 hover:text-gold-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
