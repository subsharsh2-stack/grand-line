import { createClient } from "@/lib/supabase/server";
import { GrandLineMap } from "@/components/arcs/grand-line-map";
import { ArcList } from "@/components/arcs/arc-list";

export const metadata = { title: "Grand Line Map" };

export default async function ArcsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id || null;

  const [{ data: arcs }, { data: arcProgress }] = await Promise.all([
    supabase.from("arcs").select("*").order("order_index"),
    userId
      ? supabase.from("arc_progress").select("*").eq("user_id", userId)
      : Promise.resolve({ data: [] }),
  ]);

  // Build a progress map
  const progressMap: Record<number, { status: string; episodes_watched: number }> = {};
  (arcProgress || []).forEach((ap: any) => {
    progressMap[ap.arc_id] = { status: ap.status, episodes_watched: ap.episodes_watched };
  });

  const arcsWithProgress = (arcs || []).map((arc: any) => ({
    ...arc,
    userStatus: progressMap[arc.id]?.status || "not_started",
    episodesWatched: progressMap[arc.id]?.episodes_watched || 0,
  }));

  const totalEpsWatched = Object.values(progressMap).reduce((sum, p) => sum + p.episodes_watched, 0);
  const arcsCompleted = Object.values(progressMap).filter(p => p.status === "completed").length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-b from-ocean-950/30 to-transparent">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-xs text-ocean-400 font-semibold tracking-widest uppercase mb-2">🗺️ Log Pose Navigation</div>
              <h1 className="font-display text-4xl font-black text-white mb-2">Grand Line Map</h1>
              <p className="text-slate-400 text-base">Your voyage across 32+ arcs. Each arc is an island.</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="font-display text-3xl font-black text-gold-400">{totalEpsWatched}</div>
                <div className="text-xs text-slate-500">Episodes</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-black text-green-400">{arcsCompleted}</div>
                <div className="text-xs text-slate-500">Arcs Complete</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl font-black text-slate-400">{(arcs || []).length - arcsCompleted}</div>
                <div className="text-xs text-slate-500">Remaining</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map visualization */}
      <GrandLineMap arcs={arcsWithProgress} />

      {/* Arc list */}
      <ArcList arcs={arcsWithProgress} />
    </div>
  );
}
