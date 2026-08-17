"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap,
  Compass,
  Bell,
  CreditCard,
  Coins,
  Users,
  ClipboardList,
  Map as MapIcon,
  Globe,
  MoreHorizontal,
  Settings,
  CircleHelp,
  MessageSquare,
  LayoutGrid,
  Search,
  Command,
  Plus,
  Send,
  FileDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  UserPlus,
  UserMinus,
  TrendingUp,
  ArrowRight,
  Filter,
  Calendar,
  GitBranch,
  PieChart,
  MoreVertical,
  Check,
  Square,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string }>;

type NavKey = "dashboard" | "notification" | "earnings" | "spending" | "subscriptions" | "reports" | "transactions" | "performance" | "settings" | "helpcenter" | "feedback";

type RangeKey = "30d" | "3m" | "1y";

type SubStatus = "Subscribed" | "Unsubscribed" | "Inactive";

type Source = "Website" | "Paid Ads" | "Organic Ads" | "Referral";

type Subscriber = {
  id: string;
  name: string;
  email: string;
  status: SubStatus;
  signup: string;
  source: Source;
};

type SortKey = "id" | "name" | "email" | "status" | "signup" | "source";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const mainMenu: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "dashboard", label: "Dashboard", icon: Compass },
  { key: "notification", label: "Notification", icon: Bell },
  { key: "earnings", label: "Earnings", icon: CreditCard },
  { key: "spending", label: "Spending", icon: Coins },
  { key: "subscriptions", label: "Subscriptions", icon: Users },
  { key: "reports", label: "Reports", icon: ClipboardList },
  { key: "transactions", label: "Transactions", icon: MapIcon },
  { key: "performance", label: "Performance", icon: Globe },
];

const generalMenu: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "settings", label: "Settings", icon: Settings },
  { key: "helpcenter", label: "Help Center", icon: CircleHelp },
  { key: "feedback", label: "Feedback", icon: MessageSquare },
];

const sectionCopy: Partial<Record<NavKey, { icon: IconType; title: string; description: string }>> = {
  notification: { icon: Bell, title: "Notifications", description: "Every alert about your revenue, subscribers and churn lands here." },
  earnings: { icon: CreditCard, title: "Earnings", description: "A full breakdown of revenue by product and billing cycle." },
  spending: { icon: Coins, title: "Spending", description: "Track platform and infrastructure costs against revenue." },
  subscriptions: { icon: Users, title: "Subscriptions", description: "Manage plans, pricing tiers and active subscriptions." },
  reports: { icon: ClipboardList, title: "Reports", description: "Schedule and export recurring performance reports." },
  transactions: { icon: MapIcon, title: "Transactions", description: "A ledger of every charge, refund and payout." },
  performance: { icon: Globe, title: "Performance", description: "Regional and channel-level performance at a glance." },
  settings: { icon: Settings, title: "Settings", description: "Manage workspace, billing and team preferences." },
  helpcenter: { icon: CircleHelp, title: "Help Center", description: "Search articles or reach out to support any time." },
  feedback: { icon: MessageSquare, title: "Feedback", description: "Share ideas and vote on what we build next." },
};

const rangeMeta: Record<RangeKey, { label: string; dailyRevenue: string; dailyDelta: string; activeSubs: string; activeDelta: string; newSubs: string; newDelta: string; churn: string; churnDelta: string }> = {
  "30d": { label: "30 Days", dailyRevenue: "$612.10", dailyDelta: "+20%($223)", activeSubs: "42,243", activeDelta: "+12%(1,456)", newSubs: "1605", newDelta: "+20%(201)", churn: "3.2%", churnDelta: "-8%(0.4%)" },
  "3m": { label: "3 Months", dailyRevenue: "$584.40", dailyDelta: "+14%($172)", activeSubs: "41,020", activeDelta: "+9%(998)", newSubs: "4310", newDelta: "+11%(410)", churn: "3.6%", churnDelta: "-4%(0.2%)" },
  "1y": { label: "1 years", dailyRevenue: "$531.75", dailyDelta: "+31%($401)", activeSubs: "37,860", activeDelta: "+22%(3,120)", newSubs: "15840", newDelta: "+18%(1,980)", churn: "4.1%", churnDelta: "-2%(0.1%)" },
};

const recordSlides = [
  { title: "New Record Achieved!", body: "November is the highest revenue since the start with $6,745,500." },
  { title: "Fastest Growth Yet", body: "Subscriber growth is up 12% this month, the strongest since launch." },
  { title: "Churn at an All-Time Low", body: "Churn rate dropped to 3.2%, down from 4.1% last quarter." },
];

const leadSources: { label: Source; value: number; color: string }[] = [
  { label: "Website", value: 1240, color: "#5B8DEF" },
  { label: "Paid Ads", value: 354, color: "#8B5CF6" },
  { label: "Organic Ads", value: 553, color: "#5B8DEF" },
  { label: "Referral", value: 204, color: "#C084FC" },
];

