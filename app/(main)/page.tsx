import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Dashboard } from "@/components/dashboard/dashboard";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [
    { data: profile },
    { data: recentActivity },
    { data: watchProgress },
    { data: crew },
    { data: challenges },
    { data: nextEpisode },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("activity_feed").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("watch_progress").select("episode_id").eq("user_id", user.id),
    supabase.from("crews").select("*, crew_members(count)").eq("id", supabase.from("profiles").select("crew_id").eq("id", user.id).single() as unknown as string).maybeSingle(),
    supabase.from("challenges").select("*").eq("is_active", true).limit(3),
    supabase.from("episodes").select("id, episode_number, title, arc_name, bounty_reward").not("id", "in", `(${(await supabase.from("watch_progress").select("episode_id").eq("user_id", user.id)).data?.map(w => w.episode_id).join(",") || "0"})`).order("episode_number").limit(1).single(),
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
