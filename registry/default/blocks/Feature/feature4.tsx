"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";

/* ---------- Shared class tokens ---------- */
const card = "relative overflow-hidden rounded-[20px] bg-white dark:bg-[#1f1f23]";
const pill = "bg-[#f1f1f2] dark:bg-[#2a2a2f]";
const subtle = "text-[10px] text-[#a3a3aa]";
const title = "text-[12.5px] font-medium";

/* ---------- Animated number (starts when scrolled into view) ---------- */
function useInView<T extends HTMLElement>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function Counter({
  to,
  suffix,
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  return (
    <span ref={ref} className={className}>
      <NumberFlow
        value={inView ? to : 0}
        suffix={suffix}
        format={{ useGrouping: false }}
        transformTiming={{ duration: 1100, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        spinTiming={{ duration: 1100, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      />
    </span>
  );
}

/* ---------- Icons ---------- */
const BagUIMark = () => (
  <Image src="/logo.png" alt="BagUI logo" width={20} height={20} className="h-5 w-5 object-contain" priority />
);

const ReactIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <g stroke="#2bb4d6" strokeWidth="0.9">
      <ellipse cx="7" cy="7" rx="6" ry="2.3" />
      <ellipse cx="7" cy="7" rx="6" ry="2.3" transform="rotate(60 7 7)" />
      <ellipse cx="7" cy="7" rx="6" ry="2.3" transform="rotate(120 7 7)" />
    </g>
    <circle cx="7" cy="7" r="1.1" fill="#2bb4d6" />
  </svg>
);

const NextIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <circle cx="7" cy="7" r="6.2" className="fill-black dark:fill-white" />
    <path d="M5 4.4v5.2M5 4.4l4.2 5.2M9 4.4v3.2" fill="none" strokeWidth="1.1" strokeLinecap="round" className="stroke-white dark:stroke-black" />
  </svg>
);

const TailwindIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
    <path
      fill="#38bdf8"
      d="M12 6c-2.667 0-4.333 1.333-5 4 1-1.333 2.167-1.833 3.5-1.5.761.19 1.305.742 1.913 1.358C13.403 10.864 14.55 12 17 12c2.667 0 4.333-1.333 5-4-1 1.333-2.167 1.833-3.5 1.5-.761-.19-1.305-.742-1.913-1.358C15.597 7.136 14.45 6 12 6zm-5 6c-2.667 0-4.333 1.333-5 4 1-1.333 2.167-1.833 3.5-1.5.761.19 1.305.742 1.913 1.358C8.403 16.864 9.55 18 12 18c2.667 0 4.333-1.333 5-4-1 1.333-2.167 1.833-3.5 1.5-.761-.19-1.305-.742-1.913-1.358C10.597 13.136 9.45 12 7 12z"
    />
  </svg>
);

const KeyboardIcon = () => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" aria-hidden>
    <rect width="16" height="10" rx="2.2" />
    <g className="fill-white dark:fill-[#1f1f23]">
      <rect x="2" y="2.2" width="2" height="1.4" rx=".4" />
      <rect x="5" y="2.2" width="2" height="1.4" rx=".4" />
      <rect x="8" y="2.2" width="2" height="1.4" rx=".4" />
      <rect x="11" y="2.2" width="3" height="1.4" rx=".4" />
      <rect x="4" y="6" width="8" height="1.4" rx=".4" />
    </g>
  </svg>
);

/* ---------- Cards ---------- */
function RegistryCard() {
  const [enabled, setEnabled] = useState(true);

  return (
    <section className={`${card} flex min-h-[340px] flex-col justify-between md:col-start-1 md:row-span-3 md:row-start-1 md:min-h-[430px]`}>
      {/* faint grid in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[55%] w-[70%] bg-[linear-gradient(#f1ece8_1px,transparent_1px),linear-gradient(90deg,#f1ece8_1px,transparent_1px)] bg-[length:44px_44px] opacity-90 [-webkit-mask-image:radial-gradient(circle_at_100%_0,#000,transparent_70%)] [mask-image:radial-gradient(circle_at_100%_0,#000,transparent_70%)] dark:opacity-10"
      />

      <div className="relative px-5 pt-5">
        <div className="grid size-[38px] place-items-center rounded-[10px] bg-gradient-to-br from-[#ff8a3d] to-[#f0541a] shadow-[0_4px_10px_rgba(240,84,26,0.28)]">
          <BagUIMark />
        </div>
        <h2 className="mb-3.5 mt-[62px] text-[14.5px] font-medium tracking-tight">shadcn/ui registry</h2>
        <p className="text-xs leading-[1.65] text-[#8b8b92]">
          Add any block to your project through the shadcn/ui registry. The code lives in your repo, so you can
          customize everything.
        </p>
      </div>

      <div className="relative mt-auto flex items-center justify-between border-t border-[#f1f1f2] px-4 pb-3.5 pt-3.5 dark:border-[#2a2a2f]">
        <button
          type="button"
          className={`inline-flex items-center gap-[7px] rounded-full px-3 py-2 text-[11.5px] font-medium ${pill} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0541a]`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="#f0541a" aria-hidden>
            <rect x="1" y="2" width="9" height="4" rx="1.2" />
            <rect x="6" y="9" width="9" height="4" rx="1.2" opacity=".75" />
          </svg>
          Explore blocks
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Enable animations"
          onClick={() => setEnabled((v) => !v)}
          className={`relative h-[22px] w-10 rounded-full ${pill} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0541a]`}
        >
          <span
            className={`absolute left-[3px] top-[3px] size-4 rounded-full transition-all duration-200 ${
              enabled ? "translate-x-[18px] bg-[#f0541a]" : "bg-[#a3a3aa]"
            }`}
          />
        </button>
      </div>
    </section>
  );
}

function StackCard() {
  return (
    <section className={`${card} flex items-center justify-between px-4 py-3 md:col-start-2 md:row-start-1`}>
      <div>
        <div className={title}>Works with your stack</div>
        <div className={`mt-[5px] ${subtle}`}>React, Next.js, Tailwind CSS</div>
      </div>
      <div className="flex" aria-hidden>
        {[ReactIcon, NextIcon, TailwindIcon].map((Icon, i) => (
          <span
            key={i}
            className={`grid size-[26px] place-items-center rounded-full border-2 border-[#f1ece8] bg-white shadow-[0_0_0_1px_#fff] dark:border-[#2a2a2f] dark:bg-[#1f1f23] dark:shadow-none ${i > 0 ? "-ml-1.5" : ""}`}
          >
            <Icon />
          </span>
        ))}
      </div>
    </section>
  );
}

function BlocksCard() {
  return (
    <section className={`${card} flex min-h-[190px] flex-col p-4 md:col-start-2 md:row-start-2`}>
      <div className="flex items-baseline justify-between">
        <span className={title}>Blocks</span>
        <span className="text-[10px] text-[#f08a5c]">Handcrafted</span>
      </div>
      <div className={`mt-[5px] ${subtle}`}>UI library</div>

      <Counter to={30} className="my-auto block py-[18px] pb-3 text-[56px] font-medium leading-none tracking-[-0.04em]" />

      <div className={`flex justify-between ${subtle}`}>
        <span>Hero to footer</span>
        <b className="font-medium text-[#0c0c0d] dark:text-zinc-100">Plug and ship</b>
      </div>
    </section>
  );
}

function OpenSourceCard() {
  return (
    <section className={`${card} flex min-h-[280px] flex-col justify-between px-5 py-[18px] md:col-start-3 md:row-span-2 md:row-start-1`}>
      {/* dotted pattern in the top-right corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[65%] w-[80%] bg-[radial-gradient(#d9d9de_1.1px,transparent_1.3px)] bg-[length:7px_7px] [-webkit-mask-image:radial-gradient(circle_at_100%_0,#000,transparent_72%)] [mask-image:radial-gradient(circle_at_100%_0,#000,transparent_72%)] dark:opacity-30"
      />
      <Counter to={100} suffix="%" className="relative block text-[52px] font-medium leading-none tracking-[-0.04em]" />
      <div className="relative">
        <h3 className={`mb-[9px] ${title}`}>Open source</h3>
        <p className="max-w-[190px] text-[11px] leading-[1.6] text-[#8b8b92]">
          Open source and built together. Read the code, customize it, and contribute on GitHub.
        </p>
      </div>
    </section>
  );
}

function CopyPasteCard() {
  return (
    <section className={`${card} flex items-center justify-between gap-3 py-3 pl-3 pr-4 md:col-span-2 md:col-start-2 md:row-start-3`}>
      <div className="flex min-w-0 items-center gap-3.5">
        <span className={`grid h-6 w-8 flex-none place-items-center rounded-md text-[#f0541a] ${pill}`} aria-hidden>
          <KeyboardIcon />
        </span>
        <div className="min-w-0">
          <div className={title}>Copy and paste</div>
          <div className={`mt-[5px] truncate max-md:whitespace-normal ${subtle}`}>
            Copy a block, paste it, customize it.
          </div>
        </div>
      </div>

      <div className="flex flex-none items-center gap-2">
        <kbd className={`rounded-full px-4 py-[9px] font-sans text-xs font-medium tracking-wider ${pill}`}>⌘ + C</kbd>
        <span className="text-[11px] font-medium">+</span>
        <kbd className={`grid size-8 place-items-center rounded-full font-sans text-[11px] font-medium text-[#f0541a] ${pill}`}>V</kbd>
      </div>
    </section>
  );
}

/* ---------- Page ---------- */
export default function FeaturesSection4() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#ebebec] px-5 py-12 font-sans text-[#0c0c0d] antialiased dark:bg-[#111113] dark:text-zinc-100">
      <header className="mb-[34px] text-center">
        <h1 className="text-[28px] font-medium tracking-tight">Ship production-ready UI faster</h1>
        <p className="mx-auto mt-2.5 max-w-[380px] text-[12.5px] leading-[1.55] text-[#8b8b92]">
          Handcrafted React and shadcn/ui sections that you can plug in, customize, and ship with confidence.
        </p>
      </header>

      <div className="grid w-full max-w-[880px] grid-cols-1 gap-1.5 rounded-[26px] border-2 border-[#fafafa] bg-[#f4f4f5] p-1.5 md:grid-cols-3 md:grid-rows-[auto_1fr_auto] dark:border-[#232327] dark:bg-[#1a1a1d]">
        <RegistryCard />
        <StackCard />
        <BlocksCard />
        <OpenSourceCard />
        <CopyPasteCard />
      </div>
    </main>
  );
}