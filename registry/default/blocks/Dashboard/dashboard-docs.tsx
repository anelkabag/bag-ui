"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  ClipboardList,
  Calendar,
  Users,
  FileText,
  Workflow,
  BarChart3,
  Settings,
  Share2,
  Search,
  Command,
  ChevronUp,
  Plus,
  MoreVertical,
  ArrowUpDown,
  Clock,
  Braces,
  Palette,
  ScrollText,
  Zap,
  Folder,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Bookmark,
  Pencil,
  Trash2,
  Mail,
  RefreshCw,
  Check,
  X,
  Columns3,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string }>;

type NavKey = "home" | "tasks" | "calendar" | "teams" | "docs" | "automations" | "reporting" | "settings" | "releases";

type DocFile = { id: string; name: string; sharedBy: string; size: string; created: string };

type DocCategory = { id: string; title: string; description: string; icon: IconType; files: DocFile[] };

type FilterKey = "all" | "connected" | "notConnected";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const essentialsNav: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "home", label: "Home", icon: Home },
  { key: "tasks", label: "Tasks", icon: ClipboardList },
  { key: "calendar", label: "Calendar", icon: Calendar },
  { key: "teams", label: "Teams", icon: Users },
  { key: "docs", label: "Docs", icon: FileText },
  { key: "automations", label: "Automations", icon: Workflow },
  { key: "reporting", label: "Reporting", icon: BarChart3 },
];

const supportNav: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "settings", label: "Settings", icon: Settings },
  { key: "releases", label: "Releases", icon: Share2 },
];

const projects = [
  { id: "atlas", name: "Atlas CRM Revamp", color: "bg-lime-500" },
  { id: "nimbus", name: "Nimbus Dashboard", color: "bg-orange-500" },
  { id: "orion", name: "Orion API Gateway", color: "bg-blue-500" },
  { id: "helio", name: "Helio Task System", color: "bg-rose-500" },
];

const sectionCopy: Partial<Record<NavKey, { icon: IconType; title: string; description: string }>> = {
  home: { icon: Home, title: "Home", description: "Your personalized overview across every project and doc." },
  tasks: { icon: ClipboardList, title: "Tasks", description: "Your team's Kanban board lives here." },
  calendar: { icon: Calendar, title: "Calendar", description: "See every deadline and scheduled task in one calendar view." },
  teams: { icon: Users, title: "Teams", description: "Manage members, roles and permissions across your workspace." },
  automations: { icon: Workflow, title: "Automations", description: "Automate repetitive documentation and review workflows." },
  reporting: { icon: BarChart3, title: "Reporting", description: "Engagement and adoption reports for your knowledge base." },
  settings: { icon: Settings, title: "Settings", description: "Workspace preferences, billing and integrations." },
  releases: { icon: Share2, title: "Releases", description: "Track what shipped in each release across your projects." },
};

