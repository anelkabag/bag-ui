import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

const emptySummary = {
  totalDownloads: 0,
  downloadsToday: 0,
  componentCount: 0,
  projectCount: 0,
  topComponents: [],
  dailySeries: [],
};

export async function GET() {
  try {
    const supabase = await createSupabaseServiceRoleClient();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      { count: totalDownloads },
      { count: downloadsToday },
      { data: downloadRows },
      { data: dailyRows },
    ] = await Promise.all([
      supabase
        .from("component_downloads")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("component_downloads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfToday.toISOString()),
      supabase
        .from("component_downloads")
        .select("component, project_id, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("component_downloads")
        .select("created_at")
        .gte(
          "created_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        ),
    ]);

    const componentBuckets = new Map<
      string,
      { downloads: number; projects: Set<string>; lastUsedAt: string | null }
    >();
    for (const row of downloadRows ?? []) {
      const entry = componentBuckets.get(row.component) ?? {
        downloads: 0,
        projects: new Set<string>(),
        lastUsedAt: null,
      };
      entry.downloads += 1;
      entry.projects.add(row.project_id);
      entry.lastUsedAt =
        row.created_at > (entry.lastUsedAt ?? "")
          ? row.created_at
          : entry.lastUsedAt;
      componentBuckets.set(row.component, entry);
    }

    const topComponents = Array.from(componentBuckets.entries())
      .map(([component, values]) => ({
        component,
        downloads: values.downloads,
        projects: values.projects.size,
        lastUsedAt: values.lastUsedAt,
      }))
      .sort(
        (a, b) =>
          b.downloads - a.downloads || a.component.localeCompare(b.component),
      );

    const dailyCounts = new Map<string, number>();
    for (const row of dailyRows ?? []) {
      const date = new Date(row.created_at).toISOString().slice(0, 10);
      dailyCounts.set(date, (dailyCounts.get(date) ?? 0) + 1);
    }

    const dailySeries = Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index));
      const key = date.toISOString().slice(0, 10);
      return { date: key, downloads: dailyCounts.get(key) ?? 0 };
    });

    return NextResponse.json({
      totalDownloads: totalDownloads ?? 0,
      downloadsToday: downloadsToday ?? 0,
      componentCount: topComponents.length,
      projectCount: new Set((downloadRows ?? []).map((row) => row.project_id))
        .size,
      topComponents,
      dailySeries,
    });
  } catch (error) {
    console.error("Analytics summary error", error);
    return NextResponse.json(emptySummary, { status: 200 });
  }
}
