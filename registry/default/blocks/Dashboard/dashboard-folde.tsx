"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  createContext,
  useContext,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Home,
  Folder as FolderIcon,
  FileText,
  FileSpreadsheet,
  FileType,
  Presentation,
  Image as ImageIcon,
  BarChart3,
  Mail,
  MailOpen,
  Workflow,
  Settings,
  Bell,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  MoreVertical,
  Share2,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  ChevronsRight,
  ExternalLink,
  Pin,
  Inbox,
  Plus,
  Trash2,
  Download,
  Pencil,
  Check,
  Link2,
  X,
  ArrowUpDown,
  Clock,
  Zap,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  Theme (dark mode) context                                          */
/* ================================================================== */
/*
  Uses Tailwind's class-based dark mode strategy: the root wrapper gets a
  "dark" class toggled by React state, and every descendant uses regular
  `dark:` variants. Make sure tailwind.config has `darkMode: "class"`
  (or, on Tailwind v4, `@custom-variant dark (&:where(.dark, .dark *));`
  in your CSS) for this to take effect.
*/

const ThemeContext = createContext<boolean>(false);
function useIsDark() {
  return useContext(ThemeContext);
}

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type FolderVariant = "neutral" | "blue" | "black";
type FileKind = "doc" | "sheet" | "image" | "pdf" | "slide";
type TagName = "Sales" | "Marketing" | "Analytics" | "Product" | "Engineering" | "Growth";
type NavKey = "home" | "notes" | "reports" | "emails" | "automation";
type SortKey = "name" | "size" | "date";

type FileItem = {
  id: string;
  name: string;
  kind: FileKind;
  sizeKb: number;
  modified: string; // ISO yyyy-mm-dd
  owner: string;
};

type Folder = {
  id: string;
  title: string;
  notesCount: number;
  sizeKb: number;
  variant: FolderVariant;
  tag: TagName;
  files: FileItem[];
};

type Project = {
  id: string;
  name: string;
  folders: Folder[];
};

type SelectedItem =
  | { type: "folder"; folder: Folder }
  | { type: "file"; file: FileItem; folderTitle: string; folderTag: TagName }
  | null;

type NotificationItem = {
  id: number;
  message: string;
  time: string;
  unread: boolean;
  link?: { projectId: string; folderId: string };
};

type EmailItem = {
  id: number;
  from: string;
  subject: string;
  snippet: string;
  time: string;
  unread: boolean;
};

type AutomationItem = {
  id: number;
  name: string;
  description: string;
  trigger: string;
  enabled: boolean;
};

/* ================================================================== */
/*  Folder graphic — same flap silhouette + "cards peeking out" idea   */
/* ================================================================== */

const FLAP_PATH =
  "M0 25C0 11.1929 11.1929 0 25 0H136.084C143.044 0 149.689 2.90139 154.42 8.00608L178.08 33.5343C182.811 38.639 189.456 41.5404 196.416 41.5404H296C309.807 41.5404 321 52.7333 321 66.5404V216C321 229.807 309.807 241 296 241H25C11.1929 241 0 229.807 0 216V25Z";

/* Light theme — soft neutrals + a single blue accent */
const folderPalettes = {
  neutral: {
    flapFill: "#EFEFF1",
    flapStroke: "#E2E2E6",
    cardFill: "#FFFFFF",
    cardStroke: "#E9E9EC",
    cardLineFill: "#E3E3E7",
  },
  blue: {
    flapFill: "#6DBCFE",
    flapStroke: "#94CEFF",
    cardFill: "#FFFFFF",
    cardStroke: "#EAF4FF",
    cardLineFill: "#DCEEFF",
  },
  black: {
    flapFill: "#1F2937",
    flapStroke: "#374151",
    cardFill: "#111827",
    cardStroke: "#374151",
    cardLineFill: "#374151",
  }
} as const;

/* Dark theme — kept deliberately monochrome (charcoal / graphite / off-white),
   with the "blue" variant surviving as the one accent, muted to a deep
   midnight so it still reads as black-and-white-first. The "black" variant
   flips to near-white so it keeps acting as the spotlight tile against a
   dark canvas. */
const folderPalettesDark = {
  neutral: {
    flapFill: "#4B4B4F",
    flapStroke: "#5D5D62",
    cardFill: "#ECECEE",
    cardStroke: "#DBDBDD",
    cardLineFill: "#C7C7CB",
  },
  blue: {
    flapFill: "#2B4A6E",
    flapStroke: "#3E6690",
    cardFill: "#ECECEE",
    cardStroke: "#DBDBDD",
    cardLineFill: "#C7C7CB",
  },
  black: {
    flapFill: "#F5F5F7",
    flapStroke: "#E4E4E7",
    cardFill: "#FFFFFF",
    cardStroke: "#ECECEE",
    cardLineFill: "#E2E2E5",
  }
} as const;

const cardSpring = { type: "spring" as const, stiffness: 150, damping: 15 };

function MiniCard({ palette }: { palette: (typeof folderPalettes)[FolderVariant] }) {
  return (
    <svg width="70" height="92" viewBox="0 0 70 92" fill="none">
      <rect width="70" height="92" rx="12" fill={palette.cardFill} stroke={palette.cardStroke} />
      <rect x="9" y="14" width="52" height="6" rx="3" fill={palette.cardLineFill} />
      <rect x="9" y="28" width="36" height="4" rx="2" fill={palette.cardLineFill} opacity={0.75} />
      <rect x="9" y="37" width="36" height="4" rx="2" fill={palette.cardLineFill} opacity={0.75} />
      <rect x="9" y="47" width="28" height="4" rx="2" fill={palette.cardLineFill} opacity={0.75} />
    </svg>
  );
}

const FolderGraphic = React.memo(function FolderGraphic({
  variant = "neutral",
  hovered,
}: {
  variant?: FolderVariant;
  hovered: boolean;
}) {
  const isDark = useIsDark();
  const palette = (isDark ? folderPalettesDark : folderPalettes)[variant];
  const open = hovered;

  return (
    <div className="relative inline-flex h-[130px] w-[158px] items-end justify-center">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="absolute"
          animate={{ y: open ? -34 : -16, x: 17, rotate: open ? 8 : 4 }}
          transition={cardSpring}
        >
          <MiniCard palette={palette} />
        </motion.div>
        <motion.div
          className="absolute"
          animate={{ y: open ? -40 : -20, x: 0, rotate: 0 }}
          transition={cardSpring}
        >
          <MiniCard palette={palette} />
        </motion.div>
        <motion.div
          className="absolute"
          animate={{ y: open ? -34 : -16, x: -17, rotate: open ? -8 : -4 }}
          transition={cardSpring}
        >
          <MiniCard palette={palette} />
        </motion.div>
      </div>

      <motion.svg
        width="160"
        height="120"
        viewBox="0 0 321 241"
        fill="none"
        className="relative"
        animate={{ y: open ? 2 : 0 }}
        transition={cardSpring}
      >
        <path d={FLAP_PATH} fill={palette.flapFill} />
        <path d={FLAP_PATH} fill="none" stroke={palette.flapStroke} />
      </motion.svg>
    </div>
  );
});

/* ================================================================== */
/*  Helpers                                                             */
/* ================================================================== */

