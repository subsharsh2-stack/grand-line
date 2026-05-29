// ============================================================
// GRAND LINE — Episode Sync API
// Fetches all episodes from Jikan (MAL) and upserts into Supabase
// Can be called:
//   POST /api/admin/sync-episodes          → full sync
//   POST /api/admin/sync-episodes?mode=new → only fetch new episodes
// Protected by CRON_SECRET header (set in env)
// ============================================================

import { createClient } from "@/lib/supabase/server";
import { fetchAllEpisodes, fetchSingleEpisode, getLatestEpisodeCount } from "@/lib/jikan";
import { NextRequest, NextResponse } from "next/server";

const BATCH_SIZE = 50;

export const maxDuration = 300; // 5 min timeout on Vercel

export async function POST(req: NextRequest) {
  // Protect this endpoint
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("mode") || "full";

  const supabase = await createClient();

  try {
    if (mode === "new") {
      // Only fetch episodes we don't have yet
      const [{ count: dbCount }, latestCount] = await Promise.all([
        supabase.from("episodes").select("id", { count: "exact", head: true }),
        getLatestEpisodeCount(),
      ]);

      const currentMax = dbCount || 0;
      if (latestCount <= currentMax) {
        return NextResponse.json({ message: "Database is up to date", count: currentMax });
      }

      // Fetch only the new episodes
      let synced = 0;
      for (let ep = currentMax + 1; ep <= latestCount; ep++) {
        const episode = await fetchSingleEpisode(ep);
        if (!episode) continue;

        // Get arc ID from slug
        let arcId = null;
        if (episode.arc_slug) {
          const { data: arc } = await supabase
            .from("arcs")
            .select("id")
            .eq("slug", episode.arc_slug)
            .single();
          arcId = arc?.id || null;
        }

        await supabase.from("episodes").upsert({
          episode_number: episode.episode_number,
          title: episode.title,
          arc_id: arcId,
          arc_name: episode.arc_name,
          synopsis: episode.synopsis,
          crunchyroll_url: episode.crunchyroll_url,
          is_filler: episode.is_filler,
          is_recap: episode.is_recap,
          importance_level: episode.importance_level,
          bounty_reward: episode.bounty_reward,
          bonus_bounty: episode.bonus_bounty,
        }, { onConflict: "episode_number" });

        synced++;
      }

      return NextResponse.json({ message: "New episodes synced", synced });
    }

    // Full sync mode
    console.log("Starting full episode sync from Jikan API...");
    const allEpisodes = await fetchAllEpisodes();
    console.log(`Fetched ${allEpisodes.length} episodes from Jikan`);

    // Get arc ID map from DB
    const { data: arcs } = await supabase.from("arcs").select("id, slug");
    const arcSlugToId = Object.fromEntries(
      (arcs || []).map((a) => [a.slug, a.id])
    );

    // Batch upsert
    let synced = 0;
    for (let i = 0; i < allEpisodes.length; i += BATCH_SIZE) {
      const batch = allEpisodes.slice(i, i + BATCH_SIZE).map((ep) => ({
        episode_number: ep.episode_number,
        title: ep.title,
        arc_id: ep.arc_slug ? arcSlugToId[ep.arc_slug] || null : null,
        arc_name: ep.arc_name,
        synopsis: ep.synopsis,
        crunchyroll_url: ep.crunchyroll_url,
        is_filler: ep.is_filler,
        is_recap: ep.is_recap,
        importance_level: ep.importance_level,
        bounty_reward: ep.bounty_reward,
        bonus_bounty: ep.bonus_bounty,
        // Note: quiz_question stays null here — AI generates these separately
      }));

      const { error } = await supabase
        .from("episodes")
        .upsert(batch, { onConflict: "episode_number" });

      if (error) {
        console.error(`Batch ${i}–${i + BATCH_SIZE} error:`, error.message);
      } else {
        synced += batch.length;
      }
    }

    return NextResponse.json({
      success: true,
      total: allEpisodes.length,
      synced,
      message: `Synced ${synced} episodes from Jikan API`,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Sync failed", details: String(error) },
      { status: 500 }
    );
  }
}

// GET: Check sync status
export async function GET() {
  const supabase = await createClient();
  const [{ count }, latestCount] = await Promise.all([
    supabase.from("episodes").select("id", { count: "exact", head: true }),
    getLatestEpisodeCount(),
  ]);

  return NextResponse.json({
    dbEpisodeCount: count || 0,
    malEpisodeCount: latestCount,
    isUpToDate: (count || 0) >= latestCount,
    needsSync: (count || 0) === 0,
  });
}
