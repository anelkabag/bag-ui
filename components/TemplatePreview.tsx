"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { IconArrowUpRight, IconMaximize } from "@tabler/icons-react";
import type { RegistryItem } from "@/lib/block-categories";

interface TemplatePreviewProps {
  templates: RegistryItem[];
}

const imageSizes = [
  "aspect-[16/10]",
  "aspect-[4/3]",
  "aspect-[3/2]",
  "aspect-square",
  "aspect-[5/4]",
] as const;

function TemplateCard({
  template,
  index,
}: {
  template: RegistryItem;
  index: number;
}) {
  const imageSize = imageSizes[index % imageSizes.length];
  const title = template.title || template.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "80px" }}
      transition={{ duration: 0.3, delay: (index % 3) * 0.04 }}
      className="mb-5 break-inside-avoid"
    >
      <Link
        href={`/fullscreen/${template.name}?from=templates`}
        aria-label={`Open ${title} in fullscreen`}
        className="group relative block overflow-hidden rounded-xl border border-border bg-card outline-none transition-colors hover:border-foreground/30 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <div className={`relative overflow-hidden bg-muted ${imageSize}`}>
          {template.cover ? (
            <Image
              src={template.cover}
              alt={`${title} preview`}
              fill
              sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
              Preview unavailable
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30 group-focus-visible:bg-black/30">
            <span className="flex items-center gap-2 rounded-full bg-background/95 px-3 py-2 text-xs font-medium text-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <IconMaximize size={14} />
              View template
            </span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-3 p-4">
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
          <IconArrowUpRight
            size={16}
            className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          />
        </div>
      </Link>
    </motion.div>
  );
}

export function TemplatePreview({ templates }: TemplatePreviewProps) {
  return (
    <section
      aria-label="Template gallery"
      className="columns-1 gap-5 sm:columns-2 xl:columns-3"
    >
      {templates.map((template, index) => (
        <TemplateCard
          key={template.name}
          template={template}
          index={index}
        />
      ))}
    </section>
  );
}
