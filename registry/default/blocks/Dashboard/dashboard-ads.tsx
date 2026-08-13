"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe,
  Clock,
  AlertTriangle,
  RotateCw,
  Cpu,
  Timer,
  Home,
  Compass,
  Megaphone,
  Layers,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Infinity as InfinityIcon,
  Music2,
  LayoutDashboard,
  Calendar,
  Folder,
  PieChart,
  Lightbulb,
  SlidersHorizontal,
  ArrowDownUp,
  Flag,
  Square,
  ChevronDown,
  Bell,
  Plus,
  Search,
  Command,
  MoreVertical,
  Info,
  PanelLeftClose,
  Check,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string }>;

type SidebarKey = "overview" | "discover" | "campaigns" | "adsets" | "audience" | "reports" | "google" | "meta" | "tiktok" | "linkedin" | "settings";

type TopTabKey = "dashboard" | "planner" | "assethub" | "segments" | "insights" | "preferences";

type CampaignStatus = "ACTIVE" | "PAUSED" | "CANCEL" | "COMPLETED";

type Campaign = {
  id: string;
  name: string;
  status: CampaignStatus;
  budget: number;
  spent: number;
  conversions: number | null;
  convRate: number | null;
  roas: number | null;
  clicks: number | null;
  ctr: number | null;
};

type SortKey = "name" | "status" | "budget" | "spent" | "conversions" | "convRate" | "roas" | "clicks" | "ctr";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const generalNav: { key: SidebarKey; label: string; icon: IconType; badge?: number }[] = [
  { key: "overview", label: "Overview", icon: Home },
  { key: "discover", label: "Discover", icon: Compass },
  { key: "campaigns", label: "Campaigns", icon: Megaphone },
  { key: "adsets", label: "Ad Sets", icon: Layers, badge: 12 },
  { key: "audience", label: "Audience", icon: Users },
  { key: "reports", label: "Reports", icon: BarChart3, badge: 32 },
];

const accountNav: { key: SidebarKey; label: string; platform: "google" | "meta" | "tiktok" | "linkedin" }[] = [
  { key: "google", label: "Google Ads", platform: "google" },
  { key: "meta", label: "Meta Ads", platform: "meta" },
  { key: "tiktok", label: "TikTok Ads", platform: "tiktok" },
  { key: "linkedin", label: "LinkedIn Ads", platform: "linkedin" },
];

const topTabs: { key: TopTabKey; label: string; icon: IconType }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "planner", label: "Planner", icon: Calendar },
  { key: "assethub", label: "Asset Hub", icon: Folder },
  { key: "segments", label: "Segments", icon: PieChart },
  { key: "insights", label: "Insights", icon: Lightbulb },
  { key: "preferences", label: "Preferences", icon: SlidersHorizontal },
];

const sectionCopy: Partial<Record<SidebarKey, { icon: IconType; title: string; description: string }>> = {
  discover: { icon: Compass, title: "Discover", description: "Trending creatives and benchmarks across your industry will show up here." },
  campaigns: { icon: Megaphone, title: "Campaigns", description: "Create and manage every campaign across your connected ad accounts." },
  adsets: { icon: Layers, title: "Ad Sets", description: "Group your ads into sets with shared budget and targeting." },
  audience: { icon: Users, title: "Audience", description: "Build and save audience segments to target across platforms." },
  reports: { icon: BarChart3, title: "Reports", description: "Schedule and export custom performance reports." },
  google: { icon: Globe, title: "Google Ads", description: "Connect your Google Ads account to pull performance data in." },
  meta: { icon: InfinityIcon, title: "Meta Ads", description: "Connect Meta Ads to sync Facebook and Instagram campaigns." },
  tiktok: { icon: Music2, title: "TikTok Ads", description: "Connect TikTok Ads to manage spend alongside your other channels." },
  linkedin: { icon: Users, title: "LinkedIn Ads", description: "Connect LinkedIn Ads to track B2B campaign performance." },
  settings: { icon: Settings, title: "Settings", description: "Manage workspace, billing and team preferences." },
};

