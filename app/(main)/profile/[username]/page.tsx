import { createClient } from "@/lib/supabase/server";
import { WantedPoster } from "@/components/profile/wanted-poster";
import { ProfileStats } from "@/components/profile/profile-stats";
import { DevilFruitCollection } from "@/components/profile/devil-fruit-collection";
import { RecentActivity } from "@/components/profile/recent-activity";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { username: string } }) {
  return { title: `${params.username}'s Wanted Poster` };
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createClient();

  const [
    { data: { user } },
    { data: profile },
  ] = await Promise.all([
    supabase.auth.getUser(),
    supabase
      .from("profiles")
      .select("*")
      .eq("username", params.username)
      .maybeSingle(),
  ]);

  if (!profile) notFound();

  const isOwnProfile = user?.id === profile.id;

  const [
    { data: devilFruits },
    { data: crew },
    { data: arcProgress },
    { data: recentActivity },
    { data: bountyHistory },
  ] = await Promise.all([
    supabase
      .from("user_devil_fruits")
      .select("*, devil_fruits(*)")
      .eq("user_id", profile.id)
      .order("earned_at", { ascending: false }),
    profile.crew_id
      ? supabase.from("crews").select("*").eq("id", profile.crew_id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from("arc_progress")
      .select("*, arcs(name, slug)")
      .eq("user_id", profile.id)
      .eq("status", "completed"),
    supabase
      .from("activity_feed")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("bounty_transactions")
      .select("amount, reason, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Wanted Poster */}
        <div className="lg:col-span-1">
          <WantedPoster
            profile={profile}
            crew={crew}
            devilFruits={devilFruits || []}
            isOwnProfile={isOwnProfile}
          />
        </div>

        {/* Right: Stats + Activity */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileStats
            profile={profile}
            completedArcs={arcProgress || []}
          />
          <DevilFruitCollection devilFruits={devilFruits || []} />
          <RecentActivity activity={recentActivity || []} />
        </div>
      </div>
    </div>
  );
}
