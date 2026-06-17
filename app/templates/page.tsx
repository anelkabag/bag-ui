"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import registryJson from "@/registry.json";
import { RegistryItem } from "@/lib/block-categories";
import { ComponentPreview } from "@/components/ComponentPreview";
import {
  IconEye,
  IconCode,
  IconArrowsMaximize,
  IconRefresh,
  IconChevronDown,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";

const registry = registryJson as { items: RegistryItem[] };

// Filter templates from registry
const templates = registry.items.filter((item) =>
  item.name.toLowerCase().includes("template"),
);

type ViewMode = "preview" | "code";
type PkgManager = "pnpm" | "npm" | "yarn" | "bun";

// Custom Badge Component
function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "premium";
  className?: string;
}) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold";
  const variants = {
    default: "bg-foreground text-background",
    secondary: "bg-muted text-muted-foreground",
    outline: "border border-border text-foreground bg-transparent",
    premium: "bg-green-500 text-white",
  };
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Package manager icons (SVG)
const PKG_ICONS: Record<PkgManager, React.ReactNode> = {
  pnpm: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={14}
      height={14}
    >
      <path fill="#F69220" d="M0 0h256v256H0z" />
      <path
        fill="#fff"
        d="M64 32h32v192H64zm96 0h32v192h-32zM32 64h32v128H32z"
      />
    </svg>
  ),
  npm: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={14}
      height={14}
    >
      <path
        fill="#cb3837"
        d="M2 38.5h124v43.71H64v7.29H36.44v-7.29H2zm6.89 36.43h13.78V53.07h6.89v21.86h6.89V45.79H8.89zm34.44-29.14v36.42h13.78v-7.28h13.78V45.79zm13.78 7.29H64v14.56h-6.89zm20.67-7.29v29.14h13.78V53.07h6.89v21.86h6.89V53.07h6.89v21.86h6.89V45.79z"
      />
    </svg>
  ),
  yarn: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={14}
      height={14}
    >
      <path
        fill="#2C8EBB"
        d="M10.3 64s6.6 4 15 4.6c2.4 1 4.2 2.2 4.2 4.2 0 2.8-3 3.5-6.1 3.5-3.7 0-8-1.2-11-3.2l-2.4 3c3 2.4 8 4 13.5 4 6.2 0 10.4-2.7 10.4-8 0-4.4-3.6-6.8-8-7.4-4.4-.6-8-.6-8-.6V55.3c3.6 1 7.4 1.6 12 1.8l-2.4-3c-4-.2-9-1.2-12.2-2.6v12.5zm69 0s6.6 4 15 4.6c2.4 1 4.2 2.2 4.2 4.2 0 2.8-3 3.5-6.1 3.5-3.7 0-8-1.2-11-3.2l-2.4 3c3 2.4 8 4 13.5 4 6.2 0 10.4-2.7 10.4-8 0-4.4-3.6-6.8-8-7.4-4.4-.6-8-.6-8-.6V55.3c3.6 1 7.4 1.6 12 1.8l-2.4-3c-4-.2-9-1.2-12.2-2.6v12.5z"
      />
    </svg>
  ),
  bun: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={14}
      height={14}
    >
      <circle cx="64" cy="64" r="60" fill="#FBF0DF" />
      <path
        fill="#111827"
        d="M64 24c-22 0-40 18-40 40s18 40 40 40 40-18 40-40-18-40-40-40z"
      />
    </svg>
  ),
};

function getInstallCmd(pkg: PkgManager, templateName: string) {
  const registry = `@bagui/${templateName}`;
  switch (pkg) {
    case "pnpm":
      return `pnpm dlx shadcn@latest add ${registry}`;
    case "yarn":
      return `yarn dlx shadcn@latest add ${registry}`;
    case "bun":
      return `bunx --bun shadcn@latest add ${registry}`;
    default:
      return `npx shadcn@latest add ${registry}`;
  }
}

function getCodeSnippet(templateName: string) {
  const name = templateName
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return `import { ${name} } from "@/components/templates/${templateName}";

export default function Page() {
  return (
    <main>
      <${name} />
    </main>
  );
}`;
}

function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };
  return { copied, copy };
}

