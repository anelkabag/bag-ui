"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Aperture, Asterisk, Settings, Sparkles, type LucideIcon } from "lucide-react";

const HEIGHT = 378;
const RINGS: { color: string; Icon: LucideIcon }[] = [
  { color: "#ff4d1a", Icon: Asterisk },
  { color: "#22c55e", Icon: Aperture },
  { color: "#facc15", Icon: Sparkles },
];

function Ring({
  progress,
  index,
  color,
  Icon,
}: {
  progress: MotionValue<number>;
  index: number;
  color: string;
  Icon: LucideIcon;
}) {
  const v = useTransform(progress, (p) => Math.min(1, Math.max(0, p * 3 - index)));
  const visible = useTransform(v, (x) => (x > 0.001 ? 1 : 0));
  const label = useTransform(v, (x) => `${Math.round(x * 100)}%`);

  return (
    <div
      className="absolute left-2 flex w-12 flex-col items-center gap-1"
      style={{ top: 82 + index * 80 }}
    >
      <div className="relative size-11">
        <svg viewBox="0 0 44 44" className="size-11 -rotate-90">
          <circle cx="22" cy="22" r="19" fill="none" stroke="#2a2a2a" strokeWidth="3.5" />
          <motion.circle
            cx="22"
            cy="22"
            r="19"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ pathLength: v, opacity: visible }}
          />
        </svg>
        <Icon className="absolute inset-0 m-auto size-[18px] text-white" strokeWidth={1.75} />
      </div>
      <motion.span className="text-[11px] font-medium leading-none tabular-nums text-white">
        {label}
      </motion.span>
    </div>
  );
}

export default function ScrollEdgeIndicator() {
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 140, damping: 26, mass: 0.3 });
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rootRef = useRef<HTMLElement>(null);
  const drag = useRef<{ pointer: number; scroll: number; travel: number; max: number } | null>(
    null,
  );
  const [active, setActive] = useState(false);

  useEffect(() => {
    const scroller = document.getElementById("main");
    const root = rootRef.current;
    if (!scroller || !root) return;

    let frame = 0;
    const update = () => {
      const parentH = root.parentElement?.clientHeight ?? scroller.clientHeight;
      const max = scroller.scrollHeight - scroller.clientHeight;
      const p = max > 1 ? Math.min(1, Math.max(0, scroller.scrollTop / max)) : 0;
      const nextScale = Math.min(1, Math.max(0.62, (parentH - 12) / HEIGHT));
      const travel = Math.max(0, parentH - HEIGHT * nextScale);
      raw.set(p);
      scale.set(nextScale);
      if (!drag.current) y.set(p * travel);
      setActive(max > 1);
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
  }, [raw, scale, y]);

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const scroller = document.getElementById("main");
    const root = rootRef.current;
    if (!scroller || !root) return;
    const parentH = root.parentElement?.clientHeight ?? scroller.clientHeight;
    const nextScale = scale.get();
    const travel = Math.max(1, parentH - HEIGHT * nextScale);
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
      aria-label="Scroll progress"
      aria-hidden={!active}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className="absolute top-0 right-0 z-40 h-[378px] w-14 origin-top-right cursor-grab touch-none active:cursor-grabbing"
      style={{
        y,
        scale,
        visibility: active ? "visible" : "hidden",
        pointerEvents: active ? "auto" : "none",
      }}
    >
      <svg viewBox="0 0 56 378" className="absolute inset-0 size-full" aria-hidden>
        <path
          d="M56 0C56 22 44 28 30 32C16 36 8 44 8 66V318C8 330 2 336 2 354A24 24 0 0 0 26 378H56Z"
          fill="#000"
          stroke="#fff"
          strokeOpacity=".14"
        />
      </svg>

      {RINGS.map((r, i) => (
        <Ring key={i} progress={progress} index={i} {...r} />
      ))}

      <button
        type="button"
        aria-label="Back to top"
        onClick={() => document.getElementById("main")?.scrollTo({ top: 0, behavior: "smooth" })}
        className="absolute top-[336px] left-2 flex size-9 items-center justify-center rounded-full bg-white/[0.08] text-white transition-colors hover:bg-white/15"
      >
        <Settings className="size-[18px]" strokeWidth={1.75} />
      </button>
    </motion.aside>
  );
}
