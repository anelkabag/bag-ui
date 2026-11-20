"use client";

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  IconEye,
  IconCode,
  IconArrowsMaximize,
  IconRefresh,
  IconChevronDown,
  IconCopy,
  IconCheck,
  IconDeviceMobile,
  IconDeviceDesktop,
} from "@tabler/icons-react";
import posthog from "posthog-js";

import type { RegistryItem } from "@/lib/block-categories";
import { getComponentAccessTier, getInstallAccessState } from "@/lib/access";
import { ComponentPreview } from "@/components/ComponentPreview";
import PnpmLogo from "@/public/assets/pnpm.svg";
import YarnLogo from "@/public/assets/yarn.svg";
import { useAuth } from "@/hooks/useAuth";
import { trackComponentDownload } from "@/lib/analytics";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TemplatePreviewProps {
  templates: RegistryItem[];
}

type ViewMode = "preview" | "code";
type DeviceMode = "desktop" | "mobile";
type PkgManager = "pnpm" | "npm" | "yarn" | "bun";
type AccessTier = "free" | "pro";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const PKG_MANAGERS: PkgManager[] = ["pnpm", "npm", "yarn", "bun"];

function getInstallCmd(pkg: PkgManager, name: string) {
  const registry = `@bagui/${name}`;
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

// ─── useInView hook (montage différé des previews hors écran) ────────────────

function useInView<T extends Element>(rootMargin = "400px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}

// ─── useCopy hook ─────────────────────────────────────────────────────────────

function useCopy(timeout = 1500) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), timeout);
  };
  return { copied, copy };
}

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Code block (toujours sombre, comme la page block) ───────────────────────

