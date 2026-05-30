import { createClient } from "@/lib/supabase/server";
import { MarketplacePage } from "@/components/marketplace/marketplace-page";

export const metadata = { title: "Sabaody Market — Merch & Fan Art" };

export default async function Marketplace() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const [
    { data: merch },
    { data: fanArt },
    { data: currentEpisode },
  ] = await Promise.all([
    supabase
      .from("merch_deals")
      .select("*")
      .eq("is_active", true)
      .or(`ends_at.is.null,ends_at.gt.${new Date().toISOString()}`)
      .order("created_at", { ascending: false }),
    supabase
      .from("fan_art_listings")
      .select("*, profiles(username, display_name, avatar_url)")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(20),
    userId
      ? supabase
          .from("watch_progress")
          .select("episode_id, episodes(episode_number, arc_id, arcs(name))")
          .eq("user_id", userId)
          .order("watched_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const currentArcId = (currentEpisode as unknown as { episodes?: { arc_id?: number } } | null)?.episodes?.arc_id;
  const episodeDeals = merch?.filter((m: any) => m.arc_id === currentArcId || m.episode_id !== null) || [];
  const sitewideDeals = merch?.filter((m: any) => !m.episode_id && !m.arc_id) || [];

  return (
    <MarketplacePage
      episodeDeals={episodeDeals}
      sitewideDeals={sitewideDeals}
      fanArt={fanArt || []}
      currentArcName={(currentEpisode as unknown as { episodes?: { arcs?: { name: string } } } | null)?.episodes?.arcs?.name}
    />
  );
}
