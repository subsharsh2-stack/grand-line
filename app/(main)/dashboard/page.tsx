"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Dashboard } from "@/components/dashboard/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dashboardProps, setDashboardProps] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      // Auto-create profile if missing
      let { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        const base = (user.email?.split("@")[0] || "pirate")
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "_");
        const username = `${base}_${Math.floor(Math.random() * 9000 + 1000)}`;
        const { data: created } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            username,
            display_name: user.user_metadata?.display_name || username,
            avatar_url: user.user_metadata?.avatar_url || null,
          })
          .select("*")
          .maybeSingle();
        profile = created;
      }

      const { data: watchedEpisodeIds } = await supabase
        .from("watch_progress")
        .select("episode_id")
        .eq("user_id", user.id);
      const watchedIds = watchedEpisodeIds?.map((w: any) => w.episode_id).join(",") || "0";

      const [
        { data: recentActivity },
        { data: watchProgress },
        { data: challenges },
        { data: nextEpisode },
      ] = await Promise.all([
        supabase.from("activity_feed").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("watch_progress").select("episode_id").eq("user_id", user.id),
        supabase.from("challenges").select("*").eq("is_active", true).limit(3),
        supabase.from("episodes").select("id, episode_number, title, arc_name, bounty_reward").not("id", "in", `(${watchedIds})`).order("episode_number").limit(1).maybeSingle(),
      ]);

      setDashboardProps({
        profile,
        recentActivity: recentActivity || [],
        totalWatched: watchProgress?.length || 0,
        nextEpisode: nextEpisode || null,
        challenges: challenges || [],
      });
      setLoading(false);
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🏴‍☠️</div>
          <div className="text-gold-400 font-bold text-sm tracking-widest uppercase">Charting the Grand Line…</div>
          <div className="mt-4 flex gap-1.5 justify-center">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-gold-500/50 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardProps) return null;

  return <Dashboard {...dashboardProps} />;
}
