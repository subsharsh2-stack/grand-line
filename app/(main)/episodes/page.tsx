import { createClient } from "@/lib/supabase/server";
import { EpisodeBrowser } from "@/components/episodes/episode-browser";
import { redirect } from "next/navigation";

export const metadata = { title: "Episodes — Log Pose" };

export default async function EpisodesPage({
  searchParams,
}: {
  searchParams: { arc?: string; search?: string; page?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/episodes");

  const page = parseInt(searchParams.page || "1");
  const pageSize = 48;
  const offset = (page - 1) * pageSize;

  let query = supabase
    .from("episodes")
    .select("*, arcs(name, saga)", { count: "exact" })
    .order("episode_number")
    .range(offset, offset + pageSize - 1);

  if (searchParams.arc) {
    const { data: arc } = await supabase.from("arcs").select("id").eq("slug", searchParams.arc).single();
    if (arc) query = query.eq("arc_id", arc.id);
  }

  if (searchParams.search) {
    query = query.ilike("title", `%${searchParams.search}%`);
  }

  const [{ data: episodes, count }, { data: arcs }, { data: watchedEps }] = await Promise.all([
    query,
    supabase.from("arcs").select("id, slug, name, saga").order("order_index"),
    supabase.from("watch_progress").select("episode_id, quiz_passed, bounty_earned").eq("user_id", user.id),
  ]);

  const watchedSet = new Set(watchedEps?.map((w) => w.episode_id) || []);
  const watchedMap = Object.fromEntries(
    (watchedEps || []).map((w) => [w.episode_id, { quiz_passed: w.quiz_passed, bounty_earned: w.bounty_earned }])
  );

  return (
    <EpisodeBrowser
      episodes={(episodes || []).map((ep) => ({
        ...ep,
        isWatched: watchedSet.has(ep.id),
        quizPassed: watchedMap[ep.id]?.quiz_passed || false,
      }))}
      arcs={arcs || []}
      totalCount={count || 0}
      currentPage={page}
      pageSize={pageSize}
      currentArc={searchParams.arc}
      currentSearch={searchParams.search}
    />
  );
}
