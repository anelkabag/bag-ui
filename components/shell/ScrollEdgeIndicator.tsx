"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Aperture, Asterisk, Settings, Sparkles, type LucideIcon } from "lucide-react";

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

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      raw.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      ro.disconnect();
    };
  }, [raw]);

  return (
    <aside
      aria-label="Scroll progress"
      className="pointer-events-none fixed right-0 top-1/2 z-50 h-[378px] w-14 -translate-y-1/2"
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
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="pointer-events-auto absolute left-2 top-[336px] flex size-9 items-center justify-center rounded-full bg-white/[0.08] text-white transition-colors hover:bg-white/15"
      >
        <Settings className="size-[18px]" strokeWidth={1.75} />
      </button>
    </aside>
  );
}