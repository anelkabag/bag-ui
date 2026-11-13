"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BookOpen,
  Contrast,
  History,
  Home,
  LayoutGrid,
  LayoutTemplate,
  Menu,
  PanelLeft,
  Search,
  Tag,
  X,
  type LucideIcon,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "bagui-sidebar-collapsed";

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Blocks", href: "/blocks", icon: LayoutGrid },
  { label: "Templates", href: "/templates", icon: LayoutTemplate },
  { label: "Changelog", href: "/changelog", icon: History },
  { label: "Pricing", href: "/pricing", icon: Tag },
  { label: "Docs", href: "/docs", icon: BookOpen },
];

const EXTERNAL = [
  { label: "X", href: "https://x.com/BagUi_pro" },
  { label: "GitHub", href: "https://github.com/anelkabag/bag-ui" },
  { label: "Support", href: "mailto:anelka.bag@gmail.com" },
];

function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="relative block shrink-0" style={{ width: size, height: size }}>
      <Image src="/logo.png" alt="BagUI" fill priority className="object-contain dark:hidden" />
      <Image src="/logoW.png" alt="BagUI" fill priority className="hidden object-contain dark:block" />
    </span>
  );
}

// ─── Sidebar (desktop) ───────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col transition-[width] duration-300 ease-out md:flex",
        collapsed ? "w-14 items-center py-3.5" : "w-52 px-3 py-3.5",
      )}
    >
      {/* Top: logo + actions */}
      {collapsed ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open sidebar"
          title="Open sidebar (Ctrl+B)"
          className="mb-5 flex size-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          {/* le logo blanc reste lisible sur le rail noir */}
          <Image src="/logoW.png" alt="BagUI" width={20} height={20} className="object-contain" />
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
              title="Browse blocks"
              className="flex size-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
            >
              <Search size={16} />
            </Link>
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              title="Collapse sidebar (Ctrl+B)"
              className="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
            >
              <PanelLeft size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={cn("flex flex-col", collapsed ? "gap-2" : "gap-0.5")}>
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              aria-label={label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center transition-colors",
                collapsed
                  ? "size-9 justify-center rounded-full"
                  : "gap-3 rounded-lg px-2.5 py-1.5 text-[15px]",
                collapsed
                  ? active
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                  : active
                    ? "bg-accent font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-[18px] shrink-0" strokeWidth={1.75} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={cn("mt-auto flex flex-col", collapsed ? "items-center gap-2" : "gap-0.5")}>
        {collapsed ? (
          <>
            <Link
              href="/docs"
              title="Docs"
              aria-label="Docs"
              className="flex size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <BookOpen size={18} strokeWidth={1.75} />
            </Link>
            <a
              href="https://github.com/anelkabag/bag-ui"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              aria-label="GitHub"
              className="flex size-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <FaGithub size={17} />
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              title="Switch theme"
              aria-label="Switch theme"
              className="mt-1 size-7 cursor-pointer rounded-full bg-[conic-gradient(from_200deg,#f97316,#ec4899,#38bdf8,#34d399,#f97316)] ring-2 ring-white/20 transition-transform hover:scale-110"
            />
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
            <div className="mt-3 flex items-center gap-1 px-1 text-muted-foreground">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Switch theme"
                title="Switch theme"
                className="flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
              >
                <Contrast size={17} />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Barre mobile ────────────────────────────────────────────────────────────
function MobileBar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative z-20 border-b border-border bg-sidebar md:hidden">
      <div className="flex h-12 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
          <Logo size={20} /> BagUI
        </Link>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex size-9 items-center justify-center rounded-md hover:bg-accent"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-0.5 border-t border-border p-2">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Icon size={18} strokeWidth={1.75} />
              {label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

// ─── Shell ───────────────────────────────────────────────────────────────────
export default function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Restaure la préférence (après le montage pour éviter un mismatch d'hydratation)
  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        /* stockage indisponible */
      }
      return next;
    });
  }, []);

  // Ctrl/Cmd + B
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    // Le fond n'est visible que lorsque la barre est rétractée (cadre flottant)
    <div className="shell-backdrop fixed inset-0 overflow-hidden">
      <div
        className={cn(
          "flex h-full flex-col transition-[margin,height,border-radius,background-color] duration-300 ease-out md:flex-row",
          collapsed
            ? "md:m-4 md:h-[calc(100%-2rem)] md:rounded-[28px] md:bg-neutral-950 md:shadow-2xl md:ring-1 md:ring-white/10"
            : "bg-sidebar",
        )}
      >
        <MobileBar />
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        <main
          id="main"
          className={cn(
            "relative min-w-0 flex-1 overflow-y-auto overscroll-contain bg-background transition-[margin,border-radius] duration-300 ease-out",
            collapsed
              ? "md:my-1.5 md:mr-1.5 md:rounded-[22px]"
              : "md:mt-1.5 md:rounded-tl-2xl md:border-l md:border-t md:border-border",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}