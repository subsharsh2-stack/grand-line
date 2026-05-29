import Link from "next/link";
import { LandingHero } from "@/components/landing/hero";
import { LandingFeatures } from "@/components/landing/features";
import { LandingArcs } from "@/components/landing/arcs";
import { LandingMonetization } from "@/components/landing/monetization";
import { LandingCTA } from "@/components/landing/cta";
import { Navbar } from "@/components/nav/navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080c14]">
      <Navbar profile={null} />
      <LandingHero />
      <LandingFeatures />
      <LandingArcs />
      <LandingMonetization />
      <LandingCTA />
      <footer className="border-t border-white/[0.06] py-12 px-6 text-center">
        <div className="font-display text-gold-400 text-lg font-bold tracking-widest mb-2">GRAND LINE</div>
        <p className="text-slate-600 text-sm mb-4">The World for One Piece Fans</p>
        <div className="flex justify-center gap-6 text-xs text-slate-600">
          <Link href="/about" className="hover:text-slate-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-slate-400 transition-colors">Contact</Link>
        </div>
        <p className="text-slate-700 text-xs mt-6">
          Grand Line is a fan project. One Piece is owned by Eiichiro Oda / Shueisha / Toei Animation.
        </p>
      </footer>
    </div>
  );
}