function formatSize(kb: number) {
  if (kb >= 1024 * 1024) return `${(kb / (1024 * 1024)).toFixed(1)} GB`;
  if (kb >= 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${Math.round(kb)} KB`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}, ${y}`;
}
function todayIso() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const TAG_DOT: Record<TagName, string> = {
  Sales: "bg-blue-500",
  Marketing: "bg-neutral-400",
  Analytics: "bg-rose-500",
  Product: "bg-violet-500",
  Engineering: "bg-amber-500",
  Growth: "bg-emerald-500",
};

const KIND_META: Record<FileKind, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  doc: { icon: FileText, color: "text-indigo-500 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-500/15", label: "Document" },
  sheet: { icon: FileSpreadsheet, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/15", label: "Spreadsheet" },
  image: { icon: ImageIcon, color: "text-pink-500 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-500/15", label: "Image" },
  pdf: { icon: FileType, color: "text-rose-500 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-500/15", label: "PDF" },
  slide: { icon: Presentation, color: "text-orange-500 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-500/15", label: "Slides" },
};

function sortFolders(folders: Folder[], sortBy: SortKey): Folder[] {
  const copy = [...folders];
  copy.sort((a, b) => {
    if (sortBy === "name") return a.title.localeCompare(b.title);
    if (sortBy === "size") return b.sizeKb - a.sizeKb;
    return 0;
  });
  return copy;
}

function sortFiles(files: FileItem[], sortBy: SortKey): FileItem[] {
  const copy = [...files];
  copy.sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "size") return b.sizeKb - a.sizeKb;
    return b.modified.localeCompare(a.modified);
  });
  return copy;
}

/* ================================================================== */
/*  Mock data                                                          */
/* ================================================================== */

let uid = 1000;
function nextId(prefix: string) {
  uid += 1;
  return `${prefix}-${uid}`;
}

function f(name: string, kind: FileKind, sizeKb: number, modified: string, owner: string): FileItem {
  return { id: nextId("file"), name, kind, sizeKb, modified, owner };
}

const INITIAL_PROJECTS: Project[] = [
  {
    id: "bagui",
    name: "Bag Ui",
    folders: [
      {
        id: "ux-research",
        title: "UX research",
        notesCount: 233,
        sizeKb: 119706,
        variant: "neutral",
        tag: "Product",
        files: [
          f("Interview transcript — Maria K.", "doc", 480, "2024-12-01", "Sophia Lane"),
          f("Interview transcript — Noah P.", "doc", 512, "2024-12-02", "Sophia Lane"),
          f("Usability test notes", "doc", 210, "2024-11-28", "Lina Voss"),
          f("Persona board", "image", 3200, "2024-11-20", "Marc Ade"),
          f("Research plan Q4", "pdf", 640, "2024-11-15", "Sophia Lane"),
        ],
      },
      {
        id: "raw-data",
        title: "Raw data",
        notesCount: 39,
        sizeKb: 184525,
        variant: "blue",
        tag: "Analytics",
        files: [
          f("Event export — Nov", "sheet", 43008, "2024-12-01", "Theo Kade"),
          f("Event export — Dec", "sheet", 38912, "2024-12-05", "Theo Kade"),
          f("Survey responses raw", "sheet", 15360, "2024-11-30", "Nora Bell"),
          f("Session logs sample", "doc", 1126, "2024-11-22", "Theo Kade"),
        ],
      },
      {
        id: "processed-data",
        title: "Processed data",
        notesCount: 21,
        sizeKb: 23962,
        variant: "neutral",
        tag: "Analytics",
        files: [
          f("Cohort table Q4", "sheet", 6554, "2024-12-03", "Nora Bell"),
          f("Cleaned survey set", "sheet", 4915, "2024-11-30", "Nora Bell"),
          f("Feature matrix v3", "sheet", 3174, "2024-11-25", "Theo Kade"),
        ],
      },
      {
        id: "reports",
        title: "Reports",
        notesCount: 17,
        sizeKb: 501760,
        variant: "neutral",
        tag: "Marketing",
        files: [
          f("Q4 growth report", "pdf", 2458, "2024-12-06", "Sophia Lane"),
          f("Board deck — December", "slide", 18432, "2024-12-04", "Marc Ade"),
          f("Retention deep dive", "pdf", 3994, "2024-11-18", "Nora Bell"),
          f("Weekly summary #48", "doc", 220, "2024-11-29", "Sophia Lane"),
        ],
      },
      {
        id: "data-visualization",
        title: "Data visualization",
        notesCount: 96,
        sizeKb: 1362790,
        variant: "neutral",
        tag: "Analytics",
        files: [
          f("Funnel dashboard export", "image", 4710, "2024-12-02", "Marc Ade"),
          f("Cohort heatmap", "image", 2969, "2024-11-27", "Nora Bell"),
          f("Revenue trend chart", "image", 1843, "2024-11-21", "Marc Ade"),
          f("Viz style guide", "pdf", 1229, "2024-11-10", "Lina Voss"),
        ],
      },
      {
        id: "ideas-insights",
        title: "Ideas and Insights",
        notesCount: 103,
        sizeKb: 129331,
        variant: "neutral",
        tag: "Product",
        files: [
          f("Insight log — November", "doc", 340, "2024-11-30", "Lina Voss"),
          f("Feature idea backlog", "doc", 290, "2024-11-26", "Marc Ade"),
          f("Customer quotes bank", "doc", 410, "2024-11-19", "Sophia Lane"),
        ],
      },
    ],
  },
  {
    id: "kivu-event",
    name: "Kivu Event",
    folders: [
      {
        id: "customer-interviews",
        title: "Customer interviews",
        notesCount: 58,
        sizeKb: 65843,
        variant: "neutral",
        tag: "Product",
        files: [
          f("Interview — Acme Co.", "doc", 380, "2024-12-01", "Lina Voss"),
          f("Interview — Nimbus Inc.", "doc", 402, "2024-11-27", "Lina Voss"),
          f("Synthesis notes", "doc", 260, "2024-11-24", "Sophia Lane"),
        ],
      },
      {
        id: "onboarding-flows",
        title: "Onboarding flows",
        notesCount: 24,
        sizeKb: 39014,
        variant: "neutral",
        tag: "Growth",
        files: [
          f("Flow diagram v2", "image", 2150, "2024-11-29", "Marc Ade"),
          f("Drop-off analysis", "sheet", 5530, "2024-11-22", "Theo Kade"),
          f("Copy audit", "doc", 180, "2024-11-15", "Nora Bell"),
        ],
      },
      {
        id: "growth-experiments",
        title: "Growth experiments",
        notesCount: 31,
        sizeKb: 53862,
        variant: "blue",
        tag: "Growth",
        files: [
          f("Experiment log Q4", "sheet", 3686, "2024-12-05", "Theo Kade"),
          f("Pricing test results", "pdf", 1434, "2024-11-30", "Nora Bell"),
          f("Referral loop notes", "doc", 310, "2024-11-20", "Sophia Lane"),
          f("Landing page variants", "image", 2765, "2024-11-12", "Marc Ade"),
        ],
      },
    ],
  },
  {
    id: "codeai",
    name: "CodeAI",
    folders: [
      {
        id: "model-evals",
        title: "Model evals",
        notesCount: 47,
        sizeKb: 215450,
        variant: "blue",
        tag: "Engineering",
        files: [
          f("Eval suite results v6", "sheet", 8397, "2024-12-04", "Theo Kade"),
          f("Regression report", "pdf", 1946, "2024-11-28", "Nora Bell"),
          f("Prompt failure cases", "doc", 340, "2024-11-21", "Lina Voss"),
        ],
      },
      {
        id: "prompt-library",
        title: "Prompt library",
        notesCount: 19,
        sizeKb: 13107,
        variant: "neutral",
        tag: "Engineering",
        files: [
          f("System prompts v3", "doc", 220, "2024-12-02", "Marc Ade"),
          f("Few-shot examples", "doc", 190, "2024-11-25", "Sophia Lane"),
          f("Prompt style guide", "pdf", 640, "2024-11-10", "Lina Voss"),
        ],
      },
      {
        id: "release-notes",
        title: "Release notes",
        notesCount: 12,
        sizeKb: 6246,
        variant: "neutral",
        tag: "Engineering",
        files: [
          f("v2.4 release notes", "doc", 120, "2024-12-06", "Marc Ade"),
          f("v2.3 release notes", "doc", 118, "2024-11-18", "Marc Ade"),
          f("Changelog archive", "pdf", 980, "2024-10-30", "Theo Kade"),
        ],
      },
    ],
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 1, message: "Marc Ade commented on Q4 growth report", time: "5m ago", unread: true, link: { projectId: "bagui", folderId: "reports" } },
  { id: 2, message: "New file added to Raw data", time: "1h ago", unread: true, link: { projectId: "bagui", folderId: "raw-data" } },
  { id: 3, message: "Theo Kade shared Event export — Dec", time: "3h ago", unread: true, link: { projectId: "bagui", folderId: "raw-data" } },
  { id: 4, message: "Weekly summary #48 is ready", time: "Yesterday", unread: false, link: { projectId: "bagui", folderId: "reports" } },
  { id: 5, message: "You were mentioned in Persona board", time: "2d ago", unread: true, link: { projectId: "bagui", folderId: "ux-research" } },
  { id: 6, message: "New experiment added to Growth experiments", time: "2d ago", unread: false, link: { projectId: "kivu-event", folderId: "growth-experiments" } },
];

