import { createClient } from "@/lib/supabase/server";
import { ChallengesPage } from "@/components/challenges/challenges-page";

export const metadata = { title: "Challenges" };

export default async function Challenges() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const [{ data: challenges }, { data: userChallenges }, { data: profile }] = await Promise.all([
    supabase.from("challenges").select("*, arcs(name)").eq("is_active", true).order("bounty_reward", { ascending: false }),
    userId
      ? supabase.from("user_challenges").select("*").eq("user_id", userId)
      : Promise.resolve({ data: [] }),
    userId
      ? supabase.from("profiles").select("total_episodes_watched, watch_streak, total_arcs_completed").eq("id", userId).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const userChallengeMap = Object.fromEntries(
    (userChallenges || []).map((uc: any) => [uc.challenge_id, uc])
  );

  return (
    <ChallengesPage
      challenges={challenges || []}
      userChallengeMap={userChallengeMap}
      profile={profile || { total_episodes_watched: 0, watch_streak: 0, total_arcs_completed: 0 }}
    />
  );
}
