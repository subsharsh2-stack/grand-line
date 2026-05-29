import { createClient } from "@/lib/supabase/server";
import { getDenDenMushiResponse } from "@/lib/ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message, history } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  // Get user context
  const [{ data: profile }, { data: lastWatch }] = await Promise.all([
    supabase.from("profiles").select("username, total_episodes_watched").eq("id", user.id).single(),
    supabase
      .from("watch_progress")
      .select("episodes(arc_name)")
      .eq("user_id", user.id)
      .order("watched_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  const response = await getDenDenMushiResponse(
    message,
    history || [],
    {
      username: profile?.username || "Nakama",
      episodesWatched: profile?.total_episodes_watched || 0,
      lastArc: (lastWatch?.episodes as { arc_name?: string } | null)?.arc_name || null,
    }
  );

  return NextResponse.json({ response });
}