const topTabCopy: Partial<Record<TopTabKey, { icon: IconType; title: string; description: string }>> = {
  planner: { icon: Calendar, title: "Planner", description: "Plan upcoming campaigns and launches on a shared calendar." },
  assethub: { icon: Folder, title: "Asset Hub", description: "Store and organize creatives shared across every campaign." },
  segments: { icon: PieChart, title: "Segments", description: "Slice performance data by audience segment." },
  insights: { icon: Lightbulb, title: "Insights", description: "AI-generated recommendations based on recent performance." },
  preferences: { icon: SlidersHorizontal, title: "Preferences", description: "Configure default currency, timezone and reporting cadence." },
};

const stats: { icon: IconType; label: string; value: string; unit?: string; delta: string; direction: "up" | "down"; info: string }[] = [
  { icon: Globe, label: "Requests", value: "94", delta: "12.4%", direction: "up", info: "Total API requests processed in the selected period." },
  { icon: Clock, label: "Wall Time", value: "0.01", unit: "ms", delta: "20.4%", direction: "up", info: "Average wall-clock duration per request." },
  { icon: AlertTriangle, label: "Errors", value: "2", delta: "56.4%", direction: "down", info: "Requests that returned a 4xx or 5xx response." },
  { icon: RotateCw, label: "Processing Time", value: "0", unit: "GB/s", delta: "1.7%", direction: "up", info: "Average data throughput per request." },
  { icon: Cpu, label: "CPU Time", value: "0.08", unit: "ms", delta: "13.1%", direction: "down", info: "Average CPU time consumed per request." },
  { icon: Timer, label: "Request Time", value: "0.02", unit: "ms", delta: "1.8%", direction: "down", info: "End-to-end time from request to response." },
];

const adPerfDatasets: Record<"2026" | "2025", number[]> = {
  "2026": [520, 560, 540, 610, 498, 650, 670, 700, 730, 760, 780, 810],
  "2025": [470, 500, 480, 540, 430, 560, 580, 600, 620, 640, 660, 690],
};

const campaignBars: { h: number; cat: "high" | "moderate" | "low" }[] = [
  { h: 70, cat: "high" }, { h: 45, cat: "moderate" }, { h: 30, cat: "low" }, { h: 55, cat: "moderate" }, { h: 65, cat: "high" }, { h: 40, cat: "moderate" },
  { h: 75, cat: "high" }, { h: 60, cat: "high" }, { h: 25, cat: "low" }, { h: 35, cat: "moderate" }, { h: 70, cat: "high" }, { h: 20, cat: "low" },
  { h: 50, cat: "moderate" }, { h: 65, cat: "high" }, { h: 30, cat: "low" }, { h: 55, cat: "moderate" }, { h: 60, cat: "high" }, { h: 45, cat: "moderate" },
  { h: 80, cat: "high" }, { h: 70, cat: "high" }, { h: 35, cat: "moderate" }, { h: 60, cat: "high" }, { h: 75, cat: "high" }, { h: 50, cat: "moderate" },
  { h: 65, cat: "high" }, { h: 55, cat: "moderate" }, { h: 25, cat: "low" }, { h: 70, cat: "high" }, { h: 60, cat: "high" }, { h: 40, cat: "moderate" },
  { h: 75, cat: "high" }, { h: 30, cat: "low" }, { h: 65, cat: "high" }, { h: 50, cat: "moderate" }, { h: 35, cat: "low" }, { h: 70, cat: "high" },
];

const campaignsSeed: Campaign[] = [
  { id: "c1", name: "Spring Sale Boost", status: "ACTIVE", budget: 50, spent: 48.67, conversions: 128, convRate: 6.42, roas: 4.21, clicks: 1987, ctr: 6.91 },
  { id: "c2", name: "New App Install Drive", status: "ACTIVE", budget: 40, spent: 36.21, conversions: 312, convRate: 18.35, roas: 3.67, clicks: 1700, ctr: 7.57 },
  { id: "c3", name: "Brand Awareness Q2", status: "PAUSED", budget: 30, spent: 27.89, conversions: null, convRate: null, roas: null, clicks: null, ctr: null },
  { id: "c4", name: "Retargeting Visitors", status: "CANCEL", budget: 25, spent: 12.34, conversions: 42, convRate: 9.24, roas: 5.18, clicks: 455, ctr: 4.62 },
  { id: "c5", name: "Summer Promo Leads", status: "COMPLETED", budget: 35, spent: 31.75, conversions: 68, convRate: 12.07, roas: 2.84, clicks: 563, ctr: 3.94 },
  { id: "c6", name: "Video Views Campaign", status: "PAUSED", budget: 25, spent: 21.43, conversions: null, convRate: null, roas: null, clicks: null, ctr: null },
];

