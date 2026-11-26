"use client";

import { useEffect, useId, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Geometry (isometric disc)                                          */
/* ------------------------------------------------------------------ */
const CX = 498;
const CY = 381;
const K = 0.567; // vertical flattening
const R = 395; // disc radius
const D = 75; // disc thickness
const RING = 265; // module ring radius
const SPEED = 360 / 40; // deg / s  → 1 turn every 40s

const f = (n: number) => n.toFixed(1);

const plateMatrix = (th: number) => {
  const r = (th * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  const a = c, b = K * s, cc = -s / K, d = c;
  return `matrix(${a} ${b} ${cc} ${d} ${CX - a * CX - cc * CY} ${CY - b * CX - d * CY})`;
};

const modTransform = (angle: number, th: number) => {
  const t = ((angle + th) * Math.PI) / 180;
  return `translate(${f(CX + RING * Math.cos(t))} ${f(CY + K * RING * Math.sin(t))})`;
};

const ribPath = (th: number) => {
  let p = "";
  for (let ang = 3 + (th % 4); ang < 179; ang += 4) {
    const t = (ang * Math.PI) / 180;
    const x = CX + R * Math.cos(t);
    const y = CY + K * R * Math.sin(t);
    p += `M${f(x)} ${f(y + 5)}V${f(y + D - 4)}`;
  }
  return p;
};

const CORE_RIBS =
  "M563.6 364.9V382.9M562 370.1V388.1M559.2 375V393M555.2 379.7V397.7M550 384V402M543.8 387.9V405.9M536.8 391.3V409.3M529 394V412M520.6 396.2V414.2M511.7 397.6V415.6M502.6 398.3V416.3M493.4 398.3V416.3M484.3 397.6V415.6M475.4 396.2V414.2M467 394V412M459.2 391.3V409.3M452.2 387.9V405.9M446 384V402M440.8 379.7V397.7M436.8 375V393M434 370.1V388.1M432.4 364.9V382.9";

const GEAR =
  "M15.8 -2.3L15.8 2.3L11.6 3L10.3 6.1L12.8 9.6L9.6 12.8L6.1 10.3L3 11.6L2.3 15.8L-2.3 15.8L-3 11.6L-6.1 10.3L-9.6 12.8L-12.8 9.6L-10.3 6.1L-11.6 3L-15.8 2.3L-15.8 -2.3L-11.6 -3L-10.3 -6.1L-12.8 -9.6L-9.6 -12.8L-6.1 -10.3L-3 -11.6L-2.3 -15.8L2.3 -15.8L3 -11.6L6.1 -10.3L9.6 -12.8L12.8 -9.6L10.3 -6.1L11.6 -3ZM5.5 0A5.5 5.5 0 1 0 -5.5 0A5.5 5.5 0 1 0 5.5 0Z";

const ICO = "#9a9a9a";

const Gear = ({ sy }: { sy: number }) => (
  <path d={GEAR} fill={ICO} fillRule="evenodd" transform={`scale(1.25 ${sy})`} />
);

const MODULES: { a: number; icon: React.ReactNode }[] = [
  { a: -112, icon: <Gear sy={0.82} /> },
  { a: -69, icon: <path fill={ICO} d="M0-11A16 11 0 1 0 16 0H0Z" /> },
  { a: -25, icon: <path fill={ICO} d="M3-12-9 2h7l-3 10L11-2H4z" transform="scale(1.2 .75)" /> },
  {
    a: 22,
    icon: (
      <>
        <path fill={ICO} d="M0-10 16-3 0 4-16-3Z" />
        <path d="M-16 2 0 9 16 2" stroke={ICO} strokeWidth={2.4} />
      </>
    ),
  },
  { a: 66, icon: <path d="M-6-5-13 0-6 5M6-5 13 0 6 5M3-8-3 8" stroke={ICO} strokeWidth={2.4} /> },
  {
    a: 111,
    icon: (
      <>
        <Gear sy={0.78} />
        <rect x={-10} y={-6} width={20} height={12} rx={2} fill="#0d0d0d" transform="rotate(-8)" />
        <rect x={-6} y={-3} width={12} height={6} rx={1} stroke={ICO} strokeWidth={1.8} transform="rotate(-8)" />
      </>
    ),
  },
  { a: 157, icon: <Gear sy={0.8} /> },
  {
    a: 204,
    icon: (
      <g transform="scale(1 .72)" fill={ICO}>
        <path d="M-4 -14c-6 0-10 3-10 7-4 1-6 4-6 8s3 7 7 7c1 4 5 6 9 5V-14Zm8 0c6 0 10 3 10 7 4 1 6 4 6 8s-3 7-7 7c-1 4-5 6-9 5V-14Z" />
        <path d="M-11 -1h6M5 -1h7M-8 6h5M4 6h4M-1 -14V13" stroke="#0d0d0d" strokeWidth={2.2} />
      </g>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */
const Corners = () => (
  <>
    <span className="absolute -left-px -top-px z-[3] h-3 w-3 border-l-2 border-t-2 border-[#8a8a8a]" />
    <span className="absolute -right-px -top-px z-[3] h-3 w-3 border-r-2 border-t-2 border-[#8a8a8a]" />
    <span className="absolute -bottom-px -left-px z-[3] h-3 w-3 border-b-2 border-l-2 border-[#8a8a8a]" />
    <span className="absolute -bottom-px -right-px z-[3] h-3 w-3 border-b-2 border-r-2 border-[#8a8a8a]" />
  </>
);

const dots =
  "bg-[radial-gradient(#2e2e2e_1px,transparent_1.2px)] bg-[length:4px_4px]";
const btn =
  "inline-flex items-center justify-center rounded-[3px] bg-[#f3f3f3] font-medium text-[#111]";

/* ------------------------------------------------------------------ */
/*  Disc illustration                                                  */
/* ------------------------------------------------------------------ */
function NodeDisc() {
  const uid = useId().replace(/:/g, "");
  const plateRef = useRef<SVGGElement>(null);
  const ribsRef = useRef<SVGPathElement>(null);
  const modRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let t0: number | null = null;

    const frame = (ts: number) => {
      if (t0 === null) t0 = ts;
      const th = (((ts - t0) / 1000) * SPEED) % 360;
      plateRef.current?.setAttribute("transform", plateMatrix(th));
      ribsRef.current?.setAttribute("d", ribPath(th));
      modRefs.current.forEach((el, i) =>
        el?.setAttribute("transform", modTransform(MODULES[i].a, th)),
      );
      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  const ln = { stroke: "#4a4a4a", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };

  return (
    <svg viewBox="0 0 602 645" fill="none" className="absolute left-0 top-0 h-[645px] w-[602px]">
      <defs>
        <linearGradient id={`beam-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#fff6b0" />
          <stop offset=".35" stopColor="#f6cd1a" />
          <stop offset="1" stopColor="#f6cd1a" stopOpacity=".85" />
        </linearGradient>
        <linearGradient id={`glow-${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#f6cd1a" stopOpacity=".55" />
          <stop offset=".6" stopColor="#f6cd1a" stopOpacity=".12" />
          <stop offset="1" stopColor="#f6cd1a" stopOpacity="0" />
        </linearGradient>
        <filter id={`blur-${uid}`} x="-200%" y="-20%" width="500%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* callout */}
      <text x="85" y="122" fontFamily="Geist, sans-serif" fontSize="14.5" fill="#e6e6e6">
        <tspan fill="#f6cd1a">Insight Node</tspan> : Turns scattered
      </text>
      <text x="85" y="146" fontFamily="Geist, sans-serif" fontSize="14.5" fill="#e6e6e6">
        data into clear, predictive insights.
      </text>

      {/* disc body */}
      <path d="M893 381A395 224 0 0 1 103 381V456A395 224 0 0 0 893 456Z" fill="#0b0b0b" stroke="#6b6b6b" strokeWidth={1.3} />
      <path ref={ribsRef} d={ribPath(0)} stroke="#6e6e6e" strokeWidth={1.4} />
      <ellipse cx={CX} cy={CY} rx={395} ry={224} fill="#0d0d0d" stroke="#707070" strokeWidth={1.4} />

      {/* rotating plate */}
      <g ref={plateRef} transform={plateMatrix(0)}>
        <ellipse cx={CX} cy={CY} rx={382} ry={216.6} {...ln} strokeDasharray="6 5" />
        <ellipse cx={CX} cy={CY} rx={366} ry={207.5} {...ln} />
        <path {...ln} d="M498 310.7L498 173.5M498 451.3L498 588.5M403 335.8L217.6 247.6M603.2 343.7L808.4 271M600.8 420.3L801.4 497M392 381L135 381" />
      </g>

      {/* modules */}
      {MODULES.map((m, i) => (
        <g
          key={m.a}
          ref={(el) => {
            modRefs.current[i] = el;
          }}
          transform={modTransform(m.a, 0)}
        >
          {m.icon}
        </g>
      ))}

      {/* active wedge */}
      <path
        d="M241.3 526.5A363 205.8 0 0 1 135 381L378 381A120 68 0 0 0 413.1 429.1Z"
        fill="#3b3410"
        stroke="#f6cd1a"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />

      {/* inner rings */}
      <ellipse cx={CX} cy={CY} rx={120} ry={68} {...ln} />
      <ellipse cx={CX} cy={CY} rx={100} ry={56.7} {...ln} strokeDasharray="6 5" />

      {/* Axiom core */}
      <path d="M564 357A66 37.4 0 0 1 432 357V381A66 37.4 0 0 0 564 381Z" fill="#0b0b0b" stroke="#6b6b6b" strokeWidth={1.2} />
      <path d={CORE_RIBS} stroke="#6e6e6e" strokeWidth={1.4} />
      <ellipse cx={CX} cy={357} rx={66} ry={37.4} fill="#0d0d0d" stroke="#7a7a7a" strokeWidth={1.3} />
      <ellipse cx={CX} cy={357} rx={52} ry={29.5} {...ln} />
      <text
        transform="translate(498 357) rotate(33) skewX(-18)"
        textAnchor="middle"
        dy="4"
        fontFamily="Geist, sans-serif"
        fontSize="12.5"
        fill="#b5b5b5"
        letterSpacing=".3"
      >
        Axiom Core
      </text>

      {/* coin */}
      <ellipse cx={257} cy={440} rx={57} ry={31} stroke="#8a7a2a" strokeWidth={1.2} strokeDasharray="4 3" />
      <path d="M209 423A48 26 0 0 1 305 423V436A48 26 0 0 1 209 436Z" fill="#c9a40e" stroke="#2a2408" strokeWidth={1} />
      <path
        d="M211 428V437M216 433V443M222 437V447M229 440V450M237 442V452M245 444V454M253 445V455M261 445V455M269 444V454M277 442V452M285 440V450M292 437V447M298 433V443M303 428V437"
        stroke="#5a4a08"
        strokeWidth={1.4}
      />
      <ellipse cx={257} cy={423} rx={48} ry={26} fill="#f6cd1a" stroke="#fff3a0" strokeWidth={1} />
      <ellipse cx={257} cy={423} rx={38} ry={20} stroke="#2a2408" strokeWidth={2.2} />
      <path d="M240 418l22-6 4 4-22 6zM248 428l24-7 3 4-24 7z" fill="#151103" />

      {/* light beam */}
      <g>
        <animate attributeName="opacity" values="1;.6;1" dur="2.4s" repeatCount="indefinite" />
        <rect x={243} y={190} width={28} height={230} fill={`url(#glow-${uid})`} filter={`url(#blur-${uid})`} />
        <rect x={254.5} y={180} width={5} height={240} fill={`url(#beam-${uid})`} filter={`url(#blur-${uid})`} opacity={0.8} />
      </g>
      <rect x={255.8} y={178} width={2.4} height={242} fill={`url(#beam-${uid})`} />
      <path d="M253 180 257 170 261 180Z" fill="#f6cd1a" />
      <ellipse cx={257} cy={412} rx={14} ry={6} fill="#fff8c4" filter={`url(#blur-${uid})`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export default function AindeskHero() {
  return (
    <div className="min-h-screen bg-[#0b0b0b] pt-3 font-['Geist',system-ui,sans-serif] text-[#f2f2f2] antialiased">
      <div className="relative mx-auto max-w-[1354px] border-x border-dashed border-[#333] pb-10 max-[520px]:mx-4">
        {/* NAV */}
        <header className="relative flex h-[76px] items-center border-y border-dashed border-[#333] px-[30px] max-[520px]:px-3.5">
          <Corners />
          <a href="#" className="flex items-center gap-1.5 text-[29px] font-medium tracking-[-0.4px] max-[520px]:text-2xl">
            <svg viewBox="0 0 38 30" fill="#fff" className="h-[30px] w-[38px]">
              <path d="M13 9C6 9 1 13.6 1 19.5S6 30 13 30c3 0 5.4-1 7-2.6V30h6V5h-6v6.6C18.4 10 16 9 13 9Zm.8 6c3.2 0 5.6 2 5.6 4.5S17 24 13.8 24 8 22 8 19.5 10.6 15 13.8 15Z" />
              <path d="M28 0h6v4h-6zM28 12c0-2 2-3.6 4.6-3.6C35.5 8.4 37 10.6 37 13.6V30h-6V15c0-1-.5-1.6-1.5-1.6S28 14 28 15V30z" />
            </svg>
            aindesk
          </a>

          <nav className="absolute left-1/2 flex -translate-x-1/2 gap-[17px] text-[15.5px] text-[#bdbdbd] max-[1100px]:hidden">
            <a href="#" className="flex items-center gap-1.5 transition-colors hover:text-white">
              Solutions
              <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-2.5 w-2.5">
                <path d="M2 3.5 5 6.5 8 3.5" />
              </svg>
            </a>
            {["Platform", "Docs", "Pricing", "Resources"].map((l) => (
              <a key={l} href="#" className="transition-colors hover:text-white">
                {l}
              </a>
            ))}
          </nav>

          <div className="-mr-px ml-auto flex items-center gap-[17px] text-base">
            <a href="#" className="max-[520px]:hidden">Sign in</a>
            <a href="#" className={`${btn} h-[46px] px-4 text-base`}>Get Started</a>
          </div>
        </header>

        {/* HERO */}
        <section className="relative grid h-[720px] grid-cols-[679px_1fr] border-b border-dashed border-[#333] max-[1100px]:h-auto max-[1100px]:grid-cols-1">
          <div className="relative flex flex-col border-r border-dashed border-[#333] max-[1100px]:border-r-0">
            <div className={`h-[37px] border-b border-dashed border-[#333] ${dots}`} />
            <div className="flex-1 px-[30px] pt-[130px] max-[1100px]:px-6 max-[1100px]:py-[70px]">
              <div className="flex items-center gap-2 font-['Geist_Mono',monospace] text-[15px] tracking-[0.3px] text-[#e9e9e9]">
                <i className="h-3.5 w-3.5 rounded-full bg-[#f6cd1a]" />
                SCALABLE BY DESIGN
              </div>
              <h1 className="mt-4 text-[54px] font-semibold leading-[61px] tracking-[-1.2px] max-[1100px]:text-[40px] max-[1100px]:leading-[46px]">
                Build Your Own
                <br />
                <span className="text-[#f6cd1a]">Intelligence Network</span>
              </h1>
              <p className="mt-[17px] max-w-[520px] text-lg leading-[27px] text-[#bdbdbd]">
                Activate intelligent modules that analyze, predict, and act — keeping your entire network in sync with zero manual control
              </p>
              <div className="mt-[52px] flex items-center gap-[18px]">
                <a href="#" className={`${btn} h-14 px-3.5 text-lg`}>Start Building</a>
                <a href="#" className="flex items-center gap-2 text-base font-medium">
                  View Node Network
                  <svg viewBox="0 0 9 12" fill="none" stroke="#fff" strokeWidth={2} className="h-3 w-[9px]">
                    <path d="M2 1.5 6.5 6 2 10.5" />
                  </svg>
                </a>
              </div>
            </div>
            <div className={`h-10 border-t border-dashed border-[#333] ${dots}`} />
          </div>

          <div className="relative overflow-hidden max-[1100px]:h-[560px] max-[1100px]:border-t max-[1100px]:border-dashed max-[1100px]:border-[#333]">
            <svg
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              viewBox="0 0 675 720"
              fill="none"
              stroke="#333"
              strokeDasharray="5 5"
            >
              <path d="M0 0 35 37M675 0 637 37M0 720 35 682M675 720 637 682" />
            </svg>
            <div className="absolute bottom-[38px] left-[35px] right-[38px] top-[37px] overflow-hidden border border-dashed border-[#333]">
              <NodeDisc />
            </div>
          </div>
        </section>

        {/* LOGOS (placeholder brands) */}
        <section className="relative grid h-[82px] grid-cols-4 items-center justify-items-center border-b border-dashed border-[#333] text-[#a9a9a9] max-[1100px]:h-auto max-[1100px]:grid-cols-2 max-[1100px]:gap-y-6 max-[1100px]:py-6">
          <Corners />
          <div className="flex items-center gap-2 text-[21px] font-medium tracking-[1.5px]">
            <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth={2.4}>
              <circle cx="17" cy="17" r="14" />
              <path d="M11 23V11l6 8 6-8v12" />
            </svg>
            NOVA
          </div>
          <div className="flex items-center">
            <svg width="130" height="32" viewBox="0 0 130 32">
              <rect width="130" height="32" fill="currentColor" />
              <text x="65" y="25" textAnchor="middle" fontFamily="Geist, sans-serif" fontWeight="700" fontSize="24" letterSpacing="10" fill="#0b0b0b">
                KITE
              </text>
            </svg>
          </div>
          <div className="flex items-center gap-2 text-xl tracking-[-0.3px]">
            <svg width="46" height="32" viewBox="0 0 46 32" fill="none" stroke="currentColor" strokeWidth={2.4}>
              <ellipse cx="23" cy="16" rx="21" ry="12" transform="rotate(-18 23 16)" />
              <path d="M15 21 31 10" />
            </svg>
            <b className="font-semibold">orbit</b>
            <span className="font-normal">labs</span>
          </div>
          <div className="flex items-center gap-2 text-[26px] font-semibold tracking-[-0.3px]">
            <svg width="30" height="32" viewBox="0 0 30 32" fill="currentColor">
              <path d="M15 0 30 5v12c0 8-6 13-15 15C6 30 0 25 0 17V5z" />
              <path d="M8 11l7 12 7-12" stroke="#0b0b0b" strokeWidth={3} fill="none" />
            </svg>
            fieldwave
          </div>
        </section>
      </div>
    </div>
  );
}