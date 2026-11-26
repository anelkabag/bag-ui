"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Halftone globe settings                                            */
/* ------------------------------------------------------------------ */
const GAP = 7; // grid spacing
const TOP = 405; // y of the globe's top edge
const RAD = 560; // globe radius
const MAXR = 2.75; // max dot radius

// animation strength
const TWINKLE = 0.28; // per-dot shimmer
const WAVE = 0.16; // ripple spreading from the top
const PULSE = 0.75; // energy pulses travelling down the beam

type RGB = [number, number, number];
const DARK_GREY: RGB = [70, 62, 52];
const DARK_ORANGE: RGB = [226, 140, 24];
const DARK_GOLD: RGB = [255, 190, 52];
const LIGHT_GREY: RGB = [150, 142, 132];
const LIGHT_ORANGE: RGB = [176, 96, 12];
const LIGHT_GOLD: RGB = [140, 88, 6];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const colorOf = (I: number, grey: RGB, orange: RGB, gold: RGB) => {
  const [c1, c2, t]: [RGB, RGB, number] =
    I < 0.45 ? [grey, orange, I / 0.45] : [orange, gold, (I - 0.45) / 0.55];
  return `rgba(${Math.round(lerp(c1[0], c2[0], t))},${Math.round(lerp(c1[1], c2[1], t))},${Math.round(
    lerp(c1[2], c2[2], t),
  )},${lerp(0.55, 1, I).toFixed(2)})`;
};

type Dot = { x: number; y: number; I: number; beam: number; dist: number; dy: number; ph: number; sp: number };

