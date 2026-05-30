import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Auto-create profile if it doesn't exist yet (handles users who signed up before trigger was fixed)
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    const baseUsername = (user.email?.split("@")[0] || "pirate")
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "_");
    const username = `${baseUsername}_${Math.floor(Math.random() * 9000 + 1000)}`;
    const { data: created } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        username,
        display_name: user.user_metadata?.display_name || username,
        avatar_url: user.user_metadata?.avatar_url || null,
      })
      .select("*")
      .single();
    profile = created;
  }

  if (!profile) {
    // If profile still can't be created, show a minimal error state
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400 text-sm">
        <div className="text-center">
          <div className="text-4xl mb-4">⚓</div>
          <p>Setting up your profile...</p>
          <p className="text-xs text-slate-600 mt-2">Try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Fetch watched episodes first for the NOT IN query
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
    supabase
      .from("activity_feed")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("watch_progress")
      .select("episode_id")
      .eq("user_id", user.id),
    supabase
      .from("challenges")
      .select("*")
      .eq("is_active", true)
      .limit(3),
    supabase
      .from("episodes")
      .select("id, episode_number, title, arc_name, bounty_reward")
      .not("id", "in", `(${watchedIds})`)
      .order("episode_number")
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <Dashboard
      profile={profile}
      recentActivity={recentActivity || []}
      totalWatched={watchProgress?.length || 0}
      nextEpisode={nextEpisode}
      challenges={challenges || []}
    />
  );
}
