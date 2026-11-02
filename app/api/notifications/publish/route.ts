import { NextResponse } from "next/server";
import { hasValidBearerToken } from "@/lib/notification-security";
import {
  isProductionDeploymentStatus,
  normalizePublishedRegistry,
  PRODUCTION_REGISTRY_URL,
  type ProductionDeploymentStatus,
} from "@/lib/release-notifications";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 30;

function isDeploymentStatus(
  value: unknown,
): value is ProductionDeploymentStatus {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const event = value as Record<string, unknown>;
  return (
    typeof event.deploymentId === "number" &&
    Number.isSafeInteger(event.deploymentId) &&
    typeof event.statusId === "number" &&
    Number.isSafeInteger(event.statusId) &&
    typeof event.state === "string" &&
    typeof event.environment === "string" &&
    typeof event.productionEnvironment === "boolean" &&
    typeof event.environmentUrl === "string"
  );
}

export async function POST(request: Request) {
  if (!hasValidBearerToken(
    request.headers.get("authorization"),
    process.env.RELEASE_NOTIFICATION_DISPATCH_SECRET,
  )) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let payload: string;
  try {
    payload = await request.text();
  } catch {
    return NextResponse.json({ error: "Unable to read request body" }, { status: 400 });
  }
  if (Buffer.byteLength(payload) > 16_384) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(payload);
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!isDeploymentStatus(body)) {
    return NextResponse.json(
      { error: "Invalid deployment status event" },
      { status: 400 },
    );
  }
  if (!isProductionDeploymentStatus(body)) {
    return NextResponse.json({ accepted: true, ignored: true });
  }
  if (process.env.VERCEL_ENV !== "production") {
    return new Response(null, { status: 404 });
  }

  let registryResponse: Response;
  try {
    registryResponse = await fetch(PRODUCTION_REGISTRY_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return NextResponse.json(
      { error: "Production registry could not be reached" },
      { status: 503 },
    );
  }
  if (!registryResponse.ok) {
    console.error("Production registry returned an error", registryResponse.status);
    return NextResponse.json(
      { error: "Production registry could not be verified" },
      { status: 503 },
    );
  }

  let resources: ReturnType<typeof normalizePublishedRegistry>;
  try {
    resources = normalizePublishedRegistry(await registryResponse.json());
  } catch (error) {
    console.error(
      "Production registry validation failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Production registry could not be verified" },
      { status: 503 },
    );
  }

  try {
    const supabase = await createSupabaseServiceRoleClient();
    const { data, error } = await supabase.rpc("sync_release_registry", {
      p_items: resources,
    });
    if (error) {
      console.error("Could not persist production releases", error.code);
      return NextResponse.json(
        { error: "Could not persist production releases" },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { accepted: true, campaignsCreated: data ?? 0 },
      { status: 202 },
    );
  } catch (error) {
    console.error(
      "Production release processing failed",
      error instanceof Error ? error.message : "unknown error",
    );
    return NextResponse.json(
      { error: "Could not persist production releases" },
      { status: 503 },
    );
  }
}
