import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";
import { TemplatePreview } from "@/components/TemplatePreview";
import type { RegistryItem } from "@/lib/block-categories";
import registryJson from "@/registry.json";

const registry = registryJson as { items: RegistryItem[] };
const templates = registry.items.filter((item) =>
  item.name.toLowerCase().includes("template"),
);
const freeCount = templates.filter(
  (template) => template.access?.tier !== "pro",
).length;
const proCount = templates.length - freeCount;

export default function TemplatesPage() {
  return (
    <AppShell>
      <div className="min-h-full bg-background">
        <div className="mx-auto max-w-[1440px] pb-20">
          <PageHero
            firstLine="Ready-to-use"
            secondLine="website"
            emphasis="templates."
            className="px-4 pb-8 pt-8 md:px-4 lg:grid-cols-[1fr_auto]"
          >
            <div className="flex items-center justify-between gap-5 sm:justify-end sm:gap-7">
              <div>
                <p className="text-lg font-semibold leading-none tracking-tight text-foreground">
                  {templates.length}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Templates
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold leading-none tracking-tight text-foreground">
                  {freeCount}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">Free</p>
              </div>
              <div>
                <p className="text-lg font-semibold leading-none tracking-tight text-foreground">
                  {proCount}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">Pro</p>
              </div>
            </div>
          </PageHero>

          <p className="mx-4 mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Full-page website templates, ready to add to your project.
          </p>

          {templates.length > 0 ? (
            <TemplatePreview templates={templates} />
          ) : (
            <p className="py-12 text-center text-sm text-muted-foreground">
              No templates available yet.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}