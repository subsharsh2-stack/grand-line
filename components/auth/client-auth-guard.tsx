"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ClientAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/login");
      } else {
        setChecked(true);
      }
    });
  }, []);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🏴‍☠️</div>
          <div className="text-gold-400 font-bold text-sm tracking-widest uppercase">Setting Sail…</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
