import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Repeat,
  BarChart3,
  MessageSquare,
  Users2,
  Megaphone,
  Users,
  Layers,
  ClipboardList,
  ShieldCheck,
  CreditCard,
  Puzzle,
  Headphones,
  HelpCircle,
  Settings,
  Search,
  Bell,
  ChevronDown,
  Calendar,
  Download,
  Sparkles,
  MoreHorizontal,
  Plus,
  ArrowUpRight,
  Pencil,
  RotateCcw,
  Trash2,
  Mail,
  Trophy,
  Target,
  User,
  LogOut,
  Check,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string;
  icon: LucideIcon;
}

interface Stat {
  label: string;
  value: string;
  sub?: string;
}

type TransactionStatus = "Success" | "Pending" | "Refunded";

interface Transaction {
  id: string;
  customer: string;
  product: string;
  status: TransactionStatus;
  qty: number;
  price: string;
  total: string;
}

type TimeRange = "Weekly" | "Monthly" | "Yearly";
type CampaignStatus = "Active" | "Paused" | "Ended";

interface Campaign {
  name: string;
  status: CampaignStatus;
  budget: string;
  spent: string;
}

interface ChatMessage {
  id: string;
  name: string;
  preview: string;
  full: string;
  time: string;
  unread: boolean;
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const mainMenu: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Products", icon: Package },
  { label: "Transactions", icon: Repeat },
  { label: "Reports & Analytics", icon: BarChart3 },
  { label: "Messages", icon: MessageSquare },
  { label: "Team Performance", icon: Users2 },
  { label: "Campaigns", icon: Megaphone },
];

const customersMenu: NavItem[] = [
  { label: "Customer List", icon: Users },
  { label: "Channels", icon: Layers },
  { label: "Order Management", icon: ClipboardList },
];

const managementMenu: NavItem[] = [
  { label: "Roles & Permissions", icon: ShieldCheck },
  { label: "Billing & Subscription", icon: CreditCard },
  { label: "Integrations", icon: Puzzle },
];

const settingsMenu: NavItem[] = [
  { label: "Customer Support", icon: Headphones },
  { label: "Help Center", icon: HelpCircle },
  { label: "System Settings", icon: Settings },
];

const stats: Stat[] = [
  { label: "Total Revenue", value: "$20,320", sub: "" },
  { label: "Total Orders", value: "10,320", sub: "Orders" },
  { label: "New Customers", value: "4,305", sub: "New Users" },
  { label: "Conversion Rate", value: "3.9%", sub: "" },
];

const monthLabels: string[] = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

const salesBars: number[] = [
  28, 42, 24, 48, 58, 38, 34, 52, 44, 62, 48, 38, 44, 58, 48, 68, 54, 44, 58,
  74, 92, 68, 54, 44, 58, 48, 38, 52, 44, 34, 48, 38, 28, 42, 34, 24,
];

const revenueBars: number[] = [
  38, 62, 48, 78, 58, 42, 68, 52, 88, 58, 48, 72, 44, 34,
];

const initialTransactions: Transaction[] = [
  {
    id: "#04910",
    customer: "Ryan Korsgaard",
    product: "Ergo Office Chair",
    status: "Success",
    qty: 12,
    price: "$3,450",
    total: "$41,400",
  },
  {
    id: "#04911",
    customer: "Madelyn Lubin",
    product: "Sunset Desk 02",
    status: "Success",
    qty: 20,
    price: "$2,980",
    total: "$89,200",
  },
  {
    id: "#04912",
    customer: "Abram Bergson",
    product: "Eco Bookshelf",
    status: "Pending",
    qty: 22,
    price: "$1,750",
    total: "$75,900",
  },
  {
    id: "#04913",
    customer: "Phillip Mango",
    product: "Green Leaf Desk",
    status: "Refunded",
    qty: 24,
    price: "$1,950",
    total: "$19,500",
  },
];

const statusStyles: Record<TransactionStatus, string> = {
  Success: "bg-emerald-500",
  Pending: "bg-amber-500",
  Refunded: "bg-neutral-400",
};

const customersPool = [
  "Elena Cho",
  "Marcus Webb",
  "Priya Nair",
  "Tomasz Wiel",
  "Grace Ilori",
  "Noah Fitzgerald",
];
const productsPool = [
  "Oak Coffee Table",
  "Mesh Task Chair",
  "Walnut Shelf Unit",
  "Linen Sofa Cover",
  "Steel Desk Lamp",
  "Woven Storage Bin",
];

const products = [
  {
    name: "Ergo Office Chair",
    category: "Seating",
    price: "$3,450",
    stock: 42,
  },
  { name: "Sunset Desk 02", category: "Desks", price: "$2,980", stock: 18 },
  { name: "Eco Bookshelf", category: "Storage", price: "$1,750", stock: 65 },
  { name: "Green Leaf Desk", category: "Desks", price: "$1,950", stock: 24 },
  { name: "Oak Coffee Table", category: "Tables", price: "$1,290", stock: 37 },
  { name: "Mesh Task Chair", category: "Seating", price: "$980", stock: 51 },
];

const teamMembers = [
  { name: "Salung Prastyo", role: "Sales Operator", score: 92 },
  { name: "Elena Cho", role: "Account Manager", score: 87 },
  { name: "Marcus Webb", role: "Sales Rep", score: 79 },
  { name: "Priya Nair", role: "Sales Rep", score: 74 },
  { name: "Tomasz Wiel", role: "Support Lead", score: 68 },
];