const dateRangePresets = ["1 MAY - 31 MAY 2026", "1 APR - 30 APR 2026", "1 MAR - 31 MAR 2026"];

const notifications = [
  { id: "n1", title: "Spring Sale Boost hit 6.4% conv. rate", time: "8m ago" },
  { id: "n2", title: "Brand Awareness Q2 was paused", time: "2h ago" },
  { id: "n3", title: "Monthly report is ready", time: "Yesterday" },
];

const addMenuItems = [
  { key: "campaign", label: "New Campaign", icon: Megaphone },
  { key: "adset", label: "New Ad Set", icon: Layers },
  { key: "audience", label: "New Audience", icon: Users },
  { key: "report", label: "New Report", icon: BarChart3 },
];

const pillSpring = { type: "spring" as const, stiffness: 350, damping: 30 };

function statusStyle(status: CampaignStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-blue-500/15 text-blue-400";
    case "PAUSED":
      return "bg-amber-500/15 text-amber-400";
    case "CANCEL":
      return "bg-rose-500/15 text-rose-400";
    case "COMPLETED":
      return "bg-emerald-500/15 text-emerald-400";
  }
}

function roasStyle(roas: number | null) {
  if (roas == null) return "text-neutral-500";
  if (roas > 4) return "text-emerald-400";
  if (roas >= 2) return "text-amber-400";
  return "text-rose-400";
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
            "absolute top-full z-50 mt-2 rounded-lg border border-white/10 bg-[#1A1A1D] p-1.5 font-mono shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]",
            anchor === "left" ? "left-0" : "right-0"
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DropdownItem({
  icon: Icon,
  label,
  onClick,
  active,
}: {
  icon: IconType;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[11.5px] uppercase tracking-wide text-neutral-300 transition-colors hover:bg-white/5"
    >
      <Icon className="h-[14px] w-[14px] text-neutral-500" />
      <span className="flex-1 normal-case tracking-normal">{label}</span>
      {active && <Check className="h-3.5 w-3.5 text-blue-400" />}
    </button>
  );
}

function MoreHorizontalMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5">
        <MoreVertical className="h-[15px] w-[15px]" />
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} anchor="right" width={150}>
        <DropdownItem icon={BarChart3} label="View report" />
        <DropdownItem icon={Folder} label="Export CSV" />
      </Dropdown>
    </div>
  );
}

function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="flex h-5 w-5 items-center justify-center rounded-md text-neutral-600 hover:bg-white/5 hover:text-neutral-400">
        <Info className="h-3.5 w-3.5" />
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} anchor="right" width={190}>
        <p className="px-2 py-1.5 text-[11px] normal-case leading-snug tracking-normal text-neutral-400">{text}</p>
      </Dropdown>
    </div>
  );
}

type Platform = "google" | "meta" | "tiktok" | "linkedin";

const platformLogos: Record<Platform, string> = {
  google: "https://api.iconify.design/logos/google-icon.svg",
  meta: "https://api.iconify.design/logos/meta-icon.svg",
  tiktok: "https://api.iconify.design/logos/tiktok-icon.svg",
  linkedin: "https://api.iconify.design/logos/linkedin-icon.svg",
};

function PlatformIcon({ platform }: { platform: Platform }) {
  return (
    <img
      src={platformLogos[platform]}
      alt=""
      className="h-5 w-5 object-contain"
      loading="lazy"
    />
  );
}

