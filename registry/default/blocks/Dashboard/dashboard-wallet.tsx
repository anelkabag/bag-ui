"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  BarChart3,
  Mail,
  CreditCard,
  FileText,
  Layers,
  IdCard,
  UsersRound,
  Settings,
  CircleHelp,
  LogOut,
  ChevronsLeft,
  ChevronDown,
  Search,
  Command,
  Bell,
  Filter,
  Download,
  Plus,
  Check,
  MoreHorizontal,
  Wallet,
  Wallet2,
  Landmark,
  ArrowUpRight,
  ListFilter,
  Crown,
  Calendar,
  Smartphone,
  Code2,
  ShoppingBasket,
  Zap,
  Undo2,
  PieChart,
  PiggyBank,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type IconType = React.ComponentType<{ className?: string }>;

type NavKey =
  | "dashboard"
  | "analytics"
  | "message"
  | "transactions"
  | "invoices"
  | "recurring"
  | "subscriptions"
  | "feedback"
  | "settings"
  | "helpdesk";

type CurrencyCode = "USD" | "EUR" | "BDT" | "GBP" | "JPY" | "AUD" | "CAD";

type TxStatus = "Success" | "Pending" | "Failed";

type Transaction = {
  id: string;
  activity: string;
  date: string;
  price: string;
  status: TxStatus;
  icon: IconType;
  tint: string;
};

type WalletCurrency = {
  code: CurrencyCode;
  flag: string;
  amount: number;
  status: "Active" | "Inactive";
};

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const mainNav: { key: NavKey; label: string; icon: IconType; badge?: number }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
  { key: "message", label: "Message", icon: Mail, badge: 20 },
  { key: "transactions", label: "Transactions", icon: CreditCard },
  { key: "invoices", label: "Invoices", icon: FileText },
];

const featuresNav: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "recurring", label: "Recurring", icon: Layers },
  { key: "subscriptions", label: "Subscriptions", icon: IdCard },
  { key: "feedback", label: "Feedback", icon: UsersRound },
];

const generalNav: { key: NavKey; label: string; icon: IconType }[] = [
  { key: "settings", label: "Settings", icon: Settings },
  { key: "helpdesk", label: "Help Desk", icon: CircleHelp },
];

const currencySymbol: Record<CurrencyCode, string> = {
  USD: "$",
  EUR: "€",
  BDT: "৳",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
};

const rateFromUSD: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  BDT: 117.5,
  GBP: 0.78,
  JPY: 151,
  AUD: 1.52,
  CAD: 1.36,
};

const baseBalanceUSD = 35340.89;

const walletSeed: WalletCurrency[] = [
  { code: "USD", flag: "🇺🇸", amount: 22678.0, status: "Active" },
  { code: "EUR", flag: "🇩🇪", amount: 18345.0, status: "Active" },
  { code: "BDT", flag: "🇧🇩", amount: 122678.0, status: "Active" },
  { code: "GBP", flag: "🇬🇧", amount: 15000.0, status: "Inactive" },
];

const addonCurrencies: WalletCurrency[] = [
  { code: "JPY", flag: "🇯🇵", amount: 1850000, status: "Active" },
  { code: "AUD", flag: "🇦🇺", amount: 9200, status: "Active" },
  { code: "CAD", flag: "🇨🇦", amount: 7600, status: "Active" },
];