const docCategories: DocCategory[] = [
  {
    id: "specs",
    title: "Product Specs",
    icon: ArrowUpDown,
    description: "Centralized documentation for feature requirements, user stories, and technical specs across releases.",
    files: [
      { id: "f1", name: "checkout-redesign-spec.pdf", sharedBy: "Sarah M.", size: "240 KB", created: "June 30, 2025 · 2:10 PM" },
      { id: "f2", name: "onboarding-flow-v3.md", sharedBy: "Farah T.", size: "48 KB", created: "June 26, 2025 · 10:22 AM" },
      { id: "f3", name: "user-stories-q3.xlsx", sharedBy: "Ahsan R.", size: "76 KB", created: "June 22, 2025 · 4:45 PM" },
    ],
  },
  {
    id: "guidelines",
    title: "Engineering Guidelines",
    icon: Clock,
    description: "Best practices, coding standards, and architecture decisions to keep engineering consistent and scalable.",
    files: [
      { id: "f4", name: "code-review-checklist.md", sharedBy: "Mehedi H.", size: "12 KB", created: "June 29, 2025 · 9:00 AM" },
      { id: "f5", name: "adr-0012-event-bus.md", sharedBy: "Sarah M.", size: "31 KB", created: "June 18, 2025 · 1:15 PM" },
    ],
  },
  {
    id: "api",
    title: "API References",
    icon: Braces,
    description: "Endpoint definitions, payload structures, and authentication guides for internal and external API use.",
    files: [
      { id: "f6", name: "public-api-v2.yaml", sharedBy: "Ahsan R.", size: "88 KB", created: "June 27, 2025 · 11:40 AM" },
      { id: "f7", name: "auth-flow-diagram.drawio", sharedBy: "Mehedi H.", size: "410 KB", created: "June 21, 2025 · 3:05 PM" },
      { id: "f8", name: "webhooks-payloads.json", sharedBy: "Farah T.", size: "22 KB", created: "June 19, 2025 · 8:50 AM" },
    ],
  },
  {
    id: "design",
    title: "Design System",
    icon: Palette,
    description: "Components, UI patterns, usage rules, and branding assets for maintaining visual and UX consistency.",
    files: [
      { id: "f9", name: "color-tokens-v4.json", sharedBy: "Farah T.", size: "9 KB", created: "June 30, 2025 · 5:20 PM" },
      { id: "f10", name: "component-library.fig", sharedBy: "Sarah M.", size: "3.4 MB", created: "June 24, 2025 · 12:00 PM" },
    ],
  },
  {
    id: "release",
    title: "Release Notes",
    icon: ScrollText,
    description: "Chronological logs of version changes, bug fixes, new features, and known issues.",
    files: [
      { id: "f11", name: "changelog-v2.6.md", sharedBy: "Ahsan R.", size: "14 KB", created: "July 1, 2025 · 9:30 AM" },
      { id: "f12", name: "known-issues-v2.6.md", sharedBy: "Mehedi H.", size: "6 KB", created: "July 1, 2025 · 9:32 AM" },
    ],
  },
  {
    id: "sprint",
    title: "Sprint Archives",
    icon: Zap,
    description: "Past sprint plans, retrospectives, and key decisions for tracking team velocity and iteration history.",
    files: [
      { id: "f13", name: "task-api-spec-v1.2.pdf", sharedBy: "Sarah M.", size: "18 KB", created: "June 28, 2025 · 3:46 PM" },
      { id: "f14", name: "sprint-27-retro-notes.md", sharedBy: "Ahsan R.", size: "320 KB", created: "July 1, 2025 · 11:02 AM" },
      { id: "f15", name: "figma-handoff-checklist.xlsx", sharedBy: "Farah T.", size: "95 KB", created: "June 25, 2025 · 9:15 AM" },
      { id: "f16", name: "real-time-sync-architecture.drawio", sharedBy: "Mehedi H.", size: "1.2 MB", created: "June 24, 2025 · 1:37 PM" },
      { id: "f17", name: "user-persona-beta-group-a.pdf", sharedBy: "Sarah M.", size: "640 KB", created: "June 20, 2025 · 4:02 PM" },
    ],
  },
];

const shortcuts = [
  "Research & Testing",
  "Integrations & Webhooks",
  "API Specs & References",
  "Analytics & Metrics",
  "Security & Compliance",
  "Roadmaps & OKRs",
  "Archived Projects",
];

const engagementBaseline = [30, 34, 33, 38, 42, 40, 46, 50, 48, 54, 58, 55];
const engagementActual = [22, 26, 24, 33, 30, 38, 36, 48, 44, 52, 47, 60];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const viewsEditsSplit = { views: 68, edits: 32 };

const panelActions: { icon: IconType; label: string }[] = [
  { icon: Bookmark, label: "Bookmark" },
  { icon: Pencil, label: "Edit" },
  { icon: Trash2, label: "Delete" },
  { icon: Mail, label: "Email" },
  { icon: RefreshCw, label: "Sync" },
];

const pillSpring = { type: "spring" as const, stiffness: 350, damping: 30 };

