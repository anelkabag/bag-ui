"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";
import { Check, Copy } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "pnpm" | "npm" | "bun" | "yarn";
type Framework =
  | "next"
  | "vite"
  | "tanstack"
  | "laravel"
  | "react-router"
  | "astro";
type Section = { id: string; label: string };
type DocsPage = "installation" | "contributing" | "mcp" | "extension";

// ─── Data ─────────────────────────────────────────────────────────────────────
// "On this page" pour la page Installation — ne contient PAS Contributing.
const INSTALLATION_SECTIONS: Section[] = [
  { id: "introduction", label: "Introduction" },
  { id: "create-app", label: "Create your app" },
  { id: "requirements", label: "Requirements" },
  { id: "register-namespace", label: "Register the namespace" },
  { id: "install-a-block", label: "Install a free block" },
  { id: "customization", label: "Customization" },
  { id: "dark-mode", label: "Dark mode" },
  { id: "updates", label: "Updates" },
  { id: "support", label: "Support" },
];

// "On this page" pour la page Contribution — totalement séparée de l'installation.
const CONTRIBUTING_SECTIONS: Section[] = [
  { id: "contributing-overview", label: "Overview" },
  { id: "clone-repo", label: "Clone the repository" },
  { id: "create-branch", label: "Create a branch" },
  { id: "add-component", label: "Add your component" },
  { id: "register-json", label: "Register in registry.json" },
  { id: "verify-build", label: "Verify & build" },
];

const MCP_SECTIONS: Section[] = [
  { id: "mcp-overview", label: "What is MCP?" },
  { id: "mcp-features", label: "What BagUI MCP can do" },
  { id: "mcp-remote", label: "Remote server URL" },
  { id: "mcp-clients", label: "Connect an AI client" },
  { id: "mcp-build", label: "Run the server locally" },
  { id: "mcp-connect", label: "Connect locally to VS Code" },
  { id: "mcp-use", label: "Use the tools" },
];

const EXTENSION_SECTIONS: Section[] = [
  { id: "extension-overview", label: "What is the extension?" },
  { id: "extension-install", label: "Install the extension" },
  { id: "extension-use", label: "Browse and install components" },
  { id: "extension-requirements", label: "Requirements" },
];

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
const SIDEBAR_NAV: {
  group: string;
  pages: { label: string; page: DocsPage }[];
}[] = [
  {
    group: "Getting Started",
    pages: [
      { label: "Installations", page: "installation" },
      { label: "Contribution", page: "contributing" },
    ],
  },
  {
    group: "Resources",
    pages: [
      { label: "MCP", page: "mcp" },
      { label: "VS Code extension", page: "extension" },
    ],
  },
];

const DOCS_PAGE_CONTENT: Record<
  DocsPage,
  {
    firstLine: string;
    secondLine: string;
    emphasis: string;
    description: string;
  }
> = {
  installation: {
    firstLine: "Ready-made blocks.",
    secondLine: "Zero wasted",
    emphasis: "time.",
    description:
      "Register BagUI once and pull any block directly into your project with a single CLI command.",
  },
  contributing: {
    firstLine: "Build with us.",
    secondLine: "Ship a",
    emphasis: "block.",
    description:
      "BagUI is open source. Here's everything you need to add a component and get it merged.",
  },
  mcp: {
    firstLine: "BagUI MCP.",
    secondLine: "Your AI assistant,",
    emphasis: "connected.",
    description:
      "Discover BagUI components, inspect their source, and get installation commands directly from an MCP-compatible client.",
  },
  extension: {
    firstLine: "BagUI for VS Code.",
    secondLine: "Components, right in",
    emphasis: "your editor.",
    description:
      "Browse, search, preview, and install BagUI components without leaving Visual Studio Code.",
  },
};

// ─── Code snippets ────────────────────────────────────────────────────────────
const INIT_CMDS: Record<Tab, string> = {
  pnpm: "pnpm dlx shadcn@latest init",
  npm: "npx shadcn@latest init",
  bun: "bunx shadcn@latest init",
  yarn: "yarn dlx shadcn@latest init",
};
const INSTALL_CMDS: Record<Tab, string> = {
  pnpm: "pnpm dlx shadcn@latest add @bagui/hero-01",
  npm: "npx shadcn@latest add @bagui/hero-01",
  bun: "bunx shadcn@latest add @bagui/hero-01",
  yarn: "yarn dlx shadcn@latest add @bagui/hero-01",
};
const UPDATE_CMDS: Record<Tab, string> = {
  pnpm: "pnpm dlx shadcn@latest add @bagui/hero-01",
  npm: "npx shadcn@latest add @bagui/hero-01",
  bun: "bunx shadcn@latest add @bagui/hero-01",
  yarn: "yarn dlx shadcn@latest add @bagui/hero-01",
};
const REGISTRY_JSON = `{
  "registries": {
    "@bagui": "https://bagui.pro/r/{name}.json"
  }
}`;

