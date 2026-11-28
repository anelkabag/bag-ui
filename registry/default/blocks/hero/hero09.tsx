"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/*  Tiles config (per-tile colors, edge glow, side fade, animation)    */
/* ------------------------------------------------------------------ */
type Tile = { bg: string; bgDark: string; edge: string; mask?: string; delay: string; dur?: string };

const TILES: Tile[] = [
  {
    bg: "rgba(255,255,255,.72)",
    bgDark: "rgba(8,8,8,.7)",
    edge: "linear-gradient(to right,transparent 30%,rgba(255,170,100,.55))",
    mask: "linear-gradient(to right,transparent,#000 70%)",
    delay: "-1.2s",
  },
  {
    bg: "rgba(255,248,242,.9)",
    bgDark: "rgba(8,8,8,.86)",
    edge: "conic-gradient(from 180deg at 50% 50%,rgba(255,160,90,.55),rgba(255,255,255,.08) 25%,rgba(255,255,255,.04) 50%,rgba(255,255,255,.08) 75%,rgba(255,160,90,.55))",
    delay: "-4s",
    dur: "9s",
  },
  {
    bg: "rgba(255,255,255,.72)",
    bgDark: "rgba(8,8,8,.7)",
    edge: "linear-gradient(to left,transparent 30%,rgba(255,170,100,.55))",
    mask: "linear-gradient(to left,transparent,#000 70%)",
    delay: "-2.6s",
  },
  {
    bg: "rgba(255,236,220,.55)",
    bgDark: "rgba(10,8,7,.45)",
    edge: "linear-gradient(to right,transparent 20%,rgba(255,150,80,.6))",
    mask: "linear-gradient(to right,transparent 0%,#000 60%)",
    delay: "-5.5s",
  },
  {
    bg: "rgba(255,255,255,.92)",
    bgDark: "rgba(7,7,7,.9)",
    edge: "linear-gradient(to bottom,rgba(255,160,90,.6),rgba(255,255,255,.06) 40%,transparent)",
    delay: "-0.4s",
    dur: "9s",
  },
  {
    bg: "rgba(255,236,220,.55)",
    bgDark: "rgba(10,8,7,.45)",
    edge: "linear-gradient(to left,transparent 20%,rgba(255,150,80,.6))",
    mask: "linear-gradient(to left,transparent 0%,#000 60%)",
    delay: "-3.3s",
  },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* ring = 1px border (static warm edge + scrolling light), halo = soft 3px band following the light */
const ringBase =
  "pointer-events-none absolute inset-0 rounded-[inherit] [mask:linear-gradient(#000_0_0)_content-box_exclude,linear-gradient(#000_0_0)] animate-[border-run_var(--dur,7s)_linear_infinite] [animation-delay:var(--delay,0s)] motion-reduce:animate-none";

function GlassTile({ bg, bgDark, edge, mask, delay, dur }: Tile) {
  const style = {
    "--tile-bg": bg,
    "--tile-bg-dark": bgDark,
    "--edge": edge,
    "--delay": delay,
    "--dur": dur ?? "7s",
    maskImage: mask,
    WebkitMaskImage: mask,
  } as CSSProperties;

  return (
    <div style={style} className="h9-tile relative rounded-md">
      <span
        className={`${ringBase} p-px [background:conic-gradient(from_var(--a),transparent_0deg_250deg,rgba(255,140,70,.45)_300deg,#ffe3c2_350deg,transparent_360deg),var(--edge)]`}
      />
      <span
        className={`${ringBase} p-[3px] opacity-[.55] [background:conic-gradient(from_var(--a),transparent_0deg_270deg,rgba(255,150,80,.7)_345deg,transparent_360deg)]`}
      />
    </div>
  );
}

const navLink =
  "flex items-center gap-1.5 text-neutral-700 transition-colors duration-200 hover:text-neutral-950 dark:text-[#e9e9e9] dark:hover:text-white";

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */
export default function UsersHero() {
  return (
    <section className="users-hero relative isolate min-h-[760px] overflow-hidden bg-[#fff7f2] pb-12 font-['Inter',system-ui,sans-serif] text-neutral-950 antialiased [line-height:normal] dark:bg-[#050505] dark:text-[#f5f5f5] sm:min-h-[900px] lg:min-h-[1048px]">
      <style>{`
        @property --a { syntax: "<angle>"; initial-value: 0deg; inherits: false; }
        @keyframes border-run { to { --a: 360deg; } }
        .users-hero {
          background:
            radial-gradient(48% 42% at 92% 104%, rgba(255,174,85,.7) 0%, rgba(251,138,53,.35) 28%, transparent 72%),
            radial-gradient(55% 48% at 58% 108%, rgba(249,135,58,.45) 0%, rgba(236,100,38,.18) 45%, transparent 78%),
            radial-gradient(42% 58% at 0% 64%, rgba(206,74,28,.22) 0%, transparent 72%),
            #fff7f2;
        }
        .dark .users-hero {
          background:
            radial-gradient(48% 42% at 92% 104%, #ffae55 0%, #fb8a35 28%, rgba(240,105,40,.65) 55%, transparent 82%),
            radial-gradient(55% 48% at 58% 108%, #f9873a 0%, rgba(236,100,38,.85) 35%, rgba(190,60,22,.35) 65%, transparent 85%),
            radial-gradient(42% 58% at 0% 64%, rgba(206,74,28,.9) 0%, rgba(165,46,18,.6) 40%, rgba(90,22,10,.25) 68%, transparent 88%),
            radial-gradient(40% 48% at 100% 62%, rgba(214,86,32,.75) 0%, rgba(150,48,20,.35) 45%, transparent 80%),
            #050505;
        }
        .h9-tile {
          background: linear-gradient(160deg, rgba(255,255,255,.7) 0%, rgba(255,255,255,.28) 40%, rgba(255,180,120,.12) 100%), var(--tile-bg);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.7), 0 0 0 1px rgba(0,0,0,.06);
        }
        .dark .h9-tile {
          background: linear-gradient(160deg, rgba(255,255,255,.045) 0%, rgba(255,255,255,.012) 40%, rgba(0,0,0,.25) 100%), var(--tile-bg-dark);
          box-shadow: inset 0 0 0 1px rgba(255,255,255,.06), 0 0 0 1px rgba(0,0,0,.6);
        }
      `}</style>

      {/* film grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[.1] mix-blend-multiply dark:opacity-[.16] dark:mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />

      {/* TILE GRID */}
      <div className="pointer-events-none absolute left-1/2 top-20 z-[1] grid w-[min(1472px,calc(100%-1rem))] -translate-x-1/2 grid-cols-[1fr_2fr_1fr] grid-rows-[150px_140px] gap-1 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,.35)_0%,#000_22%,#000_72%,transparent_100%)] sm:top-[110px] sm:grid-rows-[220px_200px] lg:top-[130px] lg:w-[min(1472px,calc(100%-2rem))] lg:grid-rows-[310px_300px]">
        {TILES.map((t, i) => (
          <GlassTile key={i} {...t} />
        ))}
      </div>

      {/* NAV */}
      <header className="relative z-[5] mx-auto flex h-16 max-w-[1472px] items-center justify-between px-4 sm:h-20 sm:px-8 lg:px-[104px]">
        <a href="#" className="flex items-center gap-[9px] text-xl font-medium tracking-[-0.5px] sm:text-2xl">
          <Image src="/logo.png" alt="BagUi" width={28} height={28} className="h-7 w-7 object-contain dark:hidden" priority />
          <Image src="/logoW.png" alt="" aria-hidden width={28} height={28} className="hidden h-7 w-7 object-contain dark:block" priority />
          BagUi
        </a>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-[25px] text-[15px] font-medium lg:flex">
          <a href="#" className={navLink}>Features</a>
          <a href="#" className={navLink}>Docs</a>
          <a href="#" className={navLink}>Pricing</a>
          <a href="#" className={navLink}>
            Company
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-3 w-3">
              <path d="M3 4.5 6 7.5 9 4.5" />
            </svg>
          </a>
        </nav>
        <a
          href="#"
          className="inline-flex h-[30px] items-center rounded-md bg-neutral-950 px-3 text-[15px] font-medium text-white dark:bg-white dark:text-[#111]"
        >
          Log in
        </a>
      </header>

      {/* CONTENT */}
      <div className="relative z-[4] px-4 pt-16 text-center sm:pt-24 lg:pt-[116px]">
        <h1 className="text-[32px] font-medium leading-[36px] tracking-[-0.8px] sm:text-[44px] sm:leading-[48px] lg:text-[56px] lg:leading-[54px] lg:tracking-[-1.1px]">
          The smart way to manage
          <br />
          and track your users
        </h1>
        <p className="mx-auto mt-4 max-w-[500px] text-[15px] leading-6 text-neutral-600 sm:mt-[22px] sm:text-[17px] dark:text-[#b4b4b4]">
          We provide an all-in-one solution for integrating user login, control, and management, making it easy to handle
          everything from access to user tracking.
        </p>
        <a
          href="#"
          className="mt-5 inline-flex h-[38px] items-center rounded-md bg-neutral-950 px-[9px] text-base font-medium text-white transition-transform duration-200 hover:-translate-y-px sm:mt-[26px] dark:bg-white dark:text-[#111]"
        >
          Get started for free
        </a>

        {/* testimonial */}
        <div className="mt-10 sm:mt-16">
          <div className="font-['JetBrains_Mono',monospace] text-[17px] font-bold tracking-[0.5px] text-neutral-800 sm:text-[19px] dark:text-[#cfcfcf]">
            ant<span className="font-medium text-neutral-400 dark:text-[#9a9a9a]">wire</span>
          </div>
          <p className="mx-auto mt-3 max-w-[330px] px-2 text-[15px] leading-[21px] text-neutral-800 dark:text-[#e6e6e6]">
            “We&apos;ve seen real improvements in our sales process thanks to BagUi. It&apos;s intuitive and effective”
          </p>
          <div className="mt-3 inline-flex items-center gap-2.5 text-[15px] text-neutral-500 dark:text-[#8f8f8f]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/avatar.jpeg"
              alt=""
              className="h-10 w-10 rounded-full bg-[#b6a59a] object-cover"
            />
            Anelka Bag, Founder
          </div>
        </div>

        <div className="mt-10 text-[15px] font-medium text-neutral-900 sm:mt-[68px] dark:text-[#f2f2f2]">
          Trusted by teams at the world&apos;s leading companies.
        </div>

        {/* LOGOS */}
        <div className="mx-auto mt-6 flex w-full max-w-[772px] flex-wrap items-center justify-center gap-x-8 gap-y-6 px-2 text-neutral-950 sm:mt-[34px] sm:justify-between dark:text-white">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
            <path d="M15 3v24M3 15h24M6.5 6.5l17 17M23.5 6.5l-17 17" />
          </svg>

          <div className="flex items-center gap-2 whitespace-nowrap text-[19px] font-semibold tracking-[-0.4px]">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <circle cx="14" cy="14" r="12" />
              <path d="M8 17c2-6 10-6 12 0M10 12c1.5-2 6.5-2 8 0" />
            </svg>
            logoipsum
          </div>

          <svg width="30" height="28" viewBox="0 0 30 28" fill="currentColor">
            <path d="M0 0h8l12 15V0h10v28h-8L10 13v15H0z" />
            <path d="M20 0h10v8z" />
          </svg>

          <svg width="58" height="24" viewBox="0 0 58 24" fill="currentColor">
            <path d="M8 0h10L10 24H0zM24 0h10L26 24H16zM40 0h18l-8 24H32z" />
          </svg>

          <svg width="44" height="30" viewBox="0 0 44 30" fill="none" stroke="currentColor" strokeWidth={2}>
            <ellipse cx="22" cy="15" rx="20" ry="13" />
            <ellipse cx="22" cy="15" rx="14" ry="8.5" />
            <ellipse cx="22" cy="15" rx="8" ry="4.5" />
          </svg>

          <div className="flex items-center gap-[7px] whitespace-nowrap">
            <svg width="32" height="32" viewBox="0 0 32 32">
              <clipPath id="bagui-ball">
                <circle cx="16" cy="16" r="15" />
              </clipPath>
              <g clipPath="url(#bagui-ball)" fill="currentColor">
                <rect y="1" width="32" height="4" />
                <rect y="8" width="32" height="4" />
                <rect y="15" width="32" height="4" />
                <rect y="22" width="32" height="4" />
                <rect y="29" width="32" height="4" />
              </g>
            </svg>
            <div className="font-['Playfair_Display',serif] font-semibold italic leading-none">
              <div className="text-[19px]">Logoipsum</div>
              <div className="mt-px text-[11px]">Brand Standard</div>
            </div>
          </div>

          <div className="flex items-center gap-[7px] whitespace-nowrap">
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="15" cy="15" r="13" />
              <ellipse cx="15" cy="15" rx="5.5" ry="13" />
              <path d="M2 15h26" />
            </svg>
            <div className="text-[15px] font-semibold leading-[15px] tracking-[-0.3px]">
              logo—
              <br />
              ipsum
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
