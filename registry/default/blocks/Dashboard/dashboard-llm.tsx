"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Share2,
  Rows3,
  NotebookText,
  BarChart3,
  ShieldCheck,
  Database,
  Settings,
  User,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Search,
  Bell,
  Plus,
  LayoutGrid,
  FileCheck2,
  Sparkles,
  Gauge,
  DollarSign,
  Network,
  Cpu,
  Gem,
  Pencil,
  Fingerprint,
  FileWarning,
  AlertCircle,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Check,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string }>;

type NavKey = "pipelines" | "logs" | "datasets" | "analytics" | "guardrails" | "storage" | "settings" | "profile";

type TabKey = "overview" | "metrics" | "evaluations";

type RangeKey = "24h" | "7d" | "30d";

type ModelStatus = "Healthy" | "Warning" | "Degraded";

type ModelId = "gpt4o" | "claude" | "gemini";

type ActionType = "Blocked" | "Fallback" | "Retried";

type ExceptionRow = {
  id: string;
  time: string;
  timestamp: number;
  clientId: string;
  violation: string;
  snippet: string;
  action: ActionType;
};

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const mainNav: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "pipelines", label: "Pipelines", icon: Share2 },
  { key: "logs", label: "Logs", icon: Rows3 },
  { key: "datasets", label: "Datasets", icon: NotebookText },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

const secondNav: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "guardrails", label: "Guardrails", icon: ShieldCheck },
  { key: "storage", label: "Storage", icon: Database },
];

const bottomNav: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "settings", label: "Settings", icon: Settings },
  { key: "profile", label: "Profile", icon: User },
];

const sectionCopy: Partial<Record<NavKey, { icon: IconType; title: string; description: string }>> = {
  logs: { icon: Rows3, title: "Logs", description: "Raw request and response logs for every pipeline run." },
  datasets: { icon: NotebookText, title: "Datasets", description: "Manage the eval and fine-tuning datasets behind your pipelines." },
  analytics: { icon: BarChart3, title: "Analytics", description: "Cross-pipeline usage, cost and latency trends over time." },
  guardrails: { icon: ShieldCheck, title: "Guardrails", description: "Configure the safety rules enforced across every pipeline." },
  storage: { icon: Database, title: "Storage", description: "Vector stores and cached embeddings used by your pipelines." },
  settings: { icon: Settings, title: "Settings", description: "Workspace, billing and API key management." },
  profile: { icon: User, title: "Profile", description: "Your account details and personal preferences." },
};

const tabCopy: Partial<Record<TabKey, { icon: IconType; title: string; description: string }>> = {
  metrics: { icon: BarChart3, title: "Metrics", description: "Deeper latency, cost and token breakdowns for this pipeline." },
  evaluations: { icon: FileCheck2, title: "Evaluations", description: "Offline eval runs and scoring history for this pipeline." },
};

const rangeMeta: Record<
  RangeKey,
  { label: string; prompts: string; promptsDelta: string; latency: string; latencyDelta: string; cost: string; costDelta: string; blocked: string; blockedDelta: string }
> = {
  "24h": { label: "Last 24 Hours", prompts: "124k", promptsDelta: "+15%", latency: "850ms", latencyDelta: "+45ms", cost: "452.10", costDelta: "-$120", blocked: "2.4k", blockedDelta: "+4%" },
  "7d": { label: "Last 7 Days", prompts: "812k", promptsDelta: "+22%", latency: "790ms", latencyDelta: "-30ms", cost: "3,140.55", costDelta: "-$410", blocked: "14.1k", blockedDelta: "+9%" },
  "30d": { label: "Last 30 Days", prompts: "3.4M", promptsDelta: "+38%", latency: "760ms", latencyDelta: "-80ms", cost: "12,980.00", costDelta: "-$1,860", blocked: "58.6k", blockedDelta: "+2%" },
};

const sparklines = {
  prompts: [45, 60, 50, 70, 55, 80, 65, 90],
  latency: [70, 50, 80, 40, 90, 55, 75, 60],
  cost: [40, 55, 45, 65, 50, 75, 60, 85],
  blocked: [30, 50, 40, 70, 45, 65, 55, 80],
};

