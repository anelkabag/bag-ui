"use client";

import React, { KeyboardEvent, ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  IconArrowUpRight,
  IconLayoutGrid,
  IconMaximize,
  IconList,
} from "@tabler/icons-react";
import { ComponentPreview } from "@/components/component-preview";
import { RegistryItem } from "@/lib/block-categories";

interface TemplatePreviewProps {
  templates: RegistryItem[];
  children: ReactNode;
}

type TemplateView = "grid" | "full";

function GridTemplateCard({ template }: { template: RegistryItem }) {
  const router = useRouter();
  const open = () => router.push(`/fullscreen/${template.name}?from=templates`);
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={handleKeyDown}
      aria-label={`Open ${template.title || template.name} in fullscreen`}
      className="group cursor-pointer rounded-2xl border border-border bg-card p-3 text-left shadow-sm transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-background">
        {template.cover ? (
          <Image
            src={template.cover}
            alt={`${template.title || template.name} cover`}
            width={960}
            height={540}
            className="pointer-events-none aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="pointer-events-none">
            <ComponentPreview
              item={template}
              height={220}
              className="rounded-none border-0"
            />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/35 group-focus:bg-black/35">
          <span className="flex translate-y-2 items-center gap-1.5 rounded-full bg-background/95 px-3 py-2 text-xs font-semibold text-foreground opacity-0 shadow-sm transition-all group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
            <IconMaximize size={14} />
            Open full screen
          </span>
        </div>
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {template.title || template.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {template.description || "Production-ready website template"}
          </p>
        </div>
        <IconArrowUpRight
          size={16}
          className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
        />
      </div>
    </motion.div>
  );
}

export function TemplatePreview({ templates, children }: TemplatePreviewProps) {
  const [view, setView] = useState<TemplateView>("grid");

  return (
    <section aria-label="Template previews">
      <div className="mb-8 flex flex-col gap-4 border-y border-border py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          {view === "grid"
            ? "Browse compact previews and open any template fullscreen."
            : "Viewing complete template previews."}
        </p>
        <div className="flex w-fit items-center gap-1 rounded-lg border border-border bg-background p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            aria-pressed={view === "grid"}
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
              view === "grid"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconLayoutGrid size={15} />
            Grid View
          </button>
          <button
            type="button"
            onClick={() => setView("full")}
            aria-pressed={view === "full"}
            className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
              view === "full"
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconList size={15} />
            Full View
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === "grid" ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            {templates.map((template) => (
              <GridTemplateCard key={template.name} template={template} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