const INITIAL_EMAILS: EmailItem[] = [
  { id: 1, from: "Notion Digest", subject: "Your weekly activity summary", snippet: "Here's what happened across bagui Labs this week: 14 new files, 3 comments, and 2 folders updated across the team.", time: "9:14 AM", unread: true },
  { id: 2, from: "Marc Ade", subject: "Re: Board deck feedback", snippet: "Left a few comments on slide 6, mostly about the retention chart. Can we sync before Friday's review?", time: "Yesterday", unread: true },
  { id: 3, from: "Linear", subject: "3 issues assigned to you", snippet: "ENG-482, ENG-491 and ENG-503 are waiting on your review. Two are marked high priority.", time: "Yesterday", unread: false },
  { id: 4, from: "Theo Kade", subject: "Raw export is ready", snippet: "Pushed the December event export to Raw data, let me know if the schema looks right before we process it.", time: "Mon", unread: false },
  { id: 5, from: "Stripe", subject: "Your invoice is ready", snippet: "Your December invoice for the Kintsugi workspace is now available to download from your billing settings.", time: "Mon", unread: false },
];

const INITIAL_AUTOMATIONS: AutomationItem[] = [
  { id: 1, name: "Weekly report digest", description: "Sends a summary of new files every Monday at 9:00 AM.", trigger: "Schedule", enabled: true },
  { id: 2, name: "Auto-tag raw uploads", description: "Applies the Analytics tag to anything dropped into Raw data.", trigger: "File added", enabled: true },
  { id: 3, name: "Slack notify on comment", description: "Posts to #bagui-labs whenever a file gets a new comment.", trigger: "Comment", enabled: false },
  { id: 4, name: "Archive stale drafts", description: "Moves drafts untouched for 30 days into Archive.", trigger: "Schedule", enabled: false },
  { id: 5, name: "Sync to data warehouse", description: "Pushes processed sheets to the analytics warehouse nightly.", trigger: "Schedule", enabled: true },
];

const SECONDARY_NAV: { key: NavKey; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { key: "notes", icon: FileText, label: "Notes" },
  { key: "reports", icon: BarChart3, label: "Reports" },
  { key: "emails", icon: Mail, label: "Emails" },
  { key: "automation", icon: Workflow, label: "Automation" },
];

const PROJECT_TABS = [
  { id: "kivu-event", label: "Kivu Event" },
  { id: "codeai", label: "CodeAI" },
  { id: "bagui", label: "Bag Ui" },
];

const CURRENT_USER = "Anelka Bag";

/* ================================================================== */
/*  Small atoms                                                        */
/* ================================================================== */