// ─── Framework scaffolding ──────────────────────────────────────────────────────
const FRAMEWORKS: {
  key: Framework;
  label: string;
  blurb: string;
  note: string;
  docsHref: string;
  docsLabel: string;
}[] = [
  {
    key: "next",
    label: "Next.js",
    blurb: "A React framework with file-system routing and server rendering.",
    note: "Choose the recommended defaults when prompted — TypeScript, Tailwind CSS and the App Router are all BagUI needs.",
    docsHref: "https://nextjs.org/docs/app/getting-started/installation",
    docsLabel: "Next.js",
  },
  {
    key: "vite",
    label: "Vite",
    blurb: "A fast, lightweight build tool for a plain React single-page app.",
    note: "Pick the React + TypeScript template — shadcn/ui needs TypeScript to generate typed components.",
    docsHref: "https://vite.dev/guide/",
    docsLabel: "Vite",
  },
  {
    key: "tanstack",
    label: "TanStack Start",
    blurb: "A full-stack React framework built on TanStack Router.",
    note: "In the prompts, choose TanStack Start, the React framework, and the recommended defaults. Skip the shadcn add-on — you'll wire it up in the next step.",
    docsHref: "https://tanstack.com/start/latest",
    docsLabel: "TanStack",
  },
  {
    key: "laravel",
    label: "Laravel",
    blurb: "A PHP framework, paired with React and Inertia for the frontend.",
    note: "Choose the React starter kit when prompted so Inertia and React are wired up for you.",
    docsHref: "https://laravel.com/framework/docs/installation",
    docsLabel: "Laravel",
  },
  {
    key: "react-router",
    label: "React Router",
    blurb: "React Router in Framework Mode — routing, loaders and SSR out of the box.",
    note: "This scaffolds Tailwind CSS and the ~/* import alias for you automatically.",
    docsHref: "https://reactrouter.com/home",
    docsLabel: "React Router",
  },
  {
    key: "astro",
    label: "Astro",
    blurb: "A content-focused framework that ships minimal JavaScript by default.",
    note: "Say yes to TypeScript and add the React integration when prompted — shadcn/ui components need it to render.",
    docsHref: "https://docs.astro.build/en/getting-started/",
    docsLabel: "Astro",
  },
];

const FRAMEWORK_CREATE_CMDS: Record<Framework, Record<Tab, string> | string> =
  {
    next: {
      pnpm: "pnpm create next-app@latest my-app",
      npm: "npx create-next-app@latest my-app",
      bun: "bun create next-app my-app",
      yarn: "yarn create next-app my-app",
    },
    vite: {
      pnpm: "pnpm create vite@latest my-app -- --template react-ts",
      npm: "npm create vite@latest my-app -- --template react-ts",
      bun: "bun create vite my-app --template react-ts",
      yarn: "yarn create vite my-app --template react-ts",
    },
    tanstack: {
      pnpm: "pnpm dlx @tanstack/cli@latest create",
      npm: "npx @tanstack/cli@latest create",
      bun: "bunx @tanstack/cli@latest create",
      yarn: "yarn dlx @tanstack/cli@latest create",
    },
    laravel: "composer global require laravel/installer\nlaravel new my-app",
    "react-router": {
      pnpm: "pnpm create react-router@latest my-app",
      npm: "npx create-react-router@latest my-app",
      bun: "bun create react-router my-app",
      yarn: "yarn create react-router my-app",
    },
    astro: {
      pnpm: "pnpm create astro@latest my-app",
      npm: "npm create astro@latest my-app",
      bun: "bun create astro my-app",
      yarn: "yarn create astro my-app",
    },
  };

// Flag to pass to `shadcn init` for a setup tailored to each framework.
// Laravel has no flag — the CLI auto-detects it from the project root.
const FRAMEWORK_INIT_FLAG: Partial<Record<Framework, string>> = {
  next: "-t next",
  vite: "-t vite",
  tanstack: "-t start",
  "react-router": "-t react-router",
  astro: "-t astro",
};

// ─── Contributing snippets ─────────────────────────────────────────────────────
const CONTRIB_CLONE_CMD = `git clone https://github.com/anelkabag/bagui.git
cd bagui`;

const CONTRIB_BRANCH_CMD = "git checkout -b feat/my-new-component";

const CONTRIB_COMPONENT_CODE = `export default function Navbar1() {
  return (
    <nav className="flex items-center justify-between p-4">
      <div className="font-semibold">BagUi</div>
      <div className="flex gap-3">Home</div>
    </nav>
  );
}`;

const CONTRIB_REGISTRY_JSON = `{
  "name": "navbar1",
  "type": "registry:block",
  "title": "Navbar Example 1",
  "description": "Modern and responsive navigation.",
  "files": [
    {
      "path": "registry/default/blocks/navbar/navbar1.tsx",
      "type": "registry:block",
      "target": "components/blocks/navbar1.tsx"
    }
  ],
  "access": {
    "tier": "free"
  }
}`;

const CONTRIB_BUILD_CMD = `npm run build
npm run registry:build`;

const MCP_BUILD_CMD = `git clone https://github.com/anelkabag/bag-ui.git
cd bag-ui/mcp
npm install
npm run build`;

const MCP_VSCODE_CONFIG = `{
  "servers": {
    "bagui": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/bag-ui/mcp/dist/index.js"]
    }
  }
}`;

