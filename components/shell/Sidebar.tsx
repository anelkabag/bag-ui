"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { MotionConfig, motion } from "motion/react";
import {
  BookOpen,
  History,
  Home,
  LayoutGrid,
  LayoutTemplate,
  Menu,
  Moon,
  PanelLeft,
  Puzzle,
  Search,
  Sun,
  Tag,
  X,
  Network,
  type LucideIcon,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { setThemeWithTransition } from "@/lib/theme-transition";

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Blocks", href: "/blocks", icon: LayoutGrid },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Changelog", href: "/changelog", icon: History },
  { label: "Sponsor", href: "/sponsor", icon: Tag },
  { label: "Docs", href: "/docs", icon: BookOpen },
];

const EXTERNAL = [
  { label: "X", href: "https://x.com/anelkabag" },
  { label: "GitHub", href: "https://github.com/anelkabag/bag-ui" },
];

const DOC_RESOURCES: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { label: "MCP", href: "/docs#mcp", icon: Network },
  {
    label: "VS Code extension",
    href: "/docs#extension",
    icon: Puzzle,
  },
];

const SUPPORT = { label: "Support", href: "mailto:anelka.bag@gmail.com" };

function Logo({ size = 22 }: { size?: number }) {
  return (
    <span
      className="relative block shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.png"
        alt="BagUI"
        fill
        sizes={`${size}px`}
        priority
        className="object-contain dark:hidden"
      />
      <Image
        src="/logoW.png"
        alt="BagUI"
        fill
        sizes={`${size}px`}
        priority
        className="hidden object-contain dark:block"
      />
    </span>
  );
}

/**
 * Tooltip 100 % CSS (zéro JS, zéro state). Le parent doit avoir
 * `relative group/tip`. Remplace l'attribut `title` natif.
 */
function SideTip({
  label,
  side = "right",
}: {
  label: string;
  side?: "right" | "bottom";
}) {
  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-50 whitespace-nowrap rounded-xl bg-white px-4 py-2.5 text-[15px] font-medium leading-none text-neutral-900 opacity-0 shadow-lg ring-1 ring-black/5 transition duration-150 group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100",
        side === "right"
          ? "left-full top-1/2 ml-3 -translate-y-1/2 -translate-x-1 group-hover/tip:translate-x-0 group-focus-visible/tip:translate-x-0"
          : "left-1/2 top-full mt-2 -translate-x-1/2 translate-y-1 group-hover/tip:translate-y-0 group-focus-visible/tip:translate-y-0",
      )}
    >
      {label}
    </span>
  );
}

function DesktopSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);

  useEffect(() => setThemeMounted(true), []);

  const toggleTheme = () =>
    setThemeWithTransition(
      resolvedTheme === "dark" ? "light" : "dark",
      setTheme,
    );
  const themeActionLabel =
    !themeMounted || resolvedTheme !== "dark"
      ? "Switch to dark mode"
      : "Switch to light mode";
  const ThemeIcon = themeMounted && resolvedTheme === "light" ? Moon : Sun;

  return (
    <aside
      className={cn(
        "relative z-30 hidden shrink-0 flex-col transition-[width] duration-300 ease-out md:flex",
        collapsed ? "w-14 items-center py-3.5" : "w-52 px-3 py-3.5",
      )}
    >
      {collapsed ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open sidebar"
          className="group/tip relative mb-5 flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <Image
            src="/logoW.png"
            alt="BagUI"
            width={20}
            height={20}
            className="object-contain"
          />
          <SideTip label="Open sidebar" />
        </button>
      ) : (
        <div className="mb-6 flex items-center justify-between px-1">
          <Link href="/" aria-label="BagUI home">
            <Logo size={24} />
          </Link>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Link
              href="/blocks"
              aria-label="Browse blocks"
              className="group/tip relative flex size-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
            >
              <Search size={16} />
              <SideTip label="Browse blocks" side="bottom" />
            </Link>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              className="group/tip relative flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
            >
              <PanelLeft size={16} />
              <SideTip label="Collapse sidebar" side="bottom" />
            </button>
          </div>
        </div>
      )}

      <MotionConfig reducedMotion="user">
        <nav
          aria-label="Main navigation"
          className={cn("flex flex-col", collapsed ? "gap-2" : "gap-0.5")}
        >
          {NAV.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/tip relative isolate flex items-center transition-colors",
                  collapsed
                    ? "size-9 justify-center rounded-full"
                    : "gap-3 rounded-lg px-2.5 py-1.5 text-[15px]",
                  collapsed
                    ? active
                      ? "text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                    : active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="sidebar-active-nav"
                    initial={false}
                    className={cn(
                      "pointer-events-none absolute inset-0 z-0",
                      collapsed
                        ? "rounded-full bg-white/15"
                        : "rounded-lg bg-accent",
                    )}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 36,
                      mass: 0.75,
                    }}
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className="relative z-10 size-[18px] shrink-0"
                  strokeWidth={1.75}
                />
                {!collapsed && <span className="relative z-10">{label}</span>}
                {collapsed && <SideTip label={label} />}
              </Link>
            );
          })}
        </nav>
      </MotionConfig>

      <div
        className={cn(
          "mt-auto flex flex-col",
          collapsed ? "items-center gap-2" : "gap-0.5",
        )}
      >
        {collapsed ? (
          <>
            <Link
              href="/docs"
              aria-label="Docs"
              className="group/tip relative flex size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <BookOpen size={18} strokeWidth={1.75} />
              <SideTip label="Docs" />
            </Link>
            {DOC_RESOURCES.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className="group/tip relative flex size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Icon size={18} strokeWidth={1.75} />
                <SideTip label={label} />
              </Link>
            ))}
            <a
              href="https://github.com/anelkabag/bag-ui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="group/tip relative flex size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FaGithub size={17} />
              <SideTip label="GitHub" />
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={themeActionLabel}
              className="group/tip relative mt-1 flex size-9 cursor-pointer items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <ThemeIcon size={18} />
              <SideTip label={themeActionLabel} />
            </button>
          </>
        ) : (
          <>
            {EXTERNAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="rounded-lg px-2.5 py-1.5 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
            {DOC_RESOURCES.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="rounded-lg px-2.5 py-1.5 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
            <a
              href={SUPPORT.href}
              className="rounded-lg px-2.5 py-1.5 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {SUPPORT.label}
            </a>
            <div className="mt-3 flex items-center gap-1 px-1 text-muted-foreground">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={themeActionLabel}
                className="group/tip relative flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
              >
                <ThemeIcon size={17} />
                <SideTip label={themeActionLabel} />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative z-20 border-b border-border bg-sidebar md:hidden">
      <div className="flex h-12 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <Logo size={20} /> BagUI
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-9 items-center justify-center rounded-md hover:bg-accent"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <MotionConfig reducedMotion="user">
          <nav
            aria-label="Main navigation"
            className="flex flex-col gap-0.5 border-t border-border p-2"
          >
            {NAV.map(({ label, href, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative isolate flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] transition-colors",
                    active
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="mobile-sidebar-active-nav"
                      initial={false}
                      className="pointer-events-none absolute inset-0 z-0 rounded-lg bg-accent"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 36,
                        mass: 0.75,
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <Icon
                    className="relative z-10 size-[18px]"
                    strokeWidth={1.75}
                  />
                  <span className="relative z-10">{label}</span>
                </Link>
              );
            })}
            {DOC_RESOURCES.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="relative isolate flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="size-[18px]" strokeWidth={1.75} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </MotionConfig>
      )}
    </div>
  );
}

export default function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <MobileSidebar />
      <DesktopSidebar collapsed={collapsed} onToggle={onToggle} />
    </>
  );
}