const CopyIcon = () => (
  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
    <rect
      x="1"
      y="3"
      width="8"
      height="8"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1"
    />
    <path
      d="M3 3V2a1 1 0 011-1h6a1 1 0 011 1v7a1 1 0 01-1 1H9"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 12 12" fill="none">
    <path
      d="M2 6l3 3 5-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function CodeBlock({ code }: { code: string }) {
  const { copied, copy } = useCopy();
  return (
    <div className="relative rounded-xl border border-gray-200 bg-gray-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 gap-2 sm:gap-0">
        <span className="text-xs text-gray-500 font-mono">page.tsx</span>
        <button
          onClick={() => copy(code)}
          aria-label={copied ? "Copied" : "Copy code"}
          className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto">
        <code className="text-gray-300 font-mono text-[13px] leading-relaxed">
          {code}
        </code>
      </pre>
    </div>
  );
}

function TemplateToolbarHeader({
  templateName,
  mode,
  setMode,
}: {
  templateName: string;
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
}) {
  const [pkg, setPkg] = useState<PkgManager>("npm");
  const [openDropdown, setOpenDropdown] = useState(false);
  const cmd = getInstallCmd(pkg, templateName);
  const { copied, copy } = useCopy();
  const PKG_MANAGERS: PkgManager[] = ["pnpm", "npm", "yarn", "bun"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="flex items-center gap-2 sm:gap-3 mb-4 pb-3 border-b border-gray-200 -mx-6 px-6 py-3"
    >
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {(["preview", "code"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                mode === m
                  ? "text-gray-900 bg-gray-100"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {m === "preview" ? <IconEye size={14} /> : <IconCode size={14} />}
              <span className="hidden sm:inline capitalize">{m}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => window.open(`/fullscreen/${templateName}`, "_blank")}
          className="hidden sm:flex p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer items-center justify-center"
          title="Fullscreen"
        >
          <IconArrowsMaximize size={16} className="text-gray-600" />
        </button>
      </div>

      <div className="flex-1 sm:flex-initial sm:ml-auto flex items-center gap-2 sm:gap-3">
        <button
          onClick={() => copy(cmd)}
          className="sm:hidden flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
          <span>{copied ? "Copied!" : "Copy command"}</span>
        </button>

        <div className="hidden sm:flex flex-1 items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-mono text-gray-700 overflow-x-auto min-w-0">
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            {PKG_ICONS[pkg]}
          </div>
          <code className="truncate">{cmd}</code>
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-1 p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 bg-white cursor-pointer"
            title="Change package manager"
          >
            <span className="sm:hidden w-4 h-4 flex items-center justify-center">
              {PKG_ICONS[pkg]}
            </span>
            <IconChevronDown size={16} className="text-gray-600" />
          </button>

          <AnimatePresence>
            {openDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max"
              >
                {PKG_MANAGERS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPkg(p);
                      setOpenDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                      pkg === p
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      {PKG_ICONS[p]}
                    </div>
                    <span>{p}</span>
                    {pkg === p && (
                      <IconCheck size={12} className="ml-auto text-gray-600" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => copy(cmd)}
          className="hidden sm:flex p-2.5 hover:bg-gray-100 rounded-md transition-colors cursor-pointer items-center justify-center"
          title={copied ? "Copied!" : "Copy command"}
        >
          {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
        </button>
      </div>
    </motion.div>
  );
}

function TemplateCard({
  template,
  index,
}: {
  template: RegistryItem;
  index: number;
}) {
  const [mode, setMode] = useState<ViewMode>("preview");
  const code = getCodeSnippet(template.name);

  return (
    <motion.div
      id={template.name}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="mb-12 scroll-mt-20"
    >
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-semibold text-gray-900">
          {template.title || template.name}
        </h3>
      </div>

      <TemplateToolbarHeader
        templateName={template.name}
        mode={mode}
        setMode={setMode}
      />

      <AnimatePresence mode="wait">
        {mode === "preview" ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <ComponentPreview item={template} />
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <CodeBlock code={code} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20 border-x border-gray-200">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-8">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-gray-600">Templates</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black mb-2">
              Templates
            </h1>
            <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
              Explore complete, production-ready website templates built with
              shadcn/ui, Tailwind CSS, and React. Launch modern landing pages,
              dashboards, SaaS apps, and more in minutes.
            </p>
          </div>
        </motion.div>

        <div className="border-t border-gray-100 mb-10" />

        {templates.length > 0 ? (
          templates.map((template, i) => (
            <TemplateCard key={template.name} template={template} index={i} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates available yet.</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
