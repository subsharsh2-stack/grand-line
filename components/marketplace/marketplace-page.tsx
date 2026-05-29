"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, ShoppingBag, Palette, Gift, Tag, Star } from "lucide-react";

interface MerchDeal {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  product_url: string;
  affiliate_partner: string | null;
  discount_pct: number | null;
  original_price_usd: number | null;
  sale_price_usd: number | null;
  episode_id: number | null;
  arc_id: number | null;
}

interface FanArtListing {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  price_cents: number;
  arc_tags: string[] | null;
  character_tags: string[] | null;
  sales_count: number;
  profiles?: {
    username: string;
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface Props {
  episodeDeals: MerchDeal[];
  sitewideDeals: MerchDeal[];
  fanArt: FanArtListing[];
  currentArcName?: string;
}

const PARTNER_INFO: Record<string, { name: string; emoji: string; color: string }> = {
  crunchyroll:  { name: "Crunchyroll",     emoji: "🎬", color: "#f97316" },
  amiami:       { name: "AmiAmi",          emoji: "🎎", color: "#ec4899" },
  hot_topic:    { name: "Hot Topic",       emoji: "🖤", color: "#a78bfa" },
  hypland:      { name: "Hypland",         emoji: "👕", color: "#60a5fa" },
  right_stuf:   { name: "Right Stuf",      emoji: "📦", color: "#34d399" },
};

export function MarketplacePage({ episodeDeals, sitewideDeals, fanArt, currentArcName }: Props) {
  const [tab, setTab] = useState<"merch" | "fanart">("merch");

  async function handleDealClick(dealId: string, url: string) {
    // Track click via API
    await fetch("/api/marketplace/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealId }),
    });
    window.open(url, "_blank");
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs text-gold-400 font-semibold tracking-widest uppercase mb-2">🫧 Sabaody Archipelago</div>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-black text-white mb-1">Market</h1>
            <p className="text-slate-500 text-sm">Merch, figures, and fan creations</p>
          </div>
          <Link
            href="/marketplace/fanart/new"
            className="flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 text-gold-400 px-4 py-2 rounded-xl text-sm font-medium transition-all"
          >
            <Palette size={14} />
            Sell Fan Art
          </Link>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border border-white/[0.08] rounded-xl overflow-hidden mb-8 w-fit">
        <button
          onClick={() => setTab("merch")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all ${tab === "merch" ? "bg-gold-500/20 text-gold-400" : "text-slate-500 hover:text-slate-300"}`}
        >
          <ShoppingBag size={14} /> Merch Deals
        </button>
        <button
          onClick={() => setTab("fanart")}
          className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all ${tab === "fanart" ? "bg-gold-500/20 text-gold-400" : "text-slate-500 hover:text-slate-300"}`}
        >
          <Palette size={14} /> Fan Art
          <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{fanArt.length}</span>
        </button>
      </div>

      {tab === "merch" && (
        <div className="space-y-10">
          {/* Episode-specific deals */}
          {episodeDeals.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Gift size={16} className="text-gold-400" />
                <h2 className="font-bold text-white">
                  Deals for what you&apos;re watching
                  {currentArcName && <span className="text-gold-400 ml-1">({currentArcName} Arc)</span>}
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {episodeDeals.map((deal, i) => (
                  <MerchCard key={deal.id} deal={deal} index={i} onBuy={handleDealClick} highlight />
                ))}
              </div>
            </section>
          )}

          {/* All deals */}
          <section>
            <h2 className="font-bold text-white mb-4">All Deals</h2>
            {sitewideDeals.length === 0 && episodeDeals.length === 0 ? (
              <div className="text-center py-16 text-slate-600">
                <ShoppingBag size={32} className="mx-auto mb-3 opacity-50" />
                <div>No active deals right now. Check back soon!</div>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sitewideDeals.map((deal, i) => (
                  <MerchCard key={deal.id} deal={deal} index={i} onBuy={handleDealClick} />
                ))}
              </div>
            )}
          </section>

          {/* Partner logos */}
          <section className="border-t border-white/[0.06] pt-8">
            <div className="text-xs text-slate-500 text-center mb-4">Official Affiliate Partners</div>
            <div className="flex justify-center gap-4 flex-wrap">
              {Object.values(PARTNER_INFO).map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/[0.06] text-xs text-slate-400"
                >
                  <span>{partner.emoji}</span>
                  <span>{partner.name}</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-700 text-center mt-3">
              Grand Line earns a commission from affiliate sales. Prices are not impacted.
            </p>
          </section>
        </div>
      )}

      {tab === "fanart" && (
        <div>
          {fanArt.length === 0 ? (
            <div className="text-center py-20 text-slate-600">
              <Palette size={32} className="mx-auto mb-3 opacity-50" />
              <div className="mb-4">No fan art listed yet. Be the first creator!</div>
              <Link
                href="/marketplace/fanart/new"
                className="inline-flex items-center gap-2 bg-gold-500 text-void-950 font-bold px-6 py-3 rounded-xl text-sm transition-all shadow-gold-glow"
              >
                <Palette size={14} />
                List Your Art
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fanArt.map((art, i) => (
                <FanArtCard key={art.id} art={art} index={i} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MerchCard({ deal, index, onBuy, highlight }: {
  deal: MerchDeal;
  index: number;
  onBuy: (id: string, url: string) => void;
  highlight?: boolean;
}) {
  const partner = deal.affiliate_partner ? PARTNER_INFO[deal.affiliate_partner] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group rounded-2xl border overflow-hidden transition-all hover:-translate-y-1 ${
        highlight
          ? "border-gold-500/30 bg-gold-500/[0.04]"
          : "border-white/[0.06] bg-void-900/40"
      }`}
    >
      {/* Image */}
      <div className="aspect-square bg-void-800 relative flex items-center justify-center overflow-hidden">
        {deal.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deal.image_url} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          <div className="text-5xl">{partner?.emoji || "🛍️"}</div>
        )}
        {deal.discount_pct && (
          <div className="absolute top-2 right-2 bg-gold-500 text-void-950 text-xs font-black px-2 py-0.5 rounded-full">
            -{deal.discount_pct}%
          </div>
        )}
        {highlight && (
          <div className="absolute top-2 left-2 bg-blue-500/20 border border-blue-500/40 text-blue-300 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Gift size={8} /> Arc Deal
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {partner && (
          <div className="text-[10px] font-bold mb-1" style={{ color: partner.color }}>
            {partner.emoji} {partner.name}
          </div>
        )}
        <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{deal.title}</h3>
        {deal.description && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-2">{deal.description}</p>
        )}
        <div className="flex items-center justify-between mb-3">
          {deal.sale_price_usd ? (
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-gold-400">${deal.sale_price_usd}</span>
                {deal.original_price_usd && (
                  <span className="text-xs text-slate-600 line-through">${deal.original_price_usd}</span>
                )}
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-500">View on store</span>
          )}
          <Tag size={12} className="text-slate-600" />
        </div>
        <button
          onClick={() => onBuy(deal.id, deal.product_url)}
          className="w-full flex items-center justify-center gap-1.5 bg-void-800 hover:bg-gold-500/20 border border-white/[0.08] hover:border-gold-500/30 text-slate-300 hover:text-gold-400 py-2.5 rounded-xl text-xs font-medium transition-all"
        >
          Shop Now <ExternalLink size={10} />
        </button>
      </div>
    </motion.div>
  );
}

function FanArtCard({ art, index }: { art: FanArtListing; index: number }) {
  const priceFormatted = `$${(art.price_cents / 100).toFixed(2)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-2xl border border-white/[0.06] bg-void-900/40 overflow-hidden hover:border-white/[0.15] transition-all hover:-translate-y-1"
    >
      <div className="aspect-square bg-void-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={art.image_url}
          alt={art.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="p-3">
        <h3 className="text-sm font-bold text-white line-clamp-1 mb-1">{art.title}</h3>
        {art.profiles && (
          <div className="text-xs text-slate-500 mb-2">
            by @{art.profiles.username}
          </div>
        )}
        {art.arc_tags && art.arc_tags.length > 0 && (
          <div className="flex gap-1 mb-2 flex-wrap">
            {art.arc_tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[9px] bg-void-700 text-slate-400 px-1.5 py-0.5 rounded">{tag}</span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-black text-gold-400 text-sm">{priceFormatted}</span>
          {art.sales_count > 0 && (
            <span className="text-[10px] text-slate-600">{art.sales_count} sold</span>
          )}
        </div>
        <button className="w-full mt-2 bg-gold-500 hover:bg-gold-400 text-void-950 font-bold py-2 rounded-lg text-xs transition-all">
          Buy Now
        </button>
      </div>
    </motion.div>
  );
}