function HalftoneGlobe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let dark = root.classList.contains("dark");
    const palette = () =>
      dark
        ? { grey: DARK_GREY, orange: DARK_ORANGE, gold: DARK_GOLD }
        : { grey: LIGHT_GREY, orange: LIGHT_ORANGE, gold: LIGHT_GOLD };
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;

    let W = 0;
    let H = 0;
    let dots: Dot[] = [];
    let raf = 0;

    const build = () => {
      const dpr = window.devicePixelRatio || 1;
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cx = W / 2;
      const cy = TOP + RAD;
      const x0 = cx - Math.floor(cx / GAP) * GAP;
      dots = [];

      for (let y = TOP + 2; y < H; y += GAP) {
        for (let x = x0; x < W; x += GAP) {
          const nx = (x - cx) / RAD;
          const ny = (y - cy) / RAD;
          const r2 = nx * nx + ny * ny;
          if (r2 >= 1) continue;
          const nz = Math.sqrt(1 - r2);

          const lam = Math.max(0, -ny * 0.92 + nz * 0.12);
          const light = Math.pow(lam, 6);
          const rim = Math.pow(1 - nz, 2.2);
          const dx = x - cx;
          const dy = y - TOP;
          const beam = Math.exp(-(dx * dx) / (2 * 9 * 9)) * Math.exp(-dy / 190);
          const hot = Math.exp(-(dx * dx) / (2 * 95 * 95)) * Math.exp(-dy / 45);

          let I = light * (0.4 + rim * 1.3) + beam * 0.75 + hot * 0.75 + rim * 0.38 + 0.07;
          const fade = Math.min(1, Math.max(0, (H - y) / 90));
          I = Math.min(1, I * fade);
          if (I < 0.03) continue;

          dots.push({
            x,
            y,
            I,
            beam: Math.exp(-(dx * dx) / (2 * 7 * 7)) * fade,
            dist: Math.hypot(dx, dy),
            dy,
            ph: Math.random() * Math.PI * 2,
            sp: 1.2 + Math.random() * 2.2,
          });
        }
      }
    };

    const draw = (t: number) => {
      const { grey, orange, gold } = palette();
      ctx.clearRect(0, 0, W, H);
      const pulseY = (t * 140) % 420;
      const pulseY2 = (t * 140 + 210) % 420;

      for (const d of dots) {
        const tw = Math.sin(t * d.sp + d.ph);
        const wave = Math.sin(d.dist / 38 - t * 2.4);
        // modulation weighted by brightness → the yellow dots move most
        let I = d.I * (1 + d.I * (TWINKLE * tw + WAVE * wave));
        if (d.beam > 0.05) {
          const p =
            Math.exp(-((d.dy - pulseY) ** 2) / 500) + Math.exp(-((d.dy - pulseY2) ** 2) / 500);
          I += p * d.beam * PULSE;
        }
        I = Math.min(1, Math.max(0, I));

        const r = MAXR * Math.pow(I, 0.7);
        if (r < 0.35) continue;
        ctx.fillStyle = colorOf(I, grey, orange, gold);
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    build();

    const theme = new MutationObserver(() => {
      dark = root.classList.contains("dark");
    });
    theme.observe(root, { attributes: true, attributeFilter: ["class"] });

    const ro = new ResizeObserver(() => {
      build();
      if (reduce) draw(0);
    });
    ro.observe(cv);

    if (reduce) {
      draw(0);
    } else {
      const loop = (ms: number) => {
        draw(ms / 1000);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      theme.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-[2] h-full w-full" />;
}

/* ------------------------------------------------------------------ */
/*  Pieces                                                             */
/* ------------------------------------------------------------------ */
const navLink = "transition-colors duration-200 hover:text-neutral-950 dark:hover:text-white";

const Pill = ({ label, dot, className }: { label: string; dot: string; className: string }) => (
  <span
    className={`absolute z-[4] inline-flex h-8 items-center gap-2.5 whitespace-nowrap rounded-2xl border border-neutral-200 bg-white pl-[15px] pr-[17px] text-[12.5px] font-medium tracking-[0.1px] text-neutral-800 dark:border-[#383838] dark:bg-[#151515] dark:text-[#f4f4f4] ${className}`}
  >
    <i className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
    {label}
  </span>
);

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export default function InferaHero() {
  return (
    <section className="relative h-[736px] overflow-hidden bg-white font-['Geist',system-ui,sans-serif] text-neutral-950 antialiased dark:bg-[#1a1a1a] dark:text-[#f4f4f4]">
      {/* glow behind the globe */}
      <div className="pointer-events-none absolute left-1/2 top-[372px] z-[1] h-[150px] w-[520px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(196,120,16,.22)_0%,rgba(196,120,16,.08)_40%,transparent_70%)] blur-[18px] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,170,40,.32)_0%,rgba(255,150,30,.12)_40%,transparent_70%)]" />
      <HalftoneGlobe />

      {/* NAV */}
      <header className="relative z-[5] flex h-14 items-center justify-between px-[46px] max-[860px]:px-4">
        <ul className="flex list-none gap-[25px] text-[12.5px] text-neutral-500 max-[860px]:hidden dark:text-[#a3a3a3]">
          <li>
            <a href="#" className="text-neutral-950 dark:text-white">Home</a>
          </li>
          <li>
            <a href="#" className={navLink}>Enterprise AI</a>
          </li>
          <li>
            <a href="#" className={navLink}>Industries</a>
          </li>
        </ul>

        <a
          href="#"
          className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-[15.5px] font-medium tracking-[-0.2px] max-[860px]:static max-[860px]:translate-x-0"
        >
          <Image src="/logo.png" alt="BagUi" width={21} height={21} className="h-[21px] w-[21px] object-contain dark:hidden" priority />
          <Image src="/logoW.png" alt="" aria-hidden width={21} height={21} className="hidden h-[21px] w-[21px] object-contain dark:block" priority />
          BagUi
        </a>

        <div className="mr-1 flex items-center gap-[25px]">
          <ul className="flex list-none gap-[25px] text-[12.5px] text-neutral-500 max-[860px]:hidden dark:text-[#a3a3a3]">
            <li>
              <a href="#" className={navLink}>Resources</a>
            </li>
            <li>
              <a href="#" className={navLink}>Contact</a>
            </li>
          </ul>
          <a
            href="#"
            className="inline-flex h-[31px] items-center rounded-2xl border border-neutral-300 bg-white px-3 text-[11.5px] font-medium text-neutral-950 transition-colors duration-200 hover:border-neutral-500 dark:border-[#4a4a4a] dark:bg-[#141414] dark:text-white dark:hover:border-[#777]"
          >
            Request a Demo
          </a>
        </div>
      </header>

      {/* COPY */}
      <div className="relative z-[4] mt-[75px] text-center">
        <h1 className="text-[46px] font-medium leading-[50px] tracking-[-1.5px] max-[860px]:px-4 max-[860px]:text-4xl max-[860px]:leading-10 max-[860px]:tracking-[-1px]">
          Transform Your <span className="text-neutral-400 dark:text-[#6f6f6f]">Enterprise</span>
          <br />
          <span className="text-neutral-400 dark:text-[#6f6f6f]">with AI</span> Intelligence
        </h1>
        <p className="mx-auto mt-5 max-w-[440px] text-[13px] leading-5 text-neutral-500 max-[860px]:px-4 dark:text-[#a8a8a8]">
          Leverage automation, analytics, and adaptive intelligence to streamline operations, reduce costs, and unlock new
          opportunities.
        </p>
        <a
          href="#"
          className="mt-[21px] inline-flex h-[38px] items-center rounded-[7px] bg-neutral-950 px-[21px] text-sm font-medium text-white transition-transform duration-200 hover:-translate-y-px dark:bg-white dark:text-[#111]"
        >
          Explore Solutions
        </a>
      </div>

      {/* PILLS */}
      <Pill label="AI AUTOMATION" dot="#5ee04a" className="left-[calc(50%+288px)] top-[340px] max-[860px]:left-auto max-[860px]:right-4" />
      <Pill label="SCALE FASTER" dot="#f6b13a" className="left-[calc(50%-390px)] top-[410px] max-[860px]:left-4" />
      <Pill label="SMART ANALYTICS" dot="#8b4dff" className="left-[calc(50%+62px)] top-[578px] max-[860px]:left-1/2 max-[860px]:-translate-x-1/2" />
    </section>
  );
}