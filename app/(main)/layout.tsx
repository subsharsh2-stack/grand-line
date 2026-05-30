import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/nav/navbar";
import { DenDenMushi } from "@/components/ai/den-den-mushi";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: { username: string; display_name: string | null; bounty: number; rank: string; watch_streak: number; avatar_url: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("username, display_name, bounty, rank, watch_streak, avatar_url")
      .eq("id", user.id)
      .maybeSingle();
    profile = data;
  }

  return (
    <div className="min-h-screen bg-[#080c14] starfield">
      <Navbar profile={profile} />
      <main className="pt-16">
        {children}
      </main>
      <DenDenMushi />
    </div>
  );
}
