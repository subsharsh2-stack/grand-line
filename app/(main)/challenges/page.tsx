import { createClient } from "@/lib/supabase/server";
import { ChallengesPage } from "@/components/challenges/challenges-page";
import { redirect } from "next/navigation";

export const metadata = { title: "Challenges" };

export default async function Challenges() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/challenges");

  const [{ data: challenges }, { data: userChallenges }, { data: profile }] = await Promise.all([
    supabase.from("challenges").select("*, arcs(name)").eq("is_active", true).order("bounty_reward", { ascending: false }),
    supabase.from("user_challenges").select("*").eq("user_id", user.id),
    supabase.from("profiles").select("total_episodes_watched, watch_streak, total_arcs_completed").eq("id", user.id).single(),
  ]);

  const userChallengeMap = Object.fromEntries(
    (userChallenges || []).map((uc) => [uc.challenge_id, uc])
  );

  return (
    <ChallengesPage
      challenges={challenges || []}
      userChallengeMap={userChallengeMap}
      profile={profile || { total_episodes_watched: 0, watch_streak: 0, total_arcs_completed: 0 }}
    />
  );
}