const subscribersSeed: Subscriber[] = [
  { id: "001", name: "John Lake", email: "john.l@example.com", status: "Unsubscribed", signup: "2025-01-15", source: "Website" },
  { id: "002", name: "Kate Williams", email: "kate.williams@example.com", status: "Subscribed", signup: "2025-02-19", source: "Organic Ads" },
  { id: "003", name: "Ahmed Hamdi", email: "ahmed.h@example.com", status: "Unsubscribed", signup: "2025-03-12", source: "Referral" },
  { id: "004", name: "Sarah Johnson", email: "sarah.j@example.com", status: "Subscribed", signup: "2025-11-02", source: "Referral" },
  { id: "005", name: "Mark Wilson", email: "mark.w@example.com", status: "Inactive", signup: "2025-03-08", source: "Organic Ads" },
  { id: "006", name: "Sarah Luis", email: "sarah.luis@example.com", status: "Subscribed", signup: "2024-12-19", source: "Website" },
  { id: "007", name: "Diego Torres", email: "diego.t@example.com", status: "Subscribed", signup: "2025-04-27", source: "Paid Ads" },
  { id: "008", name: "Priya Nair", email: "priya.n@example.com", status: "Inactive", signup: "2025-05-30", source: "Website" },
];

const subscriberPool: Omit<Subscriber, "id">[] = [
  { name: "Elena Petrova", email: "elena.p@example.com", status: "Subscribed", signup: "2026-08-15", source: "Paid Ads" },
  { name: "Liam Chen", email: "liam.chen@example.com", status: "Subscribed", signup: "2026-08-16", source: "Website" },
  { name: "Fatima Al-Sayed", email: "fatima.a@example.com", status: "Subscribed", signup: "2026-08-17", source: "Referral" },
  { name: "Noah Becker", email: "noah.b@example.com", status: "Subscribed", signup: "2026-08-17", source: "Organic Ads" },
];

const plans = [
  { key: "starter", label: "Starter", price: "$12/mo" },
  { key: "pro", label: "Pro", price: "$29/mo" },
  { key: "business", label: "Business", price: "$79/mo" },
];

const signupPresets = ["All time", "Last 30 days", "Last 90 days", "This year"];

const addMenuItems = [
  { key: "campaign", label: "New Campaign", icon: TrendingUp },
  { key: "subscriber", label: "New Subscriber", icon: UserPlus },
  { key: "report", label: "New Report", icon: ClipboardList },
];

const pillSpring = { type: "spring" as const, stiffness: 350, damping: 30 };

function statusStyle(status: SubStatus) {
  switch (status) {
    case "Subscribed":
      return "bg-emerald-500/15 text-emerald-400";
    case "Unsubscribed":
      return "bg-rose-500/15 text-rose-400";
    case "Inactive":
      return "bg-white/10 text-neutral-300";
  }
}

