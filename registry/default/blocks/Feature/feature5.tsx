// components/BentoKeyBenefits.tsx
// Next.js (App Router) + Tailwind CSS (v3 ou v4). Server component : aucun hook, pas de "use client".
//
// Polices (app/layout.tsx) :
//   import { Inter, JetBrains_Mono } from "next/font/google";
//   const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
//   const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
//   <body className={`${inter.variable} ${mono.variable} font-[family-name:var(--font-inter)]`}>

import type { ReactNode } from "react";

/* ---------- Icônes ---------- */
const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "size-[13px]",
} as const;

const SearchIcon = () => (
  <svg {...iconProps}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);
const BellIcon = () => (
  <svg {...iconProps}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);
const UserIcon = () => (
  <svg {...iconProps} className="size-[11px]">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

/* ---------- Briques réutilisables ---------- */
function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <article
      className={`relative overflow-hidden rounded-3xl border border-[#e3e3e3] bg-[#efefef] p-6 dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
    >
      {children}
    </article>
  );
}

function CardCopy({ title, text, className = "" }: { title: string; text: string; className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-2 text-lg font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="max-w-[300px] text-sm leading-[1.45] text-neutral-500 dark:text-neutral-400">{text}</p>
    </div>
  );
}

function Float({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`absolute z-10 border border-neutral-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.07)] dark:border-neutral-700 dark:bg-neutral-800 ${className}`}
    >
      {children}
    </div>
  );
}

function Phone({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute h-[420px] w-[236px] overflow-hidden rounded-[38px] border-[6px] border-neutral-900 bg-white text-[10px] [mask-image:linear-gradient(#000_62%,transparent_100%)] dark:border-neutral-600 dark:bg-neutral-800 ${className}`}
    >
      <div className="absolute left-1/2 top-2 h-[19px] w-[62px] -translate-x-1/2 rounded-xl bg-neutral-900 dark:bg-neutral-600" />
      <div className="flex h-[34px] items-center justify-between px-[18px] pt-[11px] text-[10.5px] font-semibold">
        <span>9:41</span>
        <span className="flex items-center gap-[3px]">
          <i className="block h-[7px] w-3 rounded-[2px] bg-current" />
          <i className="block h-2 w-4 rounded-[3px] bg-current" />
        </span>
      </div>
      <div className="px-3.5 py-2">{children}</div>
    </div>
  );
}

function NavBar({ title }: { title?: string }) {
  return (
    <div className="mb-2.5 mt-1.5 flex items-center justify-between text-[11px] font-semibold">
      <span>{title}</span>
      <span className="flex gap-[9px]">
        <SearchIcon />
        <BellIcon />
      </span>
    </div>
  );
}

function AccountCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl border border-neutral-200 bg-white p-[9px] shadow-sm dark:border-neutral-700 dark:bg-neutral-800 ${className}`}>
      <div className="flex w-full items-center gap-1.5 rounded-lg border border-neutral-200 px-[7px] py-1.5 text-[9.5px] font-medium dark:border-neutral-700">
        <UserIcon />
        Adrian’s Account
        <em className="ml-auto not-italic text-neutral-400">···</em>
      </div>
      <div className="mb-0.5 mt-2.5 text-[8.5px] text-neutral-500">Available balance</div>
      <div className="text-[21px] font-semibold tracking-[-0.02em]">
        <small className="mr-[3px] text-[15px]">£</small>500,00
      </div>
      <div className="mt-[9px] flex gap-[5px]">
        {["+ Top up", "⇄ Transfer", "◎ Exchange"].map((b) => (
          <span key={b} className="flex-1 whitespace-nowrap rounded-[7px] border border-neutral-200 py-[5px] text-center text-[8.5px] font-medium dark:border-neutral-700">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Composant principal ---------- */
export default function FeaturesSection5() {
  return (
    <section className="mx-auto max-w-[1020px] px-4 py-14 text-neutral-950 sm:px-6 dark:text-neutral-100">
      <header className="mb-10 text-center">
        <div className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.06em]">
          Key benefits
        </div>
        <h2 className="mb-2 mt-3.5 text-[clamp(30px,4.4vw,42px)] font-bold leading-[1.1] tracking-[-0.03em]">
          We are simplifying finances
        </h2>
        <p className="text-[17px] tracking-[-0.01em] text-neutral-500 dark:text-neutral-400">
          Everything you need, nothing you don’t. We do the heavy lifting.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-3 lg:grid-rows-[250px_250px]">
        {/* 1 — Spend smarter */}
        <Card className="min-h-[560px] lg:row-span-2">
          <Phone className="left-1/2 top-[42px] -translate-x-1/2">
            <NavBar title="SmartHome" />
            <AccountCard />
            <div className="mx-0.5 mb-1.5 mt-3 flex justify-between text-[9px] font-semibold">
              <span>Transactions</span>
              <span className="font-medium text-violet-500">See All</span>
            </div>
            <div className="flex items-center gap-[7px] px-1 py-[7px] text-[8.5px]">
              <span className="size-[18px] flex-none rounded-full bg-[#c9b9a6]" />
              <div className="leading-tight">
                To Adrian UIIX
                <small className="block text-[7.5px] text-neutral-500">Today, 2:8pm</small>
              </div>
              <strong className="ml-auto font-semibold">-£250</strong>
            </div>
            <div className="my-1.5 flex justify-center gap-[3px]">
              <b className="h-[3px] w-2 rounded-[3px] bg-neutral-400" />
              <b className="size-[3px] rounded-full bg-neutral-300" />
              <b className="size-[3px] rounded-full bg-neutral-300" />
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-semibold">
              <span>SmartWallet</span>
              <span>⊕</span>
            </div>
            <div className="mt-2 h-[46px] rounded-[10px] bg-neutral-100 dark:bg-neutral-700" />
          </Phone>
          <CardCopy
            title="Spend smarter"
            text="Track your expenses automatically, no manual updates or spreadsheets needed."
            className="absolute inset-x-6 bottom-6"
          />
        </Card>

        {/* 2 — Grow your money */}
        <Card className="min-h-[380px] lg:col-span-2">
          <CardCopy
            title="Grow your money"
            text="Invest with beginner friendly tools & smart strategies that run in the background."
            className="max-w-[330px]"
          />
          <Float className="left-3 top-[120px] w-[186px] rounded-[14px] px-[13px] py-3 lg:left-[292px] lg:top-[72px]">
            <h4 className="text-[11px] font-semibold tracking-[-0.01em]">Trending stocks</h4>
            <svg viewBox="0 0 160 62" preserveAspectRatio="none" aria-hidden="true" className="mb-2 mt-1.5 block h-[62px] w-full">
              <defs>
                <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f08cb0" stopOpacity=".22" />
                  <stop offset="1" stopColor="#f08cb0" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 24 L18 20 L34 14 L48 56 L64 28 L80 34 L98 20 L116 26 L134 16 L160 12 L160 62 L0 62Z" fill="url(#trend-fill)" />
              <path
                d="M0 24 L18 20 L34 14 L48 56 L64 28 L80 34 L98 20 L116 26 L134 16 L160 12"
                fill="none"
                stroke="#f08cb0"
                strokeWidth="1.6"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="flex items-center gap-1.5 border-t border-neutral-200 pt-2 text-[9.5px] font-medium dark:border-neutral-700">
              <span className="size-[9px] flex-none rounded-full border-2 border-[#f08cb0]" />
              <div>
                Apple, Inc
                <small className="block text-[7.5px] font-normal text-neutral-500">APPL</small>
              </div>
              <div className="ml-auto text-right font-semibold">
                $115,6
                <small className="block text-[7.5px] font-medium text-green-500">0,54%</small>
              </div>
            </div>
          </Float>
          <Phone className="right-[-30px] top-[150px] h-[330px] border-b-0 lg:right-[22px] lg:top-[34px]">
            <NavBar />
            <AccountCard className="mt-[30px]" />
          </Phone>
        </Card>

        {/* 3 — Feel in control */}
        <Card className="min-h-[300px]">
          <CardCopy
            title="Feel in control"
            text="A clean, modern interface that turns complex finances into clear, simple steps."
          />
          <Float className="left-[30px] top-24 w-[186px] rounded-2xl px-[15px] py-3.5">
            <div className="flex items-start justify-between">
              <span className="grid size-[26px] place-items-center rounded-[9px] bg-[#f08cb0]">
                <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-[13px]">
                  <rect x="3" y="6" width="18" height="13" rx="3" />
                  <path d="M3 10h18" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-green-500">+24%</span>
            </div>
            <div className="mb-0.5 mt-3.5 text-[9.5px] text-neutral-500">Available balance</div>
            <div className="text-[27px] font-bold tracking-[-0.03em]">$234,850</div>
          </Float>
          <Float className="left-[172px] top-[140px] w-[136px] rounded-xl px-[11px] py-2.5">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-[11px] font-semibold">To do list</h4>
              <span className="rounded-[10px] bg-pink-100 px-[7px] py-[3px] text-[7.5px] font-semibold text-pink-600 dark:bg-pink-950 dark:text-pink-400">
                Add task
              </span>
            </div>
            <ul>
              {[
                { t: "Review spending summary", done: true },
                { t: "Allocate next week’s budget", done: false },
                { t: "Schedule next round of savings", done: false },
              ].map(({ t, done }) => (
                <li key={t} className={`flex items-center gap-1.5 py-1 text-[8px] ${done ? "" : "text-neutral-500"}`}>
                  <span className={`grid size-[9px] flex-none place-items-center rounded-[2px] border ${done ? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white" : "border-neutral-400"}`}>
                    {done && <span className="h-[2px] w-1 -translate-y-px -rotate-45 border-b border-l border-white dark:border-neutral-900" />}
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Float>
        </Card>

        {/* 4 — Hit your goals */}
        <Card className="min-h-[300px]">
          <CardCopy
            title="Hit your goals"
            text="Set custom goals & stay motivated with daily progress tracking and insights."
          />
          <Phone className="left-7 top-[110px] h-[330px] w-[256px]">
            <div className="mt-[70px] h-[46px] rounded-[10px] bg-neutral-100 dark:bg-neutral-700" />
          </Phone>
          <Float className="left-7 top-[138px] w-[184px] rounded-[14px] px-3.5 py-3">
            <div className="flex justify-between text-[11px] font-medium text-neutral-500">
              <span>Total earning</span>
              <b className="text-[10px] font-semibold text-green-500">+200%</b>
            </div>
            <div className="mt-0.5 text-[27px] font-bold tracking-[-0.03em]">$100,000</div>
          </Float>
        </Card>
      </div>
    </section>
  );
}