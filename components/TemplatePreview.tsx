"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { ComponentPreview } from "@/components/component-preview";
import type { RegistryItem } from "@/lib/block-categories";

interface TemplatePreviewProps {
  templates: RegistryItem[];
}

function TemplateCard({
  template,
}: {
  template: RegistryItem;
}) {
  const title = template.title || template.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "80px" }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <article className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-hidden bg-background">
          <ComponentPreview
            item={template}
            height="100vh"
            alignStart
            className="!rounded-none !border-0"
          />
        </div>

        <div className="flex items-start justify-between gap-3 border-t border-border p-4">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium text-foreground">
              {title}
            </h2>
            {template.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {template.description}
              </p>
            )}
          </div>
          <Link
            href={`/fullscreen/${template.name}?from=templates`}
            aria-label={`Open ${title} in fullscreen`}
            className="mt-0.5 shrink-0 rounded-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <IconArrowUpRight size={16} />
          </Link>
        </div>
      </article>
    </motion.div>
  );
}

export function TemplatePreview({ templates }: TemplatePreviewProps) {
  return (
    <section
      aria-label="Template gallery"
      className="flex flex-col gap-4 px-4 py-4"
    >
      {templates.map((template) => (
        <TemplateCard key={template.name} template={template} />
      ))}
    </section>
  );
}