function sourceStyle(source: Source) {
  switch (source) {
    case "Referral":
      return "bg-violet-500/15 text-violet-400";
    default:
      return "bg-blue-500/15 text-blue-400";
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
            "absolute top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#1C1C20] p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]",
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
      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-neutral-300 transition-colors hover:bg-white/5"
    >
      <Icon className="h-[15px] w-[15px] text-neutral-500" />
      <span className="flex-1">{label}</span>
      {active && <Check className="h-3.5 w-3.5 text-violet-400" />}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                              */
/* ------------------------------------------------------------------ */

function NavItem({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button onClick={onClick} className="relative flex w-full items-center gap-3 rounded-lg py-[7px] pl-3 pr-2.5 text-[13.5px] transition-colors">
      {active && <motion.span layoutId="tempo-nav-bar" className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-full bg-white" transition={pillSpring} />}
      <Icon className={cn("h-[16px] w-[16px] shrink-0", active ? "text-white" : "text-neutral-500")} />
      <span className={cn("flex-1 truncate text-left", active ? "font-semibold text-white" : "text-neutral-400")}>{label}</span>
    </button>
  );
}

function SectionHeader({ label, open, onToggle }: { label: string; open: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="flex w-full items-center gap-1.5 px-3 pb-1.5 text-[12px] font-medium text-neutral-500 hover:text-neutral-300">
      {label}
      <motion.span animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.15 }}>
        <ChevronDown className="h-3.5 w-3.5" />
      </motion.span>
    </button>
  );
}

function Sidebar({
  activeKey,
  onSelect,
  selectedPlan,
  onSelectPlan,
}: {
  activeKey: NavKey;
  onSelect: (key: NavKey) => void;
  selectedPlan: string | null;
  onSelectPlan: (key: string) => void;
}) {
  const [mainOpen, setMainOpen] = useState(true);
  const [generalOpen, setGeneralOpen] = useState(true);
  const [moreOpen, setMoreOpen] = useState(false);
  const [planOpen, setPlanOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const currentPlan = plans.find((p) => p.key === selectedPlan);

  return (
    <aside className="flex h-full w-[224px] shrink-0 flex-col overflow-y-auto border-r border-white/[0.06] bg-[#0E0E10] px-3 py-4">
      <div className="mb-5 flex items-center gap-2 px-1">
        <img
          src="/logoW.png"
          alt="Zap"
          className="h-5 w-5"
        />
        <span className="text-[17px] font-bold text-white">BagUi</span>
      </div>

      <div className="flex flex-col gap-0.5">
        <SectionHeader label="Main Menu" open={mainOpen} onToggle={() => setMainOpen((o) => !o)} />
        <AnimatePresence initial={false}>
          {mainOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.16 }} className="overflow-hidden">
              <div className="flex flex-col gap-0.5 pb-1">
                {mainMenu.map((item) => (
                  <NavItem key={item.key} icon={item.icon} label={item.label} active={activeKey === item.key} onClick={() => onSelect(item.key)} />
                ))}
                <div className="relative">
                  <button onClick={() => setMoreOpen((o) => !o)} className="flex w-full items-center gap-3 rounded-lg py-[7px] pl-3 pr-2.5 text-[13.5px] text-neutral-400 hover:text-neutral-200">
                    <MoreHorizontal className="h-[16px] w-[16px]" />
                    More
                  </button>
                  <Dropdown open={moreOpen} onClose={() => setMoreOpen(false)} width={180}>
                    <DropdownItem icon={GitBranch} label="Integrations" />
                    <DropdownItem icon={Square} label="API Keys" />
                  </Dropdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex flex-col gap-0.5">
        <SectionHeader label="General" open={generalOpen} onToggle={() => setGeneralOpen((o) => !o)} />
        <AnimatePresence initial={false}>
          {generalOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.16 }} className="overflow-hidden">
              <div className="flex flex-col gap-0.5 pb-1">
                {generalMenu.map((item) => (
                  <NavItem key={item.key} icon={item.icon} label={item.label} active={activeKey === item.key} onClick={() => onSelect(item.key)} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-1" />

      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] p-4">
        <Zap className="h-5 w-5 fill-white text-white" />
        <p className="mt-3 text-[14px] font-bold text-white">{currentPlan ? `${currentPlan.label} Plan` : "Free Trial Version"}</p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div className={cn("h-full rounded-full bg-gradient-to-r from-white/40 to-white", currentPlan ? "w-full" : "w-[70%]")} />
        </div>
        <p className="mt-3 text-[12px] leading-snug text-neutral-400">
          {currentPlan ? `${currentPlan.price} · billed monthly` : "You have 4 days left. Upgrade to continue"}
        </p>
        <div className="relative">
          <button onClick={() => setPlanOpen((o) => !o)} className="mt-3 flex items-center gap-1 text-[12.5px] font-medium text-neutral-300 hover:text-white">
            {currentPlan ? "Change plan" : "Select plan"} <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <Dropdown open={planOpen} onClose={() => setPlanOpen(false)} width={180}>
            {plans.map((p) => (
              <DropdownItem
                key={p.key}
                icon={Zap}
                label={`${p.label} · ${p.price}`}
                active={selectedPlan === p.key}
                onClick={() => {
                  onSelectPlan(p.key);
                  setPlanOpen(false);
                }}
              />
            ))}
          </Dropdown>
        </div>
      </div>

      <div className="relative mt-3">
        <button onClick={() => setProfileOpen((o) => !o)} className="flex w-full items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] p-2.5 hover:bg-white/[0.05]">
          <img
            src="/avatar.png"
            alt="Nero Design"
            className="h-9 w-9 shrink-0 rounded-full border border-white/10 bg-neutral-800 object-cover"
          />
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[13px] font-semibold text-white">Anelka Bag</p>
            <p className="truncate text-[11.5px] text-neutral-500">ceo@bagui.pro</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
        </button>
        <Dropdown open={profileOpen} onClose={() => setProfileOpen(false)} width={190}>
          <DropdownItem icon={Settings} label="Account settings" />
          <DropdownItem icon={ArrowRight} label="Log out" />
        </Dropdown>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar                                                              */
/* ------------------------------------------------------------------ */

function TopBar({
  query,
  onQueryChange,
  onAddSubscriber,
  canAddSubscriber,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onAddSubscriber: () => void;
  canAddSubscriber: boolean;
}) {
  const [openMenu, setOpenMenu] = useState<"add" | "invite" | null>(null);

  return (
    <div className="flex items-center justify-between px-7 py-4">
      <span className="flex items-center gap-2 text-[15px] font-semibold text-white">
        <LayoutGrid className="h-[17px] w-[17px] text-neutral-400" /> Dashboard
      </span>

      <div className="flex items-center gap-3">
        <div className="flex w-[230px] items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2">
          <Search className="h-[14px] w-[14px] text-neutral-500" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search Anything..."
            className="w-full bg-transparent text-[12.5px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
          />
          <span className="flex items-center gap-0.5 rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[10px] text-neutral-500">
            <Command className="h-2.5 w-2.5" />K
          </span>
        </div>

        <div className="h-5 w-px bg-white/10" />

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "add" ? null : "add"))}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[13px] text-neutral-200 hover:bg-white/[0.07]"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
          <Dropdown open={openMenu === "add"} onClose={() => setOpenMenu(null)} anchor="right" width={200}>
            {addMenuItems.map((item) =>
              item.key === "subscriber" ? (
                <DropdownItem
                  key={item.key}
                  icon={item.icon}
                  label={canAddSubscriber ? item.label : "No more prospects"}
                  onClick={() => {
                    if (canAddSubscriber) onAddSubscriber();
                    setOpenMenu(null);
                  }}
                />
              ) : (
                <DropdownItem key={item.key} icon={item.icon} label={item.label} onClick={() => setOpenMenu(null)} />
              )
            )}
          </Dropdown>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "invite" ? null : "invite"))}
            className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-[13px] font-medium text-neutral-900 hover:bg-neutral-200"
          >
            <Send className="h-3.5 w-3.5" /> Invite
          </button>
          <Dropdown open={openMenu === "invite"} onClose={() => setOpenMenu(null)} anchor="right" width={230}>
            <p className="px-2.5 py-1.5 text-[11px] uppercase tracking-wide text-neutral-500">Invite by email</p>
            <div className="flex items-center gap-1.5 px-1.5 pb-1.5">
              <input placeholder="teammate@company.com" className="w-full rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[12.5px] text-neutral-200 placeholder:text-neutral-600 focus:outline-none" />
            </div>
            <DropdownItem icon={Send} label="Send invite" onClick={() => setOpenMenu(null)} />
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

