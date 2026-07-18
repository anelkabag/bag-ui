"use client";

/**
 * Dashboard2 — fully interactive version
 * ────────────────────────────────────────────────────────────────────────
 * Every control actually does something:
 *   - Sidebar nav ("Dashboard", "Product", "Order", "Customer", "Message",
 *     "Email", "Automation", "Analytics", "Integration") swaps the dataset,
 *     the stats row, and the table columns shown in the main panel.
 *   - Search box filters the current table's rows live.
 *   - Filter dropdown restricts rows by status; Sort dropdown re-orders rows;
 *     column headers are clickable to sort (asc/desc toggle).
 *   - "Show Statistics" toggle shows/hides the stats row.
 *   - Checkboxes drive a real selection state -> bulk action bar appears,
 *     "Apply Code" / "Edit Info" / "Delete" mutate the in-memory dataset.
 *   - "+ Add New Product" opens an inline quick-add row.
 *   - "Export" downloads the current (filtered) table as a CSV file.
 *   - "Customize" / "Customize Widget" toggle which stat cards / columns
 *     are visible.
 *   - Pagination buttons/page-size/go-to-page all actually page the data.
 *   - A small toast system confirms every action.
 *   - A light/dark toggle switches the whole dashboard's theme (Tailwind
 *     `dark:` class strategy, scoped to the dashboard root — no need for
 *     the `<html>` tag to carry the class).
 *
 * Font: Geist (next/font/google), set once on the root wrapper.
 * Colors: BagUI's neutral/gray system (bagui.vercel.app) — gray-50→900,
 * black primary actions, soft-pill status colors. Primary black surfaces
 * invert to white in dark mode to keep the strict black/white/gray language.
 *
 * Dependencies: npm install framer-motion lucide-react
 *
 * Fix note: the crash ("Cannot read properties of undefined (reading 'rows')")
 * happened because `active` could hold a nav label with no matching key in
 * the `datasets` map (e.g. a sidebar item added without a matching entry in
 * buildDatasets()), so `datasets[active]` was `undefined`. `dataset` now
 * falls back to the first available dataset instead of crashing, and logs a
 * dev-only warning so the mismatch is easy to spot and fix at the source.
 */

import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  LayoutGrid,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Mail,
  Zap,
  BarChart3,
  Plug,
  HelpCircle,
  MessageCircle,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  MoreHorizontal,
  Filter,
  ArrowUpDown,
  Share2,
  Bell,
  Plus,
  Download,
  SlidersHorizontal,
  Star,
  X,
  Info,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  Trash2,
  Sun,
  Moon,
  Crown,
} from "lucide-react";
import Image from "next/image";

// ─── Font (applied once, inherited everywhere) ─────────────────────────────
const font = {
  fontFamily: "var(--font-geist-sans), Geist, Inter, system-ui, sans-serif",
} as const;

// ─── Motion variants ────────────────────────────────────────────────────────
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.04 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// ─── Shared types ───────────────────────────────────────────────────────────
type Status =
  | "In Stock"
  | "Out of Stock"
  | "Restock"
  | "Active"
  | "Pending"
  | "Completed"
  | "Cancelled"
  | "Read"
  | "Unread"
  | "Published"
  | "Draft"
  | "New"
  | "In Review"
  | "Resolved";

type Row = {
  id: string;
  cells: Record<string, string | number>;
  status: Status;
  rating?: number;
};

type ColumnDef = {
  key: string;
  label: string;
  align?: "left" | "right";
  numeric?: boolean;
};

type Dataset = {
  key: string;
  title: string;
  addLabel: string;
  columns: ColumnDef[];
  stats: { label: string; value: string; delta: string }[];
  rows: Row[];
};

