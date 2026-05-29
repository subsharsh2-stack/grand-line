import { createClient } from "@/lib/supabase/server";
import { generateEpisodeQuiz } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

// POST /api/ai/quiz — Generate + save a quiz for an episode
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { episodeId } = await req.json();
  if (!episodeId) return NextResponse.json({ error: "episodeId required" }, { status: 400 });

  // Get episode details
  const { data: episode } = await supabase
    .from("episodes")
    .select("id, episode_number, title, synopsis, arc_name, quiz_question")
    .eq("id", episodeId)
    .single();

  if (!episode) return NextResponse.json({ error: "Episode not found" }, { status: 404 });

  // If quiz already exists, return it
  if (episode.quiz_question) {
    return NextResponse.json({ cached: true });
  }

  // Generate new quiz with AI
  const quiz = await generateEpisodeQuiz({
    episodeNumber: episode.episode_number,
    episodeTitle: episode.title,
    synopsis: episode.synopsis,
    arcName: episode.arc_name,
  });

  if (!quiz) return NextResponse.json({ error: "Quiz generation failed" }, { status: 500 });

  // Save to database
  await supabase.from("episodes").update({
    quiz_question: quiz.question,
    quiz_options: quiz.options,
    quiz_explanation: quiz.explanation,
  }).eq("id", episodeId);

  return NextResponse.json({ success: true, quiz });
}

// GET /api/ai/quiz/batch — Generate quizzes for all episodes missing them
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // Find episodes without quizzes (process in batches of 20)
  const { data: episodes } = await supabase
    .from("episodes")
    .select("id, episode_number, title, synopsis, arc_name")
    .is("quiz_question", null)
    .eq("is_filler", false)
    .eq("is_recap", false)
    .order("episode_number")
    .limit(20);

  if (!episodes?.length) return NextResponse.json({ message: "All episodes have quizzes" });

  let generated = 0;
  for (const ep of episodes) {
    const quiz = await generateEpisodeQuiz({
      episodeNumber: ep.episode_number,
      episodeTitle: ep.title,
      synopsis: ep.synopsis,
      arcName: ep.arc_name,
    });

    if (quiz) {
      await supabase.from("episodes").update({
        quiz_question: quiz.question,
        quiz_options: quiz.options,
        quiz_explanation: quiz.explanation,
      }).eq("id", ep.id);
      generated++;
    }

    // Small delay between AI calls
    await new Promise((r) => setTimeout(r, 300));
  }

  return NextResponse.json({ generated, remaining: episodes.length - generated });
}
