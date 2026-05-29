import { createClient } from "@/lib/supabase/server";
import { getPersonalizedRecommendation, getDailyMotivation, getNextArcRecommendation } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = req.nextUrl.searchParams.get("type") || "recommendation";

  const [{ data: profile }, { data: lastWatch }, { data: completedArcs }] = await Promise.all([
    supabase
      .from("profiles")
      .select("username, total_episodes_watched, watch_streak, rank, last_watched_at")
      .eq("id", user.id)
      .single(),
    supabase
      .from("watch_progress")
      .select("episode_id, episodes(episode_number, arc_name)")
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("arc_progress")
      .select("arcs(name, slug)")
      .eq("user_id", user.id)
      .eq("status", "completed"),
  ]);

  if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 17 ? "afternoon" : hour < 21 ? "evening" : "night";
  const lastWatchedEp = (lastWatch?.episodes as { episode_number?: number } | null)?.episode_number || null;
  const lastArc = (lastWatch?.episodes as { arc_name?: string } | null)?.arc_name || null;
  const daysSinceLastWatch = profile.last_watched_at
    ? Math.floor((Date.now() - new Date(profile.last_watched_at).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  if (type === "motivation") {
    const message = await getDailyMotivation({
      username: profile.username,
      rank: profile.rank,
      streak: profile.watch_streak,
      totalEpisodes: profile.total_episodes_watched,
      lastArc,
      daysSinceLastWatch,
    });
    return NextResponse.json({ message });
  }

  if (type === "arc") {
    const completed = (completedArcs || [])
      .map((ap) => (ap.arcs as { name?: string } | null)?.name || "")
      .filter(Boolean);
    const rec = await getNextArcRecommendation({
      completedArcs: completed,
      currentArc: lastArc,
      totalEpisodes: profile.total_episodes_watched,
      preferredStyle: null,
    });
    return NextResponse.json(rec);
  }

  // Default: personalized recommendation
  const recommendation = await getPersonalizedRecommendation({
    username: profile.username,
    totalEpisodes: profile.total_episodes_watched,
    lastWatchedEpisode: lastWatchedEp,
    lastArc,
    watchStreak: profile.watch_streak,
    rank: profile.rank,
    timeOfDay,
  });

  return NextResponse.json(recommendation);
}