function avatarUrl(seed: string) {
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=27272a`;
}

/* ------------------------------------------------------------------ */
/* Generic atoms                                                       */
/* ------------------------------------------------------------------ */

function Dropdown({
  open,
  onClose,
  anchor = "left",
  width = 220,
  children,
}: {
  open: boolean;
  onClose: () => void;
  anchor?: "left" | "right";
  width?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: -6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.97 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ width }}
          className={cn(
            "absolute top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#1C1C1F] p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]",
            anchor === "left" ? "left-0" : "right-0"
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DropdownItem({ icon: Icon, label, onClick, active }: { icon: IconType; label: string; onClick?: () => void; active?: boolean }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-neutral-300 transition-colors hover:bg-white/5">
      <Icon className="h-[15px] w-[15px] text-neutral-500" />
      <span className="flex-1">{label}</span>
      {active && <Check className="h-3.5 w-3.5 text-sky-400" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                              */
/* ------------------------------------------------------------------ */

function NavItem({ icon: Icon, label, active, onClick }: { icon: IconType; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] transition-colors",
        active ? "bg-white font-medium text-neutral-900" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
      )}
    >
      <Icon className="h-[16px] w-[16px]" />
      {label}
    </button>
  );
}

function SidebarSection({ label, open, onToggle, children }: { label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between px-3 py-1.5">
        <button onClick={onToggle} className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-300 hover:text-white">
          {label}
          <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.15 }}>
            <ChevronUp className="h-3.5 w-3.5" />
          </motion.span>
        </button>
        <div className="flex items-center gap-1">
          <button className="flex h-5 w-5 items-center justify-center rounded text-neutral-500 hover:bg-white/10 hover:text-white">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-5 w-5 items-center justify-center rounded text-neutral-500 hover:bg-white/10 hover:text-white">
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.16 }} className="overflow-hidden">
            <div className="flex flex-col gap-0.5 pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({ activeNav, onSelect, activeProject, onSelectProject }: { activeNav: NavKey; onSelect: (key: NavKey) => void; activeProject: string | null; onSelectProject: (id: string) => void }) {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [managementOpen, setManagementOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(true);
  const [appsOpen, setAppsOpen] = useState(false);

  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col gap-3 overflow-y-auto border-r border-white/[0.06] bg-[#0E0E10] p-3">
      <button className="flex items-center gap-2.5 rounded-xl bg-white/[0.05] p-2.5 hover:bg-white/[0.08]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 to-blue-600">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="5.4" stroke="white" strokeWidth="1.3" />
            <circle cx="7" cy="7" r="1.6" fill="white" />
          </svg>
        </span>
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-[13px] font-medium text-white">Courtney Henry</p>
          <p className="truncate text-[11px] text-neutral-500">Nimbus Studio</p>
        </div>
        <span className="text-neutral-500">
          <Columns3 className="h-4 w-4 rotate-90" />
        </span>
      </button>

      <button className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-left text-[13px] text-neutral-500 hover:bg-white/[0.05]">
        <Search className="h-[14px] w-[14px]" />
        <span className="flex-1">Search</span>
        <span className="flex items-center gap-0.5 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-neutral-500">
          <Command className="h-2.5 w-2.5" />F
        </span>
      </button>

      <nav className="flex flex-col gap-3">
        <div>
          <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-600">Essentials</p>
          <div className="flex flex-col gap-0.5">
            {essentialsNav.map((item) => (
              <NavItem key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key} onClick={() => onSelect(item.key)} />
            ))}
          </div>
        </div>

        <div className="h-px bg-white/[0.06]" />

        <SidebarSection label="Projects" open={projectsOpen} onToggle={() => setProjectsOpen((o) => !o)}>
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectProject(p.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13.5px] transition-colors",
                activeProject === p.id ? "bg-white/10 text-white" : "text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
              )}
            >
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md", p.color)}>
                <span className="h-1.5 w-1.5 rounded-full bg-black/30" />
              </span>
              <span className="truncate">{p.name}</span>
            </button>
          ))}
        </SidebarSection>

        <div className="h-px bg-white/[0.06]" />

        <SidebarSection label="Management" open={managementOpen} onToggle={() => setManagementOpen((o) => !o)}>
          <p className="px-3 py-1 text-[12px] text-neutral-600">No items yet</p>
        </SidebarSection>

        <div className="h-px bg-white/[0.06]" />

        <SidebarSection label="Support" open={supportOpen} onToggle={() => setSupportOpen((o) => !o)}>
          {supportNav.map((item) => (
            <NavItem key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key} onClick={() => onSelect(item.key)} />
          ))}
        </SidebarSection>

        <div className="h-px bg-white/[0.06]" />

        <SidebarSection label="Apps" open={appsOpen} onToggle={() => setAppsOpen((o) => !o)}>
          <p className="px-3 py-1 text-[12px] text-neutral-600">No apps connected</p>
        </SidebarSection>
      </nav>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar                                                              */
/* ------------------------------------------------------------------ */

function TopBar({
  query,
  onQueryChange,
  filter,
  onFilterChange,
  view,
  onViewChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  filter: FilterKey;
  onFilterChange: (f: FilterKey) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterLabel: Record<FilterKey, string> = { all: "All", connected: "Connected", notConnected: "Not connected" };

  return (
    <div className="flex items-start justify-between px-7 pb-5 pt-6">
      <div>
        <p className="text-[12.5px] text-neutral-500">Docs</p>
        <h1 className="text-[28px] font-semibold text-white">Docs</h1>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="flex w-[190px] items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
          <Search className="h-[14px] w-[14px] text-neutral-500" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-[13px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
          />
          <span className="flex items-center gap-0.5 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-neutral-500">
            <Command className="h-2.5 w-2.5" />F
          </span>
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-[13px] text-neutral-300 hover:bg-white/[0.07]"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> {filterLabel[filter]}
          </button>
          <Dropdown open={filterOpen} onClose={() => setFilterOpen(false)} anchor="right" width={170}>
            {(["all", "connected", "notConnected"] as const).map((f) => (
              <DropdownItem
                key={f}
                icon={SlidersHorizontal}
                label={filterLabel[f]}
                active={filter === f}
                onClick={() => {
                  onFilterChange(f);
                  setFilterOpen(false);
                }}
              />
            ))}
          </Dropdown>
        </div>

        <button
          onClick={() => onViewChange(view === "grid" ? "list" : "grid")}
          title={view === "grid" ? "Switch to list view" : "Switch to grid view"}
          className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-neutral-300 hover:bg-white/[0.07]"
        >
          {view === "grid" ? <List className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Category cards                                                       */
/* ------------------------------------------------------------------ */

function CategoryCard({
  category,
  connected,
  onToggleConnect,
  onOpen,
  active,
  view,
}: {
  category: DocCategory;
  connected: boolean;
  onToggleConnect: () => void;
  onOpen: () => void;
  active: boolean;
  view: "grid" | "list";
}) {
  const Icon = category.icon;
  if (view === "list") {
    return (
      <motion.button
        layout
        onClick={onOpen}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors",
          active ? "border-sky-400/40 bg-sky-400/[0.05]" : "border-white/[0.06] bg-[#141416] hover:bg-white/[0.03]"
        )}
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-neutral-300">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-medium text-white">{category.title}</p>
          <p className="truncate text-[12px] text-neutral-500">{category.files.length} files</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleConnect();
          }}
          className={cn(
            "shrink-0 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
            connected ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.07] text-neutral-300 hover:bg-white/[0.12]"
          )}
        >
          {connected ? "Connected" : "Connect"}
        </button>
      </motion.button>
    );
  }

  return (
    <motion.button
      layout
      onClick={onOpen}
      className={cn(
        "flex flex-col items-start rounded-2xl border p-4 text-left transition-colors",
        active ? "border-sky-400/40 bg-sky-400/[0.05]" : "border-white/[0.06] bg-[#141416] hover:bg-white/[0.03]"
      )}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] text-neutral-300">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-[14.5px] font-semibold text-white">{category.title}</p>
      <p className="mt-1.5 text-[12px] leading-snug text-neutral-500">{category.description}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleConnect();
        }}
        className={cn(
          "mt-4 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
          connected ? "bg-emerald-500/15 text-emerald-400" : "bg-white/[0.07] text-neutral-300 hover:bg-white/[0.12]"
        )}
      >
        {connected && <Check className="h-3.5 w-3.5" />}
        {connected ? "Connected" : "Connect"}
      </button>
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Shortcut folders                                                     */
/* ------------------------------------------------------------------ */

function ShortcutFolder({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-[100px] shrink-0 flex-col items-center gap-2 text-center">
      <motion.span
        animate={{ y: active ? -2 : 0 }}
        className={cn(
          "flex h-14 w-16 items-center justify-center rounded-lg bg-gradient-to-b shadow-[0_6px_16px_-8px_rgba(0,0,0,0.6)] transition-colors",
          active ? "from-sky-400 to-sky-600" : "from-neutral-600 to-neutral-800"
        )}
      >
        <Folder className="h-6 w-6 text-white/90" />
      </motion.span>
      <span className={cn("text-[11.5px] leading-tight", active ? "text-white" : "text-neutral-400")}>{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Charts                                                                */
/* ------------------------------------------------------------------ */

function EngagementChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...engagementBaseline, ...engagementActual);
  const min = 0;
  const toPoints = (vals: number[]) => vals.map((v, i) => ({ x: (i / (vals.length - 1)) * 100, y: 100 - ((v - min) / (max - min)) * 100 }));
  const baselinePts = toPoints(engagementBaseline);
  const actualPts = toPoints(engagementActual);
  const activeIndex = hovered ?? engagementActual.length - 1;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#141416] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[14px] font-medium text-white">Documentation Engagement Trend</span>
        <div className="flex items-center gap-3 text-[11.5px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded-full border border-dashed border-neutral-400" /> Target
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500" /> Actual
          </span>
        </div>
      </div>
      <div className="relative h-[160px] w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <polyline points={baselinePts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1" strokeDasharray="2,2" vectorEffect="non-scaling-stroke" />
          <polyline points={actualPts.map((p) => `${p.x},${p.y}`).join(" ")} fill="none" stroke="#F97316" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          {actualPts.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={hovered === i ? 1.8 : 1.3} fill="#F43F5E" stroke="#141416" strokeWidth="0.6" />
          ))}
        </svg>
        <div className="absolute inset-0 flex">
          {engagementActual.map((_, i) => (
            <div key={i} className="flex-1" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
          ))}
        </div>
        <motion.div
          layoutId="engagement-tooltip"
          style={{ left: `${actualPts[activeIndex].x}%`, top: `${actualPts[activeIndex].y}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+12px)] whitespace-nowrap rounded-lg border border-white/10 bg-[#1E1E22] px-2.5 py-1.5 text-[11px] text-white shadow-lg"
        >
          {monthsShort[activeIndex]} · {engagementActual[activeIndex]} edits
        </motion.div>
      </div>
      <div className="mt-2 flex justify-between text-[10.5px] text-neutral-500">
        {monthsShort.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

function ViewsEditsChart() {
  const [hovered, setHovered] = useState<"views" | "edits" | null>(null);
  const total = viewsEditsSplit.views + viewsEditsSplit.edits;
  const radius = 15.9;
  const circumference = 2 * Math.PI * radius;
  const viewsDash = (viewsEditsSplit.views / total) * circumference;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#141416] p-5">
      <span className="text-[14px] font-medium text-white">Views &amp; Edits by Week</span>
      <div className="mt-5 flex flex-col items-center gap-4">
        <div className="relative h-[150px] w-[150px]">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="#F5F5F5"
              strokeWidth={hovered === "views" ? 4.4 : 3.6}
              strokeDasharray={`${viewsDash} ${circumference - viewsDash}`}
              strokeLinecap="round"
              className="transition-all duration-200"
              onMouseEnter={() => setHovered("views")}
              onMouseLeave={() => setHovered(null)}
            />
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth={hovered === "edits" ? 4.4 : 3.6}
              strokeDasharray={`${circumference - viewsDash} ${viewsDash}`}
              strokeDashoffset={-viewsDash}
              strokeLinecap="round"
              className="transition-all duration-200"
              onMouseEnter={() => setHovered("edits")}
              onMouseLeave={() => setHovered(null)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] font-bold text-white">{hovered === "edits" ? `${viewsEditsSplit.edits}%` : `${viewsEditsSplit.views}%`}</span>
            <span className="text-[10.5px] text-neutral-500">{hovered === "edits" ? "Edits" : "Views"}</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[12px]">
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F5F5F5]" /> Views
          </span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" /> Edits
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Detail panel                                                         */
/* ------------------------------------------------------------------ */

function DetailPanel({ category }: { category: DocCategory | null }) {
  const [bookmarked, setBookmarked] = useState(false);

  if (!category) {
    return (
      <aside className="flex h-full w-[300px] shrink-0 flex-col items-center justify-center gap-2 border-l border-white/[0.06] bg-[#0E0E10] p-6 text-center">
        <Folder className="h-6 w-6 text-neutral-600" />
        <p className="text-[12.5px] text-neutral-500">Select a category or shortcut to preview its files here.</p>
      </aside>
    );
  }

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col overflow-y-auto border-l border-white/[0.06] bg-[#0E0E10] p-4">
      <div className="mb-4 flex items-center gap-1">
        {panelActions.map((a) => {
          const isBookmark = a.label === "Bookmark";
          const on = isBookmark && bookmarked;
          return (
            <button
              key={a.label}
              onClick={isBookmark ? () => setBookmarked((b) => !b) : undefined}
              title={a.label}
              className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors", on ? "bg-sky-400/20 text-sky-300" : "text-neutral-500 hover:bg-white/5 hover:text-neutral-200")}
            >
              <a.icon className={cn("h-[15px] w-[15px]", on && "fill-current")} />
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={category.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.16 }}>
          <p className="text-[15px] font-semibold text-white">{category.title}</p>
          <p className="mt-1.5 text-[12px] leading-relaxed text-neutral-500">{category.description}</p>

          <div className="mt-4 flex flex-col gap-2.5">
            {category.files.map((f) => (
              <div key={f.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="flex items-start gap-2.5">
                  <img src={avatarUrl(f.sharedBy)} alt={f.sharedBy} className="mt-0.5 h-6 w-6 shrink-0 rounded-full border border-white/10 bg-neutral-800 object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-medium text-neutral-200">{f.name}</p>
                    <p className="text-[11px] text-neutral-500">Shared By: {f.sharedBy}</p>
                    <p className="text-[11px] text-neutral-500">Size: {f.size}</p>
                    <p className="text-[11px] text-neutral-500">Created Time: {f.created}</p>
                  </div>
                </div>
                <button className="mt-2 rounded-lg bg-white/[0.06] px-2.5 py-1 text-[11px] text-neutral-300 hover:bg-white/[0.1]">Details</button>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state                                                          */
/* ------------------------------------------------------------------ */

function EmptyStateDark({ icon: Icon, title, description }: { icon: IconType; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col items-center justify-center gap-3 px-7 py-24 text-center"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
        <Icon className="h-5 w-5 text-neutral-400" />
      </span>
      <h2 className="text-[15px] font-semibold text-white">{title}</h2>
      <p className="max-w-[280px] text-[13.5px] text-neutral-500">{description}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Docs view                                                             */
/* ------------------------------------------------------------------ */

function DocsView({
  query,
  filter,
  connectedIds,
  onToggleConnect,
  view,
  onViewChange,
  selectedId,
  onSelect,
}: {
  query: string;
  filter: FilterKey;
  connectedIds: Set<string>;
  onToggleConnect: (id: string) => void;
  view: "grid" | "list";
  onViewChange: (v: "grid" | "list") => void;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    return docCategories.filter((c) => {
      const matchesQuery = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      const isConnected = connectedIds.has(c.id);
      const matchesFilter = filter === "all" || (filter === "connected" && isConnected) || (filter === "notConnected" && !isConnected);
      return matchesQuery && matchesFilter;
    });
  }, [query, filter, connectedIds]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex flex-col gap-6 px-7 pb-7">
      <motion.div layout className={cn(view === "grid" ? "grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-2.5")}>
        <AnimatePresence initial={false}>
          {visibleCategories.map((c) => (
            <CategoryCard
              key={c.id}
              category={c}
              connected={connectedIds.has(c.id)}
              onToggleConnect={() => onToggleConnect(c.id)}
              onOpen={() => onSelect(c.id)}
              active={selectedId === c.id}
              view={view}
            />
          ))}
        </AnimatePresence>
        {visibleCategories.length === 0 && <p className="py-8 text-center text-[13px] text-neutral-500">No doc categories match your filters.</p>}
      </motion.div>

      <div>
        <p className="mb-3 text-[14px] font-medium text-white">Shortcut</p>
        <div className="flex gap-5 overflow-x-auto pb-1">
          {shortcuts.map((s) => (
            <ShortcutFolder key={s} label={s} active={false} onClick={() => onSelect(docCategories[shortcuts.indexOf(s) % docCategories.length].id)} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.6fr_1fr]">
        <EngagementChart />
        <ViewsEditsChart />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function DocsDashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>("docs");
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [connectedIds, setConnectedIds] = useState<Set<string>>(new Set(["sprint"]));
  const [selectedId, setSelectedId] = useState<string>("sprint");

  function toggleConnect(id: string) {
    setConnectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSelectNav(key: NavKey) {
    setActiveNav(key);
  }

  const navCopy = sectionCopy[activeNav];
  const selectedCategory = docCategories.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0B0B0C] text-white">
      <Sidebar activeNav={activeNav} onSelect={handleSelectNav} activeProject={activeProject} onSelectProject={(id) => setActiveProject((p) => (p === id ? null : id))} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {activeNav === "docs" ? (
          <TopBar query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} view={view} onViewChange={setView} />
        ) : (
          <div className="h-[1px]" />
        )}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeNav === "docs" ? (
              <DocsView
                key="docs"
                query={query}
                filter={filter}
                connectedIds={connectedIds}
                onToggleConnect={toggleConnect}
                view={view}
                onViewChange={setView}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ) : (
              navCopy && <EmptyStateDark key={activeNav} icon={navCopy.icon} title={navCopy.title} description={navCopy.description} />
            )}
          </AnimatePresence>
        </main>
      </div>
      {activeNav === "docs" && <DetailPanel category={selectedCategory} />}
    </div>
  );
}