type ModelNode = { id: ModelId; name: string; icon: IconType; status: ModelStatus; traffic: number; avgMs: number };

const modelNodes: ModelNode[] = [
  { id: "gpt4o", name: "GPT-4o", icon: Cpu, status: "Healthy", traffic: 68, avgMs: 120 },
  { id: "claude", name: "Claude 3.5 Sonnet", icon: Sparkles, status: "Healthy", traffic: 22, avgMs: 145 },
  { id: "gemini", name: "Gemini Flash", icon: Gem, status: "Warning", traffic: 10, avgMs: 850 },
];

const exceptionsSeed: ExceptionRow[] = [
  { id: "e1", time: "10:42 AM", timestamp: 1042, clientId: "user_892x", violation: "PII_Detector_v2 (Credit Card Info)", snippet: "payment with 4532 1121", action: "Blocked" },
  { id: "e2", time: "10:15 AM", timestamp: 1015, clientId: "user_110a", violation: "Prompt Injection Attempt", snippet: "Ignore previous instructions", action: "Fallback" },
  { id: "e3", time: "09:30 AM", timestamp: 930, clientId: "sys_router", violation: "Upstream Timeout (GPT-4o > 5000ms)", snippet: "Summarize the attached 50...", action: "Blocked" },
  { id: "e4", time: "09:12 AM", timestamp: 912, clientId: "user_4480", violation: "Output Parsing: Invalid JSON Schema", snippet: "{'user_name': 'John Doe',", action: "Retried" },
  { id: "e5", time: "08:45 AM", timestamp: 845, clientId: "anon_ip", violation: "Rate Limit: 50 requests / minute", snippet: "What is the capital of F...", action: "Fallback" },
  { id: "e6", time: "08:20 AM", timestamp: 820, clientId: "user_2210", violation: "Toxicity Threshold Exceeded", snippet: "You are so useless, just...", action: "Blocked" },
];

const ingressRows = [
  { label: "Endpoint:", value: "/v1/chat/completions", badge: "POST" },
  { label: "Auth Protocol:", value: "", badge: "Bearer Token (Strict)" },
  { label: "Rate Limit:", value: "req/min per IP", badge: "100" },
];

const middlewareCards: { title: string; icon: IconType; rows: { label: string; value: string }[] }[] = [
  { title: "PII Redact", icon: Fingerprint, rows: [{ label: "Mode:", value: "MASK" }, { label: "Engine:", value: "NER" }] },
  { title: "Injection", icon: FileWarning, rows: [{ label: "Heuristic:", value: "ON" }, { label: "Vector:", value: "STRICT" }] },
  { title: "Toxicity Class.", icon: AlertCircle, rows: [{ label: "Threshold:", value: "0.85" }, { label: "Action:", value: "DROP" }] },
];

type Rule = {
  id: string;
  priority: "High" | "Medium" | "Low";
  conditionField: string;
  conditionOp: string;
  conditionValues: string[];
  routeTo: string;
  temp: string;
  maxTokens: string;
};

const rules: Rule[] = [
  { id: "r1", priority: "High", conditionField: "Intent", conditionOp: "==", conditionValues: ["Billing", "Refund"], routeTo: "GPT-4o", temp: "0.2", maxTokens: "1024" },
  { id: "r2", priority: "Medium", conditionField: "Intent", conditionOp: "==", conditionValues: ["General Query"], routeTo: "Claude 3.5 Sonnet", temp: "0.5", maxTokens: "2048" },
  { id: "r3", priority: "Low", conditionField: "Confidence", conditionOp: "<", conditionValues: ["0.4"], routeTo: "Gemini Flash", temp: "0.7", maxTokens: "512" },
];

const notifications = [
  { id: "n1", title: "Gemini Flash latency spike detected", time: "6m ago" },
  { id: "n2", title: "New guardrail rule deployed", time: "1h ago" },
  { id: "n3", title: "Weekly cost report is ready", time: "Yesterday" },
];

