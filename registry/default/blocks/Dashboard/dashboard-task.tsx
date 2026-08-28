"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Search,
  ChevronsLeft,
  ChevronDown,
  Home,
  CheckSquare,
  Calendar,
  Users,
  FileStack,
  Zap,
  BarChart2,
  Plus,
  MoreHorizontal,
  Settings,
  Rocket,
  Grid2x2,
  ListFilter,
  ArrowUpDown,
  SlidersHorizontal,
  MessageSquare,
  Paperclip,
  X,
  Trash2,
  Check,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  Types                                                               */
/* ================================================================== */

type TaskStatus = "todo" | "in-progress" | "in-review" | "done";
type Priority = "High" | "Medium" | "Low";
type TabKey = "overview" | "lists" | "board" | "timeline" | "files";

type TaskNote = { id: string; author: string; text: string };

type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  assignees: string[];
  dueDate: string; // ISO yyyy-mm-dd
  commentsCount: number;
  attachmentsCount: number;
  notes: TaskNote[];
};

type Project = {
  id: string;
  name: string;
  dot: string;
  tasks: Task[];
};

/* ================================================================== */
/*  Constants                                                          */
/* ================================================================== */

const TODAY_ISO = "2026-08-28";

const STATUS_COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in-progress", label: "In Progress" },
  { id: "in-review", label: "In Review" },
  { id: "done", label: "Done" },
];

const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

const PRIORITY_META: Record<Priority, { chip: string }> = {
  High: { chip: "bg-rose-500/15 text-rose-400" },
  Medium: { chip: "bg-amber-500/15 text-amber-400" },
  Low: { chip: "bg-violet-500/15 text-violet-400" },
};

const TEAM = ["Courtney Henry", "Sophia Lane", "Marc Ade", "Lina Voss", "Theo Kade", "Nora Bell"];

const ESSENTIALS_NAV: { key: string; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
  { key: "home", icon: Home, label: "Home" },
  { key: "tasks", icon: CheckSquare, label: "Tasks" },
  { key: "calendar", icon: Calendar, label: "Calendar" },
  { key: "teams", icon: Users, label: "Teams" },
  { key: "docs", icon: FileStack, label: "Docs" },
  { key: "automations", icon: Zap, label: "Automations" },
  { key: "reporting", icon: BarChart2, label: "Reporting" },
];

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "lists", label: "Lists" },
  { key: "board", label: "Board" },
  { key: "timeline", label: "Timeline" },
  { key: "files", label: "Files" },
];

/* ================================================================== */
/*  Helpers                                                             */
/* ================================================================== */