function RangeTabs({
  value,
  onChange,
  onExport,
  onAddSubscriber,
  canAddSubscriber,
}: {
  value: RangeKey;
  onChange: (v: RangeKey) => void;
  onExport: () => void;
  onAddSubscriber: () => void;
  canAddSubscriber: boolean;
}) {
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const ranges: { key: RangeKey; label: string }[] = [
    { key: "30d", label: "30 Days" },
    { key: "3m", label: "3 Months" },
    { key: "1y", label: "1 years" },
  ];

  return (
    <div className="flex items-center justify-between px-7 pb-4">
      <div className="flex items-center gap-1 rounded-xl bg-white/[0.03] p-1">
        {ranges.map((r) => {
          const active = r.key === value;
          return (
            <button key={r.key} onClick={() => onChange(r.key)} className="relative rounded-lg px-3.5 py-1.5 text-[13px] transition-colors">
              {active && <motion.span layoutId="tempo-range-pill" className="absolute inset-0 rounded-lg bg-white/10" transition={pillSpring} />}
              <span className={cn("relative z-10", active ? "font-medium text-white" : "text-neutral-500")}>{r.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2.5">
        <button onClick={onExport} className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[13px] text-neutral-200 hover:bg-white/[0.07]">
          <FileDown className="h-3.5 w-3.5" /> Export
        </button>
        <div className="relative">
          <button
            onClick={() => setNewMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-[13px] font-medium text-neutral-900 hover:bg-neutral-200"
          >
            New <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <Dropdown open={newMenuOpen} onClose={() => setNewMenuOpen(false)} anchor="right" width={200}>
            {addMenuItems.map((item) =>
              item.key === "subscriber" ? (
                <DropdownItem
                  key={item.key}
                  icon={item.icon}
                  label={canAddSubscriber ? item.label : "No more prospects"}
                  onClick={() => {
                    if (canAddSubscriber) onAddSubscriber();
                    setNewMenuOpen(false);
                  }}
                />
              ) : (
                <DropdownItem key={item.key} icon={item.icon} label={item.label} onClick={() => setNewMenuOpen(false)} />
              )
            )}
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stat cards                                                           */
/* ------------------------------------------------------------------ */

function StatCard({
  icon: Icon,
  label,
  value,
  delta,
  positive,
  sub,
  onClick,
  active,
  clickable,
}: {
  icon: IconType;
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  sub: string;
  onClick?: () => void;
  active?: boolean;
  clickable?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-4 text-left transition-all",
        active ? "border-violet-400/60 bg-violet-500/[0.06] ring-1 ring-violet-400/30" : "border-white/[0.06] bg-[#141416]",
        clickable && "hover:border-white/20 hover:shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)] active:scale-[0.98]"
      )}
    >
      <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", active ? "bg-violet-500/20 text-violet-300" : "bg-white/[0.06] text-neutral-300")}>
        <Icon className="h-[15px] w-[15px]" />
      </span>
      <p className="mt-3 text-[13px] text-neutral-400">{label}</p>
      <p className="mt-1 text-[22px] font-semibold text-white">{value}</p>
      <p className="mt-1.5 text-[12px] text-neutral-500">
        <span className={cn("font-medium", positive ? "text-emerald-400" : "text-rose-400")}>{delta}</span> · {sub}
      </p>
      {clickable && (
        <p className="mt-2 text-[10.5px] font-medium text-neutral-600">{active ? "Filtering table below ✕" : "Click to filter table"}</p>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Revenue flow chart                                                    */
/* ------------------------------------------------------------------ */

const revenuePoints = Array.from({ length: 32 }, (_, i) => {
  const trend = 1300 + i * 320;
  const wave = Math.sin(i * 0.9) * 900 + Math.sin(i * 0.35) * 500;
  return Math.max(700, Math.round(trend + wave));
});

const chartStart = new Date(2025, 9, 18);

const profitPoints = revenuePoints.map((v, i) => Math.round(v * (0.28 + 0.03 * Math.sin(i * 0.5))));

function formatChartDate(offset: number) {
  const d = new Date(chartStart);
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

const RevenueFlowChart = React.forwardRef<HTMLDivElement, {}>(function RevenueFlowChart(_props, ref) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [metric, setMetric] = useState<"revenue" | "profit">("revenue");
  const [menuOpen, setMenuOpen] = useState(false);
  const activeIndex = hovered ?? 21;
  const dataset = metric === "revenue" ? revenuePoints : profitPoints;
  const total = dataset.reduce((a, b) => a + b, 0);

  const max = Math.max(...dataset);
  const min = Math.min(...dataset);
  const span = max - min || 1;
  const pad = span * 0.15;
  const lo = min - pad;
  const hi = max + pad;

  const points = dataset.map((v, i) => ({
    x: (i / (dataset.length - 1)) * 100,
    y: 100 - ((v - lo) / (hi - lo)) * 100,
  }));
  const pointsAttr = points.map((p) => `${p.x},${p.y}`).join(" ");
  const active = points[activeIndex];

  const ticks = 5;
  const tickVals = Array.from({ length: ticks }, (_, i) => hi - (i / (ticks - 1)) * (hi - lo));

  return (
    <div ref={ref} className="rounded-2xl border border-white/[0.06] bg-[#141416] p-5 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[14px] font-medium text-white">
          <TrendingUp className="h-4 w-4 text-neutral-400" /> Revenue Flow
        </span>
        <div className="relative">
          <button onClick={() => setMenuOpen((o) => !o)} className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5">
            <MoreVertical className="h-4 w-4" />
          </button>
          <Dropdown open={menuOpen} onClose={() => setMenuOpen(false)} anchor="right" width={170}>
            <DropdownItem icon={TrendingUp} label="Revenue" active={metric === "revenue"} onClick={() => { setMetric("revenue"); setMenuOpen(false); }} />
            <DropdownItem icon={PieChart} label="Profit" active={metric === "profit"} onClick={() => { setMetric("profit"); setMenuOpen(false); }} />
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
        <div className="flex flex-col">
          <p className="text-[26px] font-semibold text-white">${total.toLocaleString()}</p>
          <p className="text-[12.5px] text-neutral-500">Total {metric === "revenue" ? "Revenue" : "Profit"}</p>
          <p className="mt-1.5 text-[12px] text-neutral-500">
            <span className="font-medium text-emerald-400">+20%({metric === "revenue" ? "$2,423" : "$680"})</span> · Last 30 Days
          </p>

          <div className="relative mt-4 flex-1 overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
            <AnimatePresence mode="wait">
              <motion.div key={slide} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.18 }}>
                <p className="text-[13.5px] font-semibold text-white">{recordSlides[slide].title}</p>
                <p className="mt-2 text-[12px] leading-snug text-neutral-400">{recordSlides[slide].body}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setSlide((s) => (s - 1 + recordSlides.length) % recordSlides.length)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <div className="flex flex-1 gap-1">
                {recordSlides.map((_, i) => (
                  <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i === slide ? "bg-white" : "bg-white/15")} />
                ))}
              </div>
              <button
                onClick={() => setSlide((s) => (s + 1) % recordSlides.length)}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-neutral-400 hover:bg-white/10 hover:text-white"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col justify-between py-1 text-right text-[11px] text-neutral-500">
            {tickVals.map((v, i) => (
              <span key={i}>${Math.round(v).toLocaleString()}</span>
            ))}
          </div>
          <div className="relative flex-1">
            <div className="relative h-[210px] w-full">
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="tempo-line-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={`0,100 ${pointsAttr} 100,100`} fill="url(#tempo-line-fill)" />
                <polyline points={pointsAttr} fill="none" stroke="#8B5CF6" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
              </svg>

              <div className="absolute inset-0 flex">
                {dataset.map((_, i) => (
                  <div key={i} className="flex-1" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
                ))}
              </div>

              <div className="pointer-events-none absolute inset-y-0" style={{ left: `${active.x}%` }}>
                <div className="h-full w-px border-l border-dashed border-white/20" />
              </div>

              <motion.span
                layoutId="tempo-line-dot"
                style={{ left: `${active.x}%`, top: `${active.y}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#141416] bg-violet-400 shadow-[0_0_0_5px_rgba(139,92,246,0.25)]"
              />

              <motion.div
                layoutId="tempo-line-tooltip"
                style={{ left: `${active.x}%`, top: `${active.y}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-[calc(100%+14px)] whitespace-nowrap rounded-lg border border-white/10 bg-[#1E1E22] px-3 py-2 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)]"
              >
                <p className="text-[11px] text-neutral-400">{formatChartDate(activeIndex)}</p>
                <p className="flex items-center gap-1.5 text-[13px] font-medium text-white">
                  ${dataset[activeIndex].toLocaleString()} <span className="text-emerald-400">+20%</span>
                </p>
              </motion.div>
            </div>
            <div className="mt-2 flex justify-between text-[11px] text-neutral-500">
              <span>{formatChartDate(0)}</span>
              <span>{formatChartDate(dataset.length - 1)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Lead sources donut                                                    */
/* ------------------------------------------------------------------ */

function LeadSourcesCard({ activeSource, onSelectSource }: { activeSource: "All" | Source; onSelectSource: (s: Source) => void }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const total = leadSources.reduce((a, b) => a + b.value, 0);
  const radius = 15.9;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#141416] p-5">
      <div className="mb-5 flex items-center justify-between">
        <span className="flex items-center gap-2 text-[14px] font-medium text-white">
          <LayoutGrid className="h-4 w-4 text-neutral-400" /> Lead Sources Breakdown
        </span>
        <button className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative h-[130px] w-[130px] shrink-0">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            {leadSources.map((s, i) => {
              const pct = s.value / total;
              const dash = pct * circumference;
              const gap = circumference - dash;
              const el = (
                <circle
                  key={s.label}
                  cx="18"
                  cy="18"
                  r={radius}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={hovered === i ? 4.2 : 3.2}
                  strokeDasharray={`${dash} ${gap}`}
                  strokeDashoffset={-offsetAcc}
                  strokeLinecap="round"
                  className="transition-all duration-200"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                />
              );
              offsetAcc += dash + 1.5;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[20px] font-bold text-white">{total.toLocaleString()}</span>
            <span className="text-[10.5px] text-neutral-500">Total Leads</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {leadSources.map((s, i) => {
            const isFilterActive = activeSource === s.label;
            return (
              <button
                key={s.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelectSource(s.label)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-1.5 py-1 text-[13px] transition-all",
                  hovered != null && hovered !== i ? "opacity-40" : "opacity-100",
                  isFilterActive ? "bg-white/[0.06] ring-1 ring-white/20" : "hover:bg-white/[0.04]"
                )}
              >
                <span className="flex items-center gap-2 text-neutral-400">
                  <span className="h-3 w-1 rounded-full" style={{ backgroundColor: s.color }} />
                  {s.label}
                </span>
                <span className="font-semibold text-white">{s.value.toLocaleString()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => onSelectSource(leadSources[0].label)}
        className="mt-5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/[0.06] py-2.5 text-[13px] font-medium text-white hover:bg-white/[0.1]"
      >
        More details <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Subscribers table                                                     */
/* ------------------------------------------------------------------ */

const columns: { key: SortKey; label: string; icon: IconType }[] = [
  { key: "id", label: "Subscriber ID", icon: Square },
  { key: "name", label: "Name", icon: User },
  { key: "email", label: "Email", icon: Search },
  { key: "status", label: "Status", icon: PieChart },
  { key: "signup", label: "Signup Date", icon: Calendar },
  { key: "source", label: "Source", icon: GitBranch },
];

const SubscribersTable = React.forwardRef<
  HTMLDivElement,
  {
    query: string;
    subscribers: Subscriber[];
    sourceFilter: "All" | Source;
    onSourceFilterChange: (s: "All" | Source) => void;
    statusFilter: "All" | SubStatus;
    onStatusFilterChange: (s: "All" | SubStatus) => void;
    highlightId: string | null;
  }
>(function SubscribersTable(
  { query, subscribers, sourceFilter, onSourceFilterChange, statusFilter, onStatusFilterChange, highlightId },
  ref
) {
  const [signupPreset, setSignupPreset] = useState(signupPresets[0]);
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu] = useState<"signup" | "source" | "status" | null>(null);

  function handleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function toggleRow(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = subscribers.filter((s) => {
      const matchesQuery = s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
      const matchesSource = sourceFilter === "All" || s.source === sourceFilter;
      const matchesStatus = statusFilter === "All" || s.status === statusFilter;
      return matchesQuery && matchesSource && matchesStatus;
    });
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = av.localeCompare(bv);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [subscribers, query, sourceFilter, statusFilter, sortKey, sortDir]);

  const allSelected = rows.length > 0 && rows.every((r) => selected.has(r.id));

  function toggleAll() {
    setSelected((prev) => {
      if (allSelected) return new Set();
      return new Set(rows.map((r) => r.id));
    });
  }

  function exportCsv() {
    const header = "Subscriber ID,Name,Email,Status,Signup Date,Source\n";
    const body = rows.map((r) => `"${r.id}","${r.name}","${r.email}","${r.status}","${r.signup}","${r.source}"`).join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div ref={ref} className="rounded-2xl border border-white/[0.06] bg-[#141416]">
      <div className="flex flex-col gap-3 border-b border-white/[0.06] p-4">
        {selected.size > 0 ? (
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-semibold text-white">{selected.size} selected</span>
            <button onClick={() => setSelected(new Set())} className="text-[12.5px] text-violet-400 hover:text-violet-300">
              Clear
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-[15px] font-semibold text-white">{subscribers.length.toLocaleString()} Active Subscribers</span>
            {(statusFilter !== "All" || sourceFilter !== "All") && (
              <span className="flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2.5 py-1 text-[11.5px] text-violet-300">
                Filtered by {statusFilter !== "All" ? statusFilter : sourceFilter}
                <button
                  onClick={() => {
                    onStatusFilterChange("All");
                    onSourceFilterChange("All");
                  }}
                  className="text-violet-400 hover:text-white"
                >
                  ✕
                </button>
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex w-[220px] items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2">
              <Search className="h-[13px] w-[13px] text-neutral-500" />
              <span className="flex-1 text-[12px] text-neutral-500">{query ? query : "Search for a subscriber"}</span>
              <span className="rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[10px] text-neutral-500">⌘K</span>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu((m) => (m === "signup" ? null : "signup"))}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[12px] text-neutral-300 hover:bg-white/[0.06]"
              >
                <Calendar className="h-3.5 w-3.5 text-neutral-500" /> {signupPreset}
              </button>
              <Dropdown open={openMenu === "signup"} onClose={() => setOpenMenu(null)} width={170}>
                {signupPresets.map((p) => (
                  <DropdownItem key={p} icon={Calendar} label={p} active={signupPreset === p} onClick={() => { setSignupPreset(p); setOpenMenu(null); }} />
                ))}
              </Dropdown>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu((m) => (m === "source" ? null : "source"))}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[12px] text-neutral-300 hover:bg-white/[0.06]"
              >
                <GitBranch className="h-3.5 w-3.5 text-neutral-500" /> {sourceFilter === "All" ? "Source" : sourceFilter}
              </button>
              <Dropdown open={openMenu === "source"} onClose={() => setOpenMenu(null)} width={160}>
                {(["All", "Website", "Paid Ads", "Organic Ads", "Referral"] as const).map((s) => (
                  <DropdownItem key={s} icon={GitBranch} label={s} active={sourceFilter === s} onClick={() => { onSourceFilterChange(s); setOpenMenu(null); }} />
                ))}
              </Dropdown>
            </div>

            <div className="relative">
              <button
                onClick={() => setOpenMenu((m) => (m === "status" ? null : "status"))}
                className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[12px] text-neutral-300 hover:bg-white/[0.06]"
              >
                <PieChart className="h-3.5 w-3.5 text-neutral-500" /> {statusFilter === "All" ? "Status" : statusFilter}
              </button>
              <Dropdown open={openMenu === "status"} onClose={() => setOpenMenu(null)} width={160}>
                {(["All", "Subscribed", "Unsubscribed", "Inactive"] as const).map((s) => (
                  <DropdownItem key={s} icon={PieChart} label={s} active={statusFilter === s} onClick={() => { onStatusFilterChange(s); setOpenMenu(null); }} />
                ))}
              </Dropdown>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onSourceFilterChange("All");
                onStatusFilterChange("All");
                setSignupPreset(signupPresets[0]);
              }}
              className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[12px] text-neutral-300 hover:bg-white/[0.06]"
            >
              <Filter className="h-3.5 w-3.5" /> Reset
            </button>
            <button onClick={exportCsv} className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[12px] text-neutral-300 hover:bg-white/[0.06]">
              <FileDown className="h-3.5 w-3.5" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[760px]">
          <div className="grid grid-cols-[28px_1fr_1.3fr_1.6fr_1fr_1fr_1fr] items-center gap-2 px-4 py-2.5 text-[11.5px] text-neutral-500">
            <button onClick={toggleAll} className="flex h-4 w-4 items-center justify-center text-neutral-500 hover:text-neutral-300">
              {allSelected ? <CheckSquare className="h-4 w-4 text-violet-400" /> : <Square className="h-4 w-4" />}
            </button>
            {columns.map((col) => (
              <button key={col.key} onClick={() => handleSort(col.key)} className="flex items-center gap-1.5 text-left hover:text-neutral-300">
                <col.icon className="h-3.5 w-3.5" />
                {col.label}
              </button>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {rows.map((s) => {
              const checked = selected.has(s.id);
              const isNew = highlightId === s.id;
              return (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, backgroundColor: isNew ? "rgba(139,92,246,0.12)" : "rgba(0,0,0,0)" }}
                  exit={{ opacity: 0 }}
                  transition={{ backgroundColor: { duration: 1.4 } }}
                  className={cn("grid grid-cols-[28px_1fr_1.3fr_1.6fr_1fr_1fr_1fr] items-center gap-2 border-t border-white/[0.04] px-4 py-3 text-[13px]", checked && "bg-violet-500/[0.04]", !checked && !isNew && "hover:bg-white/[0.02]")}
                >
                  <button onClick={() => toggleRow(s.id)} className="flex h-4 w-4 items-center justify-center text-neutral-500 hover:text-neutral-300">
                    {checked ? <CheckSquare className="h-4 w-4 text-violet-400" /> : <Square className="h-4 w-4" />}
                  </button>
                  <span className="text-neutral-300">{s.id}</span>
                  <span className="flex min-w-0 items-center gap-2">
                    <img
                      src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(s.name)}&backgroundColor=27272a`}
                      alt={s.name}
                      className="h-6 w-6 shrink-0 rounded-full border border-white/10 bg-neutral-800 object-cover"
                    />
                    <span className="truncate text-neutral-200">{s.name}</span>
                  </span>
                  <span className="truncate text-neutral-400">{s.email}</span>
                  <span>
                    <span className={cn("inline-block rounded-md px-2 py-0.5 text-[11.5px]", statusStyle(s.status))}>{s.status}</span>
                  </span>
                  <span className="text-neutral-400">{s.signup}</span>
                  <span>
                    <span className={cn("inline-block rounded-md px-2 py-0.5 text-[11.5px]", sourceStyle(s.source))}>{s.source}</span>
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {rows.length === 0 && <p className="py-10 text-center text-[13px] text-neutral-500">No subscribers match your filters.</p>}
        </div>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Empty state (non-dashboard sections)                                 */
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
/* Dashboard view                                                        */
/* ------------------------------------------------------------------ */

function DashboardView({
  query,
  range,
  onRangeChange,
  onExport,
  onAddSubscriber,
  canAddSubscriber,
  subscribers,
  statusFilter,
  onStatusFilterChange,
  sourceFilter,
  onSourceFilterChange,
  onStatClick,
  onSelectSource,
  highlightId,
  tableRef,
  chartRef,
}: {
  query: string;
  range: RangeKey;
  onRangeChange: (r: RangeKey) => void;
  onExport: () => void;
  onAddSubscriber: () => void;
  canAddSubscriber: boolean;
  subscribers: Subscriber[];
  statusFilter: "All" | SubStatus;
  onStatusFilterChange: (s: "All" | SubStatus) => void;
  sourceFilter: "All" | Source;
  onSourceFilterChange: (s: "All" | Source) => void;
  onStatClick: (kind: "revenue" | "active" | "new" | "churn") => void;
  onSelectSource: (s: Source) => void;
  highlightId: string | null;
  tableRef: React.RefObject<HTMLDivElement | null>;
  chartRef: React.RefObject<HTMLDivElement | null>;
}) {
  const m = rangeMeta[range];
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
      <RangeTabs value={range} onChange={onRangeChange} onExport={onExport} onAddSubscriber={onAddSubscriber} canAddSubscriber={canAddSubscriber} />

      <div className="flex flex-col gap-4 px-7 pb-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CreditCard} label="Daily Revenue" value={m.dailyRevenue} delta={m.dailyDelta} positive sub={`Last ${m.label}`} clickable onClick={() => onStatClick("revenue")} />
          <StatCard
            icon={User}
            label="Active Subscribers"
            value={m.activeSubs}
            delta={m.activeDelta}
            positive
            sub={`Last ${m.label}`}
            clickable
            active={statusFilter === "Subscribed"}
            onClick={() => onStatClick("active")}
          />
          <StatCard icon={UserPlus} label="New Subscribers" value={m.newSubs} delta={m.newDelta} positive sub={`Last ${m.label}`} clickable onClick={() => onStatClick("new")} />
          <StatCard
            icon={UserMinus}
            label="Churn Rate"
            value={m.churn}
            delta={m.churnDelta}
            positive={false}
            sub={`Last ${m.label}`}
            clickable
            active={statusFilter === "Unsubscribed"}
            onClick={() => onStatClick("churn")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RevenueFlowChart ref={chartRef} />
          <LeadSourcesCard activeSource={sourceFilter} onSelectSource={onSelectSource} />
        </div>

        <SubscribersTable
          ref={tableRef}
          query={query}
          subscribers={subscribers}
          sourceFilter={sourceFilter}
          onSourceFilterChange={onSourceFilterChange}
          statusFilter={statusFilter}
          onStatusFilterChange={onStatusFilterChange}
          highlightId={highlightId}
        />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function TempoDashboard() {
  const [activeKey, setActiveKey] = useState<NavKey>("dashboard");
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<RangeKey>("30d");

  const [subscribers, setSubscribers] = useState<Subscriber[]>(subscribersSeed);
  const [poolIndex, setPoolIndex] = useState(0);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | SubStatus>("All");
  const [sourceFilter, setSourceFilter] = useState<"All" | Source>("All");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const tableRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  function scrollToTable() {
    setTimeout(() => tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }
  function scrollToChart() {
    setTimeout(() => chartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }

  function handleSelect(key: NavKey) {
    setActiveKey(key);
    setQuery("");
  }

  function handleStatClick(kind: "revenue" | "active" | "new" | "churn") {
    if (activeKey !== "dashboard") setActiveKey("dashboard");
    if (kind === "revenue") {
      scrollToChart();
      return;
    }
    if (kind === "active") setStatusFilter((f) => (f === "Subscribed" ? "All" : "Subscribed"));
    else if (kind === "churn") setStatusFilter((f) => (f === "Unsubscribed" ? "All" : "Unsubscribed"));
    else setStatusFilter("All");
    setSourceFilter("All");
    scrollToTable();
  }

  function handleSelectSource(source: Source) {
    if (activeKey !== "dashboard") setActiveKey("dashboard");
    setSourceFilter((f) => (f === source ? "All" : source));
    setStatusFilter("All");
    scrollToTable();
  }

  function handleAddSubscriber() {
    if (poolIndex >= subscriberPool.length) return;
    const next = subscriberPool[poolIndex];
    const id = String(subscribers.length + 1).padStart(3, "0");
    const newSub: Subscriber = { id, ...next };
    setSubscribers((prev) => [newSub, ...prev]);
    setPoolIndex((i) => i + 1);
    setHighlightId(id);
    setStatusFilter("All");
    setSourceFilter("All");
    if (activeKey !== "dashboard") setActiveKey("dashboard");
    scrollToTable();
    setTimeout(() => setHighlightId(null), 2200);
  }

  function handleExport() {
    const header = "Metric,Value,Delta\n";
    const m = rangeMeta[range];
    const rows = [
      `"Daily Revenue","${m.dailyRevenue}","${m.dailyDelta}"`,
      `"Active Subscribers","${m.activeSubs}","${m.activeDelta}"`,
      `"New Subscribers","${m.newSubs}","${m.newDelta}"`,
      `"Churn Rate","${m.churn}","${m.churnDelta}"`,
    ].join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tempo-overview.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const copy = sectionCopy[activeKey];
  const canAddSubscriber = poolIndex < subscriberPool.length;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0A0A0B] text-white">
      <Sidebar activeKey={activeKey} onSelect={handleSelect} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar query={query} onQueryChange={setQuery} onAddSubscriber={handleAddSubscriber} canAddSubscriber={canAddSubscriber} />
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeKey === "dashboard" ? (
              <DashboardView
                key="dashboard"
                query={query}
                range={range}
                onRangeChange={setRange}
                onExport={handleExport}
                onAddSubscriber={handleAddSubscriber}
                canAddSubscriber={canAddSubscriber}
                subscribers={subscribers}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sourceFilter={sourceFilter}
                onSourceFilterChange={setSourceFilter}
                onStatClick={handleStatClick}
                onSelectSource={handleSelectSource}
                highlightId={highlightId}
                tableRef={tableRef}
                chartRef={chartRef}
              />
            ) : (
              copy && <EmptyStateDark key={activeKey} icon={copy.icon} title={copy.title} description={copy.description} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