const newFlowItems = [
  { key: "blank", label: "Blank Pipeline", icon: Share2 },
  { key: "template", label: "From Template", icon: NotebookText },
];

const pillSpring = { type: "spring" as const, stiffness: 350, damping: 30 };

function statusColor(status: ModelStatus) {
  switch (status) {
    case "Healthy":
      return { dot: "bg-emerald-400", text: "text-emerald-400" };
    case "Warning":
      return { dot: "bg-amber-400", text: "text-amber-400" };
    case "Degraded":
      return { dot: "bg-rose-400", text: "text-rose-400" };
  }
}

function actionStyle(action: ActionType) {
  switch (action) {
    case "Blocked":
      return "bg-rose-500/15 text-rose-400";
    case "Fallback":
      return "bg-amber-500/15 text-amber-400";
    case "Retried":
      return "bg-blue-500/15 text-blue-400";
  }
}

function priorityStyle(priority: Rule["priority"]) {
  switch (priority) {
    case "High":
      return "bg-rose-500/15 text-rose-400";
    case "Medium":
      return "bg-amber-500/15 text-amber-400";
    case "Low":
      return "bg-white/10 text-neutral-300";
  }
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
            "absolute top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#181A17] p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]",
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
      {active && <Check className="h-3.5 w-3.5 text-lime-400" />}
    </button>
  );
}

function MoreMenu({ items }: { items: { label: string; icon: IconType }[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5">
        <MoreHorizontal className="h-[15px] w-[15px]" />
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} anchor="right" width={160}>
        {items.map((it) => (
          <DropdownItem key={it.label} icon={it.icon} label={it.label} onClick={() => setOpen(false)} />
        ))}
      </Dropdown>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar (icon rail)                                                  */
/* ------------------------------------------------------------------ */

function RailIcon({ icon: Icon, label, active, onClick }: { icon: IconType; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} title={label} className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-colors">
      {active && <motion.span layoutId="rail-active" className="absolute inset-0 rounded-xl bg-white/10" transition={pillSpring} />}
      <Icon className={cn("relative z-10 h-[17px] w-[17px]", active ? "text-white" : "text-neutral-500 hover:text-neutral-300")} />
    </button>
  );
}

function Sidebar({ activeNav, onSelect }: { activeNav: NavKey; onSelect: (key: NavKey) => void }) {
  return (
    <aside className="flex h-full w-[56px] shrink-0 flex-col items-center gap-1 border-r border-white/[0.06] bg-[#0C0D0B] py-4">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1L13 12H1L7 1Z" fill="#0C0D0B" />
        </svg>
      </div>

      <div className="flex flex-col gap-1">
        {mainNav.map((item) => (
          <RailIcon key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key} onClick={() => onSelect(item.key)} />
        ))}
      </div>

      <div className="my-2 h-px w-6 bg-white/[0.08]" />

      <div className="flex flex-col gap-1">
        {secondNav.map((item) => (
          <RailIcon key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key} onClick={() => onSelect(item.key)} />
        ))}
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-1">
        {bottomNav.map((item) => (
          <RailIcon key={item.key} icon={item.icon} label={item.label} active={activeNav === item.key} onClick={() => onSelect(item.key)} />
        ))}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar + tabs                                                       */
/* ------------------------------------------------------------------ */

function TopBar({ query, onQueryChange, onNewFlow }: { query: string; onQueryChange: (v: string) => void; onNewFlow: () => void }) {
  const [openMenu, setOpenMenu] = useState<"notif" | "new" | null>(null);

  return (
    <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3">
      <div className="flex items-center gap-2 text-[13px]">
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5 hover:text-neutral-300">
          <ArrowLeft className="h-[15px] w-[15px]" />
        </button>
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5 hover:text-neutral-300">
          <ArrowRight className="h-[15px] w-[15px]" />
        </button>
        <span className="ml-1 flex items-center gap-1.5 text-neutral-500">
          Pipelines
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-white">Customer Support Bot</span>
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex w-[210px] items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
          <Search className="h-[13px] w-[13px] text-neutral-500" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-[12.5px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "notif" ? null : "notif"))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white/5 hover:text-neutral-200"
          >
            <Bell className="h-[15px] w-[15px]" />
          </button>
          <Dropdown open={openMenu === "notif"} onClose={() => setOpenMenu(null)} anchor="right" width={240}>
            <div className="px-2.5 py-1.5 text-[10.5px] uppercase tracking-widest text-neutral-500">Notifications</div>
            {notifications.map((n) => (
              <div key={n.id} className="flex flex-col gap-0.5 rounded-lg px-2.5 py-2 hover:bg-white/5">
                <p className="text-[12.5px] text-neutral-200">{n.title}</p>
                <p className="text-[11px] text-neutral-500">{n.time}</p>
              </div>
            ))}
          </Dropdown>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "new" ? null : "new"))}
            className="flex items-center gap-1.5 rounded-lg bg-lime-400 px-3 py-1.5 text-[12.5px] font-medium text-neutral-900 hover:bg-lime-300"
          >
            <Plus className="h-3.5 w-3.5" /> New Flow
          </button>
          <Dropdown open={openMenu === "new"} onClose={() => setOpenMenu(null)} anchor="right" width={180}>
            {newFlowItems.map((item) => (
              <DropdownItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                onClick={() => {
                  onNewFlow();
                  setOpenMenu(null);
                }}
              />
            ))}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