function BaguiLogo() {
  return (
    <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden">
      <img
        src="/logoW.png"
        alt="BagUi"
        className="h-full w-full object-contain"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                              */
/* ------------------------------------------------------------------ */

function NavItem({
  icon,
  iconNode,
  label,
  active,
  collapsed,
  badge,
  onClick,
}: {
  icon?: IconType;
  iconNode?: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  const IconComp = icon;
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[8px] text-[12px] uppercase tracking-wide transition-colors",
        collapsed && "justify-center px-0"
      )}
    >
      {active && <motion.span layoutId="adforma-nav-pill" className="absolute inset-0 rounded-lg bg-white/[0.07]" transition={pillSpring} />}
      <span className="relative z-10 flex h-[16px] w-[16px] shrink-0 items-center justify-center">
        {iconNode ? iconNode : IconComp ? <IconComp className={cn("h-[15px] w-[15px]", active ? "text-white" : "text-neutral-500")} /> : null}
      </span>
      {!collapsed && <span className={cn("relative z-10 flex-1 truncate text-left", active ? "font-medium text-white" : "text-neutral-400")}>{label}</span>}
      {!collapsed && badge != null && (
        <span className="relative z-10 rounded-md bg-white/10 px-[6px] py-[1px] text-[10.5px] normal-case tracking-normal text-neutral-300">{badge}</span>
      )}
    </button>
  );
}

function SectionHeader({ label, open, onToggle, collapsed }: { label: string; open: boolean; onToggle: () => void; collapsed: boolean }) {
  if (collapsed) return null;
  return (
    <button onClick={onToggle} className="flex w-full items-center justify-between px-2.5 pb-1.5 text-[10px] uppercase tracking-widest text-neutral-600 hover:text-neutral-400">
      {label}
      <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.15 }}>
        <ChevronDown className="h-3 w-3" />
      </motion.span>
    </button>
  );
}

