import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // Fetch watched episodes first for the NOT IN query
  const { data: watchedEpisodeIds } = await supabase.from("watch_progress").select("episode_id").eq("user_id", user.id);
  const watchedIds = watchedEpisodeIds?.map((w: any) => w.episode_id).join(",") || "0";

  // Get user's crew_id first
  const { data: profileForCrew } = await supabase.from("profiles").select("crew_id").eq("id", user.id).single();
  const crewQuery = profileForCrew?.crew_id
    ? supabase.from("crews").select("*, crew_members(count)").eq("id", profileForCrew.crew_id).maybeSingle()
    : Promise.resolve({ data: null });

  const [
    { data: profile },
    { data: recentActivity },
    { data: watchProgress },
    crewResult,
    { data: challenges },
    { data: nextEpisode },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("activity_feed").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("watch_progress").select("episode_id").eq("user_id", user.id),
    crewQuery as any,
    supabase.from("challenges").select("*").eq("is_active", true).limit(3),
    supabase.from("episodes").select("id, episode_number, title, arc_name, bounty_reward").not("id", "in", `(${watchedIds})`).order("episode_number").limit(1).single(),
  ]);
  const crew = crewResult?.data;

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
