import Link from "next/link";
import registryJson from "@/public/r/registry.json";
import Navbar from "@/components/navbar";

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  files: { path: string; type: string; target?: string }[];
}

interface RegistryFile {
  items: RegistryItem[];
}

const registryData = registryJson as RegistryFile;

function getCategory(item: RegistryItem) {
  const target = item.files?.find((file) => file.target)?.target;
  const path = target ?? item.files?.[0]?.path ?? "";
  const normalized = path.replace(/^\.\//, "").replace(/\.tsx?$/, "");
  const segments = normalized.split("/").filter(Boolean);
  if (segments.length === 0) return "unknown";
  if (segments[0] === "components" && segments.length > 1) {
    return segments.slice(1, -1).join(" /") || segments[1] || "unknown";
  }
  if (segments.length === 1) return segments[0];
  return segments[segments.length - 2] || segments[segments.length - 1];
}

function getFileLabel(file: { path: string; target?: string }) {
  return file.target ?? file.path;
}

export default function BlocksPage() {
  const items = registryData.items ?? [];
  const totalBlocks = items.filter((item) =>
    item.type?.includes("block"),
  ).length;
  const totalUi = items.filter((item) => item.type?.includes("ui")).length;
  const totalComponents = items.reduce(
    (sum, item) => sum + item.files.length,
    0,
  );
  const sortedItems = [...items].sort((a, b) => a.title.localeCompare(b.title));

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-white px-6 md:px-12 lg:px-16 py-16">
        <div className="max-w-5xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-3">
            Blocks
          </p>
          <h1
            className="text-4xl md:text-5xl font-bold text-slate-950 mb-4"
            style={{ lineHeight: 1.05 }}
          >
            Catalogue des blocs
          </h1>
          <p className="max-w-2xl text-slate-600 text-base leading-relaxed">
            Une seule page pour visualiser chaque bloc disponible et les
            composants associés. Tous les blocs sont affichés ici, sans générer
            une page dédiée par bloc.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                Sections
              </p>
              <p className="text-3xl font-semibold text-slate-950">
                {totalBlocks}
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                Composants
              </p>
              <p className="text-3xl font-semibold text-slate-950">
                {totalComponents}
              </p>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                UI
              </p>
              <p className="text-3xl font-semibold text-slate-950">{totalUi}</p>
            </div>
          </div>
        </div>

        {sortedItems.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-slate-400">
            Aucun bloc trouvé dans le registre.
          </div>
        ) : (
          <div className="space-y-8">
            {sortedItems.map((item) => (
              <article
                id={item.name}
                key={item.name}
                className="group rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 mb-2">
                      {item.type?.split(":")[1] === "block" ? "Section" : "UI"}
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-950 leading-tight">
                      {item.title}
                    </h2>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 border border-slate-200">
                    {item.files.length} composant
                    {item.files.length > 1 ? "s" : ""}
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="grid gap-3 md:grid-cols-2 mb-6">
                  <div className="rounded-2xl bg-white p-4 border border-slate-200">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                      Catégorie
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {getCategory(item)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 border border-slate-200">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                      Types de fichiers
                    </p>
                    <p className="text-sm font-medium text-slate-900">
                      {Array.from(
                        new Set(item.files.map((file) => file.type)),
                      ).join(", ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {item.files.map((file) => (
                    <div
                      key={file.path}
                      className="rounded-2xl bg-white p-4 border border-slate-200 text-sm text-slate-600"
                    >
                      <p className="font-semibold text-slate-900">
                        {getFileLabel(file)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{file.type}</p>
                    </div>
                  ))}
                </div>

                <a
                  href={`#${item.name}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-black"
                >
                  Voir cette section
                  <span aria-hidden="true">→</span>
                </a>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
