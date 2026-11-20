"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  IconArrowsMaximize,
  IconCheck,
  IconChevronDown,
  IconCode,
  IconCopy,
  IconDeviceDesktop,
  IconDeviceMobile,
  IconEye,
  IconRefresh,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { ComponentPreview } from "@/components/component-preview";
import { getComponentAccessTier, getInstallAccessState } from "@/lib/access";
import { useAuth } from "@/hooks/useAuth";
import { trackComponentDownload } from "@/lib/analytics";
import posthog from "posthog-js";
import type { RegistryItem } from "@/lib/block-categories";

interface TemplatePreviewProps {
  templates: RegistryItem[];
}

type ViewMode = "preview" | "code";
type DeviceMode = "desktop" | "mobile";
type PkgManager = "pnpm" | "npm" | "yarn" | "bun";

const PKG_MANAGERS: PkgManager[] = ["pnpm", "npm", "yarn", "bun"];

function getInstallCommand(pkg: PkgManager, name: string) {
  const registry = `@bagui/${name}`;
  if (pkg === "pnpm") return `pnpm dlx shadcn@latest add ${registry}`;
  if (pkg === "yarn") return `yarn dlx shadcn@latest add ${registry}`;
  if (pkg === "bun") return `bunx --bun shadcn@latest add ${registry}`;
  return `npx shadcn@latest add ${registry}`;
}

function pascalCase(name: string) {
  return name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function getCodeSnippet(name: string) {
  const componentName = pascalCase(name);
  return `import { ${componentName} } from "@/components/templates/${name}";

export default function Page() {
  return (
    <main>
      <${componentName} />
    </main>
  );
}`;
}

function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), timeout);
  };
  return { copied, copy };
}

