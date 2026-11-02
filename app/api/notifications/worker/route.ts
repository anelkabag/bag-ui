import { NextResponse } from "next/server";
import { hasValidBearerToken } from "@/lib/notification-security";
import { runReleaseNotificationWorker } from "@/lib/release-notification-worker";
import { isProductionNotificationRuntime } from "@/lib/release-notifications";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isProductionNotificationRuntime(process.env.VERCEL_ENV)) {
    return new Response(null, { status: 404 });
  }

  if (
    !hasValidBearerToken(
      request.headers.get("authorization"),
      process.env.RELEASE_NOTIFICATION_WORKER_SECRET,
    )
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    return NextResponse.json({
      ok: true,
      ...(await runReleaseNotificationWorker()),
    });
  } catch (error) {
    console.error(
      "Release notification worker failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Release notification processing failed" },
      { status: 503 },
    );
  }
}