const MCP_REMOTE_URL = "https://mcp.bagui.pro/mcp";

const MCP_CLAUDE_CODE_CMD = `claude mcp add --transport http bagui ${MCP_REMOTE_URL}
claude mcp list`;

const MCP_CLAUDE_DESKTOP_STEPS = `Claude Desktop → Settings → Connectors → Add custom connector
Server URL: ${MCP_REMOTE_URL}`;

const MCP_CURSOR_CONFIG = `{
  "mcpServers": {
    "bagui": {
      "url": "${MCP_REMOTE_URL}"
    }
  }
}`;

const MCP_REMOTE_VSCODE_CONFIG = `{
  "servers": {
    "bagui": {
      "type": "http",
      "url": "${MCP_REMOTE_URL}"
    }
  }
}`;

const MCP_GEMINI_CONFIG = `{
  "mcpServers": {
    "bagui": {
      "httpUrl": "${MCP_REMOTE_URL}"
    }
  }
}`;

const PACKAGE_MANAGER_LOGOS: Record<Exclude<Tab, "bun">, string> = {
  pnpm: "/assets/pnpm.svg",
  npm: "/assets/npm.svg",
  yarn: "/assets/yarn.svg",
};

function CodeContent({ code }: { code: string }) {
  const tokenPattern =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\/[^\n]*|#[^\n]*|\b(?:const|let|var|function|return|export|default|import|from|as|async|await|true|false|null|undefined|new|if|else)\b|\b\d+\b)/g;
  const tokens: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(code.slice(lastIndex, match.index));
    }

    const token = match[0];
    const className =
      token.startsWith("//") || token.startsWith("#")
        ? "text-zinc-500"
        : /^["'`]/.test(token)
          ? "text-emerald-300"
          : /^\d/.test(token) || /^(true|false|null|undefined)$/.test(token)
            ? "text-amber-300"
            : "text-violet-300";

    tokens.push(
      <span key={match.index} className={className}>
        {token}
      </span>,
    );
    lastIndex = tokenPattern.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push(code.slice(lastIndex));
  }

  return <>{tokens}</>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCS COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function CodeBlock({
  tabs,
  cmds,
  mono = false,
  content,
  lang = "json",
}: {
  tabs?: Tab[];
  cmds?: Record<Tab, string>;
  mono?: boolean;
  content?: string;
  lang?: string;
}) {
  const [active, setActive] = useState<Tab>("pnpm");
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const code = content ?? cmds?.[active] ?? "";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFailed(false);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error("Failed to copy documentation snippet:", error);
      setCopied(false);
      setCopyFailed(true);
      window.setTimeout(() => setCopyFailed(false), 1800);
    }
  };

  return (
    <div className="group my-5 overflow-hidden rounded-xl border border-border bg-[#18181b] shadow-sm">
      {tabs && (
        <div className="flex items-center gap-1 border-b border-white/10 bg-[#202023] px-2 py-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                active === t
                  ? "bg-white/10 text-white"
                  : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
              }`}
            >
              {t === "bun" ? (
                <span className="flex size-4 items-center justify-center rounded-full bg-[#f9f1e1] text-[10px] font-bold text-[#141414]">
                  B
                </span>
              ) : (
                <Image
                  src={PACKAGE_MANAGER_LOGOS[t]}
                  alt=""
                  width={16}
                  height={16}
                  className="size-4 object-contain"
                />
              )}
              {t}
            </button>
          ))}
        </div>
      )}
      {!tabs && mono && (
        <div className="flex items-center justify-between border-b border-white/10 bg-[#202023] px-4 py-2.5">
          <span className="text-xs font-mono text-zinc-400">{lang}</span>
        </div>
      )}
      <div className="relative">
        <pre className="overflow-x-auto whitespace-pre p-4 pr-24 font-mono text-sm leading-relaxed text-zinc-200">
          <code>
            <CodeContent code={code} />
          </code>
        </pre>
        <button
          type="button"
          onClick={() => void copy()}
          aria-label={copied ? "Copied" : copyFailed ? "Copy failed" : "Copy code"}
          className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs shadow-sm transition-colors ${
            copied
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
              : copyFailed
                ? "border-rose-500/40 bg-rose-500/15 text-rose-300"
                : "border-white/10 bg-[#27272a] text-zinc-400 hover:text-white"
          }`}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : copyFailed ? "Failed" : "Copy"}
        </button>
      </div>
    </div>
  );
}

