"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const MERCH_PARTNERS = [
  { name: "Crunchyroll Store", emoji: "🎬", type: "Official Merch", deal: "Ep-specific deals, 8% affiliate" },
  { name: "AmiAmi", emoji: "🎎", type: "Figures & Collectibles", deal: "Arc figure deals, 10% affiliate" },
  { name: "Hot Topic", emoji: "🖤", type: "Apparel", deal: "Character-themed drops" },
  { name: "Hypland", emoji: "👕", type: "Streetwear", deal: "Limited collab drops" },
  { name: "Right Stuf Anime", emoji: "📦", type: "Manga & More", deal: "Arc completion discounts" },
  { name: "Fan Art Creators", emoji: "🎨", type: "Original Art", deal: "Platform takes 10%" },
];

const EPISODE_DEALS = [
  {
    episode: "Episode 483",
    arc: "Marineford",
    product: "Whitebeard 1/8 Scale Figure",
    discount: "20% OFF",
    description: "Watching the most powerful man fall? Own this legendary figure.",
    emoji: "🗿",
    color: "#f5a623",
  },
  {
    episode: "Episode 1071",
    arc: "Wano",
    product: "Gear 5 Luffy Funko Pop",
    discount: "15% OFF",
    description: "First time seeing Gear 5? Mark the moment. Get the figure.",
    emoji: "☀️",
    color: "#fcd34d",
  },
  {
    episode: "Episode 311",
    arc: "Enies Lobby",
    product: "Going Merry Ship Model",
    discount: "25% OFF",
    description: "After watching this farewell, you deserve this model kit.",
    emoji: "⛵",
    color: "#60a5fa",
  },
];

export function LandingMonetization() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-6 relative overflow-hidden" ref={ref}>
      {/* Episode Figure Deals */}
      <div className="max-w-6xl mx-auto mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5 text-xs text-gold-400 font-semibold tracking-widest uppercase mb-4">
            💰 Episode Drops
          </div>
          <h2 className="font-display text-4xl font-black text-white mb-4">
            Watch an Episode, <span className="text-gold-400">Get a Deal</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Certain episodes trigger exclusive merch deals. When Whitebeard falls — get his figure at 20% off.
            The moment becomes permanent.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4">
          {EPISODE_DEALS.map((deal, i) => (
            <motion.div
              key={deal.episode}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="relative group rounded-2xl border overflow-hidden"
              style={{ borderColor: `${deal.color}30`, background: `${deal.color}05` }}
            >
              {/* Discount badge */}
              <div
                className="absolute top-3 right-3 text-xs font-black px-3 py-1 rounded-full"
                style={{ background: deal.color, color: "#080c14" }}
              >
                {deal.discount}
              </div>

              <div className="p-6">
                <div className="text-5xl mb-4 transition-transform group-hover:scale-110">{deal.emoji}</div>
                <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: deal.color }}>
                  {deal.episode} · {deal.arc} Arc
                </div>
                <h3 className="text-base font-bold text-white mb-2">{deal.product}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{deal.description}</p>
                <div className="mt-4 text-xs text-slate-600 italic">
                  ✓ Unlocks automatically when you watch this episode
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Merch Partners */}
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl font-black text-white mb-4">
            The <span className="text-gold-400">Sabaody Market</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Affiliate partners, fan art marketplace, and sponsored arc challenges — all woven into your viewing experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MERCH_PARTNERS.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] bg-void-900/40 hover:border-gold-500/20 transition-all group"
            >
              <div className="text-3xl">{partner.emoji}</div>
              <div>
                <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                  {partner.name}
                </div>
                <div className="text-xs text-slate-600 mb-1">{partner.type}</div>
                <div className="text-xs text-gold-500/80">{partner.deal}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-10 p-6 rounded-2xl border border-gold-500/10 bg-gold-500/[0.03] text-center"
        >
          <div className="font-display text-xl font-bold text-gold-400 mb-2">
            💸 Revenue Model
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <div className="font-bold text-white mb-1">Affiliate Sales</div>
              <div className="text-slate-500">5–15% per merch sale driven from episode deals</div>
            </div>
            <div>
              <div className="font-bold text-white mb-1">Fan Art Platform</div>
              <div className="text-slate-500">10% platform fee on every fan art sale via Stripe</div>
            </div>
            <div>
              <div className="font-bold text-white mb-1">Sponsored Arcs</div>
              <div className="text-slate-500">Brands pay to sponsor arc challenges with native placement</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
