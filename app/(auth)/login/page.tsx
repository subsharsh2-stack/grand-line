"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); setLoading(false); }
    else { window.location.href = redirect; }
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirect}` } });
  }

  async function handleDiscord() {
    await supabase.auth.signInWithOAuth({ provider: "discord", options: { redirectTo: `${window.location.origin}/api/auth/callback?redirect=${redirect}` } });
  }

  return (
    <div className="min-h-screen bg-[#060B14] flex">
      {/* Left: decorative ocean panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center" style={{ background: "linear-gradient(135deg, #060B14 0%, #0a1628 50%, #081427 100%)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 40% 60%, rgba(14,116,144,0.2) 0%, transparent 60%)" }} />
        {[...Array(20)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white/20" style={{ width: Math.random()*2+1, height: Math.random()*2+1, left: `${Math.random()*100}%`, top: `${Math.random()*100}%`, opacity: Math.random()*0.5+0.1 }} />
        ))}
        <div className="relative text-center px-12">
          <div className="text-8xl mb-6 animate-bounce" style={{ animationDuration: "3s" }}>🏴‍☠️</div>
          <h2 className="font-display text-4xl font-black text-white mb-4 tracking-wide">THE GRAND LINE<br />AWAITS YOU</h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mx-auto">Your voyage, your legend. Track every episode, earn bounties, and become a pirate king.</p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[{ v: "589K+", l: "Active Pirates" }, { v: "4.28B+", l: "Berries Earned" }, { v: "912K+", l: "Episodes Logged" }, { v: "23K+", l: "Crews Formed" }].map(s => (
              <div key={s.l} className="bg-white/[0.04] border border-white/[0.06] rounded-2xl p-3 text-center">
                <div className="font-display text-lg font-black text-[#f5a623]">{s.v}</div>
                <div className="text-xs text-slate-600">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#f5a623] to-[#d97706] flex items-center justify-center text-2xl shadow-lg">☠️</div>
              <div className="text-left">
                <div className="font-display font-black text-lg tracking-widest text-[#f5a623]">GRAND LINE</div>
                <div className="text-[11px] text-slate-600 tracking-widest uppercase">Your Voyage. Your Legend.</div>
              </div>
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">Welcome back, Nakama!</h1>
          <p className="text-slate-500 text-sm mb-8">Sign in to continue your voyage across the Grand Line.</p>

          {/* OAuth */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button onClick={handleGoogle} className="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:border-white/[0.2] text-sm font-medium transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button onClick={handleDiscord} className="flex items-center justify-center gap-2 h-11 rounded-xl border border-white/[0.1] bg-white/[0.03] text-slate-300 hover:bg-white/[0.06] hover:border-white/[0.2] text-sm font-medium transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.01.052.037.1.079.131 2.052 1.508 4.04 2.423 5.993 3.029a.078.078 0 0 0 .084-.026c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028c1.961-.607 3.95-1.522 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
              Discord
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-slate-600">or continue with email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="nakama@example.com"
                  className="w-full h-11 pl-10 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 placeholder:text-slate-700 text-sm focus:outline-none focus:border-[#f5a623]/50 focus:bg-white/[0.06] transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-200 placeholder:text-slate-700 text-sm focus:outline-none focus:border-[#f5a623]/50 focus:bg-white/[0.06] transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-xs text-[#f5a623]/70 hover:text-[#f5a623] transition-colors">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 bg-[#f5a623] hover:bg-[#fbbf24] disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#f5a623]/20">
              {loading ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <><span>Set Sail</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#f5a623] hover:text-[#fbbf24] font-semibold transition-colors">Join the Crew</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#060B14] flex items-center justify-center"><div className="text-5xl animate-bounce">🏴‍☠️</div></div>}><LoginForm /></Suspense>;
}