const transactionsSeed: Transaction[] = [
  { id: "t1", activity: "Mobile App Purchase", date: "Wed, 12 Jun 2026", price: "$806.50", status: "Success", icon: Smartphone, tint: "bg-blue-500/15 text-blue-400" },
  { id: "t2", activity: "Software License", date: "Tue, 11 Jun 2026", price: "$102.99", status: "Success", icon: Code2, tint: "bg-rose-500/15 text-rose-400" },
  { id: "t3", activity: "Grocery Purchase", date: "Sun, 09 Jun 2026", price: "$2,500.00", status: "Success", icon: ShoppingBasket, tint: "bg-amber-500/15 text-amber-400" },
  { id: "t4", activity: "Electricity Bill", date: "Fri, 07 Jun 2026", price: "$64.20", status: "Pending", icon: Zap, tint: "bg-violet-500/15 text-violet-400" },
  { id: "t5", activity: "Refund - Online Store", date: "Wed, 05 Jun 2026", price: "$45.00", status: "Failed", icon: Undo2, tint: "bg-neutral-500/15 text-neutral-400" },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const chartDatasets: Record<"thisYear" | "lastYear", number[]> = {
  thisYear: [18200, 24300, 31500, 19800, 22600, 14100, 19300, 38200, 25400, 21700, 16500, 27800],
  lastYear: [14600, 19400, 25200, 15800, 18100, 11300, 15400, 30600, 20300, 17400, 13200, 22200],
};

const CHART_MAX = 40000;
const DEFAULT_MONTH = 7; // August

const savingsPlans = [
  { id: "investment", title: "Investment Goal", icon: PieChart, tint: "bg-teal-500/15 text-teal-400", current: 15600, target: 25000 },
  { id: "emergency", title: "Emergency Fund", icon: PiggyBank, tint: "bg-amber-500/15 text-amber-400", current: 8400, target: 20000 },
];

const notifications = [
  { id: "n1", title: "Your Investment Goal hit 62%", time: "10m ago" },
  { id: "n2", title: "New message from support", time: "1h ago" },
  { id: "n3", title: "Software License invoice paid", time: "Yesterday" },
];

const sectionCopy: Partial<Record<NavKey, { icon: IconType; title: string; description: string }>> = {
  analytics: { icon: BarChart3, title: "Analytics", description: "Deeper breakdowns of your spending and income trends will show up here." },
  message: { icon: Mail, title: "Messages", description: "Conversations with your team and support will appear here." },
  transactions: { icon: CreditCard, title: "All transactions", description: "A full, searchable history of every transaction will live here." },
  invoices: { icon: FileText, title: "Invoices", description: "Create and track invoices for your clients from this page." },
  recurring: { icon: Layers, title: "Recurring payments", description: "Manage subscriptions and recurring charges in one place." },
  subscriptions: { icon: IdCard, title: "Subscriptions", description: "Keep track of every plan you're subscribed to." },
  feedback: { icon: UsersRound, title: "Feedback", description: "Feature requests and feedback from your team land here." },
  settings: { icon: Settings, title: "Settings", description: "Manage your account, preferences and security here." },
  helpdesk: { icon: CircleHelp, title: "Help Desk", description: "Search articles or reach out to support any time." },
};

function formatMoney(amount: number, code: CurrencyCode) {
  const symbol = currencySymbol[code];
  return `${symbol}${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function todayLabel() {
  const d = new Date();
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const day = d.getDate();
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const year = d.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}

const pillSpring = { type: "spring" as const, stiffness: 350, damping: 30 };
const easeSpring = { type: "spring" as const, stiffness: 260, damping: 24 };

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
            "absolute top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#1A1A1D] p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]",
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
      <Icon className="h-[15px] w-[15px] text-neutral-400" />
      <span className="flex-1">{label}</span>
      {active && <Check className="h-3.5 w-3.5 text-blue-400" />}
    </button>
  );
}

function MoreHorizontalMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5"
      >
        <MoreHorizontal className="h-[15px] w-[15px]" />
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} anchor="right" width={160}>
        <DropdownItem icon={ArrowUpRight} label="View details" />
        <DropdownItem icon={Download} label="Export" />
      </Dropdown>
    </div>
  );
}

function BaguiMark() {
  return (
    <div className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden">
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
  icon: Icon,
  label,
  active,
  collapsed,
  badge,
  onClick,
}: {
  icon: IconType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex w-full items-center gap-2.5 rounded-xl px-2.5 py-[9px] text-[13.5px] transition-colors",
        collapsed && "justify-center px-0"
      )}
    >
      {active && (
        <motion.span
          layoutId="findexa-nav-pill"
          className="absolute inset-0 rounded-xl bg-white/[0.07]"
          transition={pillSpring}
        />
      )}
      <Icon className={cn("relative z-10 h-[16px] w-[16px] shrink-0", active ? "text-white" : "text-neutral-500")} />
      {!collapsed && (
        <span className={cn("relative z-10 flex-1 truncate text-left", active ? "font-medium text-white" : "text-neutral-400")}>
          {label}
        </span>
      )}
      {!collapsed && badge != null && (
        <span className="relative z-10 rounded-full bg-white/10 px-[7px] py-[1px] text-[11px] text-neutral-300">{badge}</span>
      )}
      {active && <span className="absolute -right-3 top-1/2 h-4 w-1.5 -translate-y-1/2 rounded-full bg-blue-500" />}
    </button>
  );
}

function Sidebar({
  activeNav,
  collapsed,
  onSelect,
  onToggleCollapse,
}: {
  activeNav: NavKey;
  collapsed: boolean;
  onSelect: (key: NavKey) => void;
  onToggleCollapse: () => void;
}) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 76 : 232 }}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      className="flex h-full shrink-0 flex-col overflow-hidden scrollbar-hidden border-r border-white/[0.06] bg-[#0F0F11] px-3 py-4"
    >
      <div className={cn("mb-6 flex items-center px-1", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <BaguiMark />
            <span className="text-[15px] font-semibold text-white">BagUi</span>
          </div>
        )}
        {collapsed && <BaguiMark />}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
          >
            <ChevronsLeft className="h-[15px] w-[15px]" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="mb-4 flex h-7 w-7 items-center justify-center self-center rounded-md text-neutral-500 hover:bg-white/5 hover:text-neutral-300"
        >
          <ChevronsLeft className="h-[15px] w-[15px] rotate-180" />
        </button>
      )}

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
        <div className="flex flex-col gap-0.5">
          {!collapsed && <p className="px-2.5 pb-1.5 text-[10.5px] font-medium uppercase tracking-wider text-neutral-600">Main menu</p>}
          {mainNav.map((item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              active={activeNav === item.key}
              collapsed={collapsed}
              onClick={() => onSelect(item.key)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          {!collapsed && <p className="px-2.5 pb-1.5 text-[10.5px] font-medium uppercase tracking-wider text-neutral-600">Features</p>}
          {featuresNav.map((item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.key}
              collapsed={collapsed}
              onClick={() => onSelect(item.key)}
            />
          ))}
        </div>

        <div className="flex flex-col gap-0.5">
          {!collapsed && <p className="px-2.5 pb-1.5 text-[10.5px] font-medium uppercase tracking-wider text-neutral-600">General</p>}
          {generalNav.map((item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.key}
              collapsed={collapsed}
              onClick={() => onSelect(item.key)}
            />
          ))}
          <NavItem icon={LogOut} label="Log out" collapsed={collapsed} />
        </div>
      </nav>

      {!collapsed && (
        <div className="mt-4 flex flex-col items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 text-center">
          <p className="text-[13px] font-semibold text-white">Upgrade Pro!</p>
          <p className="text-[12px] leading-snug text-neutral-400">Higher productivity with better organization</p>
          <button className="flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-3 py-2 text-[12.5px] font-medium text-neutral-900 transition-transform active:scale-[0.97]">
            <Crown className="h-3.5 w-3.5" />
            Upgrade
          </button>
        </div>
      )}
    </motion.aside>
  );
}

/* ------------------------------------------------------------------ */
/* Top bar                                                              */
/* ------------------------------------------------------------------ */

function TopBar({
  query,
  onQueryChange,
  onNavigate,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  onNavigate: (key: NavKey) => void;
}) {
  const [openMenu, setOpenMenu] = useState<"help" | "notif" | "profile" | null>(null);

  return (
    <div className="flex items-center justify-between px-8 pb-5 pt-6">
      <div className="flex w-[280px] items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
        <Search className="h-[15px] w-[15px] text-neutral-500" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search"
          className="w-full bg-transparent text-[13px] text-neutral-200 placeholder:text-neutral-500 focus:outline-none"
        />
        <span className="flex items-center gap-0.5 rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10.5px] text-neutral-500">
          <Command className="h-2.5 w-2.5" /> K
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "help" ? null : "help"))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-neutral-400 hover:text-neutral-200 cursor-pointer"
          >
            <CircleHelp className="h-[16px] w-[16px]" />
          </button>
          <Dropdown open={openMenu === "help"} onClose={() => setOpenMenu(null)} anchor="right" width={200}>
            <DropdownItem icon={CircleHelp} label="Help center" onClick={() => setOpenMenu(null)} />
            <DropdownItem icon={Mail} label="Contact support" onClick={() => setOpenMenu(null)} />
          </Dropdown>
        </div>

        <button
          onClick={() => onNavigate("message")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-neutral-400 hover:text-neutral-200 cursor-pointer"
        >
          <Mail className="h-[16px] w-[16px]" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpenMenu((m) => (m === "notif" ? null : "notif"))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-neutral-400 hover:text-neutral-200 cursor-pointer"
          >
            <Bell className="h-[16px] w-[16px]" />
          </button>
          <Dropdown open={openMenu === "notif"} onClose={() => setOpenMenu(null)} anchor="right" width={240}>
            <div className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">Notifications</div>
            {notifications.map((n) => (
              <div key={n.id} className="flex flex-col gap-0.5 rounded-lg px-2.5 py-2 hover:bg-white/5">
                <p className="text-[13px] text-neutral-200">{n.title}</p>
                <p className="text-[11.5px] text-neutral-500">{n.time}</p>
              </div>
            ))}
          </Dropdown>
        </div>

        <div className="relative ml-1">
          <button
            onClick={() => setOpenMenu((m) => (m === "profile" ? null : "profile"))}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <img
              src="/avatar.png"
              alt="Anelka Bag"
              className="h-9 w-9 rounded-full border border-white/10 bg-neutral-800 object-cover"
            />
            <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
          </button>
          <Dropdown open={openMenu === "profile"} onClose={() => setOpenMenu(null)} anchor="right" width={190}>
            <DropdownItem
              icon={Settings}
              label="Account settings"
              onClick={() => {
                onNavigate("settings");
                setOpenMenu(null);
              }}
            />
            <DropdownItem icon={LogOut} label="Log out" onClick={() => setOpenMenu(null)} />
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
  action,
}: {
  icon: IconType;
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex-1 rounded-2xl border border-white/[0.06] bg-[#141416] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-neutral-300">
            <Icon className="h-[15px] w-[15px]" />
          </span>
          <span className="text-[13.5px] text-neutral-300">{label}</span>
        </div>
        {action}
      </div>
      <p className="mt-3 text-[24px] font-semibold text-white">{value}</p>
      {delta && (
        <p className="mt-1.5 text-[12.5px] text-neutral-500">
          <span className={cn("font-medium", positive ? "text-emerald-400" : "text-rose-400")}>{delta}</span> from last month
        </p>
      )}
    </div>
  );
}

function CurrencyMenu({
  value,
  options,
  onChange,
}: {
  value: CurrencyCode;
  options: WalletCurrency[];
  onChange: (code: CurrencyCode) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.code === value) ?? options[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[12.5px] text-neutral-300"
      >
        <span className="text-[13px] leading-none">{current?.flag}</span>
        {current?.code}
        <ChevronDown className="h-3 w-3 text-neutral-500" />
      </button>
      <Dropdown open={open} onClose={() => setOpen(false)} anchor="right" width={150}>
        {options.map((o) => (
          <button
            key={o.code}
            onClick={() => {
              onChange(o.code);
              setOpen(false);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-neutral-300 hover:bg-white/5"
          >
            <span className="text-[15px] leading-none">{o.flag}</span>
            <span className="flex-1">{o.code}</span>
            {o.code === value && <Check className="h-3.5 w-3.5 text-blue-400" />}
          </button>
        ))}
      </Dropdown>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview chart                                                       */
/* ------------------------------------------------------------------ */

function OverviewChart({
  dataset,
  onDatasetChange,
}: {
  dataset: "thisYear" | "lastYear";
  onDatasetChange: (v: "thisYear" | "lastYear") => void;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const values = chartDatasets[dataset];
  const activeIndex = hovered ?? DEFAULT_MONTH;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#141416] p-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-neutral-300">
            <ListFilter className="h-[15px] w-[15px]" />
          </span>
          <span className="text-[14.5px] font-medium text-white">Overview</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 text-[12.5px] text-neutral-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> Earnings
          </span>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-neutral-300"
            >
              {dataset === "thisYear" ? "This Year" : "Last Year"}
              <ChevronDown className="h-3 w-3 text-neutral-500" />
            </button>
            <Dropdown open={menuOpen} onClose={() => setMenuOpen(false)} anchor="right" width={140}>
              <DropdownItem
                icon={Calendar}
                label="This Year"
                active={dataset === "thisYear"}
                onClick={() => {
                  onDatasetChange("thisYear");
                  setMenuOpen(false);
                }}
              />
              <DropdownItem
                icon={Calendar}
                label="Last Year"
                active={dataset === "lastYear"}
                onClick={() => {
                  onDatasetChange("lastYear");
                  setMenuOpen(false);
                }}
              />
            </Dropdown>
          </div>
          <button className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-500 hover:bg-white/5">
            <MoreHorizontal className="h-[15px] w-[15px]" />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex h-[220px] flex-col justify-between pb-6 text-right text-[11.5px] text-neutral-500">
          <span>$40k</span>
          <span>$30k</span>
          <span>$20k</span>
          <span>$10k</span>
          <span>$0k</span>
        </div>
        <div className="flex flex-1 items-end justify-between gap-2">
          {values.map((val, i) => {
            const isActive = i === activeIndex;
            const heightPct = Math.max((val / CHART_MAX) * 100, 4);
            return (
              <div key={months[i]} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-[220px] w-full items-end justify-center">
                  {isActive && (
                    <motion.div
                      layoutId="chart-marker"
                      style={{ bottom: `${heightPct}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="absolute left-1/2 z-20 flex -translate-x-1/2 flex-col items-center"
                    >
                      <div className="mb-2 w-max rounded-xl border border-white/10 bg-[#1E1E22] px-3 py-2 shadow-[0_16px_32px_-12px_rgba(0,0,0,0.6)]">
                        <p className="text-[11px] text-neutral-400">Earnings</p>
                        <p className="text-[13.5px] font-semibold text-white">
                          ${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <span className="h-3 w-3 rounded-full border-2 border-[#141416] bg-blue-500" />
                    </motion.div>
                  )}
                  <motion.button
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    initial={false}
                    animate={{ height: `${heightPct}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 24 }}
                    className={cn(
                      "min-h-[6px] w-full rounded-t-md",
                      isActive ? "bg-gradient-to-t from-blue-600/10 via-blue-500 to-blue-400" : "bg-white/[0.07] hover:bg-white/[0.12]"
                    )}
                  />
                </div>
                <span className={cn("text-[11.5px]", isActive ? "font-medium text-white" : "text-neutral-500")}>{months[i]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wallet + savings                                                     */
/* ------------------------------------------------------------------ */

function WalletSection({
  wallets,
  activeCode,
  onSelect,
  onAdd,
  canAdd,
}: {
  wallets: WalletCurrency[];
  activeCode: CurrencyCode;
  onSelect: (code: CurrencyCode) => void;
  onAdd: () => void;
  canAdd: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#141416] p-5">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-[14.5px] font-medium text-white">My Wallet</span>
        <button
          onClick={onAdd}
          disabled={!canAdd}
          className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-neutral-300 transition-colors hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" /> Add New
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence initial={false}>
          {wallets.map((w) => {
            const active = w.code === activeCode;
            return (
              <motion.button
                key={w.code}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={easeSpring}
                onClick={() => onSelect(w.code)}
                className={cn(
                  "rounded-xl border p-3.5 text-left transition-colors",
                  active ? "border-blue-500/50 bg-blue-500/[0.08]" : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-[13px] text-neutral-300">
                    <span className="text-[15px] leading-none">{w.flag}</span>
                    {w.code}
                  </span>
                  <MoreHorizontal className="h-3.5 w-3.5 text-neutral-600" />
                </div>
                <p className="mt-2 truncate text-[15px] font-semibold text-white">{formatMoney(w.amount, w.code)}</p>
                <p className={cn("mt-1 text-[11.5px]", w.status === "Active" ? "text-emerald-400" : "text-rose-400")}>{w.status}</p>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SavingsSection() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#141416] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-neutral-300">
            <Wallet className="h-[15px] w-[15px]" />
          </span>
          <span className="text-[14.5px] font-medium text-white">My Savings Plan</span>
        </div>
        <MoreHorizontalMenu />
      </div>
      <div className="flex flex-col gap-3">
        {savingsPlans.map((plan) => {
          const Icon = plan.icon;
          const pct = Math.round((plan.current / plan.target) * 100);
          return (
            <div key={plan.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <div className="flex items-center gap-2.5">
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg", plan.tint)}>
                  <Icon className="h-[15px] w-[15px]" />
                </span>
                <span className="text-[13.5px] font-medium text-white">{plan.title}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-[12.5px] text-neutral-400">
                <span>
                  ${plan.current.toLocaleString()}/${plan.target.toLocaleString()}
                </span>
                <span className="font-medium text-white">{pct}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Transactions                                                         */
/* ------------------------------------------------------------------ */

function TransactionsTable({ transactions, query }: { transactions: Transaction[]; query: string }) {
  const [statusFilter, setStatusFilter] = useState<"All" | TxStatus>("All");
  const [menuOpen, setMenuOpen] = useState(false);

  const visible = useMemo(() => {
    return transactions.filter((t) => {
      const matchesQuery = t.activity.toLowerCase().includes(query.trim().toLowerCase());
      const matchesStatus = statusFilter === "All" || t.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [transactions, query, statusFilter]);

  const statusStyles: Record<TxStatus, string> = {
    Success: "bg-emerald-500/10 text-emerald-400",
    Pending: "bg-amber-500/10 text-amber-400",
    Failed: "bg-rose-500/10 text-rose-400",
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#141416] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-neutral-300">
            <ArrowUpRight className="h-[15px] w-[15px]" />
          </span>
          <span className="text-[14.5px] font-medium text-white">Recent Transaction</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[12.5px] text-neutral-300"
          >
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
          <Dropdown open={menuOpen} onClose={() => setMenuOpen(false)} anchor="right" width={150}>
            {(["All", "Success", "Pending", "Failed"] as const).map((s) => (
              <DropdownItem
                key={s}
                icon={Filter}
                label={s}
                active={statusFilter === s}
                onClick={() => {
                  setStatusFilter(s);
                  setMenuOpen(false);
                }}
              />
            ))}
          </Dropdown>
        </div>
      </div>

      <div className="grid grid-cols-[1.6fr_1.1fr_0.8fr_0.9fr_28px] gap-3 px-2 pb-2 text-[11px] uppercase tracking-wide text-neutral-500">
        <span>Activity</span>
        <span>Date</span>
        <span>Price</span>
        <span>Status</span>
        <span />
      </div>

      <div className="flex flex-col">
        <AnimatePresence initial={false}>
          {visible.map((t) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-[1.6fr_1.1fr_0.8fr_0.9fr_28px] items-center gap-3 rounded-xl px-2 py-2.5 text-[13px] text-neutral-300 hover:bg-white/[0.03]"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", t.tint)}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="truncate text-neutral-200">{t.activity}</span>
                </span>
                <span className="truncate text-neutral-400">{t.date}</span>
                <span className="text-neutral-200">{t.price}</span>
                <span className={cn("inline-flex w-fit items-center gap-1.5 rounded-full px-2 py-0.5 text-[11.5px]", statusStyles[t.status])}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" /> {t.status}
                </span>
                <button className="flex h-6 w-6 items-center justify-center rounded-md text-neutral-600 hover:bg-white/5">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visible.length === 0 && <p className="py-8 text-center text-[13px] text-neutral-500">No transactions match your filters.</p>}
      </div>
    </div>
  );
}

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
      className="flex h-full flex-col items-center justify-center gap-3 py-24 text-center"
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
  currency,
  onCurrencyChange,
  wallets,
  onAddWallet,
  canAddWallet,
  chartDataset,
  onChartDatasetChange,
  transactions,
  onExport,
}: {
  query: string;
  currency: CurrencyCode;
  onCurrencyChange: (code: CurrencyCode) => void;
  wallets: WalletCurrency[];
  onAddWallet: () => void;
  canAddWallet: boolean;
  chartDataset: "thisYear" | "lastYear";
  onChartDatasetChange: (v: "thisYear" | "lastYear") => void;
  transactions: Transaction[];
  onExport: () => void;
}) {
  const balance = baseBalanceUSD * rateFromUSD[currency];

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-white">
            Welcome back Anelka Bag <span className="inline-block">👋</span>
          </h1>
          <p className="mt-1 text-[13.5px] text-neutral-500">Monitor and control what happens with your money today for financial health.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-2 text-[12.5px] text-neutral-300">
            <Calendar className="h-3.5 w-3.5 text-neutral-500" /> {todayLabel()}
          </span>
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 rounded-full bg-blue-500 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-600 active:scale-[0.98] cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-wrap gap-4">
        <StatCard
          icon={Wallet2}
          label="Account Balance"
          value={formatMoney(balance, currency)}
          delta="+3.2% ↑"
          positive
          action={<CurrencyMenu value={currency} options={wallets} onChange={onCurrencyChange} />}
        />
        <StatCard icon={ArrowUpRight} label="Total Expenses" value="$9,845.20" delta="-2.1% ↓" positive={false} action={<MoreHorizontalMenu />} />
        <StatCard icon={Landmark} label="Total Savings" value="$18,420.75" delta="+4.6% ↑" positive action={<MoreHorizontalMenu />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <WalletSection wallets={wallets} activeCode={currency} onSelect={onCurrencyChange} onAdd={onAddWallet} canAdd={canAddWallet} />
          <SavingsSection />
        </div>
        <div className="flex flex-col gap-4 lg:col-span-3">
          <OverviewChart dataset={chartDataset} onDatasetChange={onChartDatasetChange} />
          <TransactionsTable transactions={transactions} query={query} />
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function FindexaDashboard() {
  const [activeNav, setActiveNav] = useState<NavKey>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");

  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [wallets, setWallets] = useState<WalletCurrency[]>(walletSeed);
  const [addonPool, setAddonPool] = useState<WalletCurrency[]>(addonCurrencies);

  const [chartDataset, setChartDataset] = useState<"thisYear" | "lastYear">("thisYear");
  const [transactions] = useState<Transaction[]>(transactionsSeed);

  function handleAddWallet() {
    setAddonPool((pool) => {
      if (pool.length === 0) return pool;
      const [next, ...rest] = pool;
      setWallets((w) => [...w, next]);
      return rest;
    });
  }

  function handleExport() {
    const header = "Activity,Date,Price,Status\n";
    const rows = transactions.map((t) => `"${t.activity}","${t.date}","${t.price}","${t.status}"`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const currentCopy = sectionCopy[activeNav];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-black text-white">
      <Sidebar activeNav={activeNav} collapsed={collapsed} onSelect={setActiveNav} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar query={query} onQueryChange={setQuery} onNavigate={setActiveNav} />
        <main className="flex-1 overflow-y-auto px-8 pb-8">
          <AnimatePresence mode="wait">
            {activeNav === "dashboard" ? (
              <DashboardView
                key="dashboard"
                query={query}
                currency={currency}
                onCurrencyChange={setCurrency}
                wallets={wallets}
                onAddWallet={handleAddWallet}
                canAddWallet={addonPool.length > 0}
                chartDataset={chartDataset}
                onChartDatasetChange={setChartDataset}
                transactions={transactions}
                onExport={handleExport}
              />
            ) : (
              currentCopy && <EmptyStateDark key={activeNav} icon={currentCopy.icon} title={currentCopy.title} description={currentCopy.description} />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}