function TemplateCard({
  template,
}: {
  template: RegistryItem;
}) {
  const title = template.title || template.name;
  const accessTier = getComponentAccessTier(template);
  const [mode, setMode] = useState<ViewMode>("preview");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [pkg, setPkg] = useState<PkgManager>("npm");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { copied, copy } = useCopy();
  const { user, profile } = useAuth();
  const accessProfile = profile ?? user ?? null;
  const installState = getInstallAccessState(
    template,
    accessProfile,
    `/templates`,
  );
  const command = getInstallCommand(pkg, template.name);
  const code = useMemo(() => getCodeSnippet(template.name), [template.name]);

  const handleCopy = async () => {
    if (installState.action !== "install") return;
    void trackComponentDownload(template.name);
    await copy(command);
    posthog.capture("component_install_command_copied", {
      component_name: template.name,
      access_tier: accessTier,
      package_manager: pkg,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "80px" }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <article className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 px-5 pt-4">
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide ${
              accessTier === "pro"
                ? "border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                : "border border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
            }`}
          >
            {accessTier === "pro" ? "Pro" : "Free"}
          </span>
        </div>

        <div className="flex items-center gap-2 px-5 py-3 sm:gap-3">
          <div className="flex shrink-0 items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
              {(["preview", "code"] as ViewMode[]).map((itemMode) => (
                <button
                  key={itemMode}
                  onClick={() => setMode(itemMode)}
                  className={`flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-md px-2 py-1.5 text-xs font-medium transition-all ${
                    mode === itemMode
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {itemMode === "preview" ? (
                    <IconEye size={14} />
                  ) : (
                    <IconCode size={14} />
                  )}
                  <span className="hidden capitalize sm:inline">{itemMode}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() =>
                window.open(
                  `/fullscreen/${template.name}?from=templates`,
                  "_blank",
                )
              }
              className="hidden cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-accent sm:flex"
              title="Fullscreen"
            >
              <IconArrowsMaximize size={16} className="text-muted-foreground" />
            </button>

            <button
              onClick={() => setRefreshKey((value) => value + 1)}
              className="hidden cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-accent sm:flex"
              title="Refresh"
            >
              <IconRefresh size={16} className="text-muted-foreground" />
            </button>

            {mode === "preview" && (
              <button
                onClick={() =>
                  setDevice((value) =>
                    value === "mobile" ? "desktop" : "mobile",
                  )
                }
                className="hidden cursor-pointer items-center justify-center rounded-md p-2 transition-colors hover:bg-accent sm:flex"
                title={device === "mobile" ? "Desktop view" : "Mobile view"}
              >
                {device === "mobile" ? (
                  <IconDeviceDesktop size={16} className="text-muted-foreground" />
                ) : (
                  <IconDeviceMobile size={16} className="text-muted-foreground" />
                )}
              </button>
            )}
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:ml-auto sm:flex-initial sm:gap-3">
            {installState.action === "install" ? (
              <>
                <button
                  onClick={handleCopy}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent sm:hidden"
                >
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                  {copied ? "Copied!" : "Copy command"}
                </button>

                <div className="hidden min-w-0 flex-1 items-center gap-2 overflow-x-auto rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground sm:flex">
                  <span className="shrink-0 text-muted-foreground">{pkg}</span>
                  <code className="truncate">{command}</code>
                </div>

                <div className="relative shrink-0">
                  <button
                    onClick={() => setOpenDropdown((value) => !value)}
                    className="flex cursor-pointer items-center gap-1 rounded-lg border border-border bg-background p-2 transition-colors hover:bg-accent"
                    title="Change package manager"
                  >
                    <span className="text-xs font-medium text-muted-foreground sm:hidden">
                      {pkg}
                    </span>
                    <IconChevronDown size={16} className="text-muted-foreground" />
                  </button>

                  <AnimatePresence>
                    {openDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute right-0 top-full z-50 mt-1 min-w-max rounded-lg border border-border bg-popover shadow-lg"
                      >
                        {PKG_MANAGERS.map((itemPkg) => (
                          <button
                            key={itemPkg}
                            onClick={() => {
                              setPkg(itemPkg);
                              setOpenDropdown(false);
                            }}
                            className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs font-medium first:rounded-t-lg last:rounded-b-lg ${
                              pkg === itemPkg
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            }`}
                          >
                            <span>{itemPkg}</span>
                            {pkg === itemPkg && <IconCheck size={12} />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={handleCopy}
                  className="hidden cursor-pointer items-center justify-center rounded-md p-2.5 transition-colors hover:bg-accent sm:flex"
                  title={copied ? "Copied!" : "Copy command"}
                >
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                </button>
              </>
            ) : (
              <div className="flex h-[38px] min-w-0 flex-1 items-center justify-between gap-3 rounded-lg border border-border bg-muted pl-3 pr-1">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-foreground">
                    {installState.label}
                  </p>
                </div>
                <Link
                  href={installState.href}
                  className="inline-flex h-7 shrink-0 items-center justify-center rounded-full bg-foreground px-3 text-[11px] font-medium text-background"
                >
                  {installState.label}
                </Link>
              </div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mode === "preview" ? (
            <motion.div
              key={`preview-${refreshKey}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-1"
            >
              {device === "mobile" ? (
                <div className="mx-auto" style={{ width: 390, maxWidth: "100%" }}>
                  <iframe
                    src={`/fullscreen/${template.name}?from=templates`}
                    title={`Preview of ${template.title || template.name}`}
                    className="h-[500px] w-full border-0"
                    loading="lazy"
                  />
                </div>
              ) : (
                <ComponentPreview
                  item={template}
                  height={500}
                  alignStart
                  className="!rounded-xl"
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="code"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-1 pb-1"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-gray-950">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <span className="font-mono text-xs text-gray-500">page.tsx</span>
                  <button
                    onClick={() => void navigator.clipboard.writeText(code)}
                    className="flex cursor-pointer items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-white"
                  >
                    <IconCopy size={13} />
                    Copy
                  </button>
                </div>
                <pre className="overflow-x-auto p-5">
                  <code className="font-mono text-[13px] leading-relaxed text-gray-300">
                    {code}
                  </code>
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
