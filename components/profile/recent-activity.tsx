"use client";

import { formatDistanceToNow } from "date-fns";
import { CheckCircle, Trophy, Map, Users, Star } from "lucide-react";

interface ActivityItem {
  id: string;
  type: string;
  data: Record<string, unknown>;
  created_at: string;
}

interface Props {
  activity: ActivityItem[];
}

function ActivityIcon({ type }: { type: string }) {
  if (type === "episode_watched") return <CheckCircle size={12} className="text-gold-400" />;
  if (type === "arc_completed") return <Map size={12} className="text-green-400" />;
  if (type === "devil_fruit_earned") return <Star size={12} className="text-purple-400" />;
  if (type === "crew_joined") return <Users size={12} className="text-blue-400" />;
  if (type === "challenge_completed") return <Trophy size={12} className="text-orange-400" />;
  return <CheckCircle size={12} className="text-slate-400" />;
}

function ActivityMessage({ item }: { item: ActivityItem }) {
  const data = item.data;
  if (item.type === "episode_watched") {
    return (
      <span className="text-slate-300">
        Watched <span className="text-white font-medium">Episode {data.episode_number as number}</span>
        {" — "}<span className="text-slate-400 italic">{data.episode_title as string}</span>
        {" "}<span className="text-gold-400 text-xs">+฿{data.bounty_earned as number}</span>
        {(data.quiz_passed as boolean) && <span className="text-blue-400 text-xs ml-1">✓ Quiz</span>}
        {(data.streak as number) > 1 && <span className="text-orange-400 text-xs ml-1">🔥 {data.streak as number}d streak</span>}
      </span>
    );
  }
  if (item.type === "arc_completed") {
    return (
      <span className="text-slate-300">
        Completed the <span className="text-white font-medium">{data.arc_name as string} Arc</span>!
        <span className="text-gold-400 text-xs ml-1">+฿{data.bounty_earned as number}</span>
      </span>
    );
  }
  if (item.type === "devil_fruit_earned") {
    return (
      <span className="text-slate-300">
        Earned the <span className="text-purple-400 font-medium">{data.fruit_name as string}</span> Devil Fruit!
      </span>
    );
  }
  return <span className="text-slate-400">{item.type.replace(/_/g, " ")}</span>;
}

export function RecentActivity({ activity }: Props) {
  if (activity.length === 0) {
    return (
      <div className="bg-void-900/60 border border-white/[0.06] rounded-2xl p-5">
        <div className="text-xs text-slate-500 font-semibold tracking-widest uppercase mb-3">Recent Activity</div>
        <div className="text-center py-6 text-slate-600 text-sm">
          No activity yet. Start watching!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-void-900/60 border border-white/[0.06] rounded-2xl p-5">
      <div className="text-xs text-slate-500 font-semibold tracking-widest uppercase mb-4">
        Recent Activity
      </div>
      <div className="space-y-3">
        {activity.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-void-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <ActivityIcon type={item.type} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs leading-relaxed">
                <ActivityMessage item={item} />
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">
                {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