const initialCampaigns: Campaign[] = [
  {
    name: "Summer Sale Blast",
    status: "Active",
    budget: "$5,000",
    spent: "$3,120",
  },
  {
    name: "New Customer Push",
    status: "Active",
    budget: "$2,500",
    spent: "$980",
  },
  {
    name: "Retargeting Q3",
    status: "Paused",
    budget: "$1,800",
    spent: "$1,800",
  },
  {
    name: "Holiday Preview",
    status: "Ended",
    budget: "$4,200",
    spent: "$4,150",
  },
];

const campaignStatusStyles: Record<CampaignStatus, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Paused: "bg-amber-100 text-amber-700",
  Ended: "bg-neutral-200 text-neutral-500",
};

const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    name: "Ryan Korsgaard",
    preview: "Hey, can we push the delivery date...",
    time: "09:24",
    unread: true,
    full: "Hey, can we push the delivery date for the Ergo Office Chair order to next Friday? Our warehouse team needs a bit more time.",
  },
  {
    id: "m2",
    name: "Madelyn Lubin",
    preview: "Thanks for the quick refund on...",
    time: "Yesterday",
    unread: true,
    full: "Thanks for the quick refund on the Sunset Desk order, really appreciate the fast turnaround!",
  },
  {
    id: "m3",
    name: "Abram Bergson",
    preview: "Is the Eco Bookshelf still in stock...",
    time: "Yesterday",
    unread: false,
    full: "Is the Eco Bookshelf still in stock in walnut finish? Looking to order 20 units for a client.",
  },
  {
    id: "m4",
    name: "Phillip Mango",
    preview: "Following up on the refund status",
    time: "Mon",
    unread: false,
    full: "Just following up on the refund status for order #04913, haven't seen it reflected yet.",
  },
];

const GENERIC_CONTENT: Record<
  string,
  { subtitle: string; rows: { label: string; value: string }[] }
> = {
  "Customer List": {
    subtitle: "Browse and manage your customers.",
    rows: [
      { label: "Ryan Korsgaard", value: "Active" },
      { label: "Madelyn Lubin", value: "Active" },
      { label: "Abram Bergson", value: "Active" },
      { label: "Phillip Mango", value: "Inactive" },
    ],
  },
  Channels: {
    subtitle: "Manage where your orders come from.",
    rows: [
      { label: "Online Store", value: "Connected" },
      { label: "Marketplace", value: "Connected" },
      { label: "Retail POS", value: "Disconnected" },
      { label: "Wholesale", value: "Connected" },
    ],
  },
  "Order Management": {
    subtitle: "Track and fulfill customer orders.",
    rows: [
      { label: "#04910 · Ergo Office Chair", value: "Shipped" },
      { label: "#04911 · Sunset Desk 02", value: "Delivered" },
      { label: "#04912 · Eco Bookshelf", value: "Processing" },
      { label: "#04913 · Green Leaf Desk", value: "Refunded" },
    ],
  },
  "Roles & Permissions": {
    subtitle: "Control who can access what.",
    rows: [
      { label: "Admin", value: "2 members" },
      { label: "Sales Operator", value: "6 members" },
      { label: "Support Agent", value: "4 members" },
      { label: "Viewer", value: "9 members" },
    ],
  },
  "Billing & Subscription": {
    subtitle: "Manage your plan and invoices.",
    rows: [
      { label: "Current plan", value: "Pro — $49/mo" },
      { label: "Next invoice", value: "Sep 1, 2026" },
      { label: "Payment method", value: "Visa •••• 4242" },
      { label: "Billing email", value: "anelkadevs@gmail.com" },
    ],
  },
  Integrations: {
    subtitle: "Connect your favorite tools.",
    rows: [
      { label: "Slack", value: "Connected" },
      { label: "Stripe", value: "Connected" },
      { label: "Zapier", value: "Not connected" },
      { label: "Notion", value: "Not connected" },
    ],
  },
  "Customer Support": {
    subtitle: "Open tickets and support requests.",
    rows: [
      { label: "Delivery delay — order #04910", value: "Open" },
      { label: "Wrong item received", value: "Open" },
      { label: "Refund question", value: "Closed" },
      { label: "Bulk order inquiry", value: "Closed" },
    ],
  },
  "Help Center": {
    subtitle: "Guides and documentation.",
    rows: [
      { label: "Getting started with BagUI", value: "Article" },
      { label: "Managing transactions", value: "Article" },
      { label: "Setting up integrations", value: "Article" },
      { label: "Billing FAQ", value: "Article" },
    ],
  },
  "System Settings": {
    subtitle: "General configuration for your workspace.",
    rows: [
      { label: "Two-factor authentication", value: "toggle-on" },
      { label: "Email notifications", value: "toggle-on" },
      { label: "Weekly summary email", value: "toggle-off" },
      { label: "Dark mode", value: "toggle-off" },
    ],
  },
};

