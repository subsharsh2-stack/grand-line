import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { dealId } = await req.json();
  if (!dealId) return NextResponse.json({ ok: false });

  const supabase = await createClient();
  await supabase
    .from("merch_deals")
    .update({ click_count: supabase.rpc("increment", { x: 1 }) as unknown as number })
    .eq("id", dealId);

  return NextResponse.json({ ok: true });
}
