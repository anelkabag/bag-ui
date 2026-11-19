"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue } from "framer-motion";
import { Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const HEIGHT = 136;
const TOP_INSET = 76;
const BOTTOM_INSET = 20;

function formatTime(date: Date) {
  const hours = date.getHours() % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export default function ScrollEdgeIndicator() {
  const { user, profile } = useAuth();
  const y = useMotionValue(TOP_INSET);
  const scale = useMotionValue(1);
  const rootRef = useRef<HTMLElement>(null);
  const drag = useRef<{ pointer: number; scroll: number; travel: number; max: number } | null>(
    null,
  );
  const [time, setTime] = useState("--:--");
  const [online, setOnline] = useState(true);

  const avatar =
    profile?.avatar_url ||
    (typeof user?.user_metadata?.avatar_url === "string" ? user.user_metadata.avatar_url : "") ||
    (typeof user?.user_metadata?.picture === "string" ? user.user_metadata.picture : "");
  const label =
    profile?.username ||
    (typeof user?.user_metadata?.username === "string" ? user.user_metadata.username : "") ||
    user?.email ||
    "";
  const initial = label.trim().charAt(0).toUpperCase();

  useEffect(() => {
    const tick = () => setTime(formatTime(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    const scroller = document.getElementById("main");
    const root = rootRef.current;
    if (!scroller || !root) return;

    let frame = 0;
    const update = () => {
      const parentH = root.parentElement?.clientHeight ?? scroller.clientHeight;
      const max = scroller.scrollHeight - scroller.clientHeight;
      const p = max > 1 ? Math.min(1, Math.max(0, scroller.scrollTop / max)) : 0;
      const available = Math.max(HEIGHT * 0.72, parentH - TOP_INSET - BOTTOM_INSET);
      const nextScale = Math.min(1, available / HEIGHT);
      const travel = Math.max(0, parentH - TOP_INSET - BOTTOM_INSET - HEIGHT * nextScale);
      scale.set(nextScale);
      if (!drag.current) y.set(TOP_INSET + p * travel);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    scroller.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    const ro = new ResizeObserver(onScroll);
    ro.observe(scroller);
    if (scroller.firstElementChild) ro.observe(scroller.firstElementChild);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro.disconnect();
    };
  }, [scale, y]);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a, button")) return;
    const scroller = document.getElementById("main");
    const root = rootRef.current;
    if (!scroller || !root) return;
    const parentH = root.parentElement?.clientHeight ?? scroller.clientHeight;
    const nextScale = scale.get();
    const travel = Math.max(1, parentH - TOP_INSET - BOTTOM_INSET - HEIGHT * nextScale);
    const max = scroller.scrollHeight - scroller.clientHeight;
    if (max <= 1) return;
    drag.current = { pointer: event.clientY, scroll: scroller.scrollTop, travel, max };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const state = drag.current;
    const scroller = document.getElementById("main");
    if (!state || !scroller) return;
    const dy = event.clientY - state.pointer;
    scroller.scrollTop = state.scroll + (dy / state.travel) * state.max;
  };

  const endDrag = () => {
    drag.current = null;
  };

  return (
    <motion.aside
      ref={rootRef}
      aria-label={`${time}, ${online ? "online" : "offline"}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="absolute top-0 right-3 z-30 w-[52px] origin-top cursor-grab touch-none text-foreground active:cursor-grabbing"
      style={{ y, scale, height: HEIGHT }}
    >
      <div className="flex h-full flex-col items-center">
        <Link
          href={user ? "/account" : "/login"}
          aria-label={user ? "Account" : "Sign in"}
          className="relative size-11 shrink-0 rounded-full bg-foreground p-[3px]"
        >
          <span className="flex size-full items-center justify-center overflow-hidden rounded-full bg-neutral-950 text-[13px] font-semibold text-white">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="size-full object-cover" />
            ) : (
              initial || <span className="size-3.5 rounded-full bg-sky-400" />
            )}
          </span>
        </Link>

        <time
          dateTime={time}
          className="mt-2.5 text-center text-[15px] font-semibold leading-none tracking-[-0.04em] tabular-nums"
        >
          {time}
        </time>

        <div
          className={`mt-2.5 flex size-11 shrink-0 flex-col items-center justify-center rounded-full border-[1.75px] border-current ${
            online ? "" : "opacity-45"
          }`}
          title={online ? "Connected" : "No connection"}
        >
          {online ? (
            <Wifi className="size-[15px]" strokeWidth={2.4} />
          ) : (
            <WifiOff className="size-[15px]" strokeWidth={2.4} />
          )}
          <span className="mt-[3px] flex items-center gap-[3px]" aria-hidden>
            <span className="size-[3px] rounded-full bg-current" />
            <span className="size-[3px] rounded-full bg-current" />
            <span className="size-[3px] rounded-full bg-current" />
          </span>
        </div>
      </div>
    </motion.aside>
  );
}