const PAGE_SUBTITLES: Record<string, string> = {
  Products: "Manage your product catalog and inventory.",
  Transactions: "View, filter and manage every transaction.",
  "Reports & Analytics": "A deeper look at your sales performance.",
  Messages: "Conversations with your customers.",
  "Team Performance": "See how your team is performing this month.",
  Campaigns: "Track and manage your marketing campaigns.",
};

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function NavSection({
  title,
  items,
  activePage,
  onSelect,
  isDark,
}: {
  title?: string;
  items: NavItem[];
  activePage: string;
  onSelect: (label: string) => void;
  isDark: boolean;
}) {
  return (
    <div className="mb-6">
      {title && (
        <p
          className={`px-2 mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
            isDark ? "text-neutral-500" : "text-gray-400"
          }`}
        >
          {title}
        </p>
      )}
      <ul className="space-y-1">
        {items.map((item) => {
          const active = item.label === activePage;
          return (
            <li key={item.label}>
              <button
                onClick={() => onSelect(item.label)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl text-[13px] transition-colors ${
                  active
                    ? isDark
                      ? "bg-neutral-900 border border-neutral-800 shadow-sm text-neutral-50 font-medium"
                      : "bg-gray-100 border border-gray-200 shadow-sm text-gray-900 font-medium"
                    : isDark
                      ? "border border-transparent text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50"
                      : "border border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={`flex items-center justify-center w-6 h-6 rounded-md border ${
                    active
                      ? isDark
                        ? "border-neutral-700 bg-neutral-800 text-neutral-50"
                        : "border-gray-200 bg-white text-gray-900"
                      : isDark
                        ? "border-neutral-800 bg-black text-neutral-500"
                        : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  <item.icon size={13} strokeWidth={2} />
                </span>
                <span className="truncate">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function MiniSparkline() {
  const bars: number[] = [5, 9, 6, 12, 8];
  return (
    <div className="flex items-end gap-0.5 h-6">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-neutral-300"
          style={{ height: `${h * 2}px` }}
        />
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  index,
  selected,
  onClick,
  isDark,
}: Stat & {
  index: number;
  selected: boolean;
  onClick: () => void;
  isDark: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 * index }}
      className={`text-left border rounded-2xl p-4 transition-shadow ${
        isDark
          ? selected
            ? "bg-neutral-900 border-neutral-700 ring-1 ring-neutral-50/40"
            : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
          : selected
            ? "bg-white border-gray-900 ring-1 ring-gray-900"
            : "bg-white border-gray-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start justify-between">
        <p
          className={`text-[12px] ${isDark ? "text-neutral-400" : "text-neutral-400"}`}
        >
          {label}
        </p>
        <MiniSparkline />
      </div>
      <p
        className={`mt-2 text-2xl font-semibold tracking-tight ${isDark ? "text-white" : "text-neutral-900"}`}
      >
        {value}{" "}
        {sub && (
          <span
            className={`text-sm font-normal ${isDark ? "text-neutral-400" : "text-neutral-400"}`}
          >
            {sub}
          </span>
        )}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <span className="flex items-center justify-center w-4 h-4 rounded-full border border-neutral-200 text-emerald-500">
          <ArrowUpRight size={10} strokeWidth={2.5} />
        </span>
        <span className="text-[12px] text-neutral-400">+0.94 last year</span>
      </div>
    </motion.button>
  );
}

function PageHeader({
  title,
  subtitle,
  isDark = false,
}: {
  title: string;
  subtitle?: string;
  isDark?: boolean;
}) {
  return (
    <div>
      <h1
        className={`text-xl font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={`text-[13px] mt-1 ${isDark ? "text-neutral-400" : "text-neutral-400"}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`w-9 h-5 rounded-full flex p-0.5 transition-colors ${
        on ? "bg-neutral-900 justify-end" : "bg-neutral-200 justify-start"
      }`}
    >
      <motion.span
        layout
        transition={{ duration: 0.15 }}
        className="w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Sales trend + revenue breakdown (self-contained, reusable)         */
/* ------------------------------------------------------------------ */

function SalesTrendCard({ isDark }: { isDark: boolean }) {
  const [range, setRange] = useState<TimeRange>("Monthly");
  const maxSales = Math.max(...salesBars);
  const peakIndex = 20;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`xl:col-span-2 border rounded-2xl p-4 ${
        isDark
          ? "bg-neutral-900 border-neutral-800"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <p
            className={`text-[13px] font-medium mb-1 ${isDark ? "text-white" : "text-neutral-900"}`}
          >
            Sales Trend
          </p>
          <p
            className={`text-[12px] ${isDark ? "text-neutral-400" : "text-neutral-400"}`}
          >
            Total Revenue :{" "}
            <span
              className={`font-medium ${isDark ? "text-white" : "text-neutral-900"}`}
            >
              $20,320
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-1.5 text-[12px] ${isDark ? "text-neutral-400" : "text-neutral-400"}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isDark ? "bg-white" : "bg-neutral-900"}`}
            />{" "}
            New User
            <span
              className={`w-2 h-2 rounded-full ml-2 ${isDark ? "bg-neutral-700" : "bg-neutral-300"}`}
            />{" "}
            Existing User
          </div>
          <div
            className={`flex items-center rounded-lg p-0.5 text-[12px] ${isDark ? "bg-neutral-900" : "bg-neutral-100"}`}
          >
            {(["Weekly", "Monthly", "Yearly"] as TimeRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  range === r
                    ? isDark
                      ? "bg-white text-neutral-900"
                      : "bg-neutral-900 text-white"
                    : isDark
                      ? "text-neutral-400"
                      : "text-neutral-500"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <motion.div
          key={range}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute z-10 bg-neutral-900 text-white rounded-lg px-3 py-2 text-[11px] shadow-lg"
          style={{
            left: `calc(${(peakIndex / salesBars.length) * 100}% - 46px)`,
            top: 0,
          }}
        >
          <p className="font-medium mb-1">Jun 2025</p>
          <p className="flex items-center gap-1.5 text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white" /> New
            User&nbsp;
            <span className="text-white font-medium">38k</span>
          </p>
          <p className="flex items-center gap-1.5 text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-500" />{" "}
            Existing User&nbsp;
            <span className="text-white font-medium">18k</span>
          </p>
        </motion.div>

        <div className="flex">
          <div className="flex flex-col justify-between text-[10px] text-neutral-300 pr-2 pb-6 h-52">
            {["60k", "50k", "40k", "30k", "20k", "10k", "0k"].map((y) => (
              <span key={y}>{y}</span>
            ))}
          </div>

          <div className="flex-1">
            <div className="flex items-end gap-1 h-52 border-l border-b border-neutral-100 pl-2">
              {salesBars.map((h, i) => {
                const scale =
                  range === "Weekly" ? 0.7 : range === "Yearly" ? 1 : 0.9;
                const pct = (h / maxSales) * 100 * scale;
                const isPeak = i === peakIndex;
                const newUserPct = isPeak ? 0.68 : 0.4;
                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col justify-end h-full"
                  >
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct * newUserPct}%` }}
                      transition={{ duration: 0.5, delay: 0.02 * i }}
                      className={`w-full rounded-t-sm ${isDark ? "bg-white" : "bg-neutral-900"}`}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${pct * (1 - newUserPct)}%` }}
                      transition={{ duration: 0.5, delay: 0.02 * i }}
                      className={`w-full ${isDark ? "bg-neutral-700" : "bg-neutral-200"}`}
                    />
                  </div>
                );
              })}
            </div>
            <div
              className={`flex justify-between text-[10px] mt-2 pl-2 ${isDark ? "text-neutral-500" : "text-neutral-300"}`}
            >
              {monthLabels.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function RevenueBreakdownCard({ isDark }: { isDark: boolean }) {
  const [insight, setInsight] = useState(false);
  const maxRevenue = Math.max(...revenueBars);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className={`border rounded-2xl p-4 flex flex-col ${
        isDark
          ? "bg-[#161616] border-neutral-800"
          : "bg-white border-neutral-200"
      }`}
    >
      <p className="text-[13px] font-medium text-neutral-900 mb-1">
        Revenue Breakdown
      </p>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[12px] text-neutral-400">Revenue by Category</p>
          <p className="text-lg font-semibold text-neutral-900">$20,320</p>
        </div>
        <button className="flex items-center gap-1 text-[11px] text-neutral-500 border border-neutral-200 rounded-lg px-2 py-1">
          Jan 1 - Aug 30 <ChevronDown size={12} />
        </button>
      </div>

      <div className="flex-1 flex items-end gap-1.5 h-40 border-b border-dashed border-neutral-200">
        {revenueBars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${(h / maxRevenue) * 100}%` }}
            transition={{ duration: 0.5, delay: 0.03 * i }}
            className={`flex-1 rounded-t-sm ${isDark ? "bg-white" : "bg-neutral-900"}`}
          />
        ))}
      </div>
      <div
        className={`flex justify-between text-[10px] mt-2 ${isDark ? "text-neutral-500" : "text-neutral-300"}`}
      >
        <span>1 JAN</span>
        <span>30 JAN</span>
      </div>

      <button
        onClick={() => setInsight(!insight)}
        className={`mt-4 flex items-center justify-center gap-1.5 w-full transition-colors rounded-lg py-2 text-[12px] ${isDark ? "bg-neutral-900 text-neutral-300 hover:bg-neutral-800" : "bg-neutral-100 hover:bg-neutral-200 text-neutral-600"}`}
      >
        <Sparkles size={13} />{" "}
        {insight ? "Hide insight" : "Get AI insight for better analysis"}
      </button>
      <AnimatePresence>
        {insight && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`text-[12px] mt-2 leading-relaxed overflow-hidden ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
          >
            Revenue peaks mid-period, driven mostly by repeat customers.
            Consider timing your next promotion around this window to compound
            the effect.
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Transactions table (shared by Dashboard + Transactions page)       */
/* ------------------------------------------------------------------ */

function TransactionsCard({
  title,
  txs,
  limit,
  query,
  setQuery,
  onAdd,
  onDelete,
  onStatusChange,
  openMenu,
  setOpenMenu,
  isDark,
}: {
  title: string;
  txs: Transaction[];
  limit?: number;
  query: string;
  setQuery: (v: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TransactionStatus) => void;
  openMenu: string | null;
  setOpenMenu: (id: string | null) => void;
  isDark: boolean;
}) {
  const filtered = txs.filter(
    (t) =>
      query === "" ||
      t.customer.toLowerCase().includes(query.toLowerCase()) ||
      t.product.toLowerCase().includes(query.toLowerCase()),
  );
  const shown = limit ? filtered.slice(0, limit) : filtered;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`border rounded-2xl p-4 ${
        isDark
          ? "bg-[#161616] border-neutral-800"
          : "bg-white border-neutral-200"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-[13px] font-medium text-neutral-900">{title}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-neutral-100 rounded-lg px-3 py-1.5 w-48">
            <Search size={13} className="text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions"
              className={`bg-transparent outline-none text-[12px] w-full ${isDark ? "placeholder:text-neutral-500 text-white" : "placeholder:text-neutral-400 text-neutral-900"}`}
            />
          </div>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-lg px-3 py-1.5 text-[12px] font-medium hover:bg-neutral-800 transition-colors"
          >
            <Plus size={13} /> Add Transaction
          </button>
        </div>
      </div>

      <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr
              className={`text-[11px] border-b ${isDark ? "text-neutral-500 border-neutral-800" : "text-neutral-400 border-neutral-100"}`}
            >
              <th className="py-2 pr-2 font-medium">
                <input type="checkbox" className="rounded border-neutral-300" />
              </th>
              <th className="py-2 pr-4 font-medium">ID</th>
              <th className="py-2 pr-4 font-medium">Customer</th>
              <th className="py-2 pr-4 font-medium">Product</th>
              <th className="py-2 pr-4 font-medium">Status</th>
              <th className="py-2 pr-4 font-medium">Qty</th>
              <th className="py-2 pr-4 font-medium">Unit Price</th>
              <th className="py-2 pr-4 font-medium">Total Revenue</th>
              <th className="py-2 pr-2 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className={`border-b last:border-0 ${isDark ? "border-neutral-800" : "border-gray-50"}`}
              >
                <td className="py-3 pr-2">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300"
                  />
                </td>
                <td
                  className={`py-3 pr-4 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
                >
                  {t.id}
                </td>
                <td
                  className={`py-3 pr-4 ${isDark ? "text-white" : "text-neutral-900"}`}
                >
                  {t.customer}
                </td>
                <td
                  className={`py-3 pr-4 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
                >
                  {t.product}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center gap-1.5 ${isDark ? "text-neutral-300" : "text-neutral-600"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusStyles[t.status]}`}
                    />
                    {t.status}
                  </span>
                </td>
                <td
                  className={`py-3 pr-4 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
                >
                  {t.qty}
                </td>
                <td
                  className={`py-3 pr-4 ${isDark ? "text-neutral-400" : "text-neutral-500"}`}
                >
                  {t.price}
                </td>
                <td
                  className={`py-3 pr-4 font-medium ${isDark ? "text-white" : "text-neutral-900"}`}
                >
                  {t.total}
                </td>
                <td
                  className={`py-3 pr-2 text-right ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
                >
                  <div className="relative inline-block">
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === t.id ? null : t.id)
                      }
                      className={`p-1 rounded-md ${isDark ? "hover:bg-neutral-800" : "hover:bg-neutral-100"}`}
                    >
                      <MoreHorizontal size={15} />
                    </button>
                    {openMenu === t.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenu(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`absolute right-0 top-full mt-1 w-40 rounded-lg shadow-lg z-20 py-1 text-left ${isDark ? "bg-neutral-950 border border-neutral-800" : "bg-white border border-gray-200"}`}
                        >
                          <button
                            onClick={() => onStatusChange(t.id, "Success")}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] ${isDark ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-600 hover:bg-neutral-50"}`}
                          >
                            <Check size={13} /> Mark Success
                          </button>
                          <button
                            onClick={() => onStatusChange(t.id, "Refunded")}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] ${isDark ? "text-neutral-300 hover:bg-neutral-800" : "text-neutral-600 hover:bg-neutral-50"}`}
                          >
                            <RotateCcw size={13} /> Mark Refunded
                          </button>
                          <button
                            onClick={() => onDelete(t.id)}
                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] ${isDark ? "text-red-400 hover:bg-red-950/40" : "text-red-500 hover:bg-red-50"}`}
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </motion.div>
                      </>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className={`py-6 text-center text-[13px] ${isDark ? "text-neutral-500" : "text-neutral-400"}`}
                >
                  No transactions match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Other pages                                                        */
/* ------------------------------------------------------------------ */

function ProductsPage({ isDark = false }: { isDark?: boolean }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function toggle(name: string) {
    const next = new Set(selected);
    next.has(name) ? next.delete(name) : next.add(name);
    setSelected(next);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Products"
          subtitle={PAGE_SUBTITLES["Products"]}
          isDark={isDark}
        />
        {selected.size > 0 && (
          <button
            onClick={() => setSelected(new Set())}
            className="text-[12px] text-neutral-500 border border-neutral-200 rounded-lg px-3 py-1.5 bg-white"
          >
            {selected.size} selected · Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {products.map((p, i) => {
          const active = selected.has(p.name);
          return (
            <motion.button
              key={p.name}
              onClick={() => toggle(p.name)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`relative text-left bg-white border rounded-2xl p-4 transition-shadow ${
                active
                  ? "border-neutral-900 ring-1 ring-neutral-900"
                  : "border-neutral-200 hover:shadow-sm"
              }`}
            >
              {active && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center">
                  <Check size={12} />
                </span>
              )}
              <span className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500 mb-3">
                <Package size={16} />
              </span>
              <p className="text-[13px] font-medium text-neutral-900">
                {p.name}
              </p>
              <p className="text-[12px] text-neutral-400 mb-2">{p.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-neutral-900">
                  {p.price}
                </span>
                <span className="text-[11px] text-neutral-400">
                  {p.stock} in stock
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function ReportsPage({ isDark = false }: { isDark?: boolean }) {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Reports & Analytics"
        subtitle={PAGE_SUBTITLES["Reports & Analytics"]}
        isDark={isDark}
      />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <SalesTrendCard isDark={isDark} />
        <RevenueBreakdownCard isDark={isDark} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white border border-neutral-200 rounded-2xl p-4"
      >
        <p className="text-[13px] font-medium text-neutral-900 mb-3">
          Top Products
        </p>
        <div className="space-y-2">
          {products.slice(0, 4).map((p, i) => (
            <div
              key={p.name}
              className="flex items-center justify-between text-[13px] py-1.5 border-b border-neutral-50 last:border-0"
            >
              <span className="text-neutral-700">{p.name}</span>
              <span className="text-neutral-400 text-[12px]">
                {80 - i * 12} units sold
              </span>
              <span className="text-neutral-900 font-medium">{p.price}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function MessagesPage({ isDark = false }: { isDark?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [selectedId, setSelectedId] = useState(initialMessages[0].id);
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);
  const selected = messages.find((m) => m.id === selectedId)!;

  function select(id: string) {
    setSelectedId(id);
    setSent(false);
    setMessages(
      messages.map((m) => (m.id === id ? { ...m, unread: false } : m)),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Messages"
        subtitle={PAGE_SUBTITLES["Messages"]}
        isDark={isDark}
      />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 bg-white border border-neutral-200 rounded-2xl p-2">
          {messages.map((m) => (
            <button
              key={m.id}
              onClick={() => select(m.id)}
              className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl text-left transition-colors ${
                m.id === selectedId ? "bg-neutral-100" : "hover:bg-neutral-50"
              }`}
            >
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`}
                alt=""
                className="w-8 h-8 rounded-full shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p
                    className={`text-[13px] truncate ${m.unread ? "font-semibold text-neutral-900" : "text-neutral-700"}`}
                  >
                    {m.name}
                  </p>
                  <span className="text-[10px] text-neutral-400 shrink-0 ml-2">
                    {m.time}
                  </span>
                </div>
                <p className="text-[12px] text-neutral-400 truncate">
                  {m.preview}
                </p>
              </div>
              {m.unread && (
                <span className="w-2 h-2 rounded-full bg-neutral-900 mt-1.5 shrink-0" />
              )}
            </button>
          ))}
        </div>

        <motion.div
          key={selectedId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:col-span-3 bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col"
        >
          <div className="flex items-center gap-2.5 pb-3 border-b border-neutral-100">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selected.name)}`}
              alt=""
              className="w-9 h-9 rounded-full"
            />
            <div>
              <p className="text-[13px] font-medium text-neutral-900">
                {selected.name}
              </p>
              <p className="text-[11px] text-neutral-400">{selected.time}</p>
            </div>
          </div>
          <p className="text-[13px] text-neutral-600 leading-relaxed py-4 flex-1">
            {selected.full}
          </p>
          <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
            <input
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
                setSent(false);
              }}
              placeholder="Write a reply..."
              className="flex-1 bg-neutral-100 rounded-lg px-3 py-2 text-[12px] outline-none placeholder:text-neutral-400"
            />
            <button
              onClick={() => {
                if (reply.trim()) {
                  setSent(true);
                  setReply("");
                }
              }}
              className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-lg px-3 py-2 text-[12px] font-medium"
            >
              <Mail size={13} /> Send
            </button>
          </div>
          {sent && (
            <p className="text-[11px] text-emerald-600 mt-1.5">
              Message sent ✓
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function TeamPage({ isDark = false }: { isDark?: boolean }) {
  const [order, setOrder] = useState<"desc" | "asc">("desc");
  const sorted = [...teamMembers].sort((a, b) =>
    order === "desc" ? b.score - a.score : a.score - b.score,
  );
  const top = Math.max(...teamMembers.map((m) => m.score));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Team Performance"
          subtitle={PAGE_SUBTITLES["Team Performance"]}
          isDark={isDark}
        />
        <button
          onClick={() => setOrder(order === "desc" ? "asc" : "desc")}
          className="text-[12px] text-neutral-600 border border-neutral-200 rounded-lg px-3 py-1.5 bg-white flex items-center gap-1.5"
        >
          Sort: {order === "desc" ? "Highest first" : "Lowest first"}
          <ChevronDown
            size={13}
            className={`transition-transform ${order === "asc" ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-4">
        {sorted.map((m, i) => (
          <div key={m.name} className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(m.name)}`}
              alt=""
              className="w-9 h-9 rounded-full shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[13px] font-medium text-neutral-900 flex items-center gap-1.5">
                  {m.name}
                  {m.score === top && (
                    <Trophy size={13} className="text-amber-500" />
                  )}
                </p>
                <span className="text-[12px] text-neutral-500">{m.score}</span>
              </div>
              <p className="text-[11px] text-neutral-400 mb-1.5">{m.role}</p>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.score}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className="h-full bg-neutral-900 rounded-full"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampaignsPage({ isDark = false }: { isDark?: boolean }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const cycle: Record<CampaignStatus, CampaignStatus> = {
    Active: "Paused",
    Paused: "Ended",
    Ended: "Active",
  };

  function cycleStatus(name: string) {
    setCampaigns(
      campaigns.map((c) =>
        c.name === name ? { ...c, status: cycle[c.status] } : c,
      ),
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Campaigns"
        subtitle={PAGE_SUBTITLES["Campaigns"]}
        isDark={isDark}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {campaigns.map((c, i) => (
          <motion.div
            key={c.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-white border border-neutral-200 rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500">
                  <Target size={16} />
                </span>
                <p className="text-[13px] font-medium text-neutral-900">
                  {c.name}
                </p>
              </div>
              <button
                onClick={() => cycleStatus(c.name)}
                className={`text-[11px] px-2 py-1 rounded-full font-medium ${campaignStatusStyles[c.status]}`}
              >
                {c.status}
              </button>
            </div>
            <div className="flex items-center justify-between text-[12px] text-neutral-400">
              <span>
                Budget{" "}
                <span className="text-neutral-900 font-medium">{c.budget}</span>
              </span>
              <span>
                Spent{" "}
                <span className="text-neutral-900 font-medium">{c.spent}</span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function GenericPage({
  pageKey,
  isDark = false,
}: {
  pageKey: string;
  isDark?: boolean;
}) {
  const content = GENERIC_CONTENT[pageKey];
  const [checked, setChecked] = useState<Set<string>>(new Set());

  function toggle(label: string) {
    const next = new Set(checked);
    next.has(label) ? next.delete(label) : next.add(label);
    setChecked(next);
  }

  if (!content) return null;
  const isSettings = pageKey === "System Settings";

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={pageKey} subtitle={content.subtitle} isDark={isDark} />
      <div className="bg-white border border-neutral-200 rounded-2xl p-2">
        {content.rows.map((row, i) => (
          <div
            key={row.label}
            onClick={() => !isSettings && toggle(row.label)}
            className={`flex items-center justify-between px-3 py-3 rounded-xl transition-colors ${
              !isSettings ? "cursor-pointer hover:bg-neutral-50" : ""
            } ${checked.has(row.label) ? "bg-neutral-50" : ""} ${i !== content.rows.length - 1 ? "border-b border-neutral-50" : ""}`}
          >
            <span className="text-[13px] text-neutral-700">{row.label}</span>
            {isSettings ? (
              <Toggle defaultOn={row.value === "toggle-on"} />
            ) : (
              <span className="text-[12px] text-neutral-400">{row.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [txs, setTxs] = useState<Transaction[]>(initialTransactions);
  const [query, setQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [nextId, setNextId] = useState(4914);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [periodLabel, setPeriodLabel] = useState("Daily");
  const [periodOpen, setPeriodOpen] = useState(false);

  function handleAdd() {
    const customer =
      customersPool[Math.floor(Math.random() * customersPool.length)];
    const product =
      productsPool[Math.floor(Math.random() * productsPool.length)];
    const qty = Math.floor(Math.random() * 20) + 1;
    const unit = Math.floor(Math.random() * 3000) + 500;
    const newTx: Transaction = {
      id: `#${nextId}`,
      customer,
      product,
      status: "Pending",
      qty,
      price: `$${unit.toLocaleString()}`,
      total: `$${(unit * qty).toLocaleString()}`,
    };
    setTxs([newTx, ...txs]);
    setNextId(nextId + 1);
  }

  function handleDelete(id: string) {
    setTxs(txs.filter((t) => t.id !== id));
    setOpenMenu(null);
  }

  function handleStatus(id: string, status: TransactionStatus) {
    setTxs(txs.map((t) => (t.id === id ? { ...t, status } : t)));
    setOpenMenu(null);
  }

  function renderPage() {
    switch (activePage) {
      case "Dashboard":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1
                className={`text-xl font-semibold ${isDark ? "text-white" : "text-neutral-900"}`}
              >
                Welcome back, Anelka
              </h1>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    onClick={() => setPeriodOpen(!periodOpen)}
                    className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-[13px] ${isDark ? "bg-[#1a1a1a] border-neutral-700 text-neutral-300" : "bg-white border-neutral-200 text-neutral-600"}`}
                  >
                    {periodLabel} <ChevronDown size={14} />
                  </button>
                  {periodOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setPeriodOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1">
                        {["Daily", "Weekly", "Monthly"].map((p) => (
                          <button
                            key={p}
                            onClick={() => {
                              setPeriodLabel(p);
                              setPeriodOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[12px] text-neutral-600 hover:bg-neutral-50"
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <button
                  className={`flex items-center gap-1.5 border rounded-lg px-3 py-1.5 text-[13px] ${isDark ? "bg-[#1a1a1a] border-neutral-700 text-neutral-300" : "bg-white border-neutral-200 text-neutral-600"}`}
                >
                  <Calendar size={14} /> 6 Nov 2025
                </button>
                <button className="flex items-center gap-1.5 bg-neutral-900 text-white rounded-lg px-3 py-1.5 text-[13px] font-medium hover:bg-neutral-800 transition-colors">
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {stats.map((s, i) => (
                <StatCard
                  key={s.label}
                  index={i}
                  selected={selectedStat === s.label}
                  onClick={() =>
                    setSelectedStat(selectedStat === s.label ? null : s.label)
                  }
                  isDark={isDark}
                  {...s}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              <SalesTrendCard isDark={isDark} />
              <RevenueBreakdownCard isDark={isDark} />
            </div>

            <TransactionsCard
              title="Recent Transactions"
              txs={txs}
              limit={4}
              query={query}
              setQuery={setQuery}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onStatusChange={handleStatus}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              isDark={isDark}
            />
          </div>
        );
      case "Products":
        return <ProductsPage isDark={isDark} />;
      case "Transactions":
        return (
          <div className="flex flex-col gap-4">
            <PageHeader
              title="Transactions"
              subtitle={PAGE_SUBTITLES["Transactions"]}
            />
            <TransactionsCard
              title="All Transactions"
              txs={txs}
              query={query}
              setQuery={setQuery}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onStatusChange={handleStatus}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              isDark={isDark}
            />
          </div>
        );
      case "Reports & Analytics":
        return <ReportsPage isDark={isDark} />;
      case "Messages":
        return <MessagesPage isDark={isDark} />;
      case "Team Performance":
        return <TeamPage isDark={isDark} />;
      case "Campaigns":
        return <CampaignsPage isDark={isDark} />;
      default:
        return <GenericPage pageKey={activePage} isDark={isDark} />;
    }
  }

  return (
    <div
      className={`min-h-screen w-full p-0 ${isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="flex items-stretch gap-0 w-full min-h-screen">
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className={`sticky top-0 flex flex-col w-[248px] shrink-0 border-r p-3 ${
            isDark ? "bg-black border-neutral-800" : "bg-white border-gray-100"
          }`}
          style={{ height: "100vh" }}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              className={`flex min-w-0 items-center gap-3 rounded-lg px-2 py-1.5 transition-colors ${
                isDark ? "hover:bg-neutral-900" : "hover:bg-gray-50"
              }`}
            >
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src="/logoR.png"
                  alt="BagUI"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="min-w-0 text-left">
                <p
                  className={`truncate text-sm font-semibold ${
                    isDark ? "text-neutral-50" : "text-gray-900"
                  }`}
                >
                  Bag\UI
                </p>
                <p
                  className={`truncate text-xs ${
                    isDark ? "text-neutral-400" : "text-gray-500"
                  }`}
                >
                  Open Source UI Blocks
                </p>
              </div>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <NavSection
              title="Main Menu"
              items={mainMenu}
              activePage={activePage}
              onSelect={setActivePage}
              isDark={isDark}
            />
            <NavSection
              title="Customers"
              items={customersMenu}
              activePage={activePage}
              onSelect={setActivePage}
              isDark={isDark}
            />
            <NavSection
              title="Management"
              items={managementMenu}
              activePage={activePage}
              onSelect={setActivePage}
              isDark={isDark}
            />
            <NavSection
              title="Settings"
              items={settingsMenu}
              activePage={activePage}
              onSelect={setActivePage}
              isDark={isDark}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`w-full flex items-center gap-2 px-2 py-2 border-t pt-3 rounded-[14px] ${
                isDark
                  ? "border-neutral-800 hover:bg-neutral-900"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <img
                src="/avatar.png"
                alt="avatar"
                className="w-8 h-8 rounded-full bg-white"
              />
              <div className="leading-tight text-left">
                <p
                  className={`text-[13px] font-medium ${
                    isDark ? "text-neutral-50" : "text-gray-900"
                  }`}
                >
                  Anelka Bag
                </p>
                <p
                  className={`text-[11px] ${isDark ? "text-neutral-400" : "text-gray-500"}`}
                >
                  Software Developer
                </p>
              </div>
            </button>
            {profileOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setProfileOpen(false)}
                />
                <div
                  className={`absolute bottom-full left-0 mb-1 w-full rounded-lg shadow-lg z-20 py-1 ${
                    isDark
                      ? "bg-neutral-950 border border-neutral-800"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <button
                    className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] ${isDark ? "text-neutral-300 hover:bg-neutral-900" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <User size={13} /> Profile
                  </button>
                  <button
                    className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] ${isDark ? "text-neutral-300 hover:bg-neutral-900" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    <Settings size={13} /> Settings
                  </button>
                  <button
                    className={`w-full flex items-center gap-2 px-3 py-2 text-[12px] ${isDark ? "text-red-400 hover:bg-red-950/40" : "text-red-500 hover:bg-red-50"}`}
                  >
                    <LogOut size={13} /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.aside>

        {/* Main content */}
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className={`flex-1 min-w-0 flex flex-col gap-4 p-3 md:p-4 ${
            isDark ? "bg-black" : "bg-gray-50"
          }`}
        >
          {/* Top bar */}
          <div
            className={`flex items-center justify-between border rounded-[18px] px-4 py-2.5 shadow-[0_1px_0_rgba(0,0,0,0.02)] ${isDark ? "bg-neutral-950 border-neutral-800" : "bg-white border-gray-200"}`}
          >
            <p
              className={`text-[13px] ${isDark ? "text-neutral-400" : "text-gray-400"}`}
            >
              {activePage}{" "}
              <span
                className={`${isDark ? "text-neutral-500" : "text-gray-300"} mx-1`}
              >
                /
              </span>
              <span
                className={`${isDark ? "text-neutral-50" : "text-gray-900"}`}
              >
                Overview
              </span>
            </p>
            <div className="flex items-center gap-3">
              <div
                className={`hidden md:flex items-center gap-2 rounded-lg border px-3 py-1.5 w-56 transition-colors ${
                  isDark
                    ? "bg-[#161616] border-neutral-800"
                    : "bg-neutral-100 border-neutral-200"
                }`}
              >
                <Search
                  size={14}
                  className={isDark ? "text-neutral-500" : "text-neutral-400"}
                />
                <input
                  placeholder="Search..."
                  className={`bg-transparent outline-none text-[13px] w-full ${
                    isDark
                      ? "placeholder:text-neutral-500 text-neutral-100"
                      : "placeholder:text-neutral-400 text-neutral-900"
                  }`}
                />
              </div>

              <button
                onClick={() => setIsDark((v) => !v)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun size={16} className="text-neutral-500" />
                ) : (
                  <Moon size={16} className="text-neutral-500" />
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100"
                >
                  <Bell size={16} className="text-neutral-500" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                </button>
                {notifOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setNotifOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg z-20 py-1">
                      <p className="px-3 py-2 text-[12px] font-medium text-neutral-900 border-b border-neutral-50">
                        Notifications
                      </p>
                      {[
                        "New order from Madelyn Lubin",
                        "Refund requested — order #04913",
                        "Monthly report is ready",
                      ].map((n) => (
                        <p
                          key={n}
                          className="px-3 py-2 text-[12px] text-neutral-600 hover:bg-neutral-50"
                        >
                          {n}
                        </p>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100">
                <Settings size={16} className="text-neutral-500" />
              </button>
              <img
                src="/avatar.png"
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
}
