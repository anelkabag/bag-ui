import { createSupabaseServerClient } from "@/lib/supabase/server";
import Navbar from "@/components/navbar";
import {Footer} from "@/components/footer";

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

type ComponentBucket = {
    downloads: number;
    projects: Set<string>;
    lastUsedAt: string | null;
};

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

        const componentBuckets = new Map<string, ComponentBucket>();

        const typedDownloadRows = (downloadRows ?? []) as DownloadRow[];
        for (const row of typedDownloadRows) {
            const entry: ComponentBucket = componentBuckets.get(row.component) ?? {
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

const maxDaily = (series: AnalyticsSummary["dailySeries"]) =>
    Math.max(1, ...series.map((item) => item.downloads));

export default async function AnalyticsPage() {
    const summary = await getSummary();
    const peak = maxDaily(summary.dailySeries);

    const cards = [
        { label: "Total downloads", value: summary.totalDownloads },
        { label: "Downloads aujourd'hui", value: summary.downloadsToday },
        { label: "Composants", value: summary.componentCount },
        { label: "Projets", value: summary.projectCount },
    ];

    return (
        <main className="min-h-screen overflow-x-hidden">
            <Navbar/>
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 sm:py-16 border-x border-gray-200 flex flex-col gap-8 sm:gap-10">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:gap-4">
                    <div
                        className="inline-flex items-center self-start overflow-hidden"
                        style={{
                            border: "1px solid rgba(0,0,0,0.1)",
                            borderRadius: "999px",
                            background: "rgba(0,0,0,0.02)",
                        }}
                    >
            <span
                style={{
                    padding: "6px 14px",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#000",
                    letterSpacing: "-0.01em",
                    whiteSpace: "nowrap",
                }}
            >
              Bag\Ui Analytics
            </span>
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(22px, 6vw, 40px)",
                            fontWeight: 700,
                            lineHeight: 1.15,
                            letterSpacing: "-0.03em",
                            color: "rgba(0,0,0,0.5)",
                            margin: 0,
                            wordBreak: "break-word",
                        }}
                    >
                        Téléchargements des <span style={{ color: "#000" }}>composants</span>
                    </h1>

                    <p
                        style={{
                            fontSize: "13px",
                            color: "rgba(0,0,0,0.55)",
                            lineHeight: 1.6,
                            maxWidth: "540px",
                            margin: 0,
                        }}
                    >
                        Suivez l&rsquo;adoption de votre bibliothèque et identifiez les
                        composants les plus utilisés.
                    </p>
                </div>

                {/* Stat cards */}
                <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                    {cards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-2xl p-3 sm:p-5 bg-white min-w-0"
                            style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                        >
                            <p
                                style={{
                                    fontSize: "10px",
                                    fontWeight: 600,
                                    letterSpacing: "-0.01em",
                                    color: "rgba(0,0,0,0.55)",
                                }}
                            >
                                {card.label}
                            </p>
                            <p
                                className="mt-2 sm:mt-3"
                                style={{
                                    fontSize: "clamp(20px, 6vw, 28px)",
                                    fontWeight: 700,
                                    letterSpacing: "-0.03em",
                                    color: "#000",
                                }}
                            >
                                {card.value}
                            </p>
                        </div>
                    ))}
                </section>

                {/* Chart + top components */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div
                        className="rounded-2xl p-4 sm:p-6 bg-white min-w-0"
                        style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                    >
                        <div className="mb-4 sm:mb-5 flex flex-wrap items-center justify-between gap-2">
                            <h2
                                style={{
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    letterSpacing: "-0.02em",
                                    color: "#000",
                                }}
                            >
                                Téléchargements sur 30 jours
                            </h2>
                            <span
                                style={{ fontSize: "10px", color: "rgba(0,0,0,0.45)" }}
                            >
                Évolution quotidienne
              </span>
                        </div>
                        <div className="flex h-48 sm:h-56 items-end gap-1.5 sm:gap-2 overflow-x-auto pb-1">
                            {summary.dailySeries.map((item) => (
                                <div
                                    key={item.date}
                                    className="flex min-w-3 sm:min-w-4.5 flex-shrink-0 flex-col items-center gap-1.5 sm:gap-2"
                                >
                                    <div
                                        className="w-full rounded-t-md"
                                        style={{
                                            height: `${Math.max(6, (item.downloads / peak) * 160)}px`,
                                            background:
                                                item.downloads > 0
                                                    ? "rgba(0,0,0,0.85)"
                                                    : "rgba(0,0,0,0.08)",
                                        }}
                                    />
                                    <span
                                        style={{ fontSize: "8px", color: "rgba(0,0,0,0.4)" }}
                                    >
                    {item.date.slice(5)}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        className="rounded-2xl p-4 sm:p-6 bg-white min-w-0"
                        style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                    >
                        <h2
                            className="mb-4"
                            style={{
                                fontSize: "15px",
                                fontWeight: 700,
                                letterSpacing: "-0.02em",
                                color: "#000",
                            }}
                        >
                            Top composants
                        </h2>
                        <div className="space-y-2">
                            {summary.topComponents.slice(0, 5).map((item) => (
                                <div
                                    key={item.component}
                                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2"
                                    style={{
                                        border: "1px solid rgba(0,0,0,0.08)",
                                        background: "rgba(0,0,0,0.015)",
                                    }}
                                >
                                    <div className="min-w-0">
                                        <p
                                            className="truncate"
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: 600,
                                                letterSpacing: "-0.01em",
                                                color: "#000",
                                            }}
                                        >
                                            {item.component}
                                        </p>
                                        <p
                                            style={{ fontSize: "11px", color: "rgba(0,0,0,0.45)" }}
                                        >
                                            {item.projects} projets
                                        </p>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: "13px",
                                            fontWeight: 700,
                                            color: "#000",
                                            flexShrink: 0,
                                        }}
                                    >
                    {item.downloads}
                  </span>
                                </div>
                            ))}
                            {summary.topComponents.length === 0 && (
                                <p style={{ fontSize: "12px", color: "rgba(0,0,0,0.4)" }}>
                                    Aucune donnée pour le moment.
                                </p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Detail table */}
                <section
                    className="rounded-2xl p-4 sm:p-6 bg-white min-w-0"
                    style={{ border: "1px solid rgba(0,0,0,0.1)" }}
                >
                    <h2
                        className="mb-4"
                        style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            letterSpacing: "-0.02em",
                            color: "#000",
                        }}
                    >
                        Détail des composants
                    </h2>
                    <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                        <table className="min-w-[560px] w-full text-left text-sm">
                            <thead>
                            <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                                {["Composant", "Téléchargements", "Projets uniques", "Dernière utilisation"].map(
                                    (head) => (
                                        <th
                                            key={head}
                                            className="pb-3 whitespace-nowrap"
                                            style={{
                                                fontSize: "11px",
                                                fontWeight: 600,
                                                letterSpacing: "-0.01em",
                                                color: "rgba(0,0,0,0.45)",
                                            }}
                                        >
                                            {head}
                                        </th>
                                    ),
                                )}
                            </tr>
                            </thead>
                            <tbody>
                            {summary.topComponents.map((item) => (
                                <tr
                                    key={item.component}
                                    style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
                                >
                                    <td
                                        className="py-3"
                                        style={{
                                            fontWeight: 600,
                                            letterSpacing: "-0.01em",
                                            color: "#000",
                                        }}
                                    >
                                        {item.component}
                                    </td>
                                    <td className="py-3" style={{ color: "rgba(0,0,0,0.75)" }}>
                                        {item.downloads}
                                    </td>
                                    <td className="py-3" style={{ color: "rgba(0,0,0,0.75)" }}>
                                        {item.projects}
                                    </td>
                                    <td className="py-3 whitespace-nowrap" style={{ color: "rgba(0,0,0,0.45)" }}>
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
            <Footer/>
        </main>
    );
}