function TabsRow({ activeTab, onSelectTab, range, onRangeChange }: { activeTab: TabKey; onSelectTab: (t: TabKey) => void; range: RangeKey; onRangeChange: (r: RangeKey) => void }) {
  const [rangeOpen, setRangeOpen] = useState(false);
  const tabs: { key: TabKey; label: string; icon: IconType }[] = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "metrics", label: "Metrics", icon: BarChart3 },
    { key: "evaluations", label: "Evaluations", icon: FileCheck2 },
  ];

  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div className="flex items-center gap-1">
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <button key={tab.key} onClick={() => onSelectTab(tab.key)} className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors">
              {active && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-lg bg-white/[0.08]" transition={pillSpring} />}
              <tab.icon className={cn("relative z-10 h-[14px] w-[14px]", active ? "text-white" : "text-neutral-500")} />
              <span className={cn("relative z-10", active ? "font-medium text-white" : "text-neutral-500")}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <button
          onClick={() => setRangeOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-neutral-300 hover:bg-white/[0.06]"
        >
          {rangeMeta[range].label} <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
        </button>
        <Dropdown open={rangeOpen} onClose={() => setRangeOpen(false)} anchor="right" width={170}>
          {(["24h", "7d", "30d"] as const).map((r) => (
            <DropdownItem
              key={r}
              icon={Gauge}
              label={rangeMeta[r].label}
              active={range === r}
              onClick={() => {
                onRangeChange(r);
                setRangeOpen(false);
              }}
            />
          ))}
        </Dropdown>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                           */
/* ------------------------------------------------------------------ */

function Sparkline({ values, colorClass }: { values: number[]; colorClass: string }) {
  return (
    <div className="flex h-9 items-end gap-[3px]">
      {values.map((v, i) => (
        <div
          key={i}
          style={{ height: `${v}%` }}
          className={cn("w-[5px] origin-bottom rounded-sm opacity-80 transition-all duration-150 hover:scale-y-110 hover:opacity-100", colorClass)}
        />
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  delta,
  good,
  sparkValues,
  sparkColor,
}: {
  icon: IconType;
  label: string;
  value: string;
  unit?: string;
  delta: string;
  good: boolean;
  sparkValues: number[];
  sparkColor: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111210] p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[12.5px] text-neutral-400">
          <Icon className="h-[13px] w-[13px] text-neutral-500" />
          {label}
        </span>
        <MoreMenu items={[{ label: "View details", icon: BarChart3 }, { label: "Export", icon: ArrowUpDown }]} />
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="font-mono text-[24px] font-semibold text-white">
          {value}
          {unit && <span className="ml-1 text-[13px] font-normal text-neutral-400">{unit}</span>}
        </p>
        <Sparkline values={sparkValues} colorClass={sparkColor} />
      </div>
      <p className="mt-2 text-[11.5px] text-neutral-500">
        {label.split(" ")[0]} {delta.startsWith("-") ? "Decreased" : "Increased"} by{" "}
        <span className={cn("font-mono font-medium", good ? "text-emerald-400" : "text-rose-400")}>{delta}</span> vs yesterday
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Endpoint traffic diagram                                             */
/* ------------------------------------------------------------------ */

function EndpointDiagram({ focused, onFocus }: { focused: ModelId | null; onFocus: (id: ModelId | null) => void }) {
  const nodePos: Record<ModelId, { x: number; y: number }> = {
    gpt4o: { x: 25, y: 58 },
    claude: { x: 75, y: 58 },
    gemini: { x: 50, y: 80 },
  };
  const gatewayBottom = { x: 50, y: 24 };
  const midY = 40;

  function pathFor(id: ModelId) {
    const p = nodePos[id];
    if (id === "gemini") return `M ${gatewayBottom.x},${gatewayBottom.y} L ${p.x},${p.y}`;
    return `M ${gatewayBottom.x},${gatewayBottom.y} L ${gatewayBottom.x},${midY} L ${p.x},${midY} L ${p.x},${p.y}`;
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111210] p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-medium text-white">
          <Network className="h-[15px] w-[15px] text-neutral-400" /> Endpoint Traffic &amp; Health
        </span>
        <div className="flex items-center gap-2">
          <button className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11.5px] text-neutral-300 hover:bg-white/[0.06]">View Details</button>
          <MoreMenu items={[{ label: "Refresh", icon: ArrowUpDown }, { label: "Export", icon: ArrowUpDown }]} />
        </div>
      </div>

      <div
        className="relative h-[300px] w-full overflow-hidden rounded-lg border border-white/[0.05]"
        style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "16px 16px", backgroundColor: "#0B0C0A" }}
      >
        <span className="absolute left-3 top-3 rounded-md bg-white/[0.06] px-2.5 py-1 text-[10.5px] text-neutral-400">Last Updated : Mar 30 / 10:03 AM</span>

        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          {modelNodes.map((n) => {
            const dim = focused != null && focused !== n.id;
            return (
              <path
                key={n.id}
                d={pathFor(n.id)}
                fill="none"
                stroke={focused === n.id ? "#A3E635" : "rgba(255,255,255,0.18)"}
                strokeWidth={focused === n.id ? 0.6 : 0.4}
                vectorEffect="non-scaling-stroke"
                className="transition-all duration-200"
                opacity={dim ? 0.25 : 1}
              />
            );
          })}
          {modelNodes.map((n) => (
            <motion.circle
              key={`dot-${n.id}`}
              r="0.8"
              fill={focused === n.id ? "#A3E635" : "#ffffff"}
              opacity={focused != null && focused !== n.id ? 0.2 : 0.85}
              style={{ offsetPath: `path('${pathFor(n.id)}')` } as React.CSSProperties}
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear", delay: n.id === "claude" ? 0.6 : n.id === "gemini" ? 1.2 : 0 }}
            />
          ))}
        </svg>

        <button
          onClick={() => onFocus(null)}
          className="absolute left-1/2 top-[8%] w-[230px] -translate-x-1/2 rounded-lg border border-white/10 bg-[#15170F]/95 p-3 text-left shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] backdrop-blur"
        >
          <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-white">
            <Network className="h-3.5 w-3.5 text-neutral-400" /> API Gateway
          </span>
          <div className="mt-2 flex items-center justify-between text-[11.5px]">
            <span className="text-neutral-400">v1/chat/completions</span>
            <span className="font-mono font-semibold text-white">124k Reqs</span>
          </div>
        </button>

        {modelNodes.map((n) => {
          const c = statusColor(n.status);
          const isFocused = focused === n.id;
          const dim = focused != null && !isFocused;
          return (
            <motion.button
              key={n.id}
              onClick={() => onFocus(isFocused ? null : n.id)}
              className="absolute w-[210px] -translate-x-1/2 rounded-lg border p-3 text-left shadow-[0_10px_24px_-10px_rgba(0,0,0,0.6)] backdrop-blur"
              style={{ left: `${nodePos[n.id].x}%`, top: `${nodePos[n.id].y}%` }}
              animate={{ opacity: dim ? 0.4 : 1, scale: isFocused ? 1.03 : 1 }}
              transition={{ duration: 0.2 }}
              initial={false}
            >
              <div className={cn("rounded-lg border p-0.5", isFocused ? "border-lime-400/40 bg-lime-400/[0.04]" : "border-transparent bg-[#15170F]/95")}>
                <div className="flex items-center justify-between px-1.5 pt-1">
                  <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-white">
                    <n.icon className="h-3.5 w-3.5 text-neutral-400" /> {n.name}
                  </span>
                  <span className={cn("flex items-center gap-1 text-[10.5px] font-medium", c.text)}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", c.dot)} /> {n.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-1.5 px-1.5 pb-1.5">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="text-neutral-400">Traffic</span>
                    <span className="font-mono font-semibold text-white">{n.traffic}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="text-neutral-400">Avg</span>
                    <span className="font-mono font-semibold text-white">{n.avgMs}ms</span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Guardrail exceptions table                                           */
/* ------------------------------------------------------------------ */

const GuardrailTable = React.forwardRef<
  HTMLDivElement,
  { query: string; modelFilter: ModelId | null; onClearModelFilter: () => void }
>(function GuardrailTable({ query, modelFilter, onClearModelFilter }, ref) {
  const [actionFilter, setActionFilter] = useState<"All" | ActionType>("All");
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const modelLabel = modelFilter ? modelNodes.find((n) => n.id === modelFilter)?.name ?? null : null;

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = exceptionsSeed.filter((r) => {
      const matchesQuery = !q || r.clientId.toLowerCase().includes(q) || r.violation.toLowerCase().includes(q) || r.snippet.toLowerCase().includes(q);
      const matchesAction = actionFilter === "All" || r.action === actionFilter;
      const matchesModel = !modelLabel || r.violation.toLowerCase().includes(modelLabel.toLowerCase());
      return matchesQuery && matchesAction && matchesModel;
    });
    return [...filtered].sort((a, b) => (sortDir === "asc" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp));
  }, [query, actionFilter, modelLabel, sortDir]);

  return (
    <div ref={ref} className="rounded-xl border border-white/[0.07] bg-[#111210]">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/[0.06] p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex items-center gap-2 text-[13px] font-medium text-white">
            <ShieldCheck className="h-[15px] w-[15px] text-neutral-400" /> Guardrail Exceptions
          </span>
          {modelLabel && (
            <span className="flex items-center gap-1.5 rounded-full bg-lime-400/15 px-2.5 py-1 text-[11px] text-lime-300">
              Filtered by {modelLabel}
              <button onClick={onClearModelFilter} className="text-lime-400 hover:text-white">
                ✕
              </button>
            </span>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12px] text-neutral-300 hover:bg-white/[0.06]"
          >
            <Filter className="h-3.5 w-3.5" /> {actionFilter === "All" ? "Filter" : actionFilter}
          </button>
          <Dropdown open={filterOpen} onClose={() => setFilterOpen(false)} anchor="right" width={160}>
            {(["All", "Blocked", "Fallback", "Retried"] as const).map((a) => (
              <DropdownItem
                key={a}
                icon={Filter}
                label={a}
                active={actionFilter === a}
                onClick={() => {
                  setActionFilter(a);
                  setFilterOpen(false);
                }}
              />
            ))}
          </Dropdown>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[90px_100px_1.6fr_1.4fr_90px] gap-3 px-4 py-2.5 text-[11px] uppercase tracking-wide text-neutral-500">
            <button onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))} className="flex items-center gap-1 text-left hover:text-neutral-300">
              Time <ArrowUpDown className="h-3 w-3" />
            </button>
            <span>Client_ID</span>
            <span>Violation / Rule</span>
            <span>Prompt Snippet</span>
            <span className="text-right">Action</span>
          </div>

          <AnimatePresence initial={false}>
            {rows.map((r) => (
              <motion.div
                key={r.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-[90px_100px_1.6fr_1.4fr_90px] items-center gap-3 border-t border-white/[0.04] px-4 py-3 text-[12.5px] hover:bg-white/[0.02]"
              >
                <span className="font-mono text-neutral-300">{r.time}</span>
                <span className="truncate text-neutral-400">{r.clientId}</span>
                <span className="truncate text-neutral-200">{r.violation}</span>
                <span className="truncate font-mono text-neutral-500">"{r.snippet}"</span>
                <span className="text-right">
                  <span className={cn("inline-block rounded-md px-2 py-0.5 text-[11px]", actionStyle(r.action))}>{r.action}</span>
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {rows.length === 0 && <p className="py-8 text-center text-[12.5px] text-neutral-500">No exceptions match your filters.</p>}
        </div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Active pipeline architecture                                         */
/* ------------------------------------------------------------------ */

function KeyValueRow({ label, value, badge }: { label: string; value?: string; badge: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 text-[12.5px]">
      <span className="text-neutral-500">{label}</span>
      <span className="flex items-center gap-2">
        {value && <span className="text-neutral-300">{value}</span>}
        <span className="rounded-md bg-white/[0.07] px-2 py-1 font-mono text-[11.5px] text-white">{badge}</span>
      </span>
    </div>
  );
}

function RuleCard({ rule }: { rule: Rule }) {
  const [open, setOpen] = useState(rule.priority === "High");
  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.02]">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-3.5 py-3">
        <span className="flex items-center gap-2 text-[12.5px] text-neutral-200">
          Rule {rule.id.replace("r", "0")} <span className="text-neutral-600">·</span>
          <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", priorityStyle(rule.priority))}>{rule.priority}</span>
        </span>
        <span className="flex items-center gap-2">
          <MoreMenu items={[{ label: "Edit Rule", icon: Pencil }, { label: "Duplicate", icon: NotebookText }]} />
          <motion.span animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.15 }}>
            <ChevronRight className="h-3.5 w-3.5 text-neutral-500" />
          </motion.span>
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="overflow-hidden">
            <div className="px-3.5 pb-3.5">
              <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-white/[0.06] bg-black/30 px-3 py-2.5 font-mono text-[12px] text-neutral-400">
                IF [<span className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-neutral-200">{rule.conditionField}</span>] {rule.conditionOp} [
                {rule.conditionValues.map((v, i) => (
                  <span key={v} className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-neutral-200">
                    {v}
                    {i < rule.conditionValues.length - 1 ? "," : ""}
                  </span>
                ))}
                ]
              </div>
              <div className="mt-1 flex flex-col divide-y divide-white/[0.05]">
                <KeyValueRow label="Route to:" badge={rule.routeTo} />
                <KeyValueRow label="Temp:" badge={rule.temp} />
                <KeyValueRow label="Max Tokens:" badge={rule.maxTokens} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ArchitecturePanel() {
  const [editing, setEditing] = useState(false);

  return (
    <div className={cn("rounded-xl border bg-[#111210] p-5 transition-colors", editing ? "border-lime-400/40" : "border-white/[0.07]")}>
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[13px] font-medium text-white">
          <Sparkles className="h-[15px] w-[15px] text-neutral-400" /> Active Pipeline Architecture
        </span>
        <button
          onClick={() => setEditing((e) => !e)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11.5px] transition-colors",
            editing ? "border-lime-400/50 bg-lime-400/10 text-lime-300" : "border-white/[0.08] bg-white/[0.03] text-neutral-300 hover:bg-white/[0.06]"
          )}
        >
          <Pencil className="h-3.5 w-3.5" /> {editing ? "Editing..." : "Edit Pipeline"}
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wider text-neutral-500">1. Ingress (Entry Point)</p>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 divide-y divide-white/[0.05]">
            {ingressRows.map((r) => (
              <KeyValueRow key={r.label} label={r.label} value={r.value} badge={r.badge} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wider text-neutral-500">2. Pre-processing (Middleware)</p>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {middlewareCards.map((card) => (
              <div key={card.title} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <span className="flex items-center gap-1.5 text-[12px] font-medium text-neutral-200">
                  <card.icon className="h-3.5 w-3.5 text-neutral-500" /> {card.title}
                </span>
                <div className="mt-1.5 flex flex-col divide-y divide-white/[0.05]">
                  {card.rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-1.5 text-[11.5px]">
                      <span className="text-neutral-500">{row.label}</span>
                      <span className="rounded-md bg-white/[0.07] px-1.5 py-0.5 font-mono text-[11px] text-white">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] uppercase tracking-wider text-neutral-500">3. Dynamic Router (Decision Matrix)</p>
          <div className="flex flex-col gap-2.5">
            {rules.map((rule) => (
              <RuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </div>
      </div>
    </div>
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
      className="flex h-full flex-col items-center justify-center gap-3 px-5 py-24 text-center"
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
/* Overview                                                              */
/* ------------------------------------------------------------------ */

function OverviewView({ query, range }: { query: string; range: RangeKey }) {
  const [focusedNode, setFocusedNode] = useState<ModelId | null>(null);
  const m = rangeMeta[range];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex flex-col gap-4 p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Sparkles} label="Processed Prompts" value={m.prompts} delta={m.promptsDelta} good={!m.promptsDelta.startsWith("-")} sparkValues={sparklines.prompts} sparkColor="bg-blue-500" />
        <StatCard icon={Gauge} label="Avg. Latency" value={m.latency.replace("ms", "")} unit="ms" delta={m.latencyDelta} good={m.latencyDelta.startsWith("-")} sparkValues={sparklines.latency} sparkColor="bg-violet-500" />
        <StatCard icon={DollarSign} label="Total Cost" value={`$${m.cost}`} delta={m.costDelta} good={m.costDelta.startsWith("-")} sparkValues={sparklines.cost} sparkColor="bg-orange-500" />
        <StatCard icon={ShieldCheck} label="Blocked Requests" value={m.blocked} delta={m.blockedDelta} good={m.blockedDelta.startsWith("-")} sparkValues={sparklines.blocked} sparkColor="bg-rose-500" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-3">
          <EndpointDiagram focused={focusedNode} onFocus={setFocusedNode} />
          <GuardrailTable query={query} modelFilter={focusedNode} onClearModelFilter={() => setFocusedNode(null)} />
        </div>
        <div className="lg:col-span-2">
          <ArchitecturePanel />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function PipelineOpsDashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>("pipelines");
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [range, setRange] = useState<RangeKey>("24h");
  const [query, setQuery] = useState("");

  function handleSelectNav(key: NavKey) {
    setActiveNav(key);
    setActiveTab("overview");
    setQuery("");
  }

  function handleSelectTab(key: TabKey) {
    setActiveTab(key);
    setQuery("");
  }

  function handleNewFlow() {
    setActiveNav("pipelines");
    setActiveTab("overview");
  }

  const navCopy = sectionCopy[activeNav];
  const currentTabCopy = tabCopy[activeTab];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0B0C0A] text-white">
      <Sidebar activeNav={activeNav} onSelect={handleSelectNav} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar query={query} onQueryChange={setQuery} onNewFlow={handleNewFlow} />
        {activeNav === "pipelines" && <TabsRow activeTab={activeTab} onSelectTab={handleSelectTab} range={range} onRangeChange={setRange} />}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeNav === "pipelines" && activeTab === "overview" ? (
              <OverviewView key="overview" query={query} range={range} />
            ) : activeNav === "pipelines" && currentTabCopy ? (
              <EmptyStateDark key={activeTab} icon={currentTabCopy.icon} title={currentTabCopy.title} description={currentTabCopy.description} />
            ) : (
              navCopy && <EmptyStateDark key={activeNav} icon={navCopy.icon} title={navCopy.title} description={navCopy.description} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}