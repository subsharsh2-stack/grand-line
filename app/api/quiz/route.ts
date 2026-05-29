import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { episodeId, quizAnswer } = await req.json();

  if (!episodeId) {
    return NextResponse.json({ error: "Episode ID required" }, { status: 400 });
  }

  // Call the Supabase function to mark watched + handle rewards
  const { data, error } = await supabase.rpc("mark_episode_watched", {
    p_episode_id: episodeId,
    p_quiz_passed: quizAnswer !== undefined && quizAnswer !== null,
    p_quiz_answer: quizAnswer ?? null,
  });

  if (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Check if any devil fruits were earned after this episode
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_episodes_watched, bounty")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    success: true,
    bountyEarned: data.bounty_earned,
    streakBonus: data.streak_bonus,
    newStreak: data.new_streak,
    quizPassed: data.quiz_passed,
    totalEpisodes: profile?.total_episodes_watched,
    totalBounty: profile?.bounty,
  });
}