function Sidebar({
  activeKey,
  collapsed,
  onSelect,
  onToggleCollapse,
}: {
  activeKey: SidebarKey;
  collapsed: boolean;
  onSelect: (key: SidebarKey) => void;
  onToggleCollapse: () => void;
}) {
  const [generalOpen, setGeneralOpen] = useState(true);
  const [accountOpen, setAccountOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 216 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="flex h-full shrink-0 flex-col overflow-hidden border-r border-white/[0.06] bg-[#0C0C0E] px-3 py-4 font-mono"
    >
      <div className={cn("mb-5 flex items-center", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <BaguiLogo />
            <span className="text-[15px] font-semibold tracking-tight text-white">BagUI</span>
          </div>
        ) : (
          <BaguiLogo />
        )}
        {!collapsed && (
          <button onClick={onToggleCollapse} className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5 hover:text-neutral-300">
            <PanelLeftClose className="h-[14px] w-[14px]" />
          </button>
        )}
      </div>
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="mb-4 flex h-7 w-7 items-center justify-center self-center rounded-md text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
        >
          <PanelLeftClose className="h-[14px] w-[14px] rotate-180" />
        </button>
      )}

      <nav className="flex flex-1 flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          <SectionHeader label="General" open={generalOpen} onToggle={() => setGeneralOpen((o) => !o)} collapsed={collapsed} />
          <AnimatePresence initial={false}>
            {(generalOpen || collapsed) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="flex flex-col gap-0.5 overflow-hidden"
              >
                {generalNav.map((item) => (
                  <NavItem
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    badge={item.badge}
                    active={activeKey === item.key}
                    collapsed={collapsed}
                    onClick={() => onSelect(item.key)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-0.5">
          <SectionHeader label="Account" open={accountOpen} onToggle={() => setAccountOpen((o) => !o)} collapsed={collapsed} />
          <AnimatePresence initial={false}>
            {(accountOpen || collapsed) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="flex flex-col gap-0.5 overflow-hidden"
              >
                {accountNav.map((item) => (
                  <NavItem
                    key={item.key}
                    iconNode={<PlatformIcon platform={item.platform} />}
                    label={item.label}
                    active={activeKey === item.key}
                    collapsed={collapsed}
                    onClick={() => onSelect(item.key)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <div className="flex flex-col gap-0.5 pt-3">
        <NavItem icon={Settings} label="Settings" active={activeKey === "settings"} collapsed={collapsed} onClick={() => onSelect("settings")} />
        <NavItem icon={LogOut} label="Logout" collapsed={collapsed} />
      </div>

      {!collapsed && (
        <div className="relative mt-3 border-t border-white/[0.06] pt-3">
          <button onClick={() => setProfileOpen((o) => !o)} className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 hover:bg-white/5">
            <img
              src="/avatar.png"
              alt="Anelka Bag"
              className="h-8 w-8 shrink-0 rounded-full border border-white/10 bg-neutral-800 object-cover"
            />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate text-[11.5px] font-medium uppercase tracking-wide text-white">Anelka Bag</p>
              <p className="truncate text-[10.5px] normal-case tracking-normal text-neutral-500">ceo@bagui.pro</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
          </button>
          <Dropdown open={profileOpen} onClose={() => setProfileOpen(false)} width={190}>
            <DropdownItem icon={Settings} label="Workspace settings" />
            <DropdownItem icon={LogOut} label="Log out" />
          </Dropdown>
        </div>
      )}
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar + tabs                                                       */
/* ------------------------------------------------------------------ */

function TopBar({ query, onQueryChange }: { query: string; onQueryChange: (v: string) => void }) {
  const [openMenu, setOpenMenu] = useState<"add" | "notif" | null>(null);

  return (
    <div className="flex items-center justify-between px-6 pb-4 pt-5 font-mono">
      <div className="flex w-[320px] items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2">
        <Search className="h-[14px] w-[14px] text-neutral-500" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="SEARCH..."
          className="w-full bg-transparent text-[11.5px] uppercase tracking-wide text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
        />
        <span className="flex items-center gap-0.5 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-neutral-500">
          <Command className="h-2.5 w-2.5" />F
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "notif" ? null : "notif"))}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-neutral-400 hover:text-neutral-200"
          >
            <Bell className="h-[15px] w-[15px]" />
          </button>
          <Dropdown open={openMenu === "notif"} onClose={() => setOpenMenu(null)} anchor="right" width={240}>
            <div className="px-2.5 py-1.5 text-[10.5px] uppercase tracking-widest text-neutral-500">Notifications</div>
            {notifications.map((n) => (
              <div key={n.id} className="flex flex-col gap-0.5 rounded-md px-2.5 py-2 hover:bg-white/5">
                <p className="text-[11.5px] normal-case tracking-normal text-neutral-200">{n.title}</p>
                <p className="text-[10.5px] normal-case tracking-normal text-neutral-500">{n.time}</p>
              </div>
            ))}
          </Dropdown>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "add" ? null : "add"))}
            className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-3 py-2 text-[11.5px] font-medium uppercase tracking-wide text-white hover:bg-blue-600"
          >
            <Plus className="h-3.5 w-3.5" /> Add <ChevronDown className="h-3 w-3" />
          </button>
          <Dropdown open={openMenu === "add"} onClose={() => setOpenMenu(null)} anchor="right" width={190}>
            {addMenuItems.map((item) => (
              <DropdownItem key={item.key} icon={item.icon} label={item.label} onClick={() => setOpenMenu(null)} />
            ))}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

function TopTabs({ activeTab, onSelect }: { activeTab: TopTabKey; onSelect: (key: TopTabKey) => void }) {
  return (
    <div className="flex items-center gap-1 border-b border-white/[0.06] px-6 pb-3 font-mono">
      {topTabs.map((tab) => {
        const active = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onSelect(tab.key)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11.5px] uppercase tracking-wide transition-colors",
              active ? "text-white" : "text-neutral-500 hover:text-neutral-300"
            )}
          >
            {active && <motion.span layoutId="adforma-tab-pill" className="absolute inset-0 rounded-lg bg-white/[0.07]" transition={pillSpring} />}
            <tab.icon className="relative z-10 h-[14px] w-[14px]" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                           */
/* ------------------------------------------------------------------ */

function StatCard({ stat }: { stat: (typeof stats)[number] }) {
  const Icon = stat.icon;
  const TrendIcon = stat.direction === "up" ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141416] p-4 font-mono">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[11.5px] uppercase tracking-wide text-neutral-400">
          <Icon className="h-[14px] w-[14px] text-neutral-500" />
          {stat.label}
        </span>
        <InfoTip text={stat.info} />
      </div>
      <p className="mt-2.5 text-[24px] font-semibold text-white">
        {stat.value}
        {stat.unit && <span className="ml-0.5 text-[13px] font-normal text-neutral-400">{stat.unit}</span>}
      </p>
      <p className={cn("mt-1.5 flex items-center gap-1 text-[11px]", stat.direction === "up" ? "text-emerald-400" : "text-rose-400")}>
        <TrendIcon className="h-3 w-3" />
        {stat.delta}
        <span className="text-neutral-500">vs last month</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ad performance line chart                                            */
/* ------------------------------------------------------------------ */

function AdPerformanceChart({ year, onYearChange }: { year: "2026" | "2025"; onYearChange: (y: "2026" | "2025") => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const values = adPerfDatasets[year];
  const activeIndex = hovered ?? 4;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const pad = span * 0.25;
  const lo = min - pad;
  const hi = max + pad;

  const points = values.map((v, i) => ({
    x: (i / (values.length - 1)) * 100,
    y: 100 - ((v - lo) / (hi - lo)) * 100,
  }));
  const pointsAttr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const active = points[activeIndex];
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141416] p-5 font-mono">
      <div className="mb-1 flex items-start justify-between">
        <span className="text-[11.5px] uppercase tracking-wider text-neutral-400">Ad Performance</span>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1.5 text-[11px] uppercase tracking-wide text-neutral-300"
          >
            <Calendar className="h-3.5 w-3.5 text-neutral-500" /> {year} <ChevronDown className="h-3 w-3 text-neutral-500" />
          </button>
          <Dropdown open={menuOpen} onClose={() => setMenuOpen(false)} anchor="right" width={110}>
            {(["2026", "2025"] as const).map((y) => (
              <DropdownItem
                key={y}
                icon={Calendar}
                label={y}
                active={year === y}
                onClick={() => {
                  onYearChange(y);
                  setMenuOpen(false);
                }}
              />
            ))}
          </Dropdown>
        </div>
      </div>
      <p className="text-[26px] font-semibold text-white">${(total / 1000).toFixed(2)}M</p>
      <p className="mb-4 flex items-center gap-1 text-[11px] text-emerald-400">
        <TrendingUp className="h-3 w-3" /> 18.7%
        <span className="text-neutral-500">vs last year</span>
      </p>

      <div className="relative h-[120px] w-full">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <filter id="adforma-line-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <polyline points={pointsAttr} fill="none" stroke="#3B82F6" strokeWidth="1.6" vectorEffect="non-scaling-stroke" filter="url(#adforma-line-glow)" />
        </svg>

        <div className="absolute inset-0 flex">
          {values.map((_, i) => (
            <div key={i} className="flex-1" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
          ))}
        </div>

        <motion.span
          layoutId="adforma-line-dot"
          style={{ left: `${active.x}%`, top: `${active.y}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_0_5px_rgba(59,130,246,0.25)]"
        />

        <motion.div
          layoutId="adforma-line-tooltip"
          style={{ left: `${active.x}%`, top: `${active.y}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-lg border border-white/10 bg-[#1E1E22] px-3 py-2 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)]"
        >
          <p className="text-[10px] uppercase tracking-wide text-neutral-500">
            {months[activeIndex]}, {year}
          </p>
          <p className="flex items-center gap-1.5 text-[12px] font-medium text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" /> INCOME {values[activeIndex].toFixed(0)}K
          </p>
        </motion.div>
      </div>

      <div className="mt-2 flex text-[10px] tracking-wide text-neutral-500">
        {months.map((m, i) => (
          <span key={m} className={cn("flex-1 text-center", i === activeIndex && "font-medium text-white")}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Campaign breakdown bar chart                                         */
/* ------------------------------------------------------------------ */

const catColor = { high: "bg-emerald-400", moderate: "bg-amber-400", low: "bg-rose-400" } as const;
const catLabel = { high: "High (>4X)", moderate: "Moderate (2-4X)", low: "Low (<2X)" } as const;

function CampaignBreakdownChart() {
  const [activeCats, setActiveCats] = useState<Set<"high" | "moderate" | "low">>(new Set(["high", "moderate", "low"]));
  const [hovered, setHovered] = useState<number | null>(null);

  function toggleCat(cat: "high" | "moderate" | "low") {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size > 1) next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141416] p-5 font-mono">
      <div className="mb-1 flex flex-wrap items-start justify-between gap-3">
        <span className="text-[11.5px] uppercase tracking-wider text-neutral-400">Campaign Breakdown</span>
        <div className="flex items-center gap-3">
          {(["high", "moderate", "low"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => toggleCat(cat)}
              className={cn("flex items-center gap-1.5 text-[10.5px] uppercase tracking-wide transition-opacity", activeCats.has(cat) ? "opacity-100" : "opacity-30")}
            >
              <span className={cn("h-2 w-2 rounded-full", catColor[cat])} />
              <span className="text-neutral-400">{catLabel[cat]}</span>
            </button>
          ))}
          <MoreHorizontalMenu />
        </div>
      </div>
      <p className="text-[26px] font-semibold text-white">4.8x</p>
      <p className="mb-4 flex items-center gap-1 text-[11px] text-emerald-400">
        <TrendingUp className="h-3 w-3" /> 9.4%
        <span className="text-neutral-500">vs last month</span>
      </p>

      <div className="flex h-[100px] items-end gap-[3px]">
        {campaignBars.map((bar, i) => {
          const dimmed = !activeCats.has(bar.cat);
          return (
            <div key={i} className="relative flex-1" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
              {hovered === i && (
                <div className="absolute -top-7 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#1E1E22] px-1.5 py-0.5 text-[10px] text-white shadow-lg">
                  {(bar.h / 20).toFixed(1)}x
                </div>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${bar.h}%`, opacity: dimmed ? 0.25 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 22, delay: i * 0.006 }}
                className={cn("w-full rounded-[2px]", catColor[bar.cat])}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Deployment table                                                      */
/* ------------------------------------------------------------------ */

const columns: { key: SortKey; label: string }[] = [
  { key: "name", label: "Campaign" },
  { key: "status", label: "Status" },
  { key: "budget", label: "Budget" },
  { key: "spent", label: "Spent" },
  { key: "conversions", label: "Conversions" },
  { key: "convRate", label: "Conv. Rate" },
  { key: "roas", label: "ROAS" },
  { key: "clicks", label: "Clicks" },
  { key: "ctr", label: "CTR" },
];

function DeploymentTable({ query }: { query: string }) {
  const [statusFilter, setStatusFilter] = useState<"ALL" | CampaignStatus>("ALL");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [dateRange, setDateRange] = useState(dateRangePresets[0]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const rows = useMemo(() => {
    const filtered = campaignsSeed.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
    const sorted = [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      if (typeof av === "number" && typeof bv === "number") {
        return sortDir === "asc" ? av - bv : bv - av;
      }
      return 0;
    });
    return sorted;
  }, [query, statusFilter, sortKey, sortDir]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141416] font-mono">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] p-4">
        <div className="flex items-center gap-2.5">
          <Square className="h-4 w-4 text-neutral-400" />
          <span className="text-[12px] uppercase tracking-wide text-white">Deployment in progress</span>
          <div className="relative">
            <button
              onClick={() => setStatusMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-md bg-white/[0.06] px-2.5 py-1 text-[10.5px] uppercase tracking-wide text-neutral-300 hover:bg-white/[0.1]"
            >
              <Flag className="h-3 w-3" /> {statusFilter === "ALL" ? "Status" : statusFilter}
            </button>
            <Dropdown open={statusMenuOpen} onClose={() => setStatusMenuOpen(false)} width={160}>
              {(["ALL", "ACTIVE", "PAUSED", "CANCEL", "COMPLETED"] as const).map((s) => (
                <DropdownItem
                  key={s}
                  icon={Flag}
                  label={s}
                  active={statusFilter === s}
                  onClick={() => {
                    setStatusFilter(s);
                    setStatusMenuOpen(false);
                  }}
                />
              ))}
            </Dropdown>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setDateMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] uppercase tracking-wide text-neutral-300"
          >
            <Calendar className="h-3.5 w-3.5 text-neutral-500" /> {dateRange} <ChevronDown className="h-3 w-3 text-neutral-500" />
          </button>
          <Dropdown open={dateMenuOpen} onClose={() => setDateMenuOpen(false)} anchor="right" width={200}>
            {dateRangePresets.map((preset) => (
              <DropdownItem
                key={preset}
                icon={Calendar}
                label={preset}
                active={dateRange === preset}
                onClick={() => {
                  setDateRange(preset);
                  setDateMenuOpen(false);
                }}
              />
            ))}
          </Dropdown>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-9 gap-2 px-4 py-2.5 text-[10.5px] uppercase tracking-wide text-neutral-500">
            {columns.map((col) => (
              <button key={col.key} onClick={() => handleSort(col.key)} className="flex items-center gap-1 text-left hover:text-neutral-300">
                {col.label}
                <ArrowDownUp className={cn("h-3 w-3", sortKey === col.key ? "text-blue-400" : "text-neutral-600")} />
              </button>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {rows.map((c) => (
              <motion.div
                key={c.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-9 gap-2 border-t border-white/[0.04] px-4 py-3 text-[12px] text-neutral-300 hover:bg-white/[0.02]"
              >
                <span className="truncate uppercase tracking-wide text-neutral-200">{c.name}</span>
                <span>
                  <span className={cn("inline-block rounded px-2 py-0.5 text-[10px] uppercase tracking-wide", statusStyle(c.status))}>{c.status}</span>
                </span>
                <span className="text-neutral-300">${c.budget.toFixed(2)}</span>
                <span className="text-neutral-400">${c.spent.toFixed(2)}</span>
                <span className="text-blue-400">{c.conversions ?? "-"}</span>
                <span className="text-emerald-400">{c.convRate != null ? `${c.convRate}%` : "-"}</span>
                <span className={roasStyle(c.roas)}>{c.roas ?? "-"}</span>
                <span className="text-neutral-300">{c.clicks ?? "-"}</span>
                <span className="text-neutral-300">{c.ctr != null ? `${c.ctr}%` : "-"}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {rows.length === 0 && <p className="py-8 text-center text-[11.5px] uppercase tracking-wide text-neutral-500">No campaigns match your filters.</p>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty state (non-overview sections)                                  */
/* ------------------------------------------------------------------ */

function EmptyStateDark({ icon: Icon, title, description }: { icon: IconType; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col items-center justify-center gap-3 py-24 text-center font-mono"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.06]">
        <Icon className="h-5 w-5 text-neutral-400" />
      </span>
      <h2 className="text-[13px] uppercase tracking-wide text-white">{title}</h2>
      <p className="max-w-[280px] text-[12px] normal-case tracking-normal text-neutral-500">{description}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard view                                                       */
/* ------------------------------------------------------------------ */

function DashboardView({
  query,
  year,
  onYearChange,
}: {
  query: string;
  year: "2026" | "2025";
  onYearChange: (y: "2026" | "2025") => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <AdPerformanceChart year={year} onYearChange={onYearChange} />
        <CampaignBreakdownChart />
      </div>

      <DeploymentTable query={query} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function AdformaDashboard() {
  const [sidebarKey, setSidebarKey] = useState<SidebarKey>("overview");
  const [topTab, setTopTab] = useState<TopTabKey>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<"2026" | "2025">("2026");

  function handleSelectSidebar(key: SidebarKey) {
    setSidebarKey(key);
    setTopTab("dashboard");
    setQuery("");
  }

  function handleSelectTab(key: TopTabKey) {
    setTopTab(key);
    setQuery("");
  }

  const sidebarCopy = sectionCopy[sidebarKey];
  const tabCopy = topTabCopy[topTab];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      <Sidebar activeKey={sidebarKey} collapsed={collapsed} onSelect={handleSelectSidebar} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar query={query} onQueryChange={setQuery} />
        {sidebarKey === "overview" && <TopTabs activeTab={topTab} onSelect={handleSelectTab} />}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          <AnimatePresence mode="wait">
            {sidebarKey === "overview" && topTab === "dashboard" ? (
              <DashboardView key="dashboard" query={query} year={year} onYearChange={setYear} />
            ) : sidebarKey === "overview" && tabCopy ? (
              <EmptyStateDark key={topTab} icon={tabCopy.icon} title={tabCopy.title} description={tabCopy.description} />
            ) : (
              sidebarCopy && <EmptyStateDark key={sidebarKey} icon={sidebarCopy.icon} title={sidebarCopy.title} description={sidebarCopy.description} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}