import { createClient } from "@/lib/supabase/server";
import { LeaderboardPage } from "@/components/leaderboard/leaderboard-page";
import { redirect } from "next/navigation";

export const metadata = { title: "World Bounty Leaderboard" };

export default async function Leaderboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/leaderboard");

  const [
    { data: globalTop },
    { data: myProfile },
    { data: weeklyTop },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, username, display_name, bounty, rank, watch_streak, total_episodes_watched, avatar_url, crew_id")
      .order("bounty", { ascending: false })
      .limit(50),
    supabase
      .from("profiles")
      .select("id, username, bounty, rank")
      .eq("id", user.id)
      .single(),
    // Weekly: most bounty earned in last 7 days
    supabase
      .from("bounty_transactions")
      .select("user_id, amount, profiles(username, display_name, avatar_url, rank)")
      .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .gt("amount", 0)
      .order("amount", { ascending: false })
      .limit(100),
  ]);

  // Aggregate weekly data
  const weeklyMap: Record<string, { user_id: string; total: number; username: string; display_name: string | null; rank: string; avatar_url: string | null }> = {};
  weeklyTop?.forEach((tx) => {
    const profile = tx.profiles as { username: string; display_name: string | null; rank: string; avatar_url: string | null } | null;
    if (!tx.user_id || !profile) return;
    if (!weeklyMap[tx.user_id]) {
      weeklyMap[tx.user_id] = { user_id: tx.user_id, total: 0, username: profile.username, display_name: profile.display_name, rank: profile.rank, avatar_url: profile.avatar_url };
    }
    weeklyMap[tx.user_id].total += tx.amount;
  });
  const weeklyLeaders = Object.values(weeklyMap).sort((a, b) => b.total - a.total).slice(0, 20);

  // Find user's global rank
  const myRankPosition = (globalTop || []).findIndex((p) => p.id === user.id) + 1;

  return (
    <LeaderboardPage
      globalTop={globalTop || []}
      weeklyTop={weeklyLeaders}
      myProfile={myProfile}
      myRankPosition={myRankPosition}
    />
  );
}