function KintsugiMark() {
  const isDark = useIsDark();
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-neutral-900 dark:bg-neutral-100">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M1 9.5L5.5 5.5L4 2.5" stroke={isDark ? "#0A0A0A" : "white"} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M5.5 5.5L11 3.5" stroke={isDark ? "#0A0A0A" : "white"} strokeWidth="1.1" strokeLinecap="round" />
        <path d="M6.8 5.9L13 11" stroke={isDark ? "#0A0A0A" : "white"} strokeWidth="1.1" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function Avatar({ seed, className }: { seed: string; className?: string }) {
  return (
    <img
      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4`}
      alt={seed}
      className={cn("shrink-0 rounded-full bg-neutral-100 object-cover dark:bg-neutral-800 dark:ring-1 dark:ring-neutral-800", className)}
    />
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label?: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
        checked ? "bg-neutral-900 dark:bg-neutral-100" : "bg-neutral-200 dark:bg-neutral-800"
      )}
    >
      <motion.span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow-sm",
          checked ? "bg-white dark:bg-neutral-900" : "bg-white dark:bg-neutral-400"
        )}
        animate={{ x: checked ? 20 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
      />
    </button>
  );
}

function TagChip({
  tag,
  active,
  onClick,
}: {
  tag: TagName;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] transition-colors",
        active
          ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
          : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-white dark:bg-neutral-900" : TAG_DOT[tag])} />
      {tag}
    </button>
  );
}

function ToastStack({ toasts }: { toasts: { id: number; message: string }[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-lg dark:bg-neutral-50 dark:text-neutral-900 dark:shadow-black/50"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400 dark:text-emerald-600" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* Generic dropdown shell: backdrop + animated panel */
function Dropdown({
  open,
  onClose,
  anchorClassName,
  children,
}: {
  open: boolean;
  onClose: () => void;
  anchorClassName: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.14 }}
        className={cn(
          "absolute z-50 rounded-xl border border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/50",
          anchorClassName
        )}
      >
        {children}
      </motion.div>
    </>
  );
}

/* ================================================================== */
/*  Theme toggle                                                       */
/* ================================================================== */

function ThemeToggle({
  isDark,
  onToggle,
  collapsed,
}: {
  isDark: boolean;
  onToggle: () => void;
  collapsed?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      title={collapsed ? (isDark ? "Switch to light mode" : "Switch to dark mode") : undefined}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-200",
        collapsed && "justify-center px-0"
      )}
    >
      <span className="relative flex h-[15px] w-[15px] shrink-0 items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: -70, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 70, scale: 0.5 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-[15px] w-[15px]" />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: 70, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -70, scale: 0.5 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-[15px] w-[15px]" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {!collapsed && <span className="flex-1 truncate text-left">{isDark ? "Dark mode" : "Light mode"}</span>}
      {!collapsed && (
        <span
          className={cn(
            "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
            isDark ? "bg-neutral-100" : "bg-neutral-200"
          )}
        >
          <motion.span
            className={cn("absolute top-0.5 left-0.5 h-4 w-4 rounded-full shadow-sm", isDark ? "bg-neutral-900" : "bg-white")}
            animate={{ x: isDark ? 16 : 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 32 }}
          />
        </span>
      )}
    </button>
  );
}

/* ================================================================== */
/*  Nav item                                                            */
/* ================================================================== */

const NavItem = React.memo(function NavItem({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
  badge,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
          : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
      )}
    >
      <Icon className="h-[15px] w-[15px] shrink-0" />
      {!collapsed && <span className="flex-1 truncate text-left">{label}</span>}
      {!!badge && badge > 0 && (
        <span
          className={cn(
            "rounded-full bg-rose-500 px-[6px] py-[1px] text-[10px] font-medium text-white",
            collapsed && "absolute -right-0.5 -top-0.5"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
});

/* ================================================================== */
/*  Sidebar                                                             */
/* ================================================================== */

function Sidebar({
  collapsed,
  onToggleCollapsed,
  projects,
  activeProjectId,
  onSelectProject,
  projectsExpanded,
  onToggleProjectsExpanded,
  activeNav,
  onGoHome,
  onGoNav,
  notifications,
  notificationsOpen,
  onToggleNotifications,
  onMarkAllRead,
  onNotificationClick,
  unreadCount,
  isDark,
  onToggleDark,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  projectsExpanded: boolean;
  onToggleProjectsExpanded: () => void;
  activeNav: NavKey | null;
  onGoHome: () => void;
  onGoNav: (key: NavKey) => void;
  notifications: NotificationItem[];
  notificationsOpen: boolean;
  onToggleNotifications: () => void;
  onMarkAllRead: () => void;
  onNotificationClick: (n: NotificationItem) => void;
  unreadCount: number;
  isDark: boolean;
  onToggleDark: () => void;
}) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 212 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex h-full shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-white px-3 py-4 dark:border-neutral-800 dark:bg-[#0C0C0E]"
    >
      <div className={cn("flex items-center pb-5", collapsed ? "justify-center" : "justify-between px-1")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <KintsugiMark />
            <span className="whitespace-nowrap text-[14.5px] font-semibold text-neutral-900 dark:text-neutral-50">BagUi</span>
          </div>
        )}
        {collapsed && <KintsugiMark />}
        {!collapsed && (
          <button
            onClick={onToggleCollapsed}
            className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          >
            <ChevronsRight className="h-[15px] w-[15px]" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={onToggleCollapsed}
          className="absolute right-1.5 top-[18px] flex h-6 w-6 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
        >
          <ChevronsRight className="h-[13px] w-[13px] rotate-180" />
        </button>
      )}

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
        <NavItem icon={Home} label="Home" active={activeNav === "home"} collapsed={collapsed} onClick={onGoHome} />

        <button
          onClick={onToggleProjectsExpanded}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] text-neutral-500 hover:bg-neutral-50 dark:text-neutral-500 dark:hover:bg-neutral-900",
            collapsed && "justify-center px-0"
          )}
        >
          <FolderIcon className="h-[15px] w-[15px] shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 truncate text-left">Projects</span>
              <motion.span animate={{ rotate: projectsExpanded ? 0 : -90 }} transition={{ duration: 0.15 }}>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
              </motion.span>
            </>
          )}
        </button>

        <AnimatePresence initial={false}>
          {projectsExpanded && !collapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="ml-[18px] overflow-hidden border-l border-neutral-200 pl-3 dark:border-neutral-800"
            >
              <div className="flex flex-col gap-0.5 py-0.5">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelectProject(p.id)}
                    className={cn(
                      "rounded-lg px-2.5 py-[7px] text-left text-[13.5px] transition-colors",
                      p.id === activeProjectId
                        ? "bg-neutral-100 font-medium text-neutral-900 dark:bg-neutral-800 dark:text-neutral-50"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800 dark:text-neutral-500 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="my-3 h-px bg-neutral-100 dark:bg-neutral-800" />

        {SECONDARY_NAV.map((item) => (
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={activeNav === item.key}
            collapsed={collapsed}
            onClick={() => onGoNav(item.key)}
          />
        ))}
      </nav>

      <div className="flex flex-col gap-0.5 pt-2">
        <ThemeToggle isDark={isDark} onToggle={onToggleDark} collapsed={collapsed} />
        <NavItem icon={Settings} label="Settings" collapsed={collapsed} />
        <div className="relative">
          <NavItem
            icon={Bell}
            label="Notifications"
            collapsed={collapsed}
            badge={unreadCount}
            onClick={onToggleNotifications}
          />
          <AnimatePresence>
            {notificationsOpen && (
              <Dropdown open onClose={onToggleNotifications} anchorClassName={collapsed ? "left-[60px] bottom-0 w-[300px]" : "left-1 right-1 bottom-[calc(100%+6px)] w-[260px]"}>
                <div className="flex items-center justify-between border-b border-neutral-100 px-3.5 py-2.5 dark:border-neutral-800">
                  <span className="text-[13px] font-medium text-neutral-900 dark:text-neutral-50">Notifications</span>
                  <button onClick={onMarkAllRead} className="text-[11.5px] text-neutral-400 hover:text-neutral-700 dark:text-neutral-600 dark:hover:text-neutral-200">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-[280px] overflow-y-auto py-1">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => onNotificationClick(n)}
                      className="flex w-full items-start gap-2.5 px-3.5 py-2.5 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    >
                      <span
                        className={cn(
                          "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                          n.unread ? "bg-blue-500 dark:bg-blue-400" : "bg-transparent"
                        )}
                      />
                      <span className="min-w-0 flex-1">
                        <span className={cn("block text-[12.5px] leading-snug", n.unread ? "font-medium text-neutral-900 dark:text-neutral-50" : "text-neutral-500 dark:text-neutral-500")}>
                          {n.message}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-neutral-400 dark:text-neutral-600">{n.time}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </Dropdown>
            )}
          </AnimatePresence>
        </div>

        <div className="my-3 h-px bg-neutral-100 dark:bg-neutral-800" />

        <div className={cn("flex items-center gap-2.5 rounded-lg px-1.5 py-1.5", collapsed && "justify-center px-0")}>
          <Avatar seed="Anelka Bag" className="h-8 w-8" />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-neutral-900 dark:text-neutral-50">{CURRENT_USER}</p>
                <p className="truncate text-[12px] text-neutral-400 dark:text-neutral-600">ceo@bagui.pro</p>
              </div>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-600" />
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

/* ================================================================== */
/*  Top bar                                                             */
/* ================================================================== */

function TopBar({
  projectName,
  folderTitle,
  onBack,
  onGoProjectRoot,
  showBack,
  onShare,
  shareOpen,
  onCopyLink,
}: {
  projectName: string;
  folderTitle: string | null;
  onBack: () => void;
  onGoProjectRoot: () => void;
  showBack: boolean;
  onShare: () => void;
  shareOpen: boolean;
  onCopyLink: () => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  return (
    <div className="flex h-[60px] shrink-0 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#0C0C0E]">
      <div className="flex flex-1 items-center justify-between px-6">
        <div className="flex items-center gap-3 text-[13.5px]">
          <button
            onClick={onBack}
            disabled={!showBack}
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
              showBack
                ? "text-neutral-500 hover:bg-neutral-100 dark:text-neutral-500 dark:hover:bg-neutral-800"
                : "text-neutral-200 dark:text-neutral-800"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-600">
            <button onClick={onGoProjectRoot} className="flex items-center gap-1.5 hover:text-neutral-700 dark:hover:text-neutral-200">
              <FolderIcon className="h-3.5 w-3.5" />
              <span>Projects</span>
            </button>
            <ChevronRight className="h-3.5 w-3.5" />
            <button
              onClick={onGoProjectRoot}
              className={cn("flex items-center gap-1.5 hover:text-neutral-700 dark:hover:text-neutral-200", !folderTitle && "font-medium text-neutral-800 dark:text-neutral-100")}
            >
              <FolderIcon className="h-3.5 w-3.5 text-neutral-500 dark:text-neutral-500" />
              <span className={!folderTitle ? "font-medium text-neutral-800 dark:text-neutral-100" : ""}>{projectName}</span>
            </button>
            {folderTitle && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="font-medium text-neutral-800 dark:text-neutral-100">{folderTitle}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[13.5px] text-neutral-500 dark:text-neutral-400">
          <button className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900">
            <Settings className="h-[15px] w-[15px]" />
            Manage
          </button>
          <div className="relative">
            <button onClick={onShare} className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <Share2 className="h-[15px] w-[15px]" />
              Share
            </button>
            <AnimatePresence>
              {shareOpen && (
                <Dropdown open onClose={onShare} anchorClassName="right-0 top-[calc(100%+6px)] w-[280px] p-3">
                  <p className="mb-2 text-[12.5px] text-neutral-500 dark:text-neutral-400">Anyone with the link can view this project.</p>
                  <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-2 dark:border-neutral-800 dark:bg-neutral-950">
                    <Link2 className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-600" />
                    <span className="truncate text-[12px] text-neutral-500 dark:text-neutral-500">bagui.app/fullscreen/dashboard-folder</span>
                    <button
                      onClick={onCopyLink}
                      className="ml-auto shrink-0 rounded-md bg-neutral-900 px-2 py-1 text-[11px] font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                    >
                      Copy
                    </button>
                  </div>
                </Dropdown>
              )}
            </AnimatePresence>
          </div>
          <div className="relative">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <MoreHorizontal className="h-[15px] w-[15px]" />
            </button>
            <AnimatePresence>
              {moreOpen && (
                <Dropdown open onClose={() => setMoreOpen(false)} anchorClassName="right-0 top-[calc(100%+6px)] w-[190px] py-1.5">
                  <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800">
                    <Pencil className="h-3.5 w-3.5" /> Rename project
                  </button>
                  <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800">
                    <Download className="h-3.5 w-3.5" /> Export all
                  </button>
                  <button className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10">
                    <Trash2 className="h-3.5 w-3.5" /> Delete project
                  </button>
                </Dropdown>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Folder tile                                                        */
/* ================================================================== */

const FolderTile = React.memo(function FolderTile({
  folder,
  onOpen,
}: {
  folder: Folder;
  onOpen: (id: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const active = folder.variant === "black";
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="group inline-flex w-max flex-col items-center gap-6 text-center"
    >
      <motion.button
        type="button"
        onClick={() => onOpen(folder.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 dark:focus-visible:ring-neutral-100/40 mt-4"
      >
        <FolderGraphic variant={folder.variant} hovered={hovered} />
      </motion.button>

      <div className="mt-3 flex w-full max-w-[160px] flex-col items-center gap-1 text-center">
        <h3 className={cn("truncate text-[15px] font-semibold", active ? "text-white" : "text-neutral-900 dark:text-neutral-100")}>
          {folder.title}
        </h3>
        <p className={cn("text-[13px]", active ? "text-white/80" : "text-neutral-500 dark:text-neutral-500")}>{folder.notesCount} notes</p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[11px] font-medium",
            active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
          )}
        >
          {folder.tag}
        </span>
      </div>

      <p className={cn("text-[13px]", active ? "text-white/70" : "text-neutral-400 dark:text-neutral-600")}>
        {formatSize(folder.sizeKb)}
      </p>
    </motion.div>
  );
});

/* ================================================================== */
/*  File row / card                                                    */
/* ================================================================== */

const FileRow = React.memo(function FileRow({
  file,
  selected,
  onSelect,
  onDelete,
  onRename,
  onDownload,
}: {
  file: FileItem;
  selected: boolean;
  onSelect: (file: FileItem) => void;
  onDelete: (id: string) => void;
  onRename: (file: FileItem) => void;
  onDownload: (file: FileItem) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = KIND_META[file.kind];
  const Icon = meta.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
      transition={{ duration: 0.18 }}
      onClick={() => onSelect(file)}
      className={cn(
        "group flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 transition-colors",
        selected
          ? "border-neutral-900/15 bg-neutral-50 dark:border-neutral-100/15 dark:bg-neutral-900"
          : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/70"
      )}
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.bg)}>
        <Icon className={cn("h-4 w-4", meta.color)} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-medium text-neutral-900 dark:text-neutral-50">{file.name}</p>
        <p className="mt-0.5 truncate text-[12px] text-neutral-400 dark:text-neutral-600">
          {meta.label} · {formatSize(file.sizeKb)} · {formatDate(file.modified)}
        </p>
      </div>
      <Avatar seed={file.owner} className="h-6 w-6" />
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-400 opacity-0 hover:bg-neutral-200/60 hover:text-neutral-700 group-hover:opacity-100 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <Dropdown open onClose={() => setMenuOpen(false)} anchorClassName="right-0 top-[calc(100%+4px)] w-[170px] py-1.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRename(file);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <Pencil className="h-3.5 w-3.5" /> Rename
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(file);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(file.id);
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </Dropdown>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

/* ================================================================== */
/*  Search + sort toolbar (shared)                                     */
/* ================================================================== */

function Toolbar({
  search,
  onSearch,
  placeholder,
  sortBy,
  onSortChange,
  onNewDraft,
  newDraftLabel,
}: {
  search: string;
  onSearch: (v: string) => void;
  placeholder: string;
  sortBy: SortKey;
  onSortChange: (v: SortKey) => void;
  onNewDraft?: () => void;
  newDraftLabel?: string;
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortLabel: Record<SortKey, string> = { name: "Name", size: "Size", date: "Date" };
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
        <Search className="h-[15px] w-[15px] text-neutral-400 dark:text-neutral-600" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[13.5px] text-neutral-700 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-600"
        />
        {search && (
          <button onClick={() => onSearch("")} className="text-neutral-300 hover:text-neutral-500 dark:text-neutral-700 dark:hover:text-neutral-400">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <div className="relative">
        <button
          onClick={() => setSortOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-[13.5px] text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <SlidersHorizontal className="h-[15px] w-[15px]" />
          {sortLabel[sortBy]}
        </button>
        <AnimatePresence>
          {sortOpen && (
            <Dropdown open onClose={() => setSortOpen(false)} anchorClassName="right-0 top-[calc(100%+6px)] w-[150px] py-1.5">
              {(Object.keys(sortLabel) as SortKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    onSortChange(key);
                    setSortOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] hover:bg-neutral-50 dark:hover:bg-neutral-800",
                    sortBy === key ? "font-medium text-neutral-900 dark:text-neutral-50" : "text-neutral-600 dark:text-neutral-400"
                  )}
                >
                  <ArrowUpDown className="h-3.5 w-3.5" /> {sortLabel[key]}
                </button>
              ))}
            </Dropdown>
          )}
        </AnimatePresence>
      </div>
      {onNewDraft && (
        <button
          onClick={onNewDraft}
          className="flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          <Plus className="h-[15px] w-[15px]" />
          {newDraftLabel ?? "New draft"}
        </button>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Home view                                                          */
/* ================================================================== */

function HomeView({
  projectName,
  folders,
  search,
  onSearch,
  sortBy,
  onSortChange,
  tagFilter,
  onOpenFolder,
  onNewDraft,
}: {
  projectName: string;
  folders: Folder[];
  search: string;
  onSearch: (v: string) => void;
  sortBy: SortKey;
  onSortChange: (v: SortKey) => void;
  tagFilter: TagName | null;
  onOpenFolder: (id: string) => void;
  onNewDraft: () => void;
}) {
  const visible = useMemo(() => {
    let list = folders;
    if (tagFilter) list = list.filter((f) => f.tag === tagFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => f.title.toLowerCase().includes(q));
    }
    return sortFolders(list, sortBy);
  }, [folders, search, sortBy, tagFilter]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-neutral-900 dark:text-neutral-50">{projectName}</h1>
      </div>

      <Toolbar
        search={search}
        onSearch={onSearch}
        placeholder="Search folders"
        sortBy={sortBy}
        onSortChange={onSortChange}
        onNewDraft={onNewDraft}
      />

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center dark:border-neutral-800">
          <FolderIcon className="mb-3 h-8 w-8 text-neutral-300 dark:text-neutral-700" />
          <p className="text-[13.5px] text-neutral-500 dark:text-neutral-500">Nothing matches your search or filter.</p>
        </div>
      ) : (
        <motion.div layout transition={{ layout: { duration: 0.4, ease: "easeOut" } }} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((folder) => (
              <FolderTile key={folder.id} folder={folder} onOpen={onOpenFolder} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Folder detail view                                                 */
/* ================================================================== */

function FolderDetailView({
  folder,
  search,
  onSearch,
  sortBy,
  onSortChange,
  selectedFileId,
  onSelectFile,
  onDeleteFile,
  onRenameFile,
  onDownloadFile,
  onNewDraft,
}: {
  folder: Folder;
  search: string;
  onSearch: (v: string) => void;
  sortBy: SortKey;
  onSortChange: (v: SortKey) => void;
  selectedFileId: string | null;
  onSelectFile: (file: FileItem) => void;
  onDeleteFile: (id: string) => void;
  onRenameFile: (file: FileItem) => void;
  onDownloadFile: (file: FileItem) => void;
  onNewDraft: () => void;
}) {
  const isDark = useIsDark();
  const palette = (isDark ? folderPalettesDark : folderPalettes)[folder.variant];

  const visible = useMemo(() => {
    let list = folder.files;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((file) => file.name.toLowerCase().includes(q));
    }
    return sortFiles(list, sortBy);
  }, [folder.files, search, sortBy]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="pointer-events-none transform scale-50 origin-center -ml-1">
                <FolderGraphic variant={folder.variant} hovered={false} />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-[22px] font-semibold text-neutral-900 dark:text-neutral-50">{folder.title}</h1>
                <p className="mt-0.5 text-[13px] text-neutral-500 dark:text-neutral-500">{folder.files.length} files</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-right">
          <span className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            {folder.tag}
          </span>
          <p className="text-[13px] text-neutral-500 dark:text-neutral-500">{formatSize(folder.sizeKb)}</p>
        </div>
      </div>

      <Toolbar
        search={search}
        onSearch={onSearch}
        placeholder={`Search in ${folder.title}`}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onNewDraft={onNewDraft}
        newDraftLabel="Add file"
      />

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center dark:border-neutral-800">
          <FileText className="mb-3 h-8 w-8 text-neutral-300 dark:text-neutral-700" />
          <p className="text-[13.5px] text-neutral-500 dark:text-neutral-500">No files match your search.</p>
        </div>
      ) : (
        <motion.div layout transition={{ layout: { duration: 0.4, ease: "easeOut" } }} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((file) => (
              <motion.button
                key={file.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
                onClick={() => onSelectFile(file)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group flex h-full flex-col justify-between rounded-[24px] border border-neutral-200/80 bg-white p-4 text-left transition hover:-translate-y-1 hover:shadow-[0_12px_40px_-24px_rgba(15,23,42,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/40 dark:border-neutral-800/80 dark:bg-neutral-900 dark:hover:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.8)] dark:focus-visible:ring-neutral-100/30",
                  file.id === selectedFileId ? "border-neutral-900/30 bg-neutral-50 dark:border-neutral-100/20 dark:bg-neutral-800/70" : "border-transparent"
                )}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-3xl bg-neutral-50 dark:bg-neutral-950">
                      <MiniCard palette={palette} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[15px] font-semibold text-neutral-900 dark:text-neutral-50">{file.name}</p>
                      <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-500">{formatSize(file.sizeKb)}</p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-500 whitespace-nowrap dark:bg-neutral-800 dark:text-neutral-400">{file.kind}</span>
                </div>

                <div className="mt-4 flex flex-col gap-2 text-[12px] text-neutral-500 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-500">
                  <span className="truncate">{formatDate(file.modified)}</span>
                  <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[11px] font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">{folder.tag}</span>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Notes / Reports views (derived from files across the project)      */
/* ================================================================== */

function FlatFileListView({
  title,
  emptyLabel,
  files,
  search,
  onSearch,
  selectedFileId,
  onSelectFile,
  onDownloadFile,
}: {
  title: string;
  emptyLabel: string;
  files: (FileItem & { folderTitle: string })[];
  search: string;
  onSearch: (v: string) => void;
  selectedFileId: string | null;
  onSelectFile: (file: FileItem, folderTitle: string) => void;
  onDownloadFile: (file: FileItem) => void;
}) {
  const visible = useMemo(() => {
    if (!search.trim()) return files;
    const q = search.trim().toLowerCase();
    return files.filter((f) => f.name.toLowerCase().includes(q) || f.folderTitle.toLowerCase().includes(q));
  }, [files, search]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-neutral-900 dark:text-neutral-50">{title}</h1>
      </div>

      <div className="mb-6 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 dark:border-neutral-800 dark:bg-neutral-900">
        <Search className="h-[15px] w-[15px] text-neutral-400 dark:text-neutral-600" />
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder={`Search ${title.toLowerCase()}`}
          className="w-full bg-transparent text-[13.5px] text-neutral-700 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-600"
        />
      </div>

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 py-20 text-center dark:border-neutral-800">
          <p className="text-[13.5px] text-neutral-500 dark:text-neutral-500">{emptyLabel}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {visible.map((file) => {
            const meta = KIND_META[file.kind];
            const Icon = meta.icon;
            const selected = file.id === selectedFileId;
            return (
              <motion.div
                layout
                key={file.id}
                onClick={() => onSelectFile(file, file.folderTitle)}
                className={cn(
                  "group flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5",
                  selected
                    ? "border-neutral-900/15 bg-neutral-50 dark:border-neutral-100/15 dark:bg-neutral-900"
                    : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/70"
                )}
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.bg)}>
                  <Icon className={cn("h-4 w-4", meta.color)} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-neutral-900 dark:text-neutral-50">{file.name}</p>
                  <p className="mt-0.5 truncate text-[12px] text-neutral-400 dark:text-neutral-600">
                    {file.folderTitle} · {formatSize(file.sizeKb)} · {formatDate(file.modified)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadFile(file);
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-neutral-400 opacity-0 hover:bg-neutral-200/60 hover:text-neutral-700 group-hover:opacity-100 dark:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                >
                  <Download className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Emails view                                                        */
/* ================================================================== */

function EmailsView({
  emails,
  expandedId,
  onToggleExpand,
}: {
  emails: EmailItem[];
  expandedId: number | null;
  onToggleExpand: (id: number) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-neutral-900 dark:text-neutral-50">Emails</h1>
      </div>
      <div className="flex flex-col gap-1">
        {emails.map((email) => {
          const open = expandedId === email.id;
          return (
            <motion.div
              layout
              key={email.id}
              className={cn(
                "cursor-pointer overflow-hidden rounded-xl border px-4 py-3",
                open
                  ? "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                  : "border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/70"
              )}
              onClick={() => onToggleExpand(email.id)}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/15">
                  {email.unread ? (
                    <Mail className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                  ) : (
                    <MailOpen className="h-4 w-4 text-neutral-400 dark:text-neutral-600" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn("truncate text-[13.5px]", email.unread ? "font-semibold text-neutral-900 dark:text-neutral-50" : "font-medium text-neutral-700 dark:text-neutral-300")}>
                      {email.from}
                    </p>
                    <span className="shrink-0 text-[11.5px] text-neutral-400 dark:text-neutral-600">{email.time}</span>
                  </div>
                  <p className={cn("truncate text-[13px]", email.unread ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-500 dark:text-neutral-500")}>
                    {email.subject}
                  </p>
                </div>
              </div>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="pl-[52px]"
                  >
                    <p className="pt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-500">{email.snippet}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Automation view                                                    */
/* ================================================================== */

function AutomationView({
  automations,
  onToggle,
}: {
  automations: AutomationItem[];
  onToggle: (id: number) => void;
}) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[22px] font-semibold text-neutral-900 dark:text-neutral-50">Automation</h1>
      </div>
      <div className="flex flex-col gap-2.5">
        {automations.map((a) => (
          <div
            key={a.id}
            className={cn(
              "flex items-center gap-4 rounded-2xl border p-4 transition-colors",
              a.enabled
                ? "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                : "border-neutral-100 bg-neutral-50/60 dark:border-neutral-900 dark:bg-neutral-950/60"
            )}
          >
            <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", a.enabled ? "bg-neutral-900 dark:bg-white" : "bg-neutral-200 dark:bg-neutral-800")}>
              {a.trigger === "Schedule" ? (
                <Clock className={cn("h-[17px] w-[17px]", a.enabled ? "text-white dark:text-neutral-900" : "text-neutral-400 dark:text-neutral-600")} />
              ) : (
                <Zap className={cn("h-[17px] w-[17px]", a.enabled ? "text-white dark:text-neutral-900" : "text-neutral-400 dark:text-neutral-600")} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13.5px] font-medium text-neutral-900 dark:text-neutral-50">{a.name}</p>
              <p className="mt-0.5 text-[12.5px] text-neutral-500 dark:text-neutral-500">{a.description}</p>
            </div>
            <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">{a.trigger}</span>
            <Switch checked={a.enabled} onChange={() => onToggle(a.id)} label={a.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Info panel                                                         */
/* ================================================================== */

function StatCard({ label, value, progress, barColor }: { label: string; value: string; progress: number; barColor: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between">
        <span className="text-[13px] text-neutral-500 dark:text-neutral-500">{label}</span>
        <MoreVertical className="h-3.5 w-3.5 text-neutral-300 dark:text-neutral-700" />
      </div>
      <p className="mt-1 text-[19px] font-semibold text-neutral-900 dark:text-neutral-50">{value}</p>
      <div className="mt-3 h-[5px] w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function InfoPanel({
  selected,
  activeTagFilter,
  onToggleTag,
  allTags,
  pinnedFolders,
  onOpenPinned,
}: {
  selected: SelectedItem;
  activeTagFilter: TagName | null;
  onToggleTag: (tag: TagName) => void;
  allTags: TagName[];
  pinnedFolders: Folder[];
  onOpenPinned: (id: string) => void;
}) {
  const properties = useMemo(() => {
    if (!selected) return null;
    if (selected.type === "folder") {
      return [
        { label: "Size", value: formatSize(selected.folder.sizeKb) },
        { label: "Files", value: `${selected.folder.files.length}` },
        { label: "Tag", value: selected.folder.tag },
      ];
    }
    return [
      { label: "Size", value: formatSize(selected.file.sizeKb) },
      { label: "Modified", value: formatDate(selected.file.modified) },
      { label: "Owner", value: selected.file.owner },
    ];
  }, [selected]);

  return (
    <aside className="flex w-[248px] shrink-0 flex-col overflow-y-auto border-l border-neutral-200 bg-white px-5 py-6 dark:border-neutral-800 dark:bg-[#0C0C0E]">
      <div className="flex flex-col gap-3">
        <StatCard label="Documents" value="48.5 GB" progress={32} barColor="bg-blue-500" />
        <StatCard label="Images" value="182.4 MB" progress={8} barColor="bg-rose-500" />
      </div>

      <div className="mt-7">
        <h4 className="mb-2.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-500">
          {selected ? (selected.type === "folder" ? "Folder" : "File") : "Properties"}
        </h4>
        {selected ? (
          <motion.div
            key={selected.type === "folder" ? selected.folder.id : selected.file.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <p className="mb-2 truncate text-[13.5px] font-medium text-neutral-900 dark:text-neutral-50">
              {selected.type === "folder" ? selected.folder.title : selected.file.name}
            </p>
            <div className="flex flex-col gap-2">
              {properties!.map((prop) => (
                <div key={prop.label} className="flex items-center justify-between text-[13px]">
                  <span className="text-neutral-500 dark:text-neutral-500">{prop.label}</span>
                  <span className="truncate font-medium text-neutral-800 dark:text-neutral-200">{prop.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <p className="text-[12.5px] text-neutral-400 dark:text-neutral-600">Select a folder or file to see its details here.</p>
        )}
      </div>

      <div className="mt-6">
        <h4 className="mb-2.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-500">Tags</h4>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <TagChip key={tag} tag={tag} active={activeTagFilter === tag} onClick={() => onToggleTag(tag)} />
          ))}
        </div>
        {activeTagFilter && <p className="mt-2 text-[11.5px] text-neutral-400 dark:text-neutral-600">Filtering Home by "{activeTagFilter}"</p>}
      </div>

      <div className="mt-6">
        <h4 className="mb-2.5 flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-500">
          <Pin className="h-3.5 w-3.5" /> Pinned items
        </h4>
        <div className="flex flex-col gap-1">
          {pinnedFolders.map((folder) => (
            <button
              key={folder.id}
              onClick={() => onOpenPinned(folder.id)}
              className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 text-left text-[12.5px] text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
            >
              <FolderIcon className="h-3.5 w-3.5 text-neutral-400 dark:text-neutral-600" />
              <span className="truncate">{folder.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-1 border-t border-neutral-100 pt-4 dark:border-neutral-800">
        <button className="flex items-center gap-2.5 rounded-lg px-1.5 py-2 text-[13.5px] text-neutral-500 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100">
          <Inbox className="h-[15px] w-[15px]" />
          Activity
        </button>
      </div>
    </aside>
  );
}

/* ================================================================== */
/*  Root                                                                */
/* ================================================================== */

export default function baguiDashboard() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState("bagui");
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [activeNav, setActiveNav] = useState<NavKey>("home");
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("name");
  const [activeTagFilter, setActiveTagFilter] = useState<TagName | null>(null);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [emails, setEmails] = useState(INITIAL_EMAILS);
  const [expandedEmailId, setExpandedEmailId] = useState<number | null>(null);

  const [automations, setAutomations] = useState(INITIAL_AUTOMATIONS);

  const [shareOpen, setShareOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const toastIdRef = useRef(0);

  const [isDark, setIsDark] = useState(false);
  const toggleDark = useCallback(() => setIsDark((v) => !v), []);

  const pushToast = useCallback((message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  const activeProject = useMemo(
    () => projects.find((p) => p.id === activeProjectId)!,
    [projects, activeProjectId]
  );
  const openFolder = useMemo(
    () => (openFolderId ? activeProject.folders.find((fl) => fl.id === openFolderId) ?? null : null),
    [activeProject, openFolderId]
  );

  const unreadCount = useMemo(() => notifications.filter((n) => n.unread).length, [notifications]);

  const allFilesFlat = useMemo(
    () =>
      activeProject.folders.flatMap((folder) =>
        folder.files.map((file) => ({ ...file, folderTitle: folder.title }))
      ),
    [activeProject]
  );

  const updateFolders = useCallback(
    (projectId: string, updater: (folders: Folder[]) => Folder[]) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, folders: updater(p.folders) } : p))
      );
    },
    []
  );

  /* ---- navigation ---- */

  const resetViewState = useCallback(() => {
    setSearch("");
    setSelectedItem(null);
  }, []);

  const selectProject = useCallback(
    (id: string) => {
      setActiveProjectId(id);
      setOpenFolderId(null);
      setActiveNav("home");
      setActiveTagFilter(null);
      resetViewState();
    },
    [resetViewState]
  );

  const goHome = useCallback(() => {
    setActiveNav("home");
    setOpenFolderId(null);
    resetViewState();
  }, [resetViewState]);

  const goNav = useCallback(
    (key: NavKey) => {
      setActiveNav(key);
      setOpenFolderId(null);
      resetViewState();
    },
    [resetViewState]
  );

  const openFolderById = useCallback(
    (id: string) => {
      const folder = activeProject.folders.find((fl) => fl.id === id);
      setOpenFolderId(id);
      setSearch("");
      if (folder) setSelectedItem({ type: "folder", folder });
    },
    [activeProject]
  );

  const closeFolder = useCallback(() => {
    setOpenFolderId(null);
    resetViewState();
  }, [resetViewState]);

  /* ---- selection ---- */

  const selectFile = useCallback((file: FileItem, folderTitle: string, folderTag: TagName) => {
    setSelectedItem({ type: "file", file, folderTitle, folderTag });
  }, []);

  /* ---- file / folder mutations ---- */

  const deleteFile = useCallback(
    (folderId: string, fileId: string) => {
      updateFolders(activeProjectId, (folders) =>
        folders.map((fl) =>
          fl.id === folderId
            ? { ...fl, files: fl.files.filter((file) => file.id !== fileId), notesCount: Math.max(0, fl.notesCount - 1) }
            : fl
        )
      );
      setSelectedItem((prev) => (prev?.type === "file" && prev.file.id === fileId ? null : prev));
      pushToast("File deleted");
    },
    [activeProjectId, updateFolders, pushToast]
  );

  const renameFile = useCallback(
    (_file: FileItem) => {
      pushToast("Renaming is a demo action — hook this up to your API");
    },
    [pushToast]
  );

  const downloadFile = useCallback(
    (file: FileItem) => {
      pushToast(`Downloading "${file.name}"`);
    },
    [pushToast]
  );

  const addDraft = useCallback(() => {
    const targetFolder = openFolder ?? activeProject.folders[0];
    if (!targetFolder) return;
    const draft: FileItem = {
      id: nextId("file"),
      name: "Untitled draft",
      kind: "doc",
      sizeKb: 12,
      modified: todayIso(),
      owner: CURRENT_USER,
    };
    updateFolders(activeProjectId, (folders) =>
      folders.map((fl) =>
        fl.id === targetFolder.id ? { ...fl, files: [draft, ...fl.files], notesCount: fl.notesCount + 1 } : fl
      )
    );
    if (!openFolder) {
      setActiveNav("notes");
      setOpenFolderId(null);
    }
    setSelectedItem({ type: "file", file: draft, folderTitle: targetFolder.title, folderTag: targetFolder.tag });
    pushToast(`Draft added to ${targetFolder.title}`);
  }, [openFolder, activeProject, activeProjectId, updateFolders, pushToast]);

  /* ---- tags ---- */

  const allTags = useMemo(() => {
    const set = new Set<TagName>();
    activeProject.folders.forEach((fl) => set.add(fl.tag));
    return Array.from(set);
  }, [activeProject]);

  const toggleTagFilter = useCallback((tag: TagName) => {
    setActiveTagFilter((prev) => (prev === tag ? null : tag));
  }, []);

  /* ---- notifications ---- */

  const toggleNotifications = useCallback(() => setNotificationsOpen((v) => !v), []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const handleNotificationClick = useCallback(
    (n: NotificationItem) => {
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, unread: false } : item)));
      setNotificationsOpen(false);
      if (n.link) {
        if (n.link.projectId !== activeProjectId) setActiveProjectId(n.link.projectId);
        setActiveNav("home");
        setOpenFolderId(n.link.folderId);
        const proj = projects.find((p) => p.id === n.link!.projectId);
        const folder = proj?.folders.find((fl) => fl.id === n.link!.folderId);
        if (folder) setSelectedItem({ type: "folder", folder });
        setSearch("");
      }
    },
    [activeProjectId, projects]
  );

  /* ---- share ---- */

  const toggleShare = useCallback(() => setShareOpen((v) => !v), []);
  const copyLink = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("https://www.bagui.app/fullscreen/dashboard-folder").catch(() => {});
    }
    setShareOpen(false);
    pushToast("Link copied to clipboard");
  }, [pushToast]);

  /* ---- emails / automation ---- */

  const toggleEmailExpand = useCallback((id: number) => {
    setEmails((prev) => prev.map((e) => (e.id === id ? { ...e, unread: false } : e)));
    setExpandedEmailId((prev) => (prev === id ? null : id));
  }, []);

  const toggleAutomation = useCallback((id: number) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        pushToast(`${a.name} ${a.enabled ? "disabled" : "enabled"}`);
        return { ...a, enabled: !a.enabled };
      })
    );
  }, [pushToast]);

  const pinnedFolders = useMemo(() => activeProject.folders.slice(0, 3), [activeProject]);

  return (
    <ThemeContext.Provider value={isDark}>
      <div
        className={cn(
          "flex h-screen w-full overflow-hidden bg-white text-neutral-900 transition-colors duration-300 dark:bg-[#08080A] dark:text-neutral-100",
          isDark && "dark"
        )}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
          projects={PROJECT_TABS.map((t) => ({ id: t.id, name: t.label, folders: [] }))}
          activeProjectId={activeProjectId}
          onSelectProject={selectProject}
          projectsExpanded={projectsExpanded}
          onToggleProjectsExpanded={() => setProjectsExpanded((v) => !v)}
          activeNav={openFolderId ? null : activeNav}
          onGoHome={goHome}
          onGoNav={goNav}
          notifications={notifications}
          notificationsOpen={notificationsOpen}
          onToggleNotifications={toggleNotifications}
          onMarkAllRead={markAllRead}
          onNotificationClick={handleNotificationClick}
          unreadCount={unreadCount}
          isDark={isDark}
          onToggleDark={toggleDark}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar
            projectName={activeProject.name}
            folderTitle={openFolder ? openFolder.title : null}
            showBack={!!openFolder}
            onBack={closeFolder}
            onGoProjectRoot={closeFolder}
            onShare={toggleShare}
            shareOpen={shareOpen}
            onCopyLink={copyLink}
          />

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-[#F8F8F9] px-8 dark:bg-[#08080A]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={openFolderId ? `folder-${openFolderId}` : `nav-${activeNav}-${activeProjectId}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {openFolder ? (
                    <FolderDetailView
                      folder={openFolder}
                      search={search}
                      onSearch={setSearch}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      selectedFileId={selectedItem?.type === "file" ? selectedItem.file.id : null}
                      onSelectFile={(file) => selectFile(file, openFolder.title, openFolder.tag)}
                      onDeleteFile={(id) => deleteFile(openFolder.id, id)}
                      onRenameFile={renameFile}
                      onDownloadFile={downloadFile}
                      onNewDraft={addDraft}
                    />
                  ) : activeNav === "home" ? (
                    <HomeView
                      projectName={activeProject.name}
                      folders={activeProject.folders}
                      search={search}
                      onSearch={setSearch}
                      sortBy={sortBy}
                      onSortChange={setSortBy}
                      tagFilter={activeTagFilter}
                      onOpenFolder={openFolderById}
                      onNewDraft={addDraft}
                    />
                  ) : activeNav === "notes" ? (
                    <FlatFileListView
                      title="Notes"
                      emptyLabel="No notes yet."
                      files={allFilesFlat.filter((file) => file.kind === "doc")}
                      search={search}
                      onSearch={setSearch}
                      selectedFileId={selectedItem?.type === "file" ? selectedItem.file.id : null}
                      onSelectFile={(file, folderTitle) => {
                        const folder = activeProject.folders.find((fl) => fl.title === folderTitle);
                        selectFile(file, folderTitle, folder?.tag ?? "Product");
                      }}
                      onDownloadFile={downloadFile}
                    />
                  ) : activeNav === "reports" ? (
                    <FlatFileListView
                      title="Reports"
                      emptyLabel="No reports yet."
                      files={allFilesFlat.filter((file) => file.kind === "pdf" || file.kind === "slide")}
                      search={search}
                      onSearch={setSearch}
                      selectedFileId={selectedItem?.type === "file" ? selectedItem.file.id : null}
                      onSelectFile={(file, folderTitle) => {
                        const folder = activeProject.folders.find((fl) => fl.title === folderTitle);
                        selectFile(file, folderTitle, folder?.tag ?? "Marketing");
                      }}
                      onDownloadFile={downloadFile}
                    />
                  ) : activeNav === "emails" ? (
                    <EmailsView emails={emails} expandedId={expandedEmailId} onToggleExpand={toggleEmailExpand} />
                  ) : (
                    <AutomationView automations={automations} onToggle={toggleAutomation} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <InfoPanel
              selected={selectedItem}
              activeTagFilter={activeTagFilter}
              onToggleTag={toggleTagFilter}
              allTags={allTags}
              pinnedFolders={pinnedFolders}
              onOpenPinned={(id) => {
                setActiveNav("home");
                openFolderById(id);
              }}
            />
          </div>
        </div>

        <ToastStack toasts={toasts} />
      </div>
    </ThemeContext.Provider>
  );
}