let uid = 2000;
function nextId(prefix: string) {
  uid += 1;
  return `${prefix}-${uid}`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function formatShortDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[(m ?? 1) - 1]} ${d}`;
}
function isOverdue(iso: string) {
  return iso < TODAY_ISO;
}

function t(
  title: string,
  status: TaskStatus,
  priority: Priority,
  tags: string[],
  assignees: string[],
  dueDate: string,
  description: string,
  commentsCount: number,
  attachmentsCount: number
): Task {
  return {
    id: nextId("task"),
    title,
    description,
    status,
    priority,
    tags,
    assignees,
    dueDate,
    commentsCount,
    attachmentsCount,
    notes: [],
  };
}

function reorderTasks(tasks: Task[], draggedId: string, targetStatus: TaskStatus, beforeTaskId: string | null): Task[] {
  const dragged = tasks.find((tk) => tk.id === draggedId);
  if (!dragged) return tasks;
  const without = tasks.filter((tk) => tk.id !== draggedId);
  const moved: Task = { ...dragged, status: targetStatus };

  if (beforeTaskId) {
    const idx = without.findIndex((tk) => tk.id === beforeTaskId);
    if (idx !== -1) return [...without.slice(0, idx), moved, ...without.slice(idx)];
  }
  let lastIdx = -1;
  without.forEach((tk, i) => {
    if (tk.status === targetStatus) lastIdx = i;
  });
  const insertAt = lastIdx === -1 ? without.length : lastIdx + 1;
  return [...without.slice(0, insertAt), moved, ...without.slice(insertAt)];
}

function sortTasksDisplay(tasks: Task[], sortBy: "manual" | "priority" | "due" | "title"): Task[] {
  if (sortBy === "manual") return tasks;
  const copy = [...tasks];
  const priorityRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
  copy.sort((a, b) => {
    if (sortBy === "priority") return priorityRank[a.priority] - priorityRank[b.priority];
    if (sortBy === "due") return a.dueDate.localeCompare(b.dueDate);
    return a.title.localeCompare(b.title);
  });
  return copy;
}

/* ================================================================== */
/*  Mock data                                                          */
/* ================================================================== */

const HELIO_TASKS: Task[] = [
  t("Implement drag-and-drop for task cards", "todo", "High", ["UI design", "Interaction"], ["Sophia Lane", "Marc Ade", "Lina Voss", "Theo Kade"], "2026-07-02", "Enable intuitive drag-and-drop interaction between Kanban columns using a smooth, physics-based animation.", 45, 2),
  t("Write unit tests for task filters", "todo", "Medium", ["QA", "Audit"], ["Theo Kade", "Nora Bell"], "2026-07-05", "Ensure task filtering logic works correctly across status, tags, and assignee combinations.", 12, 14),
  t("Add loading skeletons to task view", "todo", "Low", ["UI design", "Aesthetics"], ["Lina Voss"], "2026-07-06", "Show lightweight placeholder shapes while task and board data are still loading.", 3, 0),
  t("Fix drag ghost image rendering in Safari", "todo", "High", ["Bug", "Frontend"], ["Marc Ade", "Theo Kade"], "2026-07-08", "Safari renders a blank drag preview when picking up a card; needs a custom drag image fallback.", 8, 1),
  t("Add empty state illustrations for columns", "todo", "Medium", ["UI design", "Aesthetics"], ["Lina Voss", "Sophia Lane"], "2026-07-09", "Design and implement friendly empty states for columns with zero cards.", 6, 4),
  t("Write onboarding tooltip copy", "todo", "Low", ["Docs", "Copy"], ["Sophia Lane"], "2026-07-10", "Draft the microcopy for the first-run tooltips guiding new users through the board.", 2, 0),
  t("Set up webhook for task status changes", "todo", "Medium", ["Backend", "Automations"], ["Theo Kade", "Nora Bell"], "2026-07-11", "Trigger outbound webhooks whenever a task moves between columns.", 9, 2),
  t("Add keyboard shortcuts for quick actions", "todo", "High", ["Interaction", "Accessibility"], ["Marc Ade", "Lina Voss"], "2026-07-12", "Support arrow-key navigation and Enter to open the focused task card.", 14, 1),
  t("Audit color contrast across dark theme", "todo", "Low", ["Design System", "Accessibility"], ["Lina Voss"], "2026-07-14", "Check every badge, tag, and text pairing meets WCAG AA contrast in dark mode.", 4, 0),
  t("Paginate the Lists view for large boards", "todo", "Medium", ["Backend", "Performance"], ["Theo Kade"], "2026-07-15", "Avoid rendering thousands of rows at once by paginating or virtualizing the list.", 5, 1),
  t("Add due-date reminders", "todo", "High", ["Automations", "Notifications"], ["Nora Bell", "Sophia Lane"], "2026-07-17", "Send a notification 24 hours before a task's due date if it's still incomplete.", 7, 0),
  t("Support multi-select for bulk actions", "todo", "Medium", ["Interaction", "UI design"], ["Marc Ade", "Lina Voss", "Theo Kade"], "2026-07-19", "Let users shift-click to select multiple cards and move or tag them together.", 11, 3),
  t("Build column reorder functionality", "in-progress", "Medium", ["UI design", "Interaction"], ["Sophia Lane", "Marc Ade", "Lina Voss"], "2026-07-02", "Allow users to drag and rearrange Kanban columns to customize their workflow layout.", 45, 2),
  t("Refactor task card component for modularity", "in-review", "Low", ["Design System", "Docs"], ["Marc Ade"], "2026-07-02", "Break down the task card into smaller, reusable components to improve maintainability and scalability.", 5, 3),
  t("Document API endpoints for task CRUD operations", "in-review", "Medium", ["Backend", "Tech"], ["Theo Kade", "Nora Bell"], "2026-07-05", "Create clear and structured documentation for all task-related Create, Read, Update, and Delete API.", 34, 1),
  t("Create initial column layout (To Do, In Progress, Done)", "done", "High", ["Research", "Audit"], ["Sophia Lane", "Marc Ade", "Lina Voss", "Theo Kade"], "2026-07-02", "Set up the default Kanban structure with predefined columns to support basic task workflow.", 45, 2),
];

const ATLAS_TASKS: Task[] = [
  t("Migrate contacts schema to new CRM model", "todo", "High", ["Backend", "Data"], ["Theo Kade", "Nora Bell"], "2026-09-02", "Move legacy contact records into the redesigned relational schema without data loss.", 6, 1),
  t("Design pipeline stage editor", "todo", "Medium", ["UI design", "Interaction"], ["Lina Voss"], "2026-09-05", "Let sales admins reorder and rename deal pipeline stages visually.", 3, 0),
  t("Build lead scoring rules engine", "in-progress", "Medium", ["Backend", "Automations"], ["Marc Ade", "Theo Kade"], "2026-09-08", "Score inbound leads automatically based on configurable weighted rules.", 9, 2),
  t("QA import/export CSV flows", "in-review", "Low", ["QA", "Audit"], ["Nora Bell"], "2026-09-11", "Verify large CSV imports and exports handle edge cases and malformed rows.", 4, 1),
  t("Write CRM migration changelog", "done", "Low", ["Docs"], ["Sophia Lane"], "2026-08-20", "Summarize schema and workflow changes for the support team ahead of launch.", 2, 0),
];

const NIMBUS_TASKS: Task[] = [
  t("Add real-time revenue chart", "todo", "High", ["Frontend", "Data viz"], ["Lina Voss", "Marc Ade"], "2026-09-03", "Stream live revenue updates into the dashboard's headline chart.", 7, 1),
  t("Optimize dashboard query caching", "todo", "Medium", ["Backend", "Performance"], ["Theo Kade"], "2026-09-06", "Cache expensive aggregation queries to cut dashboard load time.", 5, 0),
  t("Build custom date-range picker", "todo", "Medium", ["UI design", "Interaction"], ["Sophia Lane"], "2026-09-09", "Replace the default date input with a range picker that supports presets.", 4, 2),
  t("Fix tooltip overflow on small screens", "in-progress", "Low", ["Bug", "Frontend"], ["Lina Voss"], "2026-09-04", "Chart tooltips clip off-screen on narrow viewports; needs edge-aware positioning.", 3, 0),
  t("Add CSV export for reports", "in-review", "Medium", ["Backend", "Tech"], ["Theo Kade", "Nora Bell"], "2026-09-12", "Let users download any dashboard report as a formatted CSV.", 8, 1),
  t("Write dashboard onboarding guide", "done", "Low", ["Docs"], ["Sophia Lane"], "2026-08-22", "Draft the getting-started guide for first-time dashboard users.", 2, 0),
];

const ORION_TASKS: Task[] = [
  t("Add rate limiting per API key", "todo", "High", ["Backend", "Security"], ["Theo Kade"], "2026-09-01", "Prevent abuse by capping requests per key with a configurable sliding window.", 10, 1),
  t("Write OpenAPI spec for v2 routes", "todo", "Medium", ["Docs", "Tech"], ["Nora Bell"], "2026-09-07", "Document every v2 gateway route with request and response schemas.", 6, 2),
  t("Set up canary deploys for gateway", "in-progress", "High", ["Infra", "Automations"], ["Marc Ade", "Theo Kade"], "2026-09-03", "Roll new gateway builds out to a small percentage of traffic before full release.", 9, 0),
  t("Load test new auth middleware", "in-review", "Medium", ["QA", "Performance"], ["Lina Voss"], "2026-09-10", "Confirm the new auth middleware holds up under peak concurrent load.", 5, 1),
  t("Deprecate legacy v1 endpoints", "in-review", "Low", ["Backend", "Tech"], ["Theo Kade"], "2026-09-14", "Mark v1 routes deprecated and add sunset headers ahead of removal.", 3, 0),
  t("Publish gateway changelog", "done", "Low", ["Docs"], ["Nora Bell"], "2026-08-18", "Summarize the latest gateway release for downstream API consumers.", 2, 0),
];

const INITIAL_PROJECTS: Project[] = [
  { id: "atlas", name: "Atlas CRM Revamp", dot: "bg-emerald-500", tasks: ATLAS_TASKS },
  { id: "nimbus", name: "Nimbus Dashboard", dot: "bg-amber-500", tasks: NIMBUS_TASKS },
  { id: "orion", name: "Orion API Gateway", dot: "bg-blue-500", tasks: ORION_TASKS },
  { id: "helio", name: "Helio Task System", dot: "bg-rose-500", tasks: HELIO_TASKS },
];

/* ================================================================== */
/*  Small atoms                                                        */
/* ================================================================== */

function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <img
      src={"/avatar.png"}
      alt={name}
      title={name}
      className={cn("shrink-0 rounded-full border-2 border-[#0B0B0D] bg-neutral-800 object-cover", className)}
    />
  );
}

function AvatarStack({ names, max = 3 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((name) => (
          <Avatar key={name} name={name} className="h-6 w-6" />
        ))}
      </div>
      {rest > 0 && (
        <span className="ml-1 flex h-6 items-center rounded-full bg-white/[0.06] px-1.5 text-[11px] font-medium text-neutral-300">
          +{rest}
        </span>
      )}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium", PRIORITY_META[priority].chip)}>
      {priority}
    </span>
  );
}

function TagChip({ label, onClick }: { label: string; onClick?: (e: React.MouseEvent) => void }) {
  return (
    <span
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-neutral-300",
        onClick && "cursor-pointer hover:bg-white/[0.1] hover:text-neutral-100"
      )}
    >
      {label}
    </span>
  );
}

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
        className={cn("absolute z-50 rounded-xl border border-white/10 bg-[#151517] shadow-2xl shadow-black/60", anchorClassName)}
      >
        {children}
      </motion.div>
    </>
  );
}

function ToastStack({ toasts }: { toasts: { id: number; message: string }[] }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col items-end gap-2">
      <AnimatePresence>
        {toasts.map((tst) => (
          <motion.div
            key={tst.id}
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="pointer-events-auto flex items-center gap-2 rounded-xl border border-white/10 bg-[#1A1A1D] px-4 py-2.5 text-[13px] font-medium text-neutral-100 shadow-xl"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            {tst.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  Sidebar                                                             */
/* ================================================================== */

function SidebarSection({
  label,
  expanded,
  onToggle,
  onAdd,
  children,
}: {
  label: string;
  expanded: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1 px-2.5">
        <button
          onClick={onToggle}
          className="flex flex-1 items-center gap-1.5 rounded-md py-1 text-left text-[11.5px] font-medium uppercase tracking-wide text-neutral-500 hover:text-neutral-300"
        >
          <motion.span animate={{ rotate: expanded ? 0 : -90 }} transition={{ duration: 0.15 }}>
            <ChevronDown className="h-3 w-3" />
          </motion.span>
          {label}
        </button>
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex h-5 w-5 items-center justify-center rounded-md text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-200"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="overflow-hidden"
          >
            <div className="mt-0.5 flex flex-col gap-0.5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({
  collapsed,
  onToggleCollapsed,
  activeSection,
  onSelectSection,
  projects,
  activeProjectId,
  onSelectProject,
  onSearchFocusHint,
  pushToast,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  activeSection: string;
  onSelectSection: (key: string) => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onSearchFocusHint: () => void;
  pushToast: (m: string) => void;
}) {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [managementOpen, setManagementOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(true);
  const [appsOpen, setAppsOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex h-full shrink-0 flex-col overflow-hidden border-r border-white/[0.06] bg-[#0E0E10] py-4"
    >
      <div className={cn("flex items-center gap-2.5 px-3 pb-4", collapsed && "justify-center px-0")}>
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-lg">
            <img
                src="/faviconblack.png"
                alt="Logo BagUi"
                className="h-full w-full object-cover"
            />
        </div>

        {!collapsed && (
          <>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-neutral-100">BagUI</p>
              <p className="truncate text-[11.5px] text-neutral-500">Open Source Ui Blocks</p>
            </div>
            <button
              onClick={onToggleCollapsed}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-200"
            >
              <ChevronsLeft className="h-[15px] w-[15px]" />
            </button>
          </>
        )}
      </div>
      {collapsed && (
        <button
          onClick={onToggleCollapsed}
          className="absolute right-1.5 top-4 flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-200"
        >
          <ChevronsLeft className="h-[13px] w-[13px] rotate-180" />
        </button>
      )}

      <div className="px-3">
        <button
          onClick={onSearchFocusHint}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-2 text-left text-[13px] text-neutral-500 hover:bg-white/[0.05]",
            collapsed && "justify-center px-0"
          )}
        >
          <Search className="h-[14px] w-[14px] shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1">Search</span>
              <span className="rounded border border-white/10 px-1 py-0.5 text-[10px] text-neutral-500">⌘F</span>
            </>
          )}
        </button>
      </div>

      <nav className="mt-4 flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-3">
        {!collapsed && <p className="px-2.5 text-[11.5px] font-medium uppercase tracking-wide text-neutral-500">Essentials</p>}
        <div className="mt-0.5 flex flex-col gap-0.5">
          {ESSENTIALS_NAV.map((item) => {
            const active = activeSection === item.key;
            return (
              <button
                key={item.key}
                title={collapsed ? item.label : undefined}
                onClick={() => onSelectSection(item.key)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13.5px] transition-colors",
                  collapsed && "justify-center px-0",
                  active ? "bg-white font-medium text-neutral-900" : "text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
                )}
              >
                <item.icon className="h-[15px] w-[15px] shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>

        {!collapsed && (
          <>
            <SidebarSection
              label="Projects"
              expanded={projectsOpen}
              onToggle={() => setProjectsOpen((v) => !v)}
              onAdd={() => pushToast("Creating projects is a demo action")}
            >
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] transition-colors",
                    p.id === activeProjectId && activeSection === "tasks"
                      ? "bg-white/[0.08] font-medium text-neutral-100"
                      : "text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
                  )}
                >
                  <span className={cn("h-2 w-2 shrink-0 rounded-full", p.dot)} />
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </SidebarSection>

            <SidebarSection label="Management" expanded={managementOpen} onToggle={() => setManagementOpen((v) => !v)}>
              <button
                onClick={() => onSelectSection("team-directory")}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
              >
                Team directory
              </button>
              <button
                onClick={() => onSelectSection("resource-planning")}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
              >
                Resource planning
              </button>
            </SidebarSection>

            <SidebarSection label="Support" expanded={supportOpen} onToggle={() => setSupportOpen((v) => !v)}>
              <button
                onClick={() => onSelectSection("settings")}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
              >
                <Settings className="h-[15px] w-[15px]" /> Settings
              </button>
              <button
                onClick={() => onSelectSection("releases")}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
              >
                <Rocket className="h-[15px] w-[15px]" /> Releases
              </button>
            </SidebarSection>

            <SidebarSection label="Apps" expanded={appsOpen} onToggle={() => setAppsOpen((v) => !v)}>
              <button
                onClick={() => onSelectSection("app-slack")}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
              >
                Slack
              </button>
              <button
                onClick={() => onSelectSection("app-github")}
                className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-left text-[13.5px] text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
              >
                GitHub
              </button>
            </SidebarSection>
          </>
        )}
      </nav>
    </motion.aside>
  );
}

/* ================================================================== */
/*  Task card                                                          */
/* ================================================================== */

const TaskCard = React.memo(function TaskCard({
  task,
  isDragging,
  isDropTarget,
  showTags,
  showDescription,
  onOpen,
  onTagClick,
  onDragStart,
  onDragOver,
  onDragEnd,
}: {
  task: Task;
  isDragging: boolean;
  isDropTarget: boolean;
  showTags: boolean;
  showDescription: boolean;
  onOpen: (task: Task) => void;
  onTagClick: (tag: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent, task: Task) => void;
  onDragEnd: () => void;
}) {
  const overdue = isOverdue(task.dueDate) && task.status !== "done";
  return (
    <div>
      <AnimatePresence>
        {isDropTarget && (
          <motion.div
            layout
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0.7 }}
            className="mb-2 h-0.5 rounded-full bg-blue-500"
          />
        )}
      </AnimatePresence>
      <motion.div
        layout
        layoutId={task.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isDragging ? 0.35 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.18 }}
        draggable
        onDragStart={(e) => onDragStart(e as unknown as React.DragEvent, task)}
        onDragOver={(e) => onDragOver(e as unknown as React.DragEvent, task)}
        onDragEnd={onDragEnd}
        onClick={() => onOpen(task)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen(task);
        }}
        className="group cursor-grab rounded-xl border border-white/[0.06] bg-[#141416] p-3.5 text-left shadow-sm shadow-black/30 transition-colors hover:border-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 active:cursor-grabbing"
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            {showTags &&
              task.tags.map((tag) => (
                <TagChip
                  key={tag}
                  label={tag}
                  onClick={(e) => {
                    e.stopPropagation();
                    onTagClick(tag);
                  }}
                />
              ))}
          </div>
        </div>

        <p className="text-[13.5px] font-medium leading-snug text-neutral-100">{task.title}</p>
        {showDescription && task.description && (
          <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-neutral-500">{task.description}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <AvatarStack names={task.assignees} />
        </div>

        <div className="mt-3 flex items-center gap-3 text-[11.5px] text-neutral-500">
          <span className={cn("flex items-center gap-1", overdue && "text-rose-400")}>
            <Calendar className="h-3 w-3" />
            {formatShortDate(task.dueDate)}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {task.commentsCount}
          </span>
          <span className="flex items-center gap-1">
            <Paperclip className="h-3 w-3" />+{task.attachmentsCount}
          </span>
        </div>
      </motion.div>
    </div>
  );
});

/* ================================================================== */
/*  Add task inline form                                               */
/* ================================================================== */

function AddTaskInline({ onAdd, onCancel }: { onAdd: (title: string, priority: Priority) => void; onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    if (title.trim()) onAdd(title.trim(), priority);
    else onCancel();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.16 }}
      className="overflow-hidden rounded-xl border border-white/15 bg-[#141416] p-3"
    >
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="Task title"
        className="w-full bg-transparent text-[13.5px] text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
      />
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex gap-1">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={cn(
                "rounded-md px-2 py-0.5 text-[11px] font-medium transition-colors",
                priority === p ? PRIORITY_META[p].chip : "bg-white/[0.04] text-neutral-500 hover:bg-white/[0.08]"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onCancel} className="rounded-md px-2 py-1 text-[12px] text-neutral-500 hover:text-neutral-300">
            Cancel
          </button>
          <button onClick={submit} className="rounded-md bg-white px-2.5 py-1 text-[12px] font-medium text-neutral-900 hover:bg-neutral-200">
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ================================================================== */
/*  Board column                                                       */
/* ================================================================== */

function BoardColumn({
  column,
  tasks,
  draggingId,
  dragOverColumn,
  dragOverTaskId,
  showTags,
  showDescription,
  onOpenTask,
  onTagClick,
  onDragStart,
  onCardDragOver,
  onColumnDragOver,
  onColumnDragEnter,
  onDrop,
  onDragEnd,
  addingColumn,
  onStartAdd,
  onCancelAdd,
  onAddTask,
  onSortColumn,
  onClearColumn,
}: {
  column: { id: TaskStatus; label: string };
  tasks: Task[];
  draggingId: string | null;
  dragOverColumn: TaskStatus | null;
  dragOverTaskId: string | null;
  showTags: boolean;
  showDescription: boolean;
  onOpenTask: (task: Task) => void;
  onTagClick: (tag: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onCardDragOver: (e: React.DragEvent, task: Task) => void;
  onColumnDragOver: (e: React.DragEvent) => void;
  onColumnDragEnter: (status: TaskStatus) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragEnd: () => void;
  addingColumn: TaskStatus | null;
  onStartAdd: (status: TaskStatus) => void;
  onCancelAdd: () => void;
  onAddTask: (status: TaskStatus, title: string, priority: Priority) => void;
  onSortColumn: (status: TaskStatus, by: "priority" | "due") => void;
  onClearColumn: (status: TaskStatus) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isColumnDropTarget = draggingId && dragOverColumn === column.id && !dragOverTaskId;

  return (
    <div
      className="flex w-[300px] shrink-0 flex-col"
      onDragEnter={() => onColumnDragEnter(column.id)}
      onDragOver={onColumnDragOver}
      onDrop={(e) => onDrop(e, column.id)}
    >
      <div className="mb-3 flex items-center justify-between px-0.5">
        <div>
          <h3 className="text-[13.5px] font-semibold text-neutral-100">{column.label}</h3>
          <p className="text-[11.5px] text-neutral-500">{tasks.length} cards</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-200"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <Dropdown open onClose={() => setMenuOpen(false)} anchorClassName="right-0 top-[calc(100%+4px)] w-[180px] py-1.5">
                <button
                  onClick={() => {
                    onSortColumn(column.id, "priority");
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-neutral-300 hover:bg-white/[0.06]"
                >
                  Sort by priority
                </button>
                <button
                  onClick={() => {
                    onSortColumn(column.id, "due");
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-neutral-300 hover:bg-white/[0.06]"
                >
                  Sort by due date
                </button>
                <button
                  onClick={() => {
                    onClearColumn(column.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Clear column
                </button>
              </Dropdown>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={() => onStartAdd(column.id)}
        className="mb-3 flex items-center justify-center rounded-lg border border-dashed border-white/10 py-2 text-neutral-500 transition-colors hover:border-white/20 hover:text-neutral-300"
      >
        <Plus className="h-4 w-4" />
      </button>

      <div
        className={cn(
          "flex min-h-[80px] flex-1 flex-col gap-2.5 rounded-xl p-1 transition-colors",
          isColumnDropTarget && "bg-blue-500/[0.06] ring-1 ring-inset ring-blue-500/20"
        )}
      >
        <AnimatePresence initial={false}>
          {addingColumn === column.id && (
            <AddTaskInline key="add-form" onAdd={(title, priority) => onAddTask(column.id, title, priority)} onCancel={onCancelAdd} />
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={draggingId === task.id}
              isDropTarget={dragOverColumn === column.id && dragOverTaskId === task.id}
              showTags={showTags}
              showDescription={showDescription}
              onOpen={onOpenTask}
              onTagClick={onTagClick}
              onDragStart={onDragStart}
              onDragOver={onCardDragOver}
              onDragEnd={onDragEnd}
            />
          ))}
        </AnimatePresence>

        {tasks.length === 0 && addingColumn !== column.id && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-white/[0.06] py-8 text-[12px] text-neutral-600">
            Drop a card here
          </div>
        )}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Board view                                                         */
/* ================================================================== */

function BoardView({
  tasks,
  sortBy,
  showTags,
  showDescription,
  visibleStatuses,
  onOpenTask,
  onTagClick,
  onMutateTasks,
  pushToast,
}: {
  tasks: Task[];
  sortBy: "manual" | "priority" | "due" | "title";
  showTags: boolean;
  showDescription: boolean;
  visibleStatuses: TaskStatus[];
  onOpenTask: (task: Task) => void;
  onTagClick: (tag: string) => void;
  onMutateTasks: (updater: (tasks: Task[]) => Task[]) => void;
  pushToast: (m: string) => void;
}) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const [addingColumn, setAddingColumn] = useState<TaskStatus | null>(null);

  const columnTasks = useMemo(() => {
    const map = new Map<TaskStatus, Task[]>();
    STATUS_COLUMNS.forEach((c) => map.set(c.id, []));
    tasks.forEach((task) => map.get(task.status)?.push(task));
    const result = new Map<TaskStatus, Task[]>();
    map.forEach((list, status) => result.set(status, sortTasksDisplay(list, sortBy)));
    return result;
  }, [tasks, sortBy]);

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
    setDraggingId(task.id);
  }, []);

  const handleColumnDragEnter = useCallback((status: TaskStatus) => {
    setDragOverColumn((prev) => {
      if (prev !== status) setDragOverTaskId(null);
      return status;
    });
  }, []);

  const handleCardDragOver = useCallback((e: React.DragEvent, task: Task) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverColumn(task.status);
    setDragOverTaskId(task.id);
  }, []);

  const handleColumnDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, status: TaskStatus) => {
      e.preventDefault();
      if (!draggingId) return;
      const beforeId = dragOverColumn === status ? dragOverTaskId : null;
      onMutateTasks((prev) => reorderTasks(prev, draggingId, status, beforeId));
      setDraggingId(null);
      setDragOverColumn(null);
      setDragOverTaskId(null);
    },
    [draggingId, dragOverColumn, dragOverTaskId, onMutateTasks]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingId(null);
    setDragOverColumn(null);
    setDragOverTaskId(null);
  }, []);

  const addTask = useCallback(
    (status: TaskStatus, title: string, priority: Priority) => {
      const task: Task = {
        id: nextId("task"),
        title,
        description: "",
        status,
        priority,
        tags: [],
        assignees: [],
        dueDate: "2026-09-15",
        commentsCount: 0,
        attachmentsCount: 0,
        notes: [],
      };
      onMutateTasks((prev) => [task, ...prev]);
      setAddingColumn(null);
      pushToast("Task created");
    },
    [onMutateTasks, pushToast]
  );

  const sortColumn = useCallback(
    (status: TaskStatus, by: "priority" | "due") => {
      onMutateTasks((prev) => {
        const inCol = sortTasksDisplay(
          prev.filter((tk) => tk.status === status),
          by
        );
        const others = prev.filter((tk) => tk.status !== status);
        return [...others, ...inCol];
      });
      pushToast(`Sorted by ${by === "priority" ? "priority" : "due date"}`);
    },
    [onMutateTasks, pushToast]
  );

  const clearColumn = useCallback(
    (status: TaskStatus) => {
      onMutateTasks((prev) => prev.filter((tk) => tk.status !== status));
      pushToast("Column cleared");
    },
    [onMutateTasks, pushToast]
  );

  const columns = STATUS_COLUMNS.filter((c) => visibleStatuses.includes(c.id));

  return (
    <div className="flex flex-1 gap-5 overflow-x-auto pb-4">
      {columns.map((column) => (
        <BoardColumn
          key={column.id}
          column={column}
          tasks={columnTasks.get(column.id) ?? []}
          draggingId={draggingId}
          dragOverColumn={dragOverColumn}
          dragOverTaskId={dragOverTaskId}
          showTags={showTags}
          showDescription={showDescription}
          onOpenTask={onOpenTask}
          onTagClick={onTagClick}
          onDragStart={handleDragStart}
          onCardDragOver={handleCardDragOver}
          onColumnDragOver={handleColumnDragOver}
          onColumnDragEnter={handleColumnDragEnter}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          addingColumn={addingColumn}
          onStartAdd={setAddingColumn}
          onCancelAdd={() => setAddingColumn(null)}
          onAddTask={addTask}
          onSortColumn={sortColumn}
          onClearColumn={clearColumn}
        />
      ))}
    </div>
  );
}

/* ================================================================== */
/*  Lists view                                                         */
/* ================================================================== */

function ListsView({
  tasks,
  onOpenTask,
}: {
  tasks: Task[];
  onOpenTask: (task: Task) => void;
}) {
  const [sortKey, setSortKey] = useState<"title" | "status" | "priority" | "due">("due");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };

  const sorted = useMemo(() => {
    const copy = [...tasks];
    const statusRank: Record<TaskStatus, number> = { todo: 0, "in-progress": 1, "in-review": 2, done: 3 };
    const priorityRank: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "title") cmp = a.title.localeCompare(b.title);
      if (sortKey === "status") cmp = statusRank[a.status] - statusRank[b.status];
      if (sortKey === "priority") cmp = priorityRank[a.priority] - priorityRank[b.priority];
      if (sortKey === "due") cmp = a.dueDate.localeCompare(b.dueDate);
      return cmp * sortDir;
    });
    return copy;
  }, [tasks, sortKey, sortDir]);

  const statusLabel: Record<TaskStatus, string> = { todo: "To Do", "in-progress": "In Progress", "in-review": "In Review", done: "Done" };

  const Header = ({ label, k }: { label: string; k: typeof sortKey }) => (
    <th className="cursor-pointer select-none px-4 py-2.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-neutral-500 hover:text-neutral-300" onClick={() => toggleSort(k)}>
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k && <ArrowUpDown className="h-3 w-3" />}
      </span>
    </th>
  );

  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.06]">
      <table className="w-full border-collapse text-[13px]">
        <thead className="bg-white/[0.02]">
          <tr>
            <Header label="Task" k="title" />
            <Header label="Status" k="status" />
            <Header label="Priority" k="priority" />
            <th className="px-4 py-2.5 text-left text-[11.5px] font-medium uppercase tracking-wide text-neutral-500">Assignees</th>
            <Header label="Due" k="due" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((task) => (
            <tr
              key={task.id}
              onClick={() => onOpenTask(task)}
              className="cursor-pointer border-t border-white/[0.05] hover:bg-white/[0.03]"
            >
              <td className="max-w-[320px] truncate px-4 py-3 font-medium text-neutral-100">{task.title}</td>
              <td className="px-4 py-3 text-neutral-400">{statusLabel[task.status]}</td>
              <td className="px-4 py-3">
                <PriorityBadge priority={task.priority} />
              </td>
              <td className="px-4 py-3">
                <AvatarStack names={task.assignees} max={4} />
              </td>
              <td className={cn("px-4 py-3", isOverdue(task.dueDate) && task.status !== "done" ? "text-rose-400" : "text-neutral-400")}>
                {formatShortDate(task.dueDate)}
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                No tasks match your filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ================================================================== */
/*  Overview view                                                      */
/* ================================================================== */

function OverviewView({ tasks, onOpenTask }: { tasks: Task[]; onOpenTask: (task: Task) => void }) {
  const total = tasks.length || 1;
  const byStatus = STATUS_COLUMNS.map((c) => ({
    ...c,
    count: tasks.filter((tk) => tk.status === c.id).length,
  }));
  const byPriority = PRIORITIES.map((p) => ({
    priority: p,
    count: tasks.filter((tk) => tk.priority === p).length,
  }));
  const upcoming = useMemo(() => [...tasks].filter((tk) => tk.status !== "done").sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5), [tasks]);

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 lg:col-span-2">
        <h3 className="mb-4 text-[13.5px] font-medium text-neutral-200">Status breakdown</h3>
        <div className="flex flex-col gap-3">
          {byStatus.map((s) => (
            <div key={s.id}>
              <div className="mb-1 flex items-center justify-between text-[12.5px]">
                <span className="text-neutral-300">{s.label}</span>
                <span className="text-neutral-500">{s.count}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(s.count / total) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full rounded-full bg-blue-500"
                />
              </div>
            </div>
          ))}
        </div>

        <h3 className="mb-4 mt-7 text-[13.5px] font-medium text-neutral-200">Priority breakdown</h3>
        <div className="flex gap-3">
          {byPriority.map((p) => (
            <div key={p.priority} className="flex-1 rounded-lg border border-white/[0.06] p-3.5 text-center">
              <p className="text-[20px] font-semibold text-neutral-100">{p.count}</p>
              <PriorityBadge priority={p.priority} />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <h3 className="mb-4 text-[13.5px] font-medium text-neutral-200">Coming up</h3>
        <div className="flex flex-col gap-1">
          {upcoming.map((task) => (
            <button
              key={task.id}
              onClick={() => onOpenTask(task)}
              className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/[0.04]"
            >
              <span className="truncate text-[12.5px] text-neutral-300">{task.title}</span>
              <span className={cn("shrink-0 text-[11.5px]", isOverdue(task.dueDate) ? "text-rose-400" : "text-neutral-500")}>
                {formatShortDate(task.dueDate)}
              </span>
            </button>
          ))}
          {upcoming.length === 0 && <p className="px-2 py-2 text-[12.5px] text-neutral-500">Nothing due — you're all caught up.</p>}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Empty placeholder (Timeline / Files / non-tasks sections)          */
/* ================================================================== */

function EmptyPlaceholder({ icon: Icon, title, description, onBack }: { icon: React.ComponentType<{ className?: string }>; title: string; description: string; onBack?: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-24 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.05]">
        <Icon className="h-5 w-5 text-neutral-400" />
      </div>
      <h3 className="text-[15px] font-medium text-neutral-100">{title}</h3>
      <p className="mt-1.5 max-w-sm text-[13px] text-neutral-500">{description}</p>
      {onBack && (
        <button onClick={onBack} className="mt-5 flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-neutral-900 hover:bg-neutral-200">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Tasks
        </button>
      )}
    </div>
  );
}

/* ================================================================== */
/*  Task drawer                                                        */
/* ================================================================== */

function TaskDrawer({
  task,
  onClose,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onClose: () => void;
  onUpdate: (id: string, updater: (task: Task) => Task) => void;
  onDelete: (id: string) => void;
}) {
  const prefersReduced = useReducedMotion();
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(task.title);
  const [assigneeMenuOpen, setAssigneeMenuOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => setTitleDraft(task.title), [task.id, task.title]);

  const saveTitle = () => {
    const trimmed = titleDraft.trim();
    if (trimmed) onUpdate(task.id, (tk) => ({ ...tk, title: trimmed }));
    setEditingTitle(false);
  };

  const toggleAssignee = (name: string) => {
    onUpdate(task.id, (tk) => ({
      ...tk,
      assignees: tk.assignees.includes(name) ? tk.assignees.filter((n) => n !== name) : [...tk.assignees, name],
    }));
  };

  const addNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    onUpdate(task.id, (tk) => ({
      ...tk,
      commentsCount: tk.commentsCount + 1,
      notes: [...tk.notes, { id: nextId("note"), author: "Courtney Henry", text }],
    }));
    setNoteDraft("");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReduced ? 0 : 0.15 }}
        className="fixed inset-0 z-40 bg-black/60"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 320, damping: 34 }}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[440px] flex-col overflow-y-auto border-l border-white/10 bg-[#111113] p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="text-[11.5px] uppercase tracking-wide text-neutral-500">Task</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-rose-500/10 hover:text-rose-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-white/[0.06] hover:text-neutral-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {editingTitle ? (
          <input
            autoFocus
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === "Enter" && saveTitle()}
            className="mb-4 w-full rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-[18px] font-semibold text-neutral-100 focus:outline-none"
          />
        ) : (
          <h2 onClick={() => setEditingTitle(true)} className="mb-4 cursor-text text-[18px] font-semibold leading-snug text-neutral-100 hover:opacity-80">
            {task.title}
          </h2>
        )}

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              onClick={() => onUpdate(task.id, (tk) => ({ ...tk, priority: p }))}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                task.priority === p ? PRIORITY_META[p].chip : "bg-white/[0.04] text-neutral-500 hover:bg-white/[0.08]"
              )}
            >
              {p}
            </button>
          ))}
          <span className="mx-1 h-4 w-px bg-white/10" />
          <select
            value={task.status}
            onChange={(e) => onUpdate(task.id, (tk) => ({ ...tk, status: e.target.value as TaskStatus }))}
            className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11.5px] text-neutral-300 focus:outline-none"
          >
            {STATUS_COLUMNS.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#111113]">
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[11.5px] font-medium uppercase tracking-wide text-neutral-500">Description</p>
          <textarea
            value={task.description}
            onChange={(e) => onUpdate(task.id, (tk) => ({ ...tk, description: e.target.value }))}
            rows={4}
            placeholder="Add a description…"
            className="w-full resize-none rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-[13px] leading-relaxed text-neutral-300 placeholder:text-neutral-600 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[11.5px] font-medium uppercase tracking-wide text-neutral-500">Tags</p>
          <div className="flex flex-wrap gap-1.5">
            {task.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-white/[0.06] px-2 py-1 text-[11.5px] text-neutral-300">
                {tag}
                <button
                  onClick={() => onUpdate(task.id, (tk) => ({ ...tk, tags: tk.tags.filter((tg) => tg !== tag) }))}
                  className="text-neutral-500 hover:text-neutral-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
            <TagInlineAdd onAdd={(tag) => onUpdate(task.id, (tk) => (tk.tags.includes(tag) ? tk : { ...tk, tags: [...tk.tags, tag] }))} />
          </div>
        </div>

        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11.5px] font-medium uppercase tracking-wide text-neutral-500">Assignees</p>
            <div className="relative">
              <button onClick={() => setAssigneeMenuOpen((v) => !v)} className="text-[11.5px] text-neutral-500 hover:text-neutral-200">
                Edit
              </button>
              <AnimatePresence>
                {assigneeMenuOpen && (
                  <Dropdown open onClose={() => setAssigneeMenuOpen(false)} anchorClassName="right-0 top-[calc(100%+4px)] w-[190px] py-1.5">
                    {TEAM.map((name) => (
                      <button
                        key={name}
                        onClick={() => toggleAssignee(name)}
                        className="flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] text-neutral-300 hover:bg-white/[0.06]"
                      >
                        <Avatar name={name} className="h-5 w-5" />
                        <span className="flex-1 truncate">{name}</span>
                        {task.assignees.includes(name) && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                      </button>
                    ))}
                  </Dropdown>
                )}
              </AnimatePresence>
            </div>
          </div>
          {task.assignees.length > 0 ? <AvatarStack names={task.assignees} max={6} /> : <p className="text-[12.5px] text-neutral-600">No one assigned yet.</p>}
        </div>

        <div className="mb-5">
          <p className="mb-2 text-[11.5px] font-medium uppercase tracking-wide text-neutral-500">Due date</p>
          <input
            type="date"
            value={task.dueDate}
            onChange={(e) => onUpdate(task.id, (tk) => ({ ...tk, dueDate: e.target.value }))}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[13px] text-neutral-300 focus:border-white/20 focus:outline-none"
          />
        </div>

        <div className="mb-5 flex items-center gap-4 text-[12.5px] text-neutral-500">
          <span className="flex items-center gap-1.5">
            <Paperclip className="h-3.5 w-3.5" /> {task.attachmentsCount} attachments
          </span>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-wide text-neutral-500">
            <MessageSquare className="h-3.5 w-3.5" /> {task.commentsCount} comments
          </p>
          <div className="flex flex-col gap-2.5">
            {task.notes.map((note) => (
              <div key={note.id} className="rounded-lg bg-white/[0.03] p-2.5 text-[12.5px]">
                <span className="font-medium text-neutral-200">{note.author}</span>
                <p className="mt-0.5 text-neutral-400">{note.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <input
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNote()}
              placeholder="Add a comment…"
              className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[12.5px] text-neutral-300 placeholder:text-neutral-600 focus:border-white/20 focus:outline-none"
            />
            <button onClick={addNote} className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-medium text-neutral-900 hover:bg-neutral-200">
              Send
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function TagInlineAdd({ onAdd }: { onAdd: (tag: string) => void }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-1 rounded-md border border-dashed border-white/15 px-2 py-1 text-[11.5px] text-neutral-500 hover:text-neutral-300">
        <Plus className="h-3 w-3" /> Add tag
      </button>
    );
  }
  return (
    <input
      autoFocus
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value.trim()) onAdd(value.trim());
        setValue("");
        setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (value.trim()) onAdd(value.trim());
          setValue("");
          setOpen(false);
        }
        if (e.key === "Escape") {
          setValue("");
          setOpen(false);
        }
      }}
      placeholder="Tag name"
      className="w-24 rounded-md border border-white/15 bg-white/[0.03] px-2 py-1 text-[11.5px] text-neutral-200 focus:outline-none"
    />
  );
}

/* ================================================================== */
/*  Top bar                                                             */
/* ================================================================== */

function TopBar({
  activeTab,
  onTabChange,
  search,
  onSearch,
  searchInputRef,
  statusFilter,
  onStatusFilter,
  sortBy,
  onSortChange,
  showTags,
  showDescription,
  onToggleShowTags,
  onToggleShowDescription,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  search: string;
  onSearch: (v: string) => void;
    searchInputRef: React.RefObject<HTMLInputElement | null>;
  statusFilter: TaskStatus | "all";
  onStatusFilter: (v: TaskStatus | "all") => void;
  sortBy: "manual" | "priority" | "due" | "title";
  onSortChange: (v: "manual" | "priority" | "due" | "title") => void;
  showTags: boolean;
  showDescription: boolean;
  onToggleShowTags: () => void;
  onToggleShowDescription: () => void;
}) {
  const [statusOpen, setStatusOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);

  const statusLabel: Record<TaskStatus | "all", string> = {
    all: "All",
    todo: "To Do",
    "in-progress": "In Progress",
    "in-review": "In Review",
    done: "Done",
  };
  const sortLabel: Record<typeof sortBy, string> = {
    manual: "Manual",
    priority: "Priority",
    due: "Due date",
    title: "Title (A–Z)",
  };

  return (
    <div className="border-b border-white/[0.06] px-8 pt-6">
      <p className="text-[12.5px] text-neutral-500">Tasks</p>
      <div className="mb-5 mt-1 flex items-center justify-between">
        <h1 className="text-[26px] font-semibold text-neutral-50">Tasks</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
            <Search className="h-[14px] w-[14px] text-neutral-500" />
            <input
              ref={searchInputRef}
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search"
              className="w-40 bg-transparent text-[13px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
            />
            <span className="rounded border border-white/10 px-1 py-0.5 text-[10px] text-neutral-500">⌘F</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setStatusOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px] text-neutral-300 hover:bg-white/[0.05]"
            >
              Status: {statusLabel[statusFilter]}
              <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
            </button>
            <AnimatePresence>
              {statusOpen && (
                <Dropdown open onClose={() => setStatusOpen(false)} anchorClassName="right-0 top-[calc(100%+6px)] w-[160px] py-1.5">
                  {(["all", "todo", "in-progress", "in-review", "done"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onStatusFilter(s);
                        setStatusOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center px-3.5 py-2 text-left text-[13px] hover:bg-white/[0.06]",
                        statusFilter === s ? "font-medium text-neutral-100" : "text-neutral-400"
                      )}
                    >
                      {statusLabel[s]}
                    </button>
                  ))}
                </Dropdown>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px] text-neutral-300 hover:bg-white/[0.05]"
            >
              <ListFilter className="h-[14px] w-[14px]" /> Sort
            </button>
            <AnimatePresence>
              {sortOpen && (
                <Dropdown open onClose={() => setSortOpen(false)} anchorClassName="right-0 top-[calc(100%+6px)] w-[150px] py-1.5">
                  {(["manual", "priority", "due", "title"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        onSortChange(s);
                        setSortOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center px-3.5 py-2 text-left text-[13px] hover:bg-white/[0.06]",
                        sortBy === s ? "font-medium text-neutral-100" : "text-neutral-400"
                      )}
                    >
                      {sortLabel[s]}
                    </button>
                  ))}
                </Dropdown>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setViewOpen((v) => !v)}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-neutral-400 hover:bg-white/[0.05]"
            >
              <Grid2x2 className="h-[15px] w-[15px]" />
            </button>
            <AnimatePresence>
              {viewOpen && (
                <Dropdown open onClose={() => setViewOpen(false)} anchorClassName="right-0 top-[calc(100%+6px)] w-[210px] p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-[11.5px] font-medium uppercase tracking-wide text-neutral-500">
                    <SlidersHorizontal className="h-3 w-3" /> View options
                  </p>
                  <label className="flex items-center justify-between py-1.5 text-[13px] text-neutral-300">
                    Show tags
                    <input type="checkbox" checked={showTags} onChange={onToggleShowTags} className="accent-blue-500" />
                  </label>
                  <label className="flex items-center justify-between py-1.5 text-[13px] text-neutral-300">
                    Show description
                    <input type="checkbox" checked={showDescription} onChange={onToggleShowDescription} className="accent-blue-500" />
                  </label>
                </Dropdown>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5">
        {TABS.map((tabItem) => (
          <button
            key={tabItem.key}
            onClick={() => onTabChange(tabItem.key)}
            className={cn(
              "relative pb-3 text-[13.5px] transition-colors",
              activeTab === tabItem.key ? "font-medium text-neutral-50" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            {tabItem.label}
            {activeTab === tabItem.key && <motion.div layoutId="tab-underline" className="absolute inset-x-0 -bottom-px h-[2px] bg-neutral-50" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Root                                                                */
/* ================================================================== */

export default function TasksDashboard() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState("helio");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("tasks");
  const [activeTab, setActiveTab] = useState<TabKey>("board");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"manual" | "priority" | "due" | "title">("manual");
  const [showTags, setShowTags] = useState(true);
  const [showDescription, setShowDescription] = useState(true);

  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: number; message: string }[]>([]);
  const toastIdRef = useRef(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [pendingFocusSearch, setPendingFocusSearch] = useState(false);

  const pushToast = useCallback((message: string) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((tst) => tst.id !== id)), 2600);
  }, []);

  const focusSearch = useCallback(() => {
    setActiveSection((prev) => {
      if (prev !== "tasks") setPendingFocusSearch(true);
      return "tasks";
    });
    // if we were already on the Tasks page, the input exists right now
    searchInputRef.current?.focus();
  }, []);

  // once the Tasks page (re)mounts after a pending focus request, finish focusing it
  useEffect(() => {
    if (pendingFocusSearch && activeSection === "tasks") {
      searchInputRef.current?.focus();
      setPendingFocusSearch(false);
    }
  }, [pendingFocusSearch, activeSection]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        focusSearch();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusSearch]);

  const activeProject = useMemo(() => projects.find((p) => p.id === activeProjectId)!, [projects, activeProjectId]);

  const mutateActiveProjectTasks = useCallback(
    (updater: (tasks: Task[]) => Task[]) => {
      setProjects((prev) => prev.map((p) => (p.id === activeProjectId ? { ...p, tasks: updater(p.tasks) } : p)));
    },
    [activeProjectId]
  );

  const updateTask = useCallback(
    (id: string, updater: (task: Task) => Task) => {
      mutateActiveProjectTasks((tasks) => tasks.map((tk) => (tk.id === id ? updater(tk) : tk)));
    },
    [mutateActiveProjectTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      mutateActiveProjectTasks((tasks) => tasks.filter((tk) => tk.id !== id));
      pushToast("Task deleted");
    },
    [mutateActiveProjectTasks, pushToast]
  );

  const filteredTasks = useMemo(() => {
    let list = activeProject.tasks;
    if (statusFilter !== "all") list = list.filter((tk) => tk.status === statusFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (tk) =>
          tk.title.toLowerCase().includes(q) ||
          tk.tags.some((tag) => tag.toLowerCase().includes(q)) ||
          tk.assignees.some((name) => name.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeProject, statusFilter, search]);

  const visibleStatuses = useMemo(() => (statusFilter === "all" ? STATUS_COLUMNS.map((c) => c.id) : [statusFilter]), [statusFilter]);

  const openTask = filteredTasks.find((tk) => tk.id === openTaskId) ?? activeProject.tasks.find((tk) => tk.id === openTaskId) ?? null;

  const selectProject = useCallback((id: string) => {
    setActiveProjectId(id);
    setActiveSection("tasks");
    setSearch("");
    setStatusFilter("all");
  }, []);

  const placeholderMeta: Record<string, { icon: React.ComponentType<{ className?: string }>; title: string; description: string }> = {
    home: { icon: Home, title: "Home", description: "Your personal overview lives here — recent activity, quick links, and shortcuts across every project." },
    calendar: { icon: Calendar, title: "Calendar", description: "Task due dates and team events will show up here once calendar sync is wired up." },
    teams: { icon: Users, title: "Teams", description: "Manage members, roles, and permissions across your workspace from here." },
    docs: { icon: FileStack, title: "Docs", description: "Long-form notes and specs linked to your projects will live in this section." },
    automations: { icon: Zap, title: "Automations", description: "Set up rules like auto-tagging or Slack notifications when tasks change status." },
    reporting: { icon: BarChart2, title: "Reporting", description: "Cross-project reports and exportable charts will show up here." },
    "team-directory": { icon: Users, title: "Team directory", description: "A searchable list of everyone in your workspace, with roles and contact info." },
    "resource-planning": { icon: BarChart2, title: "Resource planning", description: "Balance workload across the team by visualizing capacity over time." },
    settings: { icon: Settings, title: "Settings", description: "Workspace preferences, billing, and integrations will live here." },
    releases: { icon: Rocket, title: "Releases", description: "See what's new in the product and what's shipping next." },
    "app-slack": { icon: Zap, title: "Slack", description: "Connect Slack to post task updates directly into your team's channels." },
    "app-github": { icon: Zap, title: "GitHub", description: "Link pull requests and commits to tasks automatically." },
    timeline: { icon: Calendar, title: "Timeline", description: "A Gantt-style view of task schedules across the project is coming soon." },
    files: { icon: FileStack, title: "Files", description: "Attachments from every task in this project will be collected here." },
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0B0B0D] text-neutral-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={selectProject}
        onSearchFocusHint={focusSearch}
        pushToast={pushToast}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        {activeSection === "tasks" ? (
          <>
            <TopBar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              search={search}
              onSearch={setSearch}
              searchInputRef={searchInputRef}
              statusFilter={statusFilter}
              onStatusFilter={setStatusFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showTags={showTags}
              showDescription={showDescription}
              onToggleShowTags={() => setShowTags((v) => !v)}
              onToggleShowDescription={() => setShowDescription((v) => !v)}
            />

            <div className="flex flex-1 flex-col overflow-y-auto px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeTab}-${activeProjectId}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-1 flex-col"
                >
                  {activeTab === "board" && (
                    <BoardView
                      tasks={filteredTasks}
                      sortBy={sortBy}
                      showTags={showTags}
                      showDescription={showDescription}
                      visibleStatuses={visibleStatuses}
                      onOpenTask={(task) => setOpenTaskId(task.id)}
                      onTagClick={(tag) => setSearch(tag)}
                      onMutateTasks={mutateActiveProjectTasks}
                      pushToast={pushToast}
                    />
                  )}
                  {activeTab === "lists" && <ListsView tasks={filteredTasks} onOpenTask={(task) => setOpenTaskId(task.id)} />}
                  {activeTab === "overview" && <OverviewView tasks={activeProject.tasks} onOpenTask={(task) => setOpenTaskId(task.id)} />}
                  {activeTab === "timeline" && (
                    <EmptyPlaceholder icon={placeholderMeta.timeline.icon} title={placeholderMeta.timeline.title} description={placeholderMeta.timeline.description} />
                  )}
                  {activeTab === "files" && (
                    <EmptyPlaceholder icon={placeholderMeta.files.icon} title={placeholderMeta.files.title} description={placeholderMeta.files.description} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col overflow-y-auto px-8 py-8">
            <EmptyPlaceholder
              icon={placeholderMeta[activeSection]?.icon ?? Home}
              title={placeholderMeta[activeSection]?.title ?? activeSection}
              description={placeholderMeta[activeSection]?.description ?? ""}
              onBack={() => setActiveSection("tasks")}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {openTask && <TaskDrawer task={openTask} onClose={() => setOpenTaskId(null)} onUpdate={updateTask} onDelete={deleteTask} />}
      </AnimatePresence>

      <ToastStack toasts={toasts} />
    </div>
  );
}