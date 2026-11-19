"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/shell/Sidebar";
import ScrollEdgeIndicator from "@/components/shell/ScrollEdgeIndicator";

const STORAGE_KEY = "bagui-sidebar-collapsed";

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
        <Sidebar collapsed={collapsed} onToggle={toggle} />

        <div
          className={cn(
            "relative min-h-0 min-w-0 flex-1 overflow-hidden transition-[margin,border-radius] duration-300 ease-out",
            collapsed
              ? "md:my-1.5 md:mr-1.5 md:rounded-[22px]"
              : "md:mt-1.5 md:rounded-tl-2xl",
          )}
        >
          <main
            id="main"
            className={cn(
              "h-full overflow-y-auto overscroll-contain bg-background [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              collapsed
                ? ""
                : "md:border-l md:border-t md:border-border",
            )}
          >
            {children}
          </main>
          <ScrollEdgeIndicator />
        </div>
      </div>
    </div>
  );
}