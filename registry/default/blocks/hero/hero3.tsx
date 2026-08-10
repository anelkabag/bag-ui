"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { Terminal } from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Icons — inline, no external icon package required                     */
/* ---------------------------------------------------------------------- */

function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logoW.png"
      alt="Logo"
      className={className}
    />
  );
}


function FolderIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 6.6c0-.6.5-1.1 1.1-1.1h4.2c.3 0 .6.1.8.4l1 1.1c.2.2.5.4.8.4H19.9c.6 0 1.1.5 1.1 1.1v9.4c0 .6-.5 1.1-1.1 1.1H4.1c-.6 0-1.1-.5-1.1-1.1V6.6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.3 3.5h7.4l4 4v12.6c0 .5-.4.9-.9.9H6.3c-.5 0-.9-.4-.9-.9V4.4c0-.5.4-.9.9-.9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M13.7 3.5V7c0 .5.4 1 1 1h3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TerminalIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M7 9.3 10 12l-3 2.7M12.5 14.7H17"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/*  Static content                                                        */
/* ---------------------------------------------------------------------- */

const NAV_LINKS = ["Platform", "Automation Suite", "Pricing", "Company", "Docs"];

const FILES = [
  { name: "github", type: "folder" },
  { name: "vscode", type: "folder" },
  { name: "node_modules", type: "folder" },
  { name: "public", type: "folder" },
  { name: "src", type: "folder", open: true },
  { name: "CloudServices", type: "folder", nested: true },
  { name: "DevOpsAssistant.ts", type: "file", nested: true },
  { name: "App.tsx", type: "file", nested: true },
  { name: "index.tsx", type: "file", nested: true },
  { name: ".gitignore", type: "file" },
  { name: "README.md", type: "file" },
  { name: "tsconfig.json", type: "file" },
  { name: "package.json", type: "file" },
] as const;

// Real-IDE-style syntax token palette (VS Code Dark+ inspired hues,
// with a light-mode counterpart for each token).
const TOKEN_COLORS = {
  comment: "text-emerald-600 dark:text-emerald-400",
  keyword: "text-pink-600 dark:text-pink-400",
  string: "text-orange-600 dark:text-orange-300",
  type: "text-teal-600 dark:text-teal-300",
  function: "text-amber-600 dark:text-yellow-300",
  property: "text-sky-600 dark:text-sky-300",
  value: "text-lime-600 dark:text-lime-300",
  punctuation: "text-neutral-500 dark:text-neutral-400",
  plain: "text-neutral-800 dark:text-neutral-200",
  heading: "text-neutral-900 dark:text-white",
  muted: "text-neutral-500 dark:text-neutral-400",
} as const;

type TokenKey = keyof typeof TOKEN_COLORS;
type Segment = { text: string; token: TokenKey };
type CodeLine = Segment[];

const blank: CodeLine = [{ text: "", token: "plain" }];

