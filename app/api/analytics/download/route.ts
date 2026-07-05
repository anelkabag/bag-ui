import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const component = typeof body?.component === "string" ? body.component : "";
    const projectId = typeof body?.projectId === "string" ? body.projectId : "";
    const cliVersion =
      typeof body?.cliVersion === "string" ? body.cliVersion : null;
    const os = typeof body?.os === "string" ? body.os : null;
    const userId =
      typeof body?.userId === "string" && body.userId.length > 0
        ? body.userId
        : null;

    if (!component || !projectId) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    const supabase = await createSupabaseServiceRoleClient();
    const { error } = await supabase.from("component_downloads").insert({
      component,
      project_id: projectId,
      user_id: userId,
      cli_version: cliVersion,
      os,
    });

    if (error) {
      console.error("Analytics insert failed", error);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics route error", error);
    return NextResponse.json({ ok: true });
  }
}
