import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/navbar";
import registryJson from "@/public/r/registry.json";
import {
  blockCategories,
  categoryMatchesItem,
  formatCategoryLabel,
  getCategoryForSlug,
  RegistryItem,
} from "@/lib/block-categories";

interface RegistryFile {
  items: RegistryItem[];
}

const registryData = registryJson as RegistryFile;

export function generateStaticParams() {
  return blockCategories.map((category) => ({ category: category.slug }));
}

export default function CategoryPage({
  params,
}: {
  params?: { category?: string };
}) {
  const category = params?.category ?? "";
  const selectedCategory = getCategoryForSlug(category, registryData.items);

  if (!selectedCategory) {
    notFound();
  }

  const items = registryData.items.filter((item) =>
    categoryMatchesItem(category, item),
  );

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-white px-6 md:px-12 lg:px-16 py-16">
        <div className="max-w-5xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 mb-3">
            Blocks / {formatCategoryLabel(category)}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">
            {selectedCategory.title}
          </h1>
          <p className="max-w-2xl text-slate-600 text-base leading-relaxed">
            {selectedCategory.description}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
            Aucun composant trouvé pour cette catégorie.
          </div>
        ) : (
          <div className="space-y-8">
            {items.map((item) => (
              <article
                key={item.name}
                className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 shadow-sm"
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
                  {item.files.map((file) => (
                    <div
                      key={file.path}
                      className="rounded-2xl bg-white p-4 border border-slate-200 text-sm text-slate-600"
                    >
                      <p className="font-semibold text-slate-900">
                        {file.target ?? file.path}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{file.type}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/blocks"
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Retour à la liste des blocs
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