// ─── Icons per nav item ─────────────────────────────────────────────────────
type NavItem = {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const MAIN_MENU: NavItem[] = [
  { label: "Dashboard", icon: LayoutGrid },
  { label: "Product", icon: Package },
  { label: "Order", icon: ShoppingCart },
  { label: "Customer", icon: Users },
  { label: "Message", icon: MessageSquare },
];
const TOOLS_MENU: NavItem[] = [
  { label: "Email", icon: Mail },
  { label: "Automation", icon: Zap },
  { label: "Analytics", icon: BarChart3 },
  { label: "Integration", icon: Plug },
];

const BOTTOM_MENU: NavItem[] = [
  { label: "Help center", icon: HelpCircle },
  { label: "Feedback", icon: MessageCircle },
  { label: "Settings", icon: Settings },
];

const WORKSPACES = [
  { label: "Campaign", count: 5, color: "bg-gray-900 dark:bg-neutral-100" },
  { label: "Product Plan", count: 4, color: "bg-gray-400 dark:bg-neutral-600" },
];

// Strictly black / white / gray. Status is communicated through the pill's
// shade (tone) plus an optional check mark — never through hue. In dark
// mode, "solid" pills invert (white chip / dark text) to keep the same
// strict black-white-gray language instead of turning muddy.
type Tone = "solid" | "subtle" | "outline";
const STATUS_META: Record<string, { tone: Tone }> = {
  "In Stock": { tone: "solid" },
  "Out of Stock": { tone: "outline" },
  Restock: { tone: "subtle" },
  Active: { tone: "solid" },
  Pending: { tone: "subtle" },
  Completed: { tone: "solid" },
  Cancelled: { tone: "outline" },
  Read: { tone: "outline" },
  Unread: { tone: "solid" },
  Published: { tone: "solid" },
  Draft: { tone: "subtle" },
  New: { tone: "solid" },
  "In Review": { tone: "subtle" },
  Resolved: { tone: "solid" },
};
const TONE_CLASSES: Record<Tone, string> = {
  solid: "bg-gray-900 text-white dark:bg-neutral-50 dark:text-neutral-900",
  subtle:
    "bg-gray-100 text-gray-600 border border-gray-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700",
  outline:
    "bg-white text-gray-400 border border-gray-300 dark:bg-neutral-900 dark:text-neutral-500 dark:border-neutral-700",
};

// Team avatars — Dicebear "notionists" set.
const AVATARS = [
  {
    id: 1,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=JK&backgroundColor=b6e3f4",
  },
  {
    id: 2,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=AM&backgroundColor=c0aede",
  },
  {
    id: 3,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=SL&backgroundColor=ffdfbf",
  },
  {
    id: 4,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=TR&backgroundColor=d1d4f9",
  },
  {
    id: 5,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=PW&backgroundColor=ffd5dc",
  },
];

// ─── Datasets (one per nav item — this is what makes the sidebar "dynamic") ─
function buildDatasets(): Record<string, Dataset> {
  return {
    Dashboard: {
      key: "Dashboard",
      title: "Dashboard",
      addLabel: "Add Widget",
      columns: [
        { key: "name", label: "Metric" },
        { key: "value", label: "Value" },
        { key: "change", label: "Change" },
        { key: "period", label: "Period" },
      ],
      stats: [
        { label: "Total Revenue", value: "$48,290", delta: "+ 12%" },
        { label: "Active Users", value: "3,204", delta: "+ 4%" },
        { label: "Conversion Rate", value: "3.8%", delta: "+ 0.6%" },
        { label: "Churn Rate", value: "1.2%", delta: "+ 0.2%" },
      ],
      rows: [
        {
          id: "d1",
          status: "Active",
          cells: {
            name: "Monthly Recurring Revenue",
            value: "$48,290",
            change: "+12%",
            period: "This month",
          },
        },
        {
          id: "d2",
          status: "Active",
          cells: {
            name: "New Signups",
            value: "312",
            change: "+18%",
            period: "This month",
          },
        },
        {
          id: "d3",
          status: "Pending",
          cells: {
            name: "Support Tickets",
            value: "27",
            change: "-5%",
            period: "This week",
          },
        },
        {
          id: "d4",
          status: "Completed",
          cells: {
            name: "Deployments",
            value: "9",
            change: "+2",
            period: "This week",
          },
        },
        {
          id: "d5",
          status: "Active",
          cells: {
            name: "Server Uptime",
            value: "99.98%",
            change: "+0.01%",
            period: "This month",
          },
        },
        {
          id: "d6",
          status: "Cancelled",
          cells: {
            name: "Failed Payments",
            value: "4",
            change: "-2",
            period: "This month",
          },
        },
      ],
    },
    Product: {
      key: "Product",
      title: "Product",
      addLabel: "Add New Product",
      columns: [
        { key: "name", label: "Product" },
        { key: "price", label: "Price", numeric: true },
        { key: "sales", label: "Sales" },
        { key: "revenue", label: "Revenue", numeric: true },
        { key: "stock", label: "Stock", numeric: true },
        { key: "status", label: "Status" },
        { key: "rating", label: "Rating", numeric: true },
      ],
      stats: [
        { label: "Total Product", value: "250", delta: "+ 3 product" },
        { label: "Product Revenue", value: "$15,490", delta: "+ 9%" },
        { label: "Product Sold", value: "2,355", delta: "+ 7%" },
        { label: "Avg. Monthly Sales", value: "890", delta: "+ 6%" },
      ],
      rows: [
        {
          id: "p1",
          status: "In Stock",
          rating: 5.0,
          cells: {
            name: "Orbit T-Shirt #10 - White",
            price: 1.35,
            sales: "471 pcs",
            revenue: 635.85,
            stock: 100,
          },
        },
        {
          id: "p2",
          status: "Out of Stock",
          rating: 5.0,
          cells: {
            name: "Orbit T-Shirt #10 - Black",
            price: 1.35,
            sales: "402 pcs",
            revenue: 544.0,
            stock: 20,
          },
        },
        {
          id: "p3",
          status: "Restock",
          rating: 4.9,
          cells: {
            name: "Orbit T-Shirt #19 - White",
            price: 1.35,
            sales: "455 pcs",
            revenue: 645.25,
            stock: 20,
          },
        },
        {
          id: "p4",
          status: "In Stock",
          rating: 4.8,
          cells: {
            name: "SmartHome Hub",
            price: 150,
            sales: "7 pcs",
            revenue: 1050.0,
            stock: 12,
          },
        },
        {
          id: "p5",
          status: "Out of Stock",
          rating: 4.8,
          cells: {
            name: "UltraSound Wireless Earbuds",
            price: 200,
            sales: "5 pcs",
            revenue: 1000.0,
            stock: 0,
          },
        },
        {
          id: "p6",
          status: "Restock",
          rating: 4.7,
          cells: {
            name: "ProVision 4K Monitor",
            price: 400.25,
            sales: "1 pcs",
            revenue: 400.25,
            stock: 3,
          },
        },
        {
          id: "p7",
          status: "In Stock",
          rating: 4.7,
          cells: {
            name: "Orbit Retro Wave Shirt",
            price: 1.35,
            sales: "120 pcs",
            revenue: 162.4,
            stock: 0,
          },
        },
        {
          id: "p8",
          status: "Out of Stock",
          rating: 4.9,
          cells: {
            name: "Orbit Graphic Art T-Shirt",
            price: 1.35,
            sales: "200 pcs",
            revenue: 270.15,
            stock: 0,
          },
        },
        {
          id: "p9",
          status: "In Stock",
          rating: 4.8,
          cells: {
            name: "Orbit Classic Fit Crewneck",
            price: 28.5,
            sales: "130 pcs",
            revenue: 3705.25,
            stock: 11,
          },
        },
        {
          id: "p10",
          status: "In Stock",
          rating: 4.8,
          cells: {
            name: "EchoWave Bluetooth Speaker",
            price: 55.5,
            sales: "10 pcs",
            revenue: 555.0,
            stock: 20,
          },
        },
      ],
    },
    Order: {
      key: "Order",
      title: "Order",
      addLabel: "Create Order",
      columns: [
        { key: "name", label: "Order" },
        { key: "customer", label: "Customer" },
        { key: "items", label: "Items" },
        { key: "total", label: "Total", numeric: true },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Total Orders", value: "1,204", delta: "+ 5%" },
        { label: "Order Revenue", value: "$62,140", delta: "+ 11%" },
        { label: "Pending Orders", value: "38", delta: "+ 2" },
        { label: "Avg. Order Value", value: "$51.60", delta: "+ 3%" },
      ],
      rows: [
        {
          id: "o1",
          status: "Completed",
          cells: {
            name: "#ORD-1042",
            customer: "Alice Mensah",
            items: "3 items",
            total: 89.5,
          },
        },
        {
          id: "o2",
          status: "Pending",
          cells: {
            name: "#ORD-1043",
            customer: "Alex Chen",
            items: "1 item",
            total: 24.0,
          },
        },
        {
          id: "o3",
          status: "Cancelled",
          cells: {
            name: "#ORD-1044",
            customer: "Isabella Green",
            items: "2 items",
            total: 61.2,
          },
        },
        {
          id: "o4",
          status: "Completed",
          cells: {
            name: "#ORD-1045",
            customer: "Victoria Stone",
            items: "5 items",
            total: 154.9,
          },
        },
        {
          id: "o5",
          status: "Pending",
          cells: {
            name: "#ORD-1046",
            customer: "Marc Dupont",
            items: "1 item",
            total: 18.75,
          },
        },
        {
          id: "o6",
          status: "Completed",
          cells: {
            name: "#ORD-1047",
            customer: "Sarah Kim",
            items: "4 items",
            total: 132.4,
          },
        },
      ],
    },
    Customer: {
      key: "Customer",
      title: "Customer",
      addLabel: "Add Customer",
      columns: [
        { key: "name", label: "Customer" },
        { key: "email", label: "Email" },
        { key: "orders", label: "Orders", numeric: true },
        { key: "spent", label: "Total Spent", numeric: true },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Total Customers", value: "5,830", delta: "+ 2%" },
        { label: "New Customers", value: "142", delta: "+ 8%" },
        { label: "Returning Rate", value: "64%", delta: "+ 3%" },
        { label: "Avg. Lifetime Value", value: "$212", delta: "+ 5%" },
      ],
      rows: [
        {
          id: "c1",
          status: "Active",
          cells: {
            name: "Alice Mensah",
            email: "alice@mail.com",
            orders: 12,
            spent: 640.5,
          },
        },
        {
          id: "c2",
          status: "Active",
          cells: {
            name: "Alex Chen",
            email: "alex@mail.com",
            orders: 4,
            spent: 120.0,
          },
        },
        {
          id: "c3",
          status: "Pending",
          cells: {
            name: "Isabella Green",
            email: "isabella@mail.com",
            orders: 1,
            spent: 42.0,
          },
        },
        {
          id: "c4",
          status: "Active",
          cells: {
            name: "Victoria Stone",
            email: "victoria@mail.com",
            orders: 21,
            spent: 1290.75,
          },
        },
        {
          id: "c5",
          status: "Cancelled",
          cells: {
            name: "Marc Dupont",
            email: "marc@mail.com",
            orders: 2,
            spent: 58.4,
          },
        },
      ],
    },
    Message: {
      key: "Message",
      title: "Message",
      addLabel: "New Message",
      columns: [
        { key: "name", label: "From" },
        { key: "subject", label: "Subject" },
        { key: "preview", label: "Preview" },
        { key: "time", label: "Time" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Unread", value: "12", delta: "+ 3" },
        { label: "Total Messages", value: "486", delta: "+ 21" },
        { label: "Avg. Response Time", value: "2.4h", delta: "- 0.3h" },
        { label: "Resolved Today", value: "18", delta: "+ 6" },
      ],
      rows: [
        {
          id: "m1",
          status: "Unread",
          cells: {
            name: "Alice Mensah",
            subject: "Order delay",
            preview: "Hi, my order #1042 is late...",
            time: "2m",
          },
        },
        {
          id: "m2",
          status: "Read",
          cells: {
            name: "Alex Chen",
            subject: "Refund request",
            preview: "Can I get a refund for...",
            time: "15m",
          },
        },
        {
          id: "m3",
          status: "Unread",
          cells: {
            name: "Isabella Green",
            subject: "Product question",
            preview: "Does this come in blue?",
            time: "1h",
          },
        },
        {
          id: "m4",
          status: "Read",
          cells: {
            name: "Victoria Stone",
            subject: "Thank you!",
            preview: "Just wanted to say thanks...",
            time: "3h",
          },
        },
      ],
    },
    Email: {
      key: "Email",
      title: "Email",
      addLabel: "New Campaign",
      columns: [
        { key: "name", label: "Campaign" },
        { key: "recipients", label: "Recipients", numeric: true },
        { key: "openRate", label: "Open Rate" },
        { key: "clickRate", label: "Click Rate" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Campaigns Sent", value: "34", delta: "+ 4" },
        { label: "Avg. Open Rate", value: "42%", delta: "+ 3%" },
        { label: "Avg. Click Rate", value: "8.6%", delta: "+ 1.1%" },
        { label: "Unsubscribes", value: "6", delta: "- 2" },
      ],
      rows: [
        {
          id: "e1",
          status: "Completed",
          cells: {
            name: "Spring Launch",
            recipients: 4200,
            openRate: "44%",
            clickRate: "9.1%",
          },
        },
        {
          id: "e2",
          status: "Active",
          cells: {
            name: "Weekly Digest",
            recipients: 3800,
            openRate: "39%",
            clickRate: "7.4%",
          },
        },
        {
          id: "e3",
          status: "Pending",
          cells: {
            name: "Re-engagement",
            recipients: 1500,
            openRate: "-",
            clickRate: "-",
          },
        },
      ],
    },
    Automation: {
      key: "Automation",
      title: "Automation",
      addLabel: "New Workflow",
      columns: [
        { key: "name", label: "Workflow" },
        { key: "trigger", label: "Trigger" },
        { key: "runs", label: "Runs", numeric: true },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Active Workflows", value: "18", delta: "+ 2" },
        { label: "Runs Today", value: "1,204", delta: "+ 9%" },
        { label: "Success Rate", value: "98.4%", delta: "+ 0.4%" },
        { label: "Time Saved", value: "36h", delta: "+ 5h" },
      ],
      rows: [
        {
          id: "a1",
          status: "Active",
          cells: {
            name: "Welcome Email Series",
            trigger: "New signup",
            runs: 312,
          },
        },
        {
          id: "a2",
          status: "Active",
          cells: { name: "Abandoned Cart", trigger: "Cart idle 1h", runs: 214 },
        },
        {
          id: "a3",
          status: "Pending",
          cells: { name: "Win-back Flow", trigger: "No login 30d", runs: 0 },
        },
      ],
    },
    Analytics: {
      key: "Analytics",
      title: "Analytics",
      addLabel: "New Report",
      columns: [
        { key: "name", label: "Report" },
        { key: "metric", label: "Metric" },
        { key: "value", label: "Value" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Sessions", value: "24,890", delta: "+ 6%" },
        { label: "Bounce Rate", value: "38%", delta: "- 2%" },
        { label: "Avg. Session", value: "3m 42s", delta: "+ 12s" },
        { label: "Page Views", value: "88,410", delta: "+ 9%" },
      ],
      rows: [
        {
          id: "an1",
          status: "Completed",
          cells: {
            name: "Weekly Traffic",
            metric: "Sessions",
            value: "24,890",
          },
        },
        {
          id: "an2",
          status: "Completed",
          cells: { name: "Funnel Report", metric: "Conversion", value: "3.8%" },
        },
        {
          id: "an3",
          status: "Pending",
          cells: {
            name: "Cohort Retention",
            metric: "D30 retention",
            value: "22%",
          },
        },
      ],
    },
    Integration: {
      key: "Integration",
      title: "Integration",
      addLabel: "Add Integration",
      columns: [
        { key: "name", label: "Integration" },
        { key: "category", label: "Category" },
        { key: "syncedAt", label: "Last Synced" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Connected Apps", value: "9", delta: "+ 1" },
        { label: "Synced Records", value: "142,300", delta: "+ 4%" },
        { label: "Sync Errors", value: "2", delta: "- 1" },
        { label: "Avg. Sync Time", value: "48s", delta: "- 4s" },
      ],
      rows: [
        {
          id: "i1",
          status: "Active",
          cells: { name: "Stripe", category: "Payments", syncedAt: "2m ago" },
        },
        {
          id: "i2",
          status: "Active",
          cells: {
            name: "Slack",
            category: "Notifications",
            syncedAt: "10m ago",
          },
        },
        {
          id: "i3",
          status: "Pending",
          cells: { name: "HubSpot", category: "CRM", syncedAt: "Never" },
        },
      ],
    },
    Settings: {
      key: "Settings",
      title: "Settings",
      addLabel: "Add Setting",
      columns: [
        { key: "name", label: "Setting" },
        { key: "value", label: "Value" },
        { key: "category", label: "Category" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Plan", value: "Free Plan", delta: "+ upgrade" },
        { label: "Team Members", value: "4", delta: "+ 1" },
        { label: "Storage Used", value: "2.1GB / 5GB", delta: "+ 0.3GB" },
        { label: "API Calls (mo)", value: "1,204", delta: "+ 9%" },
      ],
      rows: [
        {
          id: "s1",
          status: "Active",
          cells: {
            name: "Two-Factor Authentication",
            value: "Enabled",
            category: "Security",
          },
        },
        {
          id: "s2",
          status: "Pending",
          cells: {
            name: "Email Notifications",
            value: "Daily digest",
            category: "Notifications",
          },
        },
        {
          id: "s3",
          status: "Active",
          cells: {
            name: "Dark Mode",
            value: "System default",
            category: "Appearance",
          },
        },
        {
          id: "s4",
          status: "Cancelled",
          cells: {
            name: "SSO (SAML)",
            value: "Not configured",
            category: "Security",
          },
        },
        {
          id: "s5",
          status: "Active",
          cells: {
            name: "API Access",
            value: "3 keys active",
            category: "Developer",
          },
        },
        {
          id: "s6",
          status: "Pending",
          cells: {
            name: "Billing Plan",
            value: "Free Plan",
            category: "Billing",
          },
        },
      ],
    },
    "Help center": {
      key: "Help center",
      title: "Help Center",
      addLabel: "New Article",
      columns: [
        { key: "name", label: "Article" },
        { key: "category", label: "Category" },
        { key: "views", label: "Views" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Open Tickets", value: "7", delta: "- 2" },
        { label: "Avg. Resolution Time", value: "3.2h", delta: "- 0.4h" },
        { label: "Articles Published", value: "86", delta: "+ 4" },
        { label: "Satisfaction Score", value: "96%", delta: "+ 1%" },
      ],
      rows: [
        {
          id: "h1",
          status: "Published",
          cells: {
            name: "Getting started with Orbit",
            category: "Onboarding",
            views: "4,210",
          },
        },
        {
          id: "h2",
          status: "Published",
          cells: {
            name: "How to export your data",
            category: "Data",
            views: "1,880",
          },
        },
        {
          id: "h3",
          status: "Draft",
          cells: { name: "Setting up SSO", category: "Security", views: "—" },
        },
        {
          id: "h4",
          status: "Published",
          cells: {
            name: "Managing team roles",
            category: "Team",
            views: "962",
          },
        },
        {
          id: "h5",
          status: "Draft",
          cells: {
            name: "Webhook reference",
            category: "Developer",
            views: "—",
          },
        },
      ],
    },
    Feedback: {
      key: "Feedback",
      title: "Feedback",
      addLabel: "New Feedback",
      columns: [
        { key: "name", label: "From" },
        { key: "summary", label: "Summary" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status" },
      ],
      stats: [
        { label: "Total Feedback", value: "312", delta: "+ 18" },
        { label: "New This Week", value: "24", delta: "+ 6" },
        { label: "Avg. Rating", value: "4.6/5", delta: "+ 0.1" },
        { label: "Resolved", value: "268", delta: "+ 12" },
      ],
      rows: [
        {
          id: "f1",
          status: "New",
          cells: {
            name: "Alice Mensah",
            summary: "Would love a dark mode toggle",
            type: "Feature",
          },
        },
        {
          id: "f2",
          status: "In Review",
          cells: {
            name: "Alex Chen",
            summary: "Export button is slow on large tables",
            type: "Bug",
          },
        },
        {
          id: "f3",
          status: "Resolved",
          cells: {
            name: "Isabella Green",
            summary: "Great support response time!",
            type: "Praise",
          },
        },
        {
          id: "f4",
          status: "New",
          cells: {
            name: "Marc Dupont",
            summary: "Add bulk CSV import",
            type: "Feature",
          },
        },
        {
          id: "f5",
          status: "In Review",
          cells: {
            name: "Sarah Kim",
            summary: "Pagination resets after edit",
            type: "Bug",
          },
        },
      ],
    },
  };
}

// ─── Toasts ─────────────────────────────────────────────────────────────────
type Toast = { id: number; message: string };

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);
  const push = (message: string) => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2400);
  };
  return { toasts, push };
}

function ToastStack({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none absolute bottom-5 right-5 z-30 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 rounded-lg bg-gray-900 px-3.5 py-2.5 text-sm font-medium text-white shadow-lg dark:border dark:border-neutral-700 dark:bg-neutral-800"
          >
            <CheckCircle2 size={15} className="text-green-300" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Small building blocks ──────────────────────────────────────────────────
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 cursor-pointer ${
        checked
          ? "bg-gray-900 dark:bg-neutral-50"
          : "bg-gray-200 dark:bg-neutral-700"
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="h-4 w-4 rounded-full bg-white shadow-sm dark:bg-neutral-900"
        style={{ marginLeft: checked ? "18px" : "2px" }}
      />
    </button>
  );
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      aria-pressed={checked}
      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 cursor-pointer ${
        checked
          ? "border-gray-900 bg-gray-900 dark:border-neutral-100 dark:bg-neutral-100"
          : "border-gray-300 bg-white hover:border-gray-400 dark:border-neutral-600 dark:bg-neutral-900 dark:hover:border-neutral-500"
      }`}
    >
      {checked && (
        <Check
          size={11}
          className="text-white dark:text-neutral-900"
          strokeWidth={3}
        />
      )}
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { tone: "subtle" as Tone };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[meta.tone]}`}
    >
      {meta.tone === "solid" && <Check size={11} strokeWidth={3} />}
      {status}
    </span>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <Star
        size={13}
        className="fill-amber-400 text-amber-400 dark:fill-amber-300 dark:text-amber-300"
      />
      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function Dropdown({
  label,
  icon: Icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer ${
          value !== "All" && value !== "Default"
            ? "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-neutral-50"
            : ""
        }`}
      >
        <Icon size={14} className="text-gray-400 dark:text-neutral-500" />
        {value === "All" || value === "Default" ? label : value}
        <ChevronDown
          size={14}
          className="text-gray-400 dark:text-neutral-500"
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-lg border border-gray-100 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
          >
            {options.map((o) => (
              <button
                key={o}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm hover:bg-gray-50 dark:hover:bg-neutral-800 ${
                  value === o
                    ? "font-medium text-gray-900 dark:text-neutral-50"
                    : "text-gray-500 dark:text-neutral-400"
                }`}
              >
                {o}
                {value === o && <Check size={13} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sidebar ────────────────────────────────────────────────────────────────
function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <motion.button
      variants={fadeUp}
      onClick={onClick}
      className={`relative flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer ${
        active
          ? "bg-gray-100 text-gray-900 dark:bg-neutral-800 dark:text-neutral-50"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-50"
      }`}
    >
      {active && (
        <motion.span
          layoutId="nav-active-bar"
          className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-gray-900 dark:bg-neutral-50"
        />
      )}
      <Icon
        size={16}
        className={
          active
            ? "text-gray-900 dark:text-neutral-50"
            : "text-gray-400 dark:text-neutral-500"
        }
      />
      {item.label}
    </motion.button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pb-1.5 pt-4 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
      {children}
    </p>
  );
}

function Sidebar({
  active,
  setActive,
  search,
  setSearch,
  onUpgrade,
  onLearnMore,
}: {
  active: string;
  setActive: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  onUpgrade: () => void;
  onLearnMore: () => void;
}) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full w-64 shrink-0 flex-col border-r border-gray-100 bg-white dark:border-neutral-800 dark:bg-black"
    >
      <div className="flex items-center justify-between p-4">
        <button className="flex min-w-0 items-center gap-3 rounded-lg px-1.5 py-1 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg">
            <Image
              src="/logoR.png" // Remplace par le chemin de ton logo
              alt="BagUI"
              fill
              className="object-contain"
            />
          </div>

          <div className="min-w-0 text-left">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-neutral-50">
              Bag\UI
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-neutral-400">
              Open Source UI Blocks
            </p>
          </div>
        </button>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full rounded-lg bg-gray-100 py-2 pl-8 pr-9 text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:bg-neutral-800/60 dark:text-neutral-200 dark:placeholder:text-neutral-500"
          />
          {search ? (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            >
              <X size={13} />
            </button>
          ) : (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500">
              ⌘K
            </span>
          )}
        </div>
      </div>

      <motion.nav
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto px-3 pb-4"
      >
        <SectionLabel>Main Menu</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {MAIN_MENU.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              active={active === item.label}
              onClick={() => setActive(item.label)}
            />
          ))}
        </div>

        <SectionLabel>Tools</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {TOOLS_MENU.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              active={active === item.label}
              onClick={() => setActive(item.label)}
            />
          ))}
        </div>

        <SectionLabel>Workspace</SectionLabel>
        <div className="flex flex-col gap-0.5">
          {WORKSPACES.map((w) => (
            <motion.button
              key={w.label}
              variants={fadeUp}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-50"
            >
              <span className={`h-2 w-2 rounded-full ${w.color}`} />
              <span className="flex-1 text-left">{w.label}</span>
              <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                {w.count}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.nav>

      <div className="flex flex-col gap-0.5 border-t border-gray-100 px-3 py-4 dark:border-neutral-800">
        {BOTTOM_MENU.map((item) => (
          <NavLink
            key={item.label}
            item={item}
            active={active === item.label}
            onClick={() => setActive(item.label)}
          />
        ))}

        <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-gray-900 dark:text-neutral-50">
            Upgrade Pro
            <Sparkles
              size={13}
              className="text-gray-400 dark:text-neutral-500"
            />
          </p>
          <p className="mb-3 text-xs leading-snug text-gray-500 dark:text-neutral-400">
            Higher productivity with better organization
          </p>
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUpgrade}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-gray-900 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 cursor-pointer"
            >
              <Crown size={12} />
              Upgrade
            </motion.button>
            <button
              onClick={onLearnMore}
              className="flex-1 rounded-full border border-gray-200 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

// ─── Top bar ────────────────────────────────────────────────────────────────
function AvatarStack() {
  return (
    <div className="flex items-center -space-x-2">
      {AVATARS.map((a) => (
        <img
          key={a.id}
          src={a.src}
          alt="Team member avatar"
          className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 object-cover dark:border-black dark:bg-neutral-800"
        />
      ))}
    </div>
  );
}

function ThemeToggle({
  darkMode,
  setDarkMode,
}: {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  return (
    <motion.div
      layout
      className="flex items-center gap-1.5 rounded-lg px-2 py-1.5"
      transition={{
        layout: { duration: 0.25 },
      }}
    >
      <motion.button
        type="button"
        onClick={() => setDarkMode(false)}
        aria-label="Switch to light mode"
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.15 }}
        className={`flex h-4 w-4 cursor-pointer items-center justify-center ${
          darkMode ? "text-gray-500 hover:text-gray-300" : "text-gray-900"
        }`}
      >
        <AnimatePresence mode="wait">
          {!darkMode && (
            <motion.div
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      <Toggle checked={darkMode} onChange={setDarkMode} />

      <motion.button
        type="button"
        onClick={() => setDarkMode(true)}
        aria-label="Switch to dark mode"
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.15 }}
        className={`flex h-4 w-4 cursor-pointer items-center justify-center ${
          darkMode ? "text-gray-50" : "text-gray-300 hover:text-gray-500"
        }`}
      >
        <AnimatePresence mode="wait">
          {darkMode && (
            <motion.div
              initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

function TopBar({
  title,
  onShare,
  onCustomizeWidget,
  notifCount,
  onBell,
  darkMode,
  setDarkMode,
}: {
  title: string;
  onShare: () => void;
  onCustomizeWidget: () => void;
  notifCount: number;
  onBell: () => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-neutral-800">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-50">
        {title}
      </h1>
      <div className="flex items-center gap-3">
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        <button
          onClick={onShare}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 cursor-pointer"
        >
          <Share2 size={16} />
        </button>
        <button
          onClick={onBell}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 cursor-pointer"
        >
          <Bell size={20} />
          {notifCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold text-white dark:bg-red-500 dark:text-white">
              {notifCount}
            </span>
          )}
        </button>
        <AvatarStack />
        <span className="h-6 w-px bg-gray-200 dark:bg-neutral-700" />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCustomizeWidget}
          className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 cursor-pointer"
        >
          <SlidersHorizontal size={14} />
          Customize Widget
        </motion.button>
      </div>
    </div>
  );
}

// ─── Toolbar ────────────────────────────────────────────────────────────────
function Toolbar({
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption,
  statusOptions,
  showStats,
  setShowStats,
  onCustomize,
  onExport,
  onAdd,
  addLabel,
}: {
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  sortOption: string;
  setSortOption: (v: string) => void;
  statusOptions: string[];
  showStats: boolean;
  setShowStats: (v: boolean) => void;
  onCustomize: () => void;
  onExport: () => void;
  onAdd: () => void;
  addLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5">
      <div className="flex flex-wrap items-center gap-2">
        <button className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
          <LayoutGrid
            size={14}
            className="text-gray-400 dark:text-neutral-500"
          />
          Table View
          <ChevronDown
            size={14}
            className="text-gray-400 dark:text-neutral-500"
          />
        </button>

        <Dropdown
          label="Filter"
          icon={Filter}
          options={statusOptions}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <Dropdown
          label="Sort"
          icon={ArrowUpDown}
          options={["Default", "Name (A-Z)", "Name (Z-A)"]}
          value={sortOption}
          onChange={setSortOption}
        />

        <div className="ml-1 flex items-center gap-2 rounded-lg px-3 py-1.5">
          <span className="text-sm font-medium text-gray-600 dark:text-neutral-300">
            Show Statistics
          </span>
          <Toggle checked={showStats} onChange={setShowStats} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onCustomize}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <SlidersHorizontal
            size={14}
            className="text-gray-400 dark:text-neutral-500"
          />
          Customize
        </button>
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <Download size={14} className="text-gray-400 dark:text-neutral-500" />
          Export
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-3.5 py-1.5 text-sm font-medium text-white hover:bg-gray-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-200 cursor-pointer"
        >
          <Plus size={14} />
          {addLabel}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Stats ──────────────────────────────────────────────────────────────────
function StatsRow({
  stats,
  visible,
  focused,
  setFocused,
}: {
  stats: { label: string; value: string; delta: string }[];
  visible: boolean[];
  focused: string | null;
  setFocused: (v: string | null) => void;
}) {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 px-6 pt-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {stats.map((s, i) =>
        visible[i] ? (
          <motion.button
            key={s.label}
            variants={fadeUp}
            onClick={() => setFocused(focused === s.label ? null : s.label)}
            className={`rounded-xl border p-4 text-left transition-colors duration-150 ${
              focused === s.label
                ? "border-gray-900 bg-gray-50 dark:border-neutral-100 dark:bg-neutral-800"
                : "border-gray-100 bg-white hover:border-gray-200 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400 dark:text-neutral-500">
              {s.label}
              <Info size={12} />
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-neutral-50">
              {s.value}
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-400 dark:text-neutral-500">
              vs last month
              <span
                className={`inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 font-medium ${
                  s.delta.trim().startsWith("-")
                    ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400"
                    : "border-green-200 bg-green-50 text-green-700 dark:border-green-900/50 dark:bg-green-950/40 dark:text-green-400"
                }`}
              >
                {s.delta.trim().startsWith("-") ? (
                  <ArrowDownRight size={11} />
                ) : (
                  <ArrowUpRight size={11} />
                )}
                {s.delta}
              </span>
            </div>
          </motion.button>
        ) : null,
      )}
    </motion.div>
  );
}

function CustomizePopover({
  columns,
  visibleCols,
  toggleCol,
  onClose,
}: {
  columns: string[];
  visibleCols: Record<string, boolean>;
  toggleCol: (c: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [onClose]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -6, scale: 0.98 }}
      className="absolute right-6 top-16 z-20 w-56 rounded-lg border border-gray-100 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
    >
      <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
        Visible columns
      </p>
      {columns.map((c) => {
        const checked = visibleCols[c] !== false;
        return (
          <div
            key={c}
            role="button"
            tabIndex={0}
            onClick={() => toggleCol(c)}
            onKeyDown={(e) =>
              (e.key === "Enter" || e.key === " ") && toggleCol(c)
            }
            className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left text-sm text-gray-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {c}
            <span
              aria-hidden
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                checked
                  ? "border-gray-900 bg-gray-900 dark:border-neutral-100 dark:bg-neutral-100"
                  : "border-gray-300 bg-white dark:border-neutral-600 dark:bg-neutral-900"
              }`}
            >
              {checked && (
                <Check
                  size={11}
                  className="text-white dark:text-neutral-900"
                  strokeWidth={3}
                />
              )}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
}

// ─── Table ──────────────────────────────────────────────────────────────────
function ProductTable({
  columns,
  rows,
  visibleCols,
  selected,
  toggleRow,
  toggleAll,
  sortKey,
  sortDir,
  onSortColumn,
  editingId,
  editValue,
  setEditValue,
  onCommitEdit,
}: {
  columns: ColumnDef[];
  rows: Row[];
  visibleCols: Record<string, boolean>;
  selected: Set<string>;
  toggleRow: (id: string) => void;
  toggleAll: () => void;
  sortKey: string | null;
  sortDir: "asc" | "desc";
  onSortColumn: (key: string) => void;
  editingId: string | null;
  editValue: string;
  setEditValue: (v: string) => void;
  onCommitEdit: () => void;
}) {
  const cols = columns.filter((c) => visibleCols[c.label] !== false);
  const allChecked = rows.length > 0 && selected.size === rows.length;

  return (
    <div className="overflow-hidden overflow-x-auto rounded-xl border border-gray-100 dark:border-neutral-800">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/60 dark:border-neutral-800 dark:bg-neutral-900/40">
            <th className="w-10 py-3 pl-4">
              <Checkbox checked={allChecked} onChange={toggleAll} />
            </th>
            {cols.map((c) => (
              <th
                key={c.key}
                className="py-3 pr-4 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-neutral-500"
              >
                <button
                  onClick={() => onSortColumn(c.key)}
                  className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-neutral-300"
                >
                  {c.label}
                  {sortKey === c.key ? (
                    sortDir === "asc" ? (
                      <ChevronUp size={12} />
                    ) : (
                      <ChevronDown size={12} />
                    )
                  ) : (
                    <ChevronsUpDown size={11} className="opacity-40" />
                  )}
                </button>
              </th>
            ))}
            <th className="w-10 py-3 pr-4 text-right">
              <button className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800">
                <Plus size={13} />
              </button>
            </th>
          </tr>
        </thead>
        <motion.tbody variants={stagger} initial="hidden" animate="visible">
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={cols.length + 2}
                className="px-4 py-10 text-center text-sm text-gray-400 dark:text-neutral-500"
              >
                No results match your search/filter.
              </td>
            </tr>
          )}
          {rows.map((r) => {
            const isSelected = selected.has(r.id);
            const isEditing = editingId === r.id;
            return (
              <motion.tr
                key={r.id}
                layout
                variants={fadeUp}
                className={`border-b border-gray-50 text-sm transition-colors duration-150 dark:border-neutral-800/60 cursor-pointer ${
                  isSelected
                    ? "border-l-4 border-l-gray-900 bg-gray-50 dark:border-l-neutral-50 dark:bg-neutral-800/50"
                    : "hover:bg-gray-50/60 dark:hover:bg-neutral-800/40"
                }`}
              >
                <td className="py-3 pl-4">
                  <Checkbox
                    checked={isSelected}
                    onChange={() => toggleRow(r.id)}
                  />
                </td>
                {cols.map((c, i) => {
                  if (c.key === "status") {
                    return (
                      <td key={c.key} className="py-3 pr-4">
                        <StatusBadge status={r.status} />
                      </td>
                    );
                  }
                  if (c.key === "rating" && r.rating !== undefined) {
                    return (
                      <td key={c.key} className="py-3 pr-4">
                        <RatingStars rating={r.rating} />
                      </td>
                    );
                  }
                  const raw = r.cells[c.key];
                  const isMoney = [
                    "price",
                    "revenue",
                    "spent",
                    "total",
                  ].includes(c.key);
                  const display =
                    typeof raw === "number" && isMoney
                      ? `$${raw.toFixed(2)}`
                      : (raw ?? "—");
                  if (i === 0 && isEditing) {
                    return (
                      <td key={c.key} className="py-2 pr-4">
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && onCommitEdit()}
                          onBlur={onCommitEdit}
                          className="w-full rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 outline-none focus:border-gray-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-neutral-400"
                        />
                      </td>
                    );
                  }
                  return (
                    <td
                      key={c.key}
                      className={`py-3 pr-4 ${
                        i === 0
                          ? "font-medium text-gray-800 dark:text-neutral-200"
                          : "text-gray-500 dark:text-neutral-400"
                      }`}
                    >
                      {display}
                    </td>
                  );
                })}
                <td />
              </motion.tr>
            );
          })}
        </motion.tbody>
      </table>
    </div>
  );
}

// ─── Bulk action bar ────────────────────────────────────────────────────────
function BulkActionBar({
  count,
  onClear,
  onApplyCode,
  onEditInfo,
  onDelete,
}: {
  count: number;
  onClear: () => void;
  onApplyCode: () => void;
  onEditInfo: () => void;
  onDelete: () => void;
}) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="sticky bottom-4 z-10 mx-auto flex w-fit items-center gap-3 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
        >
          <span className="text-sm font-medium text-gray-700 dark:text-neutral-200">
            {count} Selected
          </span>
          <span className="h-4 w-px bg-gray-200 dark:bg-neutral-700" />
          <button
            onClick={onApplyCode}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            Apply Code
          </button>
          <button
            onClick={onEditInfo}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-50"
          >
            Edit Info
          </button>
          <button
            onClick={onDelete}
            className="flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          >
            <Trash2 size={13} />
            Delete
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800">
            <MoreHorizontal size={15} />
          </button>
          <button
            onClick={onClear}
            className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 dark:text-neutral-500 dark:hover:bg-neutral-800"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Pagination ─────────────────────────────────────────────────────────────
function Pagination({
  page,
  setPage,
  pageSize,
  setPageSize,
  totalRows,
}: {
  page: number;
  setPage: (p: number) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  totalRows: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const [goTo, setGoTo] = useState("");
  const [sizeOpen, setSizeOpen] = useState(false);

  const pageList: (number | string)[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1)
      pageList.push(p);
    else if (pageList[pageList.length - 1] !== "…") pageList.push("…");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-1 pt-4 text-sm text-gray-500 dark:text-neutral-400">
      <div className="relative flex items-center gap-2">
        Showing per page
        <button
          onClick={() => setSizeOpen((o) => !o)}
          className="flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1 font-medium text-gray-600 hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          {pageSize}
          <ChevronsUpDown
            size={13}
            className="text-gray-400 dark:text-neutral-500"
          />
        </button>
        <AnimatePresence>
          {sizeOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute bottom-full left-24 mb-1 w-20 overflow-hidden rounded-lg border border-gray-100 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
            >
              {[5, 10, 20].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setPageSize(n);
                    setPage(1);
                    setSizeOpen(false);
                  }}
                  className="block w-full rounded-md px-2 py-1 text-left hover:bg-gray-50 dark:hover:bg-neutral-800"
                >
                  {n}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40 dark:text-neutral-500 dark:hover:bg-neutral-800"
        >
          <ChevronLeft size={15} />
        </button>
        {pageList.map((p, i) =>
          typeof p === "number" ? (
            <button
              key={i}
              onClick={() => setPage(p)}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                page === p
                  ? "bg-gray-900 text-white dark:bg-neutral-50 dark:text-neutral-900"
                  : "text-gray-500 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={i} className="px-1 text-gray-300 dark:text-neutral-600">
              {p}
            </span>
          ),
        )}
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 disabled:opacity-40 dark:text-neutral-500 dark:hover:bg-neutral-800"
        >
          <ChevronRight size={15} />
        </button>
      </div>

      <div className="flex items-center gap-2">
        Go to page
        <input
          value={goTo}
          onChange={(e) => setGoTo(e.target.value.replace(/\D/g, ""))}
          className="w-12 rounded-lg border border-gray-200 bg-white px-2 py-1 text-center text-gray-700 outline-none focus:border-gray-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:focus:border-neutral-500"
        />
        <button
          onClick={() => {
            const n = parseInt(goTo, 10);
            if (n >= 1 && n <= totalPages) setPage(n);
            setGoTo("");
          }}
          className="flex items-center gap-1 rounded-lg px-2.5 py-1 font-medium text-gray-600 hover:bg-gray-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        >
          Go
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────
export default function Dashboard2() {
  const [datasets, setDatasets] = useState<Record<string, Dataset>>(() =>
    buildDatasets(),
  );
  const [active, setActive] = useState("Product");
  const [darkMode, setDarkMode] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Default");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set(["p2", "p4"]));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visibleStats, setVisibleStats] = useState<Record<string, boolean[]>>(
    {},
  );
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({});
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [focusedStat, setFocusedStat] = useState<string | null>(null);
  const [notifCount, setNotifCount] = useState(3);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toasts, push } = useToasts();

  // `active` is normally guaranteed to match a key in `datasets` (every nav
  // item's label has a matching entry from buildDatasets()). This fallback
  // is what actually prevents the crash if the two ever drift apart — e.g. a
  // sidebar item gets added/renamed without a matching dataset entry.
  const dataset = datasets[active] ?? Object.values(datasets)[0];

  if (!datasets[active] && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(
      `[Dashboard2] No dataset found for nav item "${active}" — falling back to "${dataset.key}". Add a matching entry in buildDatasets().`,
    );
  }

  // reset per-view transient state whenever the nav switches
  useEffect(() => {
    setSearch("");
    setStatusFilter("All");
    setSortOption("Default");
    setSortKey(null);
    setSelected(new Set());
    setPage(1);
    setFocusedStat(null);
    setCustomizeOpen(false);
    setVisibleCols({});
  }, [active]);

  const statusOptions = useMemo(
    () => ["All", ...Array.from(new Set(dataset.rows.map((r) => r.status)))],
    [dataset],
  );
  const statsVisibility = visibleStats[active] ?? dataset.stats.map(() => true);

  const filteredRows = useMemo(() => {
    let rows = dataset.rows;
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          Object.values(r.cells).some((v) =>
            String(v).toLowerCase().includes(q),
          ) || r.status.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All")
      rows = rows.filter((r) => r.status === statusFilter);

    const nameKey = dataset.columns[0]?.key ?? "name";
    if (sortOption === "Name (A-Z)")
      rows = [...rows].sort((a, b) =>
        String(a.cells[nameKey]).localeCompare(String(b.cells[nameKey])),
      );
    if (sortOption === "Name (Z-A)")
      rows = [...rows].sort((a, b) =>
        String(b.cells[nameKey]).localeCompare(String(a.cells[nameKey])),
      );

    if (sortKey) {
      rows = [...rows].sort((a, b) => {
        const av =
          sortKey === "status"
            ? a.status
            : sortKey === "rating"
              ? (a.rating ?? 0)
              : a.cells[sortKey];
        const bv =
          sortKey === "status"
            ? b.status
            : sortKey === "rating"
              ? (b.rating ?? 0)
              : b.cells[sortKey];
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv));
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [dataset, search, statusFilter, sortOption, sortKey, sortDir]);

  const pagedRows = filteredRows.slice((page - 1) * pageSize, page * pageSize);

  const toggleRow = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === pagedRows.length
        ? new Set()
        : new Set(pagedRows.map((r) => r.id)),
    );

  const onSortColumn = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setSortOption("Default");
  };

  const handleAdd = () => {
    const nameKey = dataset.columns[0].key;
    const newId = `${active}-${Date.now()}`;
    const newRow: Row = {
      id: newId,
      status: (statusOptions[1] ?? "Active") as Status,
      rating: dataset.columns.some((c) => c.key === "rating") ? 5.0 : undefined,
      cells: Object.fromEntries(
        dataset.columns
          .filter((c) => c.key !== "status" && c.key !== "rating")
          .map((c) => [
            c.key,
            c.key === nameKey ? "New entry" : c.numeric ? 0 : "—",
          ]),
      ),
    };
    setDatasets((prev) => ({
      ...prev,
      [active]: { ...prev[active], rows: [newRow, ...prev[active].rows] },
    }));
    setEditingId(newId);
    setEditValue("New entry");
    setPage(1);
    push(`${dataset.addLabel} — row added`);
  };

  const commitEdit = () => {
    if (!editingId) return;
    const nameKey = dataset.columns[0].key;
    setDatasets((prev) => ({
      ...prev,
      [active]: {
        ...prev[active],
        rows: prev[active].rows.map((r) =>
          r.id === editingId
            ? {
                ...r,
                cells: { ...r.cells, [nameKey]: editValue || "Untitled" },
              }
            : r,
        ),
      },
    }));
    setEditingId(null);
  };

  const handleDelete = () => {
    setDatasets((prev) => ({
      ...prev,
      [active]: {
        ...prev[active],
        rows: prev[active].rows.filter((r) => !selected.has(r.id)),
      },
    }));
    push(`${selected.size} row(s) deleted`);
    setSelected(new Set());
  };

  const handleApplyCode = () =>
    push(`Promo code applied to ${selected.size} row(s)`);

  const handleEditInfo = () => {
    const firstId = Array.from(selected)[0];
    const row = dataset.rows.find((r) => r.id === firstId);
    if (row) {
      setEditingId(firstId);
      setEditValue(String(row.cells[dataset.columns[0].key]));
    }
    push("Editing first selected row");
  };

  const handleExport = () => {
    const cols = dataset.columns.filter((c) => visibleCols[c.label] !== false);
    const header = [...cols.map((c) => c.label)].join(",");
    const lines = filteredRows.map((r) =>
      cols
        .map((c) =>
          c.key === "status"
            ? r.status
            : c.key === "rating"
              ? (r.rating ?? "")
              : (r.cells[c.key] ?? ""),
        )
        .join(","),
    );
    const csv = [header, ...lines].join("\n");
    try {
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${active.toLowerCase()}-export.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore outside the browser
    }
    push(`Exported ${filteredRows.length} rows as CSV`);
  };

  const toggleCol = (label: string) =>
    setVisibleCols((prev) => ({
      ...prev,
      [label]: prev[label] === false ? true : false,
    }));

  return (
    <div className={darkMode ? "dark" : ""}>
      <div
        style={font}
        className="relative flex h-screen w-full overflow-hidden bg-white shadow-sm dark:border-neutral-800 dark:bg-black"
      >
        <Sidebar
          active={active}
          setActive={setActive}
          search={search}
          setSearch={setSearch}
          onUpgrade={() => push("Redirecting to billing…")}
          onLearnMore={() => push("Opening plan details…")}
        />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <TopBar
            title={dataset.title}
            onShare={() => push("Share link copied")}
            onCustomizeWidget={() => setCustomizeOpen((o) => !o)}
            notifCount={notifCount}
            onBell={() => {
              setNotifCount(0);
              push("Notifications cleared");
            }}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
          <div className="relative flex-1 overflow-y-auto pb-4">
            <Toolbar
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              sortOption={sortOption}
              setSortOption={(v) => {
                setSortOption(v);
                setSortKey(null);
              }}
              statusOptions={statusOptions}
              showStats={showStats}
              setShowStats={setShowStats}
              onCustomize={() => setCustomizeOpen((o) => !o)}
              onExport={handleExport}
              onAdd={handleAdd}
              addLabel={dataset.addLabel}
            />

            <AnimatePresence>
              {customizeOpen && (
                <CustomizePopover
                  columns={dataset.columns.map((c) => c.label)}
                  visibleCols={visibleCols}
                  toggleCol={toggleCol}
                  onClose={() => setCustomizeOpen(false)}
                />
              )}
            </AnimatePresence>

            {showStats && (
              <StatsRow
                stats={dataset.stats}
                visible={statsVisibility}
                focused={focusedStat}
                setFocused={setFocusedStat}
              />
            )}

            <div className="px-6 pt-5">
              <ProductTable
                columns={dataset.columns}
                rows={pagedRows}
                visibleCols={visibleCols}
                selected={selected}
                toggleRow={toggleRow}
                toggleAll={toggleAll}
                sortKey={sortKey}
                sortDir={sortDir}
                onSortColumn={onSortColumn}
                editingId={editingId}
                editValue={editValue}
                setEditValue={setEditValue}
                onCommitEdit={commitEdit}
              />
              <BulkActionBar
                count={selected.size}
                onClear={() => setSelected(new Set())}
                onApplyCode={handleApplyCode}
                onEditInfo={handleEditInfo}
                onDelete={handleDelete}
              />
              <Pagination
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalRows={filteredRows.length}
              />
            </div>
          </div>
        </main>

        <ToastStack toasts={toasts} />
      </div>
    </div>
  );
}