// One code snippet per openable file — clicking a file in the sidebar
// swaps the editor pane to its content, tokenized like a real IDE.
const FILE_CONTENTS: Record<string, CodeLine[]> = {
  "DevOpsAssistant.ts": [
    [{ text: "// CSS Syntax Highlighter v2", token: "comment" }],
    [{ text: "// Manages the Figma plugin interface", token: "comment" }],
    [
      { text: "import ", token: "keyword" },
      { text: "PluginManager", token: "plain" },
      { text: " from ", token: "keyword" },
      { text: "'figma.js'", token: "string" },
    ],
    blank,
    [
      { text: "interface ", token: "keyword" },
      { text: "PluginSettings", token: "type" },
      { text: " {", token: "punctuation" },
    ],
    [
      { text: "  colorScheme", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "ColorScheme", token: "type" },
      { text: ";", token: "punctuation" },
    ],
    [
      { text: "  opacity?", token: "property" },
      { text: ": { value: ", token: "punctuation" },
      { text: "number", token: "type" },
      { text: " };", token: "punctuation" },
    ],
    [
      { text: "  enabled", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "boolean", token: "type" },
      { text: ";", token: "punctuation" },
    ],
    [{ text: "}", token: "punctuation" }],
    blank,
    [
      { text: "let ", token: "keyword" },
      { text: "settings", token: "plain" },
      { text: ": ", token: "punctuation" },
      { text: "PluginSettings", token: "type" },
      { text: " = {", token: "punctuation" },
    ],
    [
      { text: "  colorScheme", token: "property" },
      { text: ": {", token: "punctuation" },
    ],
    [
      { text: "    selector", token: "property" },
      { text: ": { r: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: ", g: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: ", b: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: " },", token: "punctuation" },
    ],
    [
      { text: "    property", token: "property" },
      { text: ": { r: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: ", g: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: ", b: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: " },", token: "punctuation" },
    ],
    [
      { text: "    value", token: "property" },
      { text: ":    { r: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: ", g: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: ", b: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: " },", token: "punctuation" },
    ],
    [
      { text: "    comment", token: "property" },
      { text: ":  { r: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: ", g: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: ", b: ", token: "punctuation" },
      { text: "0", token: "value" },
      { text: " },", token: "punctuation" },
    ],
    [{ text: "  },", token: "punctuation" }],
    [
      { text: "  enabled", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "true", token: "value" },
      { text: ",", token: "punctuation" },
    ],
    [{ text: "};", token: "punctuation" }],
  ],
  "App.tsx": [
    [{ text: "// App.tsx", token: "comment" }],
    [{ text: "// Root application shell", token: "comment" }],
    blank,
    [
      { text: "import ", token: "keyword" },
      { text: "{ BagProvider } ", token: "plain" },
      { text: "from ", token: "keyword" },
      { text: "'./lib/bag';", token: "string" },
    ],
    [
      { text: "import ", token: "keyword" },
      { text: "{ Dashboard } ", token: "plain" },
      { text: "from ", token: "keyword" },
      { text: "'./Dashboard';", token: "string" },
    ],
    blank,
    [
      { text: "export default function ", token: "keyword" },
      { text: "App", token: "function" },
      { text: "() {", token: "punctuation" },
    ],
    [
      { text: "  return ", token: "keyword" },
      { text: "(", token: "punctuation" },
    ],
    [
      { text: "    <", token: "punctuation" },
      { text: "BagProvider", token: "type" },
      { text: " theme", token: "property" },
      { text: "=", token: "punctuation" },
      { text: "\"dark\"", token: "string" },
      { text: ">", token: "punctuation" },
    ],
    [
      { text: "      <", token: "punctuation" },
      { text: "Dashboard", token: "type" },
      { text: " />", token: "punctuation" },
    ],
    [
      { text: "    </", token: "punctuation" },
      { text: "BagProvider", token: "type" },
      { text: ">", token: "punctuation" },
    ],
    [{ text: "  );", token: "punctuation" }],
    [{ text: "}", token: "punctuation" }],
  ],
  "index.tsx": [
    [{ text: "// index.tsx", token: "comment" }],
    [{ text: "// Application entry point", token: "comment" }],
    blank,
    [
      { text: "import ", token: "keyword" },
      { text: "{ ", token: "plain" },
      { text: "createRoot", token: "function" },
      { text: " } ", token: "plain" },
      { text: "from ", token: "keyword" },
      { text: "'react-dom/client';", token: "string" },
    ],
    [
      { text: "import ", token: "keyword" },
      { text: "App ", token: "plain" },
      { text: "from ", token: "keyword" },
      { text: "'./App';", token: "string" },
    ],
    blank,
    [
      { text: "const ", token: "keyword" },
      { text: "root", token: "plain" },
      { text: " = ", token: "punctuation" },
      { text: "createRoot", token: "function" },
      { text: "(", token: "punctuation" },
    ],
    [
      { text: "  document.getElementById", token: "function" },
      { text: "(", token: "punctuation" },
      { text: "'root'", token: "string" },
      { text: ")!", token: "punctuation" },
    ],
    [{ text: ");", token: "punctuation" }],
    blank,
    [
      { text: "root.render", token: "function" },
      { text: "(<", token: "punctuation" },
      { text: "App", token: "type" },
      { text: " />);", token: "punctuation" },
    ],
  ],
  "package.json": [
    [{ text: "{", token: "punctuation" }],
    [
      { text: "  \"name\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"bagui-app\",", token: "string" },
    ],
    [
      { text: "  \"version\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"1.4.2\",", token: "string" },
    ],
    [
      { text: "  \"private\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "true,", token: "value" },
    ],
    [
      { text: "  \"scripts\"", token: "property" },
      { text: ": {", token: "punctuation" },
    ],
    [
      { text: "    \"dev\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"next dev\",", token: "string" },
    ],
    [
      { text: "    \"build\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"next build\"", token: "string" },
    ],
    [{ text: "  },", token: "punctuation" }],
    [
      { text: "  \"dependencies\"", token: "property" },
      { text: ": {", token: "punctuation" },
    ],
    [
      { text: "    \"next\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"15.0.0\",", token: "string" },
    ],
    [
      { text: "    \"motion\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"^11.0.0\"", token: "string" },
    ],
    [{ text: "  }", token: "punctuation" }],
    [{ text: "}", token: "punctuation" }],
  ],
  "README.md": [
    [{ text: "# BagUI App", token: "heading" }],
    blank,
    [{ text: "Autonomous engineering automations", token: "muted" }],
    [{ text: "for real-world production.", token: "muted" }],
    blank,
    [{ text: "## Getting started", token: "heading" }],
    blank,
    [{ text: "curl -fsSL https://bagui.pro/docs/install | sh", token: "string" }],
  ],
  ".gitignore": [
    [{ text: "node_modules", token: "muted" }],
    [{ text: ".next", token: "muted" }],
    [{ text: ".env.local", token: "muted" }],
    [{ text: "dist", token: "muted" }],
    [{ text: "*.log", token: "muted" }],
  ],
  "tsconfig.json": [
    [{ text: "{", token: "punctuation" }],
    [
      { text: "  \"compilerOptions\"", token: "property" },
      { text: ": {", token: "punctuation" },
    ],
    [
      { text: "    \"target\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"ES2020\",", token: "string" },
    ],
    [
      { text: "    \"jsx\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"preserve\",", token: "string" },
    ],
    [
      { text: "    \"strict\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "true,", token: "value" },
    ],
    [
      { text: "    \"moduleResolution\"", token: "property" },
      { text: ": ", token: "punctuation" },
      { text: "\"bundler\"", token: "string" },
    ],
    [{ text: "  }", token: "punctuation" }],
    [{ text: "}", token: "punctuation" }],
  ],
};

function fileAccent(name: string) {
  if (name.endsWith(".tsx")) return "text-sky-500";
  if (name.endsWith(".ts")) return "text-blue-500";
  if (name.endsWith(".json")) return "text-amber-500";
  return "text-neutral-400";
}

// Real brand marks, fetched from the Simple Icons CDN (no local SVG needed).
// Rendered desaturated by default and revealed in full colour on hover.
const LOGOS = [
  { name: "GitHub", slug: "github" },
  { name: "npm", slug: "npm" },
  { name: "shadcn/ui", slug: "shadcnui" },
  { name: "Vercel", slug: "vercel" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "Motion", slug: "framer" },
];

/* ---------------------------------------------------------------------- */
/*  Hero3                                                                  */
/* ---------------------------------------------------------------------- */

export default function Hero3() {
  const shouldReduceMotion = useReducedMotion();
  const ease = [0.16, 1, 0.3, 1] as const;

  // Code editor interactivity — which file is open, and which tabs are shown.
  const [activeFile, setActiveFile] = useState<string>("DevOpsAssistant.ts");
  const [openTabs, setOpenTabs] = useState<string[]>(["DevOpsAssistant.ts"]);
  const activeLines = FILE_CONTENTS[activeFile] ?? FILE_CONTENTS["DevOpsAssistant.ts"];

  function openFile(name: string) {
    if (!FILE_CONTENTS[name]) return;
    setActiveFile(name);
    setOpenTabs((prev) => (prev.includes(name) ? prev : [...prev, name].slice(-4)));
  }

  function closeTab(name: string) {
    setOpenTabs((prev) => {
      if (prev.length <= 1) return prev; // always keep at least one tab open
      const next = prev.filter((t) => t !== name);
      if (activeFile === name) setActiveFile(next[next.length - 1]);
      return next;
    });
  }

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.12,
        delayChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.6, ease },
    },
  };

  return (
    <section className="w-full bg-neutral-50 dark:bg-black">
      <div className="mx-auto flex w-full flex-col gap-4 px-4 pt-2 pb-6 sm:px-8 sm:pt-3 sm:pb-8 lg:px-12 lg:pt-4 lg:pb-10">
        {/* -------------------------------------------------------------- */}
        {/*  Navbar — detached card, lives inside the hero                 */}
        {/* -------------------------------------------------------------- */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0.2 : 0.5, ease }}
          className="flex items-center justify-between border-2 border-dashed border-gray-300 bg-white px-6 py-4 shadow-sm dark:border-white/15 dark:bg-black sm:px-10"
        >
          <div className="flex items-center gap-10">
            <LogoMark className="h-5 w-5 text-neutral-950 dark:text-white" />
            <div className="hidden items-center gap-8 text-sm text-neutral-600 dark:text-white/60 lg:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="transition-colors hover:text-neutral-950 dark:hover:text-white"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-md border-2 border-dashed border-neutral-300 px-4 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
              Contact Sales
            </button>
            <button className="rounded-md bg-neutral-900 px-4 py-2 text-sm text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-white/85">
              Login
            </button>
          </div>
        </motion.nav>

        {/* -------------------------------------------------------------- */}
        {/*  Hero content                                                  */}
        {/* -------------------------------------------------------------- */}
        <div className="grid grid-cols-1 gap-12 py-6 lg:grid-cols-2 lg:gap-8 lg:py-10">
          {/* Left column */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="flex flex-col justify-center"
          >
            <motion.div
              variants={fadeUp}
              className="mb-6 flex items-center gap-2 text-xs tracking-wide text-neutral-500 dark:text-white/50"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-900 dark:bg-white" />
              <span className="uppercase">New announcement on X</span>
              <span>·</span>
              <a href="https://x.com/anelkabag" className="uppercase text-orange-600 hover:underline dark:text-orange-400">
                Read more
              </a>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-sans text-4xl font-semibold leading-[1.1] tracking-tight text-neutral-950 dark:text-white lg:text-[44px]"
            >
              Autonomous Software Engineering Built for Real-World Production
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="mt-6 max-w-md space-y-4 text-[15px] leading-relaxed text-neutral-500 dark:text-white/60"
            >
              <p>
                The first engineering automations that operate everywhere
                your team ships code.
              </p>
              <p>
                From local dev to CI/CD — offload end-to-end tasks like
                refactors, migrations, debugging, and incident response
                without changing your stack, tools, or workflow.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
              <button className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-white/85">
                Get Started
              </button>
              <button className="rounded-md border-2 border-dashed border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100 dark:border-white/20 dark:text-white dark:hover:bg-white/10">
                Contact Sales
              </button>
            </motion.div>
          </motion.div>

          {/* Right column — stacked cards, large screens only */}
          <div className="relative hidden min-h-[440px] lg:block">
            {/* back card peeking out top-right, suggests depth */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
              className="absolute -right-3 -top-3 h-20 w-32 rounded-md border border-neutral-200 bg-white shadow-sm dark:border-white/15 dark:bg-black"
            >
              <Terminal className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
            </motion.span>

            {/* Code editor window */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.6, delay: shouldReduceMotion ? 0 : 0.3, ease }}
              className="absolute inset-0 z-10 flex flex-col overflow-hidden border border-neutral-200 bg-white shadow-xl dark:border-white/15 dark:bg-black"
            >
              <div className="flex items-center gap-1.5 border-b border-neutral-200 px-3 py-2.5 dark:border-white/15">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>

              {/* Open-file tabs — click to switch, × to close */}
              <div className="flex items-center gap-0.5 overflow-x-auto border-b border-neutral-200 bg-neutral-50 px-2 pt-1.5 dark:border-white/15 dark:bg-white/5">
                {openTabs.map((name) => (
                  <button
                    key={name}
                    onClick={() => setActiveFile(name)}
                    className={`group flex shrink-0 items-center gap-1.5 rounded-t-md border border-b-0 px-2.5 py-1.5 text-[10.5px] transition-colors ${
                      activeFile === name
                        ? "border-neutral-200 bg-white text-neutral-900 dark:border-white/15 dark:bg-black dark:text-white"
                        : "border-transparent text-neutral-500 hover:text-neutral-700 dark:text-white/50 dark:hover:text-white/80"
                    }`}
                  >
                    <FileIcon className={`h-2.5 w-2.5 shrink-0 ${fileAccent(name)}`} />
                    <span className="max-w-[90px] truncate">{name}</span>
                    {openTabs.length > 1 && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(name);
                        }}
                        className="ml-0.5 rounded-sm px-1 text-neutral-400 opacity-0 transition-opacity hover:bg-neutral-200 hover:text-neutral-700 group-hover:opacity-100 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        ×
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 overflow-hidden text-[11px]">
                <div className="w-28 shrink-0 overflow-y-auto border-r border-neutral-200 bg-neutral-50 px-3 py-3 dark:border-white/15 dark:bg-white/5">
                  <p className="mb-2 font-medium tracking-wide text-neutral-400 dark:text-white/40">
                    BagUi App
                  </p>
                  <ul className="space-y-1.5">
                    {FILES.map((f) => {
                      const isFile = f.type === "file";
                      const isActive = isFile && f.name === activeFile;
                      return (
                        <li
                          key={f.name}
                          onClick={() => isFile && openFile(f.name)}
                          className={`-mx-1 flex items-center gap-1.5 rounded px-1 py-0.5 ${
                            "nested" in f && f.nested ? "pl-3" : ""
                          } ${
                            isFile
                              ? "cursor-pointer hover:bg-neutral-100 dark:hover:bg-white/10"
                              : ""
                          } ${
                            isActive
                              ? "bg-neutral-100 text-neutral-900 dark:bg-white/10 dark:text-white"
                              : "open" in f && f.open
                              ? "text-neutral-900 dark:text-white"
                              : "text-neutral-500 dark:text-white/50"
                          }`}
                        >
                          {f.type === "folder" ? (
                            <FolderIcon className="h-3 w-3 shrink-0" />
                          ) : (
                            <FileIcon
                              className={`h-3 w-3 shrink-0 ${isActive ? fileAccent(f.name) : ""}`}
                            />
                          )}
                          <span className="truncate">{f.name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="flex flex-1 overflow-hidden">
                  {/* line numbers gutter */}
                  <div className="select-none overflow-hidden bg-white px-2 py-3 text-right font-mono text-neutral-300 dark:bg-black dark:text-white/20">
                    {activeLines.map((_, i) => (
                      <p key={i} className="leading-5">
                        {i + 1}
                      </p>
                    ))}
                  </div>

                  <motion.div
                    key={activeFile}
                    initial={{ opacity: shouldReduceMotion ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                    className="flex-1 overflow-y-auto bg-white px-3 py-3 font-mono dark:bg-black"
                  >
                    {activeLines.map((segments, i) => {
                      const isBlank = segments.length === 1 && segments[0].text === "";
                      return (
                        <p key={i} className="whitespace-pre leading-5">
                          {isBlank
                            ? "\u00A0"
                            : segments.map((seg, j) => (
                                <span key={j} className={TOKEN_COLORS[seg.token]}>
                                  {seg.text}
                                </span>
                              ))}
                          {i === activeLines.length - 1 && (
                            <motion.span
                              aria-hidden
                              animate={
                                shouldReduceMotion ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }
                              }
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : { duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }
                              }
                              className="ml-0.5 inline-block h-3 w-[2px] translate-y-[2px] bg-neutral-900 dark:bg-white"
                            />
                          )}
                        </p>
                      );
                    })}
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Terminal card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{
                opacity: 1,
                y: shouldReduceMotion ? 0 : [0, -6, 0],
              }}
              transition={{
                opacity: { duration: 0.6, delay: shouldReduceMotion ? 0 : 0.5 },
                y: shouldReduceMotion
                  ? { duration: 0.2 }
                  : { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
              }}
              className="absolute bottom-4 rigth-3 right-2 z-20 w-64 rounded-lg border-2 border-dashed border-neutral-200 bg-white p-4 shadow-xl dark:border-white/15 dark:bg-black"
            >
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border-1 border-dashed border-neutral-200 px-2.5 py-1 text-[10px] font-medium tracking-wide text-neutral-600 dark:border-white/15 dark:text-white/60">
                <TerminalIcon className="h-3 w-3" />
                MACOS / LINUX
              </div>
              <p className="truncate font-mono text-[12px] text-neutral-700 dark:text-white/70">
                <span className="text-neutral-400 dark:text-white/40">{">"}</span> curl -fsSL
                https://bagui.pro/docs/install | sh
              </p>
            </motion.div>
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/*  Logos strip                                                   */}
        {/* -------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col divide-y divide-gray-300 overflow-hidden border-2 border-dashed border-gray-300 bg-white shadow-sm dark:divide-white/15 dark:border-white/15 dark:bg-black sm:flex-row sm:divide-x sm:divide-y-0"
        >
          {LOGOS.map(({ name, slug }) => (
            <div
              key={name}
              className="group flex flex-1 items-center justify-center gap-2 py-8 text-neutral-400 transition-colors hover:text-neutral-700 dark:text-white/40 dark:hover:text-white cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://cdn.simpleicons.org/${slug}`}
                alt={`${name} logo`}
                className="h-4 w-4 grayscale opacity-60 transition duration-300 group-hover:grayscale-0 group-hover:opacity-100 "
              />
              <span className="text-sm font-medium">{name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}