function FrameworkPicker({
  active,
  onSelect,
}: {
  active: Framework;
  onSelect: (framework: Framework) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 my-5">
      {FRAMEWORKS.map((fw) => (
        <button
          key={fw.key}
          onClick={() => onSelect(fw.key)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
            active === fw.key
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/40"
          }`}
        >
          {fw.label}
        </button>
      ))}
    </div>
  );
}

function SectionHeading({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="text-foreground text-xl font-semibold mt-14 mb-4 scroll-mt-20 flex items-center gap-2 group"
    >
      <a
        href={`#${id}`}
        className="opacity-0 group-hover:opacity-30 transition-opacity text-foreground text-base"
      >
        #
      </a>
      {children}
    </h2>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-muted-foreground text-[0.925rem] leading-7">
      {children}
    </p>
  );
}

// Petite classe partagée pour le code inline dans le texte (inchangée en logique, juste stylée pour le dark mode)
const inlineCode =
  "text-foreground bg-muted rounded px-1.5 py-0.5 text-xs font-mono";

// Shared style for inline text links inside Prose paragraphs.
const textLink =
  "text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity";

// ─── Guide navigation ─────────────────────────────────────────────────────────
function DocsGuideNavigation({
  activePage,
  onSelectPage,
}: {
  activePage: DocsPage;
  onSelectPage: (page: DocsPage) => void;
}) {
  return (
    <nav
      aria-label="Documentation guides"
      className="flex w-fit max-w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-muted/40 p-1 xl:sticky xl:top-8 xl:w-full xl:flex-col xl:items-stretch xl:gap-5 xl:self-start xl:overflow-visible xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0"
    >
      {SIDEBAR_NAV.map((group) => (
        <div
          key={group.group}
          className="flex shrink-0 items-center gap-1 xl:block"
        >
          <p className="mb-2 hidden px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground xl:block">
            {group.group}
          </p>
          <ul className="flex items-center gap-1 xl:block xl:space-y-0.5">
            {group.pages.map((page) => (
              <li key={page.page}>
                <button
                  type="button"
                  onClick={() => onSelectPage(page.page)}
                  aria-pressed={activePage === page.page}
                  className={`relative isolate w-full shrink-0 rounded-full px-3.5 py-2 text-left text-sm font-medium transition-colors xl:rounded-lg xl:px-3 ${
                    activePage === page.page
                      ? "text-background xl:text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {activePage === page.page && (
                    <motion.span
                      layoutId="docs-page-indicator"
                      className="absolute inset-0 z-0 rounded-full bg-foreground xl:rounded-lg xl:bg-accent"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 34,
                        mass: 0.7,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative z-10">{page.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

// ─── Right TOC ────────────────────────────────────────────────────────────────
function TOC({ sections, active }: { sections: Section[]; active: string }) {
  return (
    <nav className="sticky top-20 hidden xl:block self-start">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
        On this page
      </p>
      <ul className="space-y-1.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`block text-[13px] transition-colors py-0.5 ${
                active === s.id
                  ? "text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground/80"
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// DOCS PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function DocsPage() {
  const [activePage, setActivePage] = useState<DocsPage>("installation");
  const [activeSection, setActiveSection] = useState("introduction");
  const [framework, setFramework] = useState<Framework>("next");
  const tabs: Tab[] = ["pnpm", "npm", "bun", "yarn"];
  const selectedFramework = FRAMEWORKS.find((f) => f.key === framework)!;
  const frameworkCreateCmd = FRAMEWORK_CREATE_CMDS[framework];
  const frameworkInitFlag = FRAMEWORK_INIT_FLAG[framework];

  const sections =
    activePage === "installation"
      ? INSTALLATION_SECTIONS
      : activePage === "contributing"
        ? CONTRIBUTING_SECTIONS
        : activePage === "mcp"
          ? MCP_SECTIONS
          : EXTENSION_SECTIONS;
  const heroContent = DOCS_PAGE_CONTENT[activePage];

  const handleSelectPage = (page: DocsPage) => {
    setActivePage(page);
    setActiveSection(
      page === "installation"
        ? "introduction"
        : page === "contributing"
          ? "contributing-overview"
          : page === "mcp"
            ? "mcp-overview"
            : "extension-overview",
    );
    const hash =
      page === "mcp" ? "#mcp" : page === "extension" ? "#extension" : "";
    if (hash) {
      window.history.replaceState(null, "", hash);
    } else if (
      window.location.hash === "#mcp" ||
      window.location.hash === "#extension"
    ) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    document.getElementById("main")?.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const selectPageFromHash = () => {
      if (window.location.hash === "#mcp") {
        setActivePage("mcp");
        setActiveSection("mcp-overview");
      } else if (window.location.hash === "#extension") {
        setActivePage("extension");
        setActiveSection("extension-overview");
      }
    };

    selectPageFromHash();
    window.addEventListener("hashchange", selectPageFromHash);
    return () => window.removeEventListener("hashchange", selectPageFromHash);
  }, []);

  useEffect(() => {
    let lastUpdate = 0;
    const updateActive = () => {
      const now = Date.now();
      if (now - lastUpdate < 100) return;
      lastUpdate = now;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.3) {
          setActiveSection(section.id);
        }
      }
    };

    const scrollContainer = document.getElementById("main");
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", updateActive, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", updateActive);
  }, [sections]);

  return (
    <AppShell>
      <div className="mx-auto min-h-full max-w-[1440px] bg-background pb-12 text-foreground">
        <PageHero
          firstLine={heroContent.firstLine}
          secondLine={heroContent.secondLine}
          emphasis={heroContent.emphasis}
          className="pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]"
        >
          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            {heroContent.description}
          </p>
        </PageHero>

        <div className="mx-5 mt-8 grid grid-cols-1 gap-8 md:mx-10 xl:grid-cols-[180px_minmax(0,760px)_180px] xl:justify-center xl:gap-10">
          <DocsGuideNavigation
            activePage={activePage}
            onSelectPage={handleSelectPage}
          />

          <div className="mx-auto w-full min-w-0 max-w-[760px]">
            {activePage === "installation" && (
              <>
                {/* Introduction */}
                <section id="introduction">
                  <SectionHeading id="introduction">
                    Introduction
                  </SectionHeading>
                  <Prose>
                    BagUI is a growing library of carefully crafted React
                    blocks built on shadcn/ui and Tailwind CSS. Interactive
                    sections may include Framer Motion or GSAP animations, while
                    every block remains fully customizable and installable
                    through the BagUI registry with a single CLI command.
                  </Prose>
                </section>

                {/* Create your app */}
                <section id="create-app">
                  <SectionHeading id="create-app">
                    Create your app
                  </SectionHeading>
                  <Prose>
                    Starting from zero? Pick your framework below, run the
                    scaffold command, then jump to{" "}
                    <a href="#requirements" className={textLink}>
                      Requirements
                    </a>{" "}
                    to wire up shadcn/ui. Already have a project with
                    shadcn/ui configured? Skip straight to Requirements —
                    nothing in this section applies to you.
                  </Prose>

                  <FrameworkPicker active={framework} onSelect={setFramework} />

                  <p className="text-muted-foreground text-[0.925rem] leading-7 mt-1">
                    {selectedFramework.blurb}
                  </p>

                  {typeof frameworkCreateCmd === "string" ? (
                    <CodeBlock
                      mono
                      lang="bash"
                      content={frameworkCreateCmd}
                    />
                  ) : (
                    <CodeBlock cmds={frameworkCreateCmd} tabs={tabs} />
                  )}

                  <p className="text-muted-foreground text-[0.85rem] leading-6 mt-3">
                    {selectedFramework.note}{" "}
                    <a
                      href={selectedFramework.docsHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={textLink}
                    >
                      {selectedFramework.docsLabel} docs ↗
                    </a>
                  </p>
                </section>

                {/* Requirements */}
                <section id="requirements">
                  <SectionHeading id="requirements">
                    Requirements
                  </SectionHeading>
                  <Prose>
                    Your project should run React 19, Tailwind CSS v4 and
                    shadcn/ui. Coming from the framework guide above? Run this
                    from your new project&apos;s root — same command, no
                    flags needed. Already have shadcn/ui running? You can
                    skip straight to{" "}
                    <a href="#register-namespace" className={textLink}>
                      Register the namespace
                    </a>
                    .
                  </Prose>
                  <CodeBlock cmds={INIT_CMDS} tabs={tabs} />
                  <p className="text-muted-foreground text-[0.85rem] leading-6 mt-3">
                    Tip: for a setup tailored to your framework, add the
                    matching flag
                    {frameworkInitFlag ? (
                      <>
                        {" "}
                        — for {selectedFramework.label}, that&apos;s{" "}
                        <code className={inlineCode}>
                          {frameworkInitFlag}
                        </code>
                      </>
                    ) : (
                      ""
                    )}
                    :{" "}
                    <code className={inlineCode}>-t next</code>,{" "}
                    <code className={inlineCode}>-t vite</code>,{" "}
                    <code className={inlineCode}>-t start</code>,{" "}
                    <code className={inlineCode}>-t react-router</code> or{" "}
                    <code className={inlineCode}>-t astro</code>. Laravel
                    doesn&apos;t use a flag — the CLI detects it
                    automatically.
                  </p>
                </section>

                {/* Register namespace */}
                <section id="register-namespace">
                  <SectionHeading id="register-namespace">
                    Register the namespace
                  </SectionHeading>
                  <Prose>
                    Add the BagUI registry to your project&apos;s{" "}
                    <code className={inlineCode}>components.json</code> so the
                    shadcn CLI knows where to fetch the blocks from. You only do
                    this once per project — no API key needed for free blocks.
                  </Prose>
                  <CodeBlock mono content={REGISTRY_JSON} />
                </section>

                {/* Install a block */}
                <section id="install-a-block">
                  <SectionHeading id="install-a-block">
                    Install a free block
                  </SectionHeading>
                  <Prose>
                    Once the registry is wired, install any free block by its
                    id. The CLI fetches the source, pulls the missing shadcn
                    primitives and writes the file under{" "}
                    <code className={inlineCode}>components/blocks/</code>.
                  </Prose>
                  <CodeBlock cmds={INSTALL_CMDS} tabs={tabs} />
                  <ol className="mt-6 space-y-3">
                    {[
                      "Pick a block in /blocks and copy its id (e.g. hero-01).",
                      "Run the install command above with your package manager of choice.",
                      "Import the default export from components/blocks/<id>.tsx and render it.",
                      "Replace the placeholder copy, links and brand colors.",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-border bg-muted flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground text-sm leading-6">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Customization */}
                <section id="customization">
                  <SectionHeading id="customization">
                    Customization
                  </SectionHeading>
                  <Prose>
                    Blocks ship in plain JSX with utility classes only. Change
                    copy, swap icons from{" "}
                    <code className={inlineCode}>lucide-react</code>, restyle
                    with your own Tailwind tokens or refactor the markup — there
                    is no abstraction in the way.
                  </Prose>
                  <p className="text-muted-foreground text-[0.925rem] leading-7 mt-3">
                    If you replace lucide-react with another icon library,
                    search and replace the imports. The semantics are kept
                    generic so other libraries plug in easily.
                  </p>
                </section>

                {/* Dark mode */}
                <section id="dark-mode">
                  <SectionHeading id="dark-mode">Dark mode</SectionHeading>
                  <Prose>
                    Every block reads the standard shadcn CSS variables (
                    <code className={inlineCode}>--background</code>,{" "}
                    <code className={inlineCode}>--foreground</code>,{" "}
                    <code className={inlineCode}>--muted</code>, …). As long as
                    your project toggles the{" "}
                    <code className={inlineCode}>.dark</code> class on the{" "}
                    <code className={inlineCode}>&lt;html&gt;</code> element,
                    the blocks adapt automatically.
                  </Prose>
                </section>

                {/* Updates */}
                <section id="updates">
                  <SectionHeading id="updates">Updates</SectionHeading>
                  <Prose>
                    When a block gets a fix or a refresh, the registry endpoint
                    serves the new source at the same URL. Re-run the install
                    command to pull the latest version, or watch the changelog
                    for high-level summaries.
                  </Prose>
                  <CodeBlock cmds={UPDATE_CMDS} tabs={tabs} />
                </section>

                {/* Support */}
                <section id="support">
                  <SectionHeading id="support">Support</SectionHeading>
                  <Prose>
                    Stuck on something? Email{" "}
                    <a
                      href="mailto:anelka.bag@gmail.com"
                      className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                      anelka.bag@gmail.com
                    </a>{" "}
                    — Pro accounts get priority replies, free users still get an
                    answer when time allows.
                  </Prose>
                  <div className="mt-6 rounded-xl border border-border bg-muted/50 p-6">
                    <h3 className="text-foreground text-sm font-semibold mb-2">
                      Still stuck?
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Drop us an email at{" "}
                      <a
                        href="mailto:anelka.bag@gmail.com"
                        className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
                      >
                        anelka.bag@gmail.com
                      </a>
                      . Pro accounts get priority replies.
                    </p>
                  </div>
                </section>

                {/* Prev / Next */}
                <div className="mt-16 pt-8 border-t border-border flex justify-end">
                  <button
                    onClick={() => handleSelectPage("contributing")}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Contribution guide
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </button>
                </div>
              </>
            )}

            {activePage === "contributing" && (
              <>
                {/* Overview */}
                <section id="contributing-overview">
                  <SectionHeading id="contributing-overview">
                    Overview
                  </SectionHeading>
                  <Prose>
                    BagUI is open source, and contributions are welcome — new
                    blocks, bug fixes, or documentation improvements. Clone the
                    repo, install dependencies, then create a branch and follow
                    the steps below.
                  </Prose>
                </section>

                {/* Clone the repository */}
                <section id="clone-repo">
                  <SectionHeading id="clone-repo">
                    Clone the repository
                  </SectionHeading>
                  <Prose>
                    Start by cloning the repo locally and installing
                    dependencies.
                  </Prose>
                  <CodeBlock mono content={CONTRIB_CLONE_CMD} />
                </section>

                {/* Create a branch */}
                <section id="create-branch">
                  <SectionHeading id="create-branch">
                    Create a branch
                  </SectionHeading>
                  <Prose>
                    Work off a dedicated branch rather than committing straight
                    to <code className={inlineCode}>main</code>.
                  </Prose>
                  <CodeBlock mono content={CONTRIB_BRANCH_CMD} />
                </section>

                {/* Add your component */}
                <section id="add-component">
                  <SectionHeading id="add-component">
                    Add your component
                  </SectionHeading>
                  <Prose>
                    Components live under{" "}
                    <code className={inlineCode}>registry/default/blocks</code>{" "}
                    or <code className={inlineCode}>registry/default/ui</code>.
                    If the category doesn&apos;t exist yet, create a new folder
                    for it.
                  </Prose>
                  <CodeBlock mono content={CONTRIB_COMPONENT_CODE} />
                </section>

                {/* Register in registry.json */}
                <section id="register-json">
                  <SectionHeading id="register-json">
                    Register in registry.json
                  </SectionHeading>
                  <Prose>
                    Add an entry for your component in the{" "}
                    <code className={inlineCode}>items</code> section of{" "}
                    <code className={inlineCode}>registry.json</code>.
                  </Prose>
                  <CodeBlock mono content={CONTRIB_REGISTRY_JSON} />
                </section>

                {/* Verify & build */}
                <section id="verify-build">
                  <SectionHeading id="verify-build">
                    Verify & build
                  </SectionHeading>
                  <Prose>
                    Make sure everything compiles and the registry rebuilds
                    cleanly before opening a pull request.
                  </Prose>
                  <CodeBlock mono content={CONTRIB_BUILD_CMD} />

                  <ol className="mt-6 space-y-3">
                    {[
                      "Fork the repo and create a branch for your component.",
                      "Add the component file under the correct registry folder.",
                      "Register it in registry.json with a unique name and correct paths.",
                      "Run npm run build and npm run registry:build to verify everything passes.",
                      "Open a pull request with the component name, what it adds, and screenshots if possible.",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-border bg-muted flex items-center justify-center text-[10px] font-mono text-muted-foreground">
                          {i + 1}
                        </span>
                        <span className="text-muted-foreground text-sm leading-6">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Prev / Next */}
                <div className="mt-16 pt-8 border-t border-border flex justify-between">
                  <button
                    onClick={() => handleSelectPage("installation")}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <span className="group-hover:-translate-x-0.5 transition-transform">
                      ←
                    </span>
                    Installations
                  </button>
                  <Link
                    href="/blocks"
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Browse blocks
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </Link>
                </div>
              </>
            )}

            {activePage === "mcp" && (
              <>
                <section id="mcp-overview">
                  <SectionHeading id="mcp-overview">What is MCP?</SectionHeading>
                  <Prose>
                    The Model Context Protocol (MCP) is an open standard that
                    lets AI applications connect to external tools and data.
                    The BagUI MCP server gives compatible assistants access to
                    the BagUI component registry, so they can find components
                    and prepare install commands while you work.
                  </Prose>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Learn more in the{" "}
                    <a
                      href="https://modelcontextprotocol.io/introduction"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={textLink}
                    >
                      MCP introduction ↗
                    </a>
                    .
                  </p>
                </section>

                <section id="mcp-features">
                  <SectionHeading id="mcp-features">
                    What BagUI MCP can do
                  </SectionHeading>
                  <Prose>
                    The server exposes read-only tools for listing categories,
                    searching components, retrieving component details and
                    source code, and getting install commands. It also exposes
                    registry data through the{" "}
                    <code className={inlineCode}>bagui://registry</code> and{" "}
                    <code className={inlineCode}>
                      bagui://component/&lbrace;slug&rbrace;
                    </code>{" "}
                    resources. The server returns commands for you to review;
                    it does not run installation commands on your behalf.
                  </Prose>
                  <div className="mt-5 rounded-xl border border-border bg-muted/50 p-5">
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      <li>
                        <code className={inlineCode}>list_categories</code> and{" "}
                        <code className={inlineCode}>list_components</code>{" "}
                        browse the registry.
                      </li>
                      <li>
                        <code className={inlineCode}>search_components</code>{" "}
                        finds components by keywords, category, or plan.
                      </li>
                      <li>
                        <code className={inlineCode}>get_component</code> and{" "}
                        <code className={inlineCode}>get_install_command</code>{" "}
                        provide details, optional source, and install commands.
                      </li>
                    </ul>
                  </div>
                </section>

                <section id="mcp-remote">
                  <SectionHeading id="mcp-remote">
                    Remote server URL
                  </SectionHeading>
                  <Prose>
                    After this version of BagUI is deployed to Vercel, you can
                    connect any MCP-compatible AI client to the hosted server.
                    Use this URL as the server address:
                  </Prose>
                  <CodeBlock mono lang="url" content={MCP_REMOTE_URL} />
                  <Prose>
                    The endpoint uses Streamable HTTP and does not require
                    installing anything on your computer. Claude, Cursor,
                    VS Code, and Gemini CLI can connect to it. Setup differs
                    slightly between clients.
                  </Prose>
                </section>

                <section id="mcp-clients">
                  <SectionHeading id="mcp-clients">
                    Connect an AI client
                  </SectionHeading>
                  <Prose>
                    Choose your AI client and register the BagUI MCP URL. These
                    examples connect to the hosted server; no local clone or
                    API key is needed.
                  </Prose>
                  <h3 className="mt-6 text-base font-semibold text-foreground">
                    Claude Code
                  </h3>
                  <Prose>
                    Run these commands in a terminal. Check the connection
                    with <code className={inlineCode}>claude mcp list</code>.
                  </Prose>
                  <CodeBlock mono lang="bash" content={MCP_CLAUDE_CODE_CMD} />
                  <h3 className="mt-6 text-base font-semibold text-foreground">
                    Claude Desktop
                  </h3>
                  <Prose>
                    Open Settings → Connectors → Add custom connector, then
                    paste the BagUI server URL:
                  </Prose>
                  <CodeBlock mono lang="text" content={MCP_CLAUDE_DESKTOP_STEPS} />
                  <h3 className="mt-6 text-base font-semibold text-foreground">
                    Cursor
                  </h3>
                  <Prose>
                    Add this entry to <code className={inlineCode}>.cursor/mcp.json</code>{" "}
                    in your project, then enable BagUI from Cursor&apos;s MCP
                    settings:
                  </Prose>
                  <CodeBlock mono lang="json" content={MCP_CURSOR_CONFIG} />
                  <h3 className="mt-6 text-base font-semibold text-foreground">
                    VS Code
                  </h3>
                  <Prose>
                    Add this server to <code className={inlineCode}>.vscode/mcp.json</code>{" "}
                    in your project. Open the MCP server controls and start
                    BagUI:
                  </Prose>
                  <CodeBlock mono lang="json" content={MCP_REMOTE_VSCODE_CONFIG} />
                  <h3 className="mt-6 text-base font-semibold text-foreground">
                    Gemini CLI
                  </h3>
                  <Prose>
                    Add this entry to the <code className={inlineCode}>mcpServers</code>{" "}
                    object in your Gemini CLI <code className={inlineCode}>settings.json</code>,
                    then restart the CLI:
                  </Prose>
                  <CodeBlock mono lang="json" content={MCP_GEMINI_CONFIG} />
                </section>

                <section id="mcp-build">
                  <SectionHeading id="mcp-build">
                    Run the server locally
                  </SectionHeading>
                  <Prose>
                    Prefer to run BagUI MCP on your own computer? You need
                    Node.js 18 or newer. Clone the BagUI repository, install
                    the MCP package dependencies, and build its server bundle:
                  </Prose>
                  <CodeBlock mono lang="bash" content={MCP_BUILD_CMD} />
                </section>

                <section id="mcp-connect">
                  <SectionHeading id="mcp-connect">
                    Connect locally to VS Code
                  </SectionHeading>
                  <Prose>
                    Open the cloned BagUI repository as a workspace in VS Code
                    and create <code className={inlineCode}>.vscode/mcp.json</code>{" "}
                    in its root. Replace the example path with the absolute
                    path to your local clone:
                  </Prose>
                  <CodeBlock mono lang="json" content={MCP_VSCODE_CONFIG} />
                  <Prose>
                    Save the file, then start BagUI from VS Code&apos;s MCP
                    server controls. This local <code className={inlineCode}>stdio</code>{" "}
                    setup does not use the hosted URL.
                  </Prose>
                </section>

                <section id="mcp-use">
                  <SectionHeading id="mcp-use">Use the tools</SectionHeading>
                  <Prose>
                    Once the server is running, enable its BagUI tools in your
                    assistant&apos;s tool picker and ask questions such as
                    &ldquo;Find a free dashboard component for analytics&rdquo;
                    or &ldquo;Show me the install command for footer1&rdquo;.
                    Review the returned component details or command, then
                    choose whether to use it in your project.
                  </Prose>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    For setup examples for other clients, see the{" "}
                    <a
                      href="https://github.com/anelkabag/bag-ui/tree/main/mcp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={textLink}
                    >
                      BagUI MCP README ↗
                    </a>
                    .
                  </p>
                </section>
              </>
            )}

            {activePage === "extension" && (
              <>
                <section id="extension-overview">
                  <SectionHeading id="extension-overview">
                    What is the BagUI VS Code extension?
                  </SectionHeading>
                  <Prose>
                    BagUI for VS Code brings the BagUI component catalog into
                    your editor. Browse components by category, search the
                    registry, preview a component, and install it into your
                    current workspace.
                  </Prose>
                  <div className="mt-5 rounded-xl border border-border bg-muted/50 p-5">
                    <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                      <li>Browse components from the BagUI Activity Bar view.</li>
                      <li>Search, preview, and install components from the editor.</li>
                      <li>Save favorites and refresh the component registry.</li>
                      <li>Use a cached registry snapshot when working offline.</li>
                    </ul>
                  </div>
                </section>

                <section id="extension-install">
                  <SectionHeading id="extension-install">
                    Install the extension
                  </SectionHeading>
                  <Prose>
                    The extension is available on the Visual Studio Code
                    Marketplace. Open its listing and select Install; VS Code
                    will add it to your editor.
                  </Prose>
                  <a
                    href="https://marketplace.visualstudio.com/items?itemName=bagui.bagui-vscode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85"
                  >
                    Install BagUI for VS Code <span aria-hidden="true">↗</span>
                  </a>
                </section>

                <section id="extension-use">
                  <SectionHeading id="extension-use">
                    Browse and install components
                  </SectionHeading>
                  <Prose>
                    After installation, select the BagUI icon in the VS Code
                    Activity Bar to open the component list. Choose a category
                    or search for a component, open its preview, then select
                    Install to add it to your workspace. You can also run
                    commands such as{" "}
                    <code className={inlineCode}>
                      BagUI: Search Component
                    </code>{" "}
                    from the Command Palette.
                  </Prose>
                </section>

                <section id="extension-requirements">
                  <SectionHeading id="extension-requirements">
                    Requirements
                  </SectionHeading>
                  <Prose>
                    The extension requires VS Code 1.95 or newer. To install
                    components, open a project configured with shadcn/ui
                    (<code className={inlineCode}>components.json</code>) and
                    Node.js. Some Pro components require a BagUI account.
                  </Prose>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    For the complete feature and settings list, see the{" "}
                    <a
                      href="https://github.com/anelkabag/bag-ui/tree/main/vscode"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={textLink}
                    >
                      VS Code extension README ↗
                    </a>
                    .
                  </p>
                </section>
              </>
            )}
          </div>

          {/* Right TOC */}
          <TOC sections={sections} active={activeSection} />
        </div>
      </div>
    </AppShell>
  );
}