function CodeBlock({ code, isPro }: { code: string; isPro?: boolean }) {
  const { copied, copy } = useCopy();
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const accessProfile = profile ?? user ?? null;

  const handleCopy = (text: string) => {
    if (isPro) {
      const accessState = getInstallAccessState(
        { access: { tier: "pro" } },
        accessProfile,
        pathname ?? "/templates",
      );
      if (accessState.action !== "install") {
        window.location.href = accessState.href;
        return;
      }
    }
    copy(text);
  };

  return (
    <div className="relative rounded-xl border border-border bg-gray-950 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 gap-2 sm:gap-0">
        <span className="text-xs text-gray-500 font-mono">page.tsx</span>
        <button
          onClick={() => handleCopy(code)}
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

// ─── Iframe preview (vue mobile) ──────────────────────────────────────────────

function IframePreview({ name }: { name: string }) {
  return (
    <div
      className="relative w-full rounded-xl border border-border overflow-hidden bg-white"
      style={{ height: 500 }}
    >
      <iframe
        src={`/fullscreen/${name}?from=templates`}
        title={`Preview of ${name}`}
        className="w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
}

// ─── Package manager icons ────────────────────────────────────────────────────

const PKG_ICONS: Record<PkgManager, React.ReactNode> = {
  pnpm: <Image src={PnpmLogo} alt="pnpm" width={14} height={14} />,
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
  yarn: <Image src={YarnLogo} alt="yarn" width={14} height={14} />,
  bun: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width={14}
      height={14}
    >
      <path d="M113.744 41.999a18.558 18.558 0 0 0-.8-.772c-.272-.246-.528-.524-.8-.771s-.528-.525-.8-.771c-.272-.247-.528-.525-.8-.772s-.528-.524-.8-.771-.528-.525-.8-.772-.528-.524-.8-.771c7.936 7.52 12.483 17.752 12.656 28.481 0 25.565-26.912 46.363-60 46.363-18.528 0-35.104-6.526-46.128-16.756l.8.772.8.771.8.772.8.771.8.772.8.771.8.771c11.008 10.662 27.952 17.527 46.928 17.527 33.088 0 60-20.797 60-46.285 0-10.893-4.864-21.215-13.456-29.33z" />
      <path
        fill="#fbf0df"
        d="M116.8 65.08c0 23.467-25.072 42.49-56 42.49s-56-19.023-56-42.49c0-14.55 9.6-27.401 24.352-35.023C43.904 22.435 53.088 14.628 60.8 14.628S75.104 21 92.448 30.058C107.2 37.677 116.8 50.53 116.8 65.08Z"
      />
      <path
        fill="#f6dece"
        d="M116.8 65.08a32.314 32.314 0 0 0-1.28-8.918c-4.368 51.377-69.36 53.846-94.912 38.48 11.486 8.584 25.66 13.144 40.192 12.928 30.88 0 56-19.054 56-42.49z"
      />
      <path
        fill="#fffefc"
        d="M39.248 27.234c7.152-4.135 16.656-11.896 26-11.911a15.372 15.372 0 0 0-4.448-.695c-3.872 0-8 1.93-13.2 4.83-1.808 1.018-3.68 2.144-5.664 3.317-3.728 2.222-8 4.736-12.8 7.251C13.904 37.972 4.8 51.071 4.8 65.08v1.836c9.696-33.033 27.312-35.547 34.448-39.682z"
      />
      <path
        fill="#ccbea7"
        d="M56.192 18.532A24.553 24.553 0 0 1 53.867 29.1a25.407 25.407 0 0 1-6.683 8.671c-.448.386-.096 1.127.48.91 5.392-2.02 12.672-8.068 9.6-20.272-.128-.695-1.072-.51-1.072.123zm3.632 0a24.474 24.474 0 0 1 3.646 10.12c.445 3.587.08 7.224-1.07 10.662-.192.54.496 1.003.88.556 3.504-4.32 6.56-12.899-2.592-22.156-.464-.4-1.184.216-.864.756zm4.416-.262a25.702 25.702 0 0 1 7.521 7.925A24.71 24.71 0 0 1 75.2 36.414c-.016.13.02.26.101.365a.543.543 0 0 0 .718.117.509.509 0 0 0 .221-.313c1.472-5.384.64-14.564-11.472-19.332-.64-.246-1.056.587-.528.957zM34.704 34.315a27.418 27.418 0 0 0 9.91-5.222 26.262 26.262 0 0 0 6.842-8.663c.288-.556 1.2-.34 1.056.277-2.768 12.343-12.032 14.92-17.792 14.58-.608.016-.592-.802-.016-.972z"
      />
      <path d="M60.8 111.443c-33.088 0-60-20.798-60-46.363 0-15.429 9.888-29.823 26.448-38.448 4.8-2.469 8.912-4.953 12.576-7.128 2.016-1.203 3.92-2.33 5.76-3.379C51.2 12.916 56 10.771 60.8 10.771c4.8 0 8.992 1.852 14.24 4.845 1.6.88 3.2 1.836 4.912 2.885 3.984 2.376 8.48 5.06 14.4 8.131 16.56 8.625 26.448 23.004 26.448 38.448 0 25.565-26.912 46.363-60 46.363zm0-96.814c-3.872 0-8 1.928-13.2 4.829-1.808 1.018-3.68 2.144-5.664 3.317-3.728 2.222-8 4.736-12.8 7.251C13.904 37.972 4.8 51.071 4.8 65.08c0 23.436 25.12 42.506 56 42.506s56-19.07 56-42.506c0-14.01-9.104-27.108-24.352-35.023-6.048-3.086-10.768-5.986-14.592-8.27-1.744-1.033-3.344-1.99-4.8-2.838-4.848-2.778-8.384-4.32-12.256-4.32z" />
      <path
        fill="#b71422"
        d="M72.08 76.343c-.719 2.839-2.355 5.383-4.672 7.267a11.07 11.07 0 0 1-6.4 2.9 11.13 11.13 0 0 1-6.608-2.9c-2.293-1.892-3.906-4.436-4.608-7.267a1.073 1.073 0 0 1 .05-.5 1.11 1.11 0 0 1 .272-.428 1.19 1.19 0 0 1 .958-.322h19.744a1.185 1.185 0 0 1 .947.33 1.073 1.073 0 0 1 .317.92z"
      />
      <path
        fill="#ff6164"
        d="M54.4 83.733a11.24 11.24 0 0 0 6.592 2.932 11.239 11.239 0 0 0 6.576-2.932 16.652 16.652 0 0 0 1.6-1.65 10.904 10.904 0 0 0-3.538-2.564 11.26 11.26 0 0 0-4.302-1 10.121 10.121 0 0 0-4.549 1.192 9.71 9.71 0 0 0-3.451 3.097c.368.323.688.632 1.072.925z"
      />
      <path d="M54.656 82.514a8.518 8.518 0 0 1 2.97-2.347 8.836 8.836 0 0 1 3.734-.862 9.78 9.78 0 0 1 6.4 2.608c.368-.386.72-.787 1.056-1.188-2.035-1.87-4.726-2.933-7.536-2.978a10.487 10.487 0 0 0-4.335.975 10.125 10.125 0 0 0-3.489 2.666c.378.396.779.772 1.2 1.126z" />
      <path d="M60.944 87.436a12.078 12.078 0 0 1-7.12-3.086c-2.477-2.02-4.22-4.75-4.976-7.791-.054-.27-.045-.55.027-.817a1.83 1.83 0 0 1 .389-.726 2.25 2.25 0 0 1 .81-.595 2.32 2.32 0 0 1 .998-.192h19.744c.343-.007.683.06.996.196a2.3 2.3 0 0 1 .812.591c.182.212.313.46.382.728.07.267.076.545.018.815-.756 3.042-2.5 5.771-4.976 7.791a12.078 12.078 0 0 1-7.104 3.086zm-9.872-11.417c-.256 0-.32.108-.336.139.676 2.638 2.206 4.999 4.368 6.742a10.122 10.122 0 0 0 5.84 2.7 10.207 10.207 0 0 0 5.84-2.67c2.155-1.745 3.679-4.106 4.352-6.741a.333.333 0 0 0-.14-.113.348.348 0 0 0-.18-.026z" />
      <path
        fill="#febbd0"
        d="M85.152 77.3c5.17 0 9.36-2.377 9.36-5.308s-4.19-5.307-9.36-5.307c-5.17 0-9.36 2.376-9.36 5.307 0 2.931 4.19 5.307 9.36 5.307zm-48.432 0c5.17 0 9.36-2.377 9.36-5.308s-4.19-5.307-9.36-5.307c-5.17 0-9.36 2.376-9.36 5.307 0 2.931 4.19 5.307 9.36 5.307z"
      />
      <path d="M41.12 69.863a9.052 9.052 0 0 0 4.902-1.425 8.578 8.578 0 0 0 3.254-3.812 8.22 8.22 0 0 0 .508-4.913 8.41 8.41 0 0 0-2.408-4.357 8.92 8.92 0 0 0-4.514-2.33 9.12 9.12 0 0 0-5.096.48 8.755 8.755 0 0 0-3.96 3.131 8.287 8.287 0 0 0-1.486 4.725c0 2.252.927 4.412 2.577 6.005 1.65 1.594 3.888 2.492 6.223 2.496zm39.632 0a9.054 9.054 0 0 0 4.915-1.403 8.582 8.582 0 0 0 3.275-3.802 8.22 8.22 0 0 0 .528-4.917 8.408 8.408 0 0 0-2.398-4.368 8.92 8.92 0 0 0-4.512-2.344 9.12 9.12 0 0 0-5.103.473 8.756 8.756 0 0 0-3.967 3.13 8.287 8.287 0 0 0-1.49 4.73c-.004 2.245.914 4.4 2.555 5.994 1.64 1.593 3.869 2.495 6.197 2.507z" />
      <path
        fill="#fff"
        d="M38.4 61.902a3.4 3.4 0 0 0 1.844-.531c.547-.35.974-.847 1.227-1.43a3.088 3.088 0 0 0 .195-1.847 3.16 3.16 0 0 0-.902-1.639 3.351 3.351 0 0 0-1.696-.878 3.426 3.426 0 0 0-1.916.179 3.29 3.29 0 0 0-1.489 1.176 3.113 3.113 0 0 0-.559 1.776c0 .844.347 1.654.964 2.253a3.374 3.374 0 0 0 2.332.94zm39.632 0a3.4 3.4 0 0 0 1.844-.531c.547-.35.974-.847 1.227-1.43a3.088 3.088 0 0 0 .195-1.847 3.16 3.16 0 0 0-.902-1.639 3.351 3.351 0 0 0-1.696-.878 3.426 3.426 0 0 0-1.916.179 3.29 3.29 0 0 0-1.489 1.176 3.113 3.113 0 0 0-.559 1.776c0 .84.342 1.644.953 2.242.61.598 1.44.94 2.311.952z"
      />
    </svg>
  ),
};

// ─── Toolbar header (Preview / Code + CLI) ────────────────────────────────────

const TemplateToolbarHeader = memo(function TemplateToolbarHeader({
  name,
  mode,
  setMode,
  device,
  toggleDevice,
  onRefresh,
  accessTier,
}: {
  name: string;
  mode: ViewMode;
  setMode: (m: ViewMode) => void;
  device: DeviceMode;
  toggleDevice: () => void;
  onRefresh: () => void;
  accessTier: AccessTier;
}) {
  const [pkg, setPkg] = useState<PkgManager>("npm");
  const [openDropdown, setOpenDropdown] = useState(false);
  const cmd = getInstallCmd(pkg, name);
  const { copied, copy } = useCopy();
  const { user, profile } = useAuth();
  const pathname = usePathname();
  const accessProfile = profile ?? user ?? null;
  const installState = getInstallAccessState(
    { access: { tier: accessTier } },
    accessProfile,
    pathname ?? "/templates",
  );

  const handleCopy = async (text: string) => {
    if (installState.action !== "install") return;

    void trackComponentDownload(name);
    await copy(text);
    posthog.capture("component_install_command_copied", {
      component_name: name,
      access_tier: accessTier,
      package_manager: pkg,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="flex items-center gap-2 px-5 py-3 sm:gap-3"
    >
      {/* Left: Tabs + Icons */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1">
          {(["preview", "code"] as ViewMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                mode === m
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "preview" ? <IconEye size={14} /> : <IconCode size={14} />}
              <span className="hidden sm:inline capitalize">{m}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            window.open(`/fullscreen/${name}?from=templates`, "_blank")
          }
          className="hidden sm:flex p-2 hover:bg-accent rounded-md transition-colors cursor-pointer items-center justify-center"
          title="Fullscreen"
        >
          <IconArrowsMaximize size={16} className="text-muted-foreground" />
        </button>

        <button
          onClick={onRefresh}
          className="hidden sm:flex p-2 hover:bg-accent rounded-md transition-colors cursor-pointer items-center justify-center"
          title="Refresh"
        >
          <IconRefresh size={16} className="text-muted-foreground" />
        </button>

        {mode === "preview" && (
          <button
            onClick={toggleDevice}
            className="hidden sm:flex p-2 hover:bg-accent rounded-md transition-colors cursor-pointer items-center justify-center"
            title={device === "mobile" ? "Desktop view" : "Mobile view"}
            aria-label={device === "mobile" ? "Desktop view" : "Mobile view"}
          >
            {device === "mobile" ? (
              <IconDeviceDesktop size={16} className="text-muted-foreground" />
            ) : (
              <IconDeviceMobile size={16} className="text-muted-foreground" />
            )}
          </button>
        )}
      </div>

      {/* Right: CLI Command + Dropdown + Copy */}
      <div className="flex-1 sm:flex-initial sm:ml-auto flex items-center gap-2 sm:gap-3">
        {installState.action === "install" ? (
          <>
            {/* MOBILE */}
            <button
              onClick={() => handleCopy(cmd)}
              className="sm:hidden flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              <span>{copied ? "Copied!" : "Copy command"}</span>
            </button>

            {/* DESKTOP */}
            <div className="hidden sm:flex flex-1 items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-xs font-mono text-foreground overflow-x-auto min-w-0">
              <div className="w-4 h-4 flex items-center justify-center shrink-0">
                {PKG_ICONS[pkg]}
              </div>
              <code className="truncate">{cmd}</code>
            </div>

            <div className="relative shrink-0">
              <button
                onClick={() => setOpenDropdown(!openDropdown)}
                className="flex items-center gap-1 p-2 hover:bg-accent rounded-lg transition-colors border border-border bg-background cursor-pointer"
                title="Change package manager"
              >
                <span className="sm:hidden w-4 h-4 flex items-center justify-center">
                  {PKG_ICONS[pkg]}
                </span>
                <IconChevronDown size={16} className="text-muted-foreground" />
              </button>

              <AnimatePresence>
                {openDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 right-0 bg-popover border border-border rounded-lg shadow-lg z-50 min-w-max"
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
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          {PKG_ICONS[p]}
                        </div>
                        <span>{p}</span>
                        {pkg === p && (
                          <IconCheck
                            size={12}
                            className="ml-auto text-muted-foreground"
                          />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleCopy(cmd)}
              className="hidden sm:flex p-2.5 hover:bg-accent rounded-md transition-colors cursor-pointer items-center justify-center"
              title={copied ? "Copied!" : "Copy command"}
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </button>
          </>
        ) : (
          <div className="flex h-[38px] flex-1 min-w-0 items-center justify-between gap-3 rounded-lg border border-border bg-muted pl-3 pr-1">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold leading-tight text-foreground">
                {installState.label}
              </p>
              <p className="hidden truncate text-[11px] leading-tight text-muted-foreground sm:block">
                {installState.description}
              </p>
            </div>
            <Link
              href={installState.href}
              className="inline-flex h-7 shrink-0 items-center justify-center rounded-full bg-foreground px-3 text-[11px] font-medium text-background transition-colors hover:bg-foreground/90"
            >
              {installState.label}
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// ─── Individual template card ─────────────────────────────────────────────────

const TemplateCard = memo(function TemplateCard({
  template,
  index,
}: {
  template: RegistryItem;
  index: number;
}) {
  const title = template.title || template.name;
  const accessTier = getComponentAccessTier(template) as AccessTier;

  const [mode, setMode] = useState<ViewMode>("preview");
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [refreshKey, setRefreshKey] = useState(0);
  const toggleDevice = useCallback(
    () => setDevice((d) => (d === "mobile" ? "desktop" : "mobile")),
    [],
  );
  const onRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);
  const code = useMemo(
    () => (mode === "code" ? getCodeSnippet(template.name) : ""),
    [mode, template.name],
  );
  const { ref: previewRef, inView } = useInView<HTMLDivElement>();

  return (
    <motion.div
      id={template.name}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 5) * 0.05, duration: 0.3 }}
      className="scroll-mt-20"
    >
      {/* Title + Badge above toolbar */}
      <div className="flex items-center gap-2 px-5 pt-2">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
            accessTier === "pro"
              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
              : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
          }`}
        >
          {accessTier === "pro" ? "Pro" : "Free"}
        </span>
      </div>

      <TemplateToolbarHeader
        name={template.name}
        mode={mode}
        setMode={setMode}
        device={device}
        toggleDevice={toggleDevice}
        onRefresh={onRefresh}
        accessTier={accessTier}
      />

      {/* Content */}
      <AnimatePresence mode="wait">
        {mode === "preview" ? (
          <motion.div
            key={`preview-${refreshKey}`}
            ref={previewRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-1"
            style={inView ? undefined : { minHeight: 500 }}
          >
            {!inView ? null : device === "mobile" ? (
              <div className="mx-auto" style={{ width: 390, maxWidth: "100%" }}>
                <IframePreview name={template.name} />
              </div>
            ) : (
              <ComponentPreview item={template} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="code"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-1"
          >
            <CodeBlock code={code} isPro={accessTier === "pro"} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

// ─── Export ───────────────────────────────────────────────────────────────────

export function TemplatePreview({ templates }: TemplatePreviewProps) {
  return (
    <section
      aria-label="Template gallery"
      className="flex flex-col gap-10"
    >
      {templates.map((template, i) => (
        <TemplateCard key={template.name} template={template} index={i} />
      ))}
    </section>
  );
}