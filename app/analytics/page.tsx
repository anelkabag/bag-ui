import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type DownloadRow = {
  component: string;
  project_id: string;
  created_at: string;
};

interface AnalyticsSummary {
  totalDownloads: number;
  downloadsToday: number;
  componentCount: number;
  projectCount: number;
  topComponents: Array<{
    component: string;
    downloads: number;
    projects: number;
    lastUsedAt: string | null;
  }>;
  dailySeries: Array<{ date: string; downloads: number }>;
}

async function getSummary(): Promise<AnalyticsSummary> {
  try {
    const supabase = await createSupabaseServerClient();
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
    const typedDownloadRows = (downloadRows ?? []) as DownloadRow[];
    for (const row of typedDownloadRows) {
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

    const dailySeries = Array.from({ length: 30 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - index));
      return { date: date.toISOString().slice(0, 10), downloads: 0 };
    });

    const typedDailyRows = (dailyRows ?? []) as Array<{ created_at: string }>;
    for (const row of typedDailyRows) {
      const bucketDate = new Date(row.created_at).toISOString().slice(0, 10);
      const match = dailySeries.find((item) => item.date === bucketDate);
      if (match) {
        match.downloads += 1;
      }
    }

    return {
      totalDownloads: totalDownloads ?? 0,
      downloadsToday: downloadsToday ?? 0,
      componentCount: topComponents.length,
      projectCount: new Set(typedDownloadRows.map((row) => row.project_id))
        .size,
      topComponents,
      dailySeries,
    };
  } catch (error) {
    console.error("Analytics page error", error);
    return {
      totalDownloads: 0,
      downloadsToday: 0,
      componentCount: 0,
      projectCount: 0,
      topComponents: [],
      dailySeries: [],
    };
  }
}

export default async function AnalyticsPage() {
  const summary = await getSummary();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
            BagUI Analytics
          </p>
          <h1 className="text-3xl font-semibold">
            Téléchargements des composants
          </h1>
          <p className="max-w-2xl text-sm text-slate-400">
            Suivez l’adoption de votre bibliothèque et identifiez les composants
            les plus utilisés.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            { label: "Total downloads", value: summary.totalDownloads },
            { label: "Downloads aujourd’hui", value: summary.downloadsToday },
            { label: "Composants", value: summary.componentCount },
            { label: "Projets", value: summary.projectCount },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg shadow-black/20"
            >
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-3 text-3xl font-semibold">{card.value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Téléchargements sur 30 jours
              </h2>
              <span className="text-sm text-slate-400">
                Évolution quotidienne
              </span>
            </div>
            <div className="flex h-56 items-end gap-2 overflow-x-auto">
              {summary.dailySeries.map((item) => (
                <div
                  key={item.date}
                  className="flex min-w-4.5 flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full rounded-t-md bg-cyan-500/80"
                    style={{ height: `${Math.max(8, item.downloads * 18)}px` }}
                  />
                  <span className="text-[10px] text-slate-500">
                    {item.date.slice(5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
            <h2 className="mb-4 text-lg font-semibold">Top composants</h2>
            <div className="space-y-3">
              {summary.topComponents.slice(0, 5).map((item) => (
                <div
                  key={item.component}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{item.component}</p>
                    <p className="text-xs text-slate-400">
                      {item.projects} projets
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {item.downloads}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg shadow-black/20">
          <h2 className="mb-4 text-lg font-semibold">Détail des composants</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-3">Composant</th>
                  <th className="pb-3">Téléchargements</th>
                  <th className="pb-3">Projets uniques</th>
                  <th className="pb-3">Dernière utilisation</th>
                </tr>
              </thead>
              <tbody>
                {summary.topComponents.map((item) => (
                  <tr
                    key={item.component}
                    className="border-t border-slate-800/80"
                  >
                    <td className="py-3 font-medium">{item.component}</td>
                    <td className="py-3">{item.downloads}</td>
                    <td className="py-3">{item.projects}</td>
                    <td className="py-3 text-slate-400">
                      {item.lastUsedAt
                        ? new Date(item.lastUsedAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
