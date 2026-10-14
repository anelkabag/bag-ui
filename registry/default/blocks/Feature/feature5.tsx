// components/bagui/feature-bento.tsx  —  Bag/UI · Feature block (bento)
// Next.js (App Router) + Tailwind CSS (v3.4+ ou v4). Composant serveur : pas de "use client".
//
// Polices (app/layout.tsx) :
//   import { Inter, JetBrains_Mono } from "next/font/google";
//   const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
//   const mono = JetBrains_Mono({ subsets: ["latin"], weight: "500", variable: "--font-mono" });
//   <body className={`${inter.variable} ${mono.variable}`}>
//
// Les couleurs sont portées par des variables CSS (identiques à la version HTML),
// avec la variante sombre via `dark:` (prefers-color-scheme).

import type { ReactNode } from "react";

/* ---------- Contenu (modifiable via props) ---------- */
export type FeatureItem = { title: string; description: string };

export type FeatureBentoProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Ordre : [carte haute gauche, carte large, carte basse milieu, carte basse droite] */
  items?: [FeatureItem, FeatureItem, FeatureItem, FeatureItem];
};

const defaults: Required<FeatureBentoProps> = {
  eyebrow: "Features",
  title: "Ship landing pages faster",
  description: "Handcrafted React & shadcn/ui blocks you can plug in, customize and ship with confidence.",
  items: [
    { title: "Copy, paste, ship", description: "Add any block to your project with a single shadcn command, no setup needed." },
    { title: "Built on shadcn/ui", description: "React, TypeScript & Tailwind CSS blocks that follow the conventions you already use." },
    { title: "Make it yours", description: "You own the code: change colors, content and layout without fighting a library." },
    { title: "Open source", description: "Free blocks you can use today, and a community that helps the library grow." },
  ],
};

/* Tokens (classes complètes pour que Tailwind les détecte) */
const muted = "text-[color:var(--muted)]";
const line = "border-[color:var(--line)]";
const surface = "bg-[color:var(--surface)]";
const miniBar = "h-[46px] rounded-[10px] bg-[color:var(--line)]";

/* ---------- Icônes ---------- */
const ico = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

const SearchIcon = () => (
  <svg {...ico} className="size-[13px]">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </svg>
);
const BellIcon = () => (
  <svg {...ico} className="size-[13px]">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 8H3s3-1 3-8" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);
const UserIcon = () => (
  <svg {...ico} className="h-[13px] w-[11px]">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

/* ---------- Briques ---------- */
function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <article
      className={`relative overflow-hidden rounded-[24px] border border-[color:var(--card-line)] bg-[color:var(--card)] p-6 ${className}`}
    >
      {children}
    </article>
  );
}

function CardCopy({
  title,
  text,
  className = "",
  pMax = "max-w-[300px]",
}: {
  title: string;
  text: string;
  className?: string;
  pMax?: string;
}) {
  return (
    <div className={className}>
      <h3 className="mb-2 text-[18px] font-semibold tracking-[-0.02em]">{title}</h3>
      <p className={`${pMax} text-[14px] leading-[1.45] tracking-[-0.005em] ${muted}`}>{text}</p>
    </div>
  );
}

function Float({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`absolute z-[2] border ${line} ${surface} shadow-[0_10px_30px_rgba(0,0,0,0.07)] ${className}`}
    >
      {children}
    </div>
  );
}

function Phone({ className = "", children }: { className?: string; children?: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className={`absolute h-[420px] w-[236px] overflow-hidden rounded-[38px] border-[6px] border-[color:var(--phone)] ${surface} text-[10px] [-webkit-mask-image:linear-gradient(#000_62%,transparent_100%)] [mask-image:linear-gradient(#000_62%,transparent_100%)] ${className}`}
    >
      <div className="absolute left-1/2 top-2 h-[19px] w-[62px] -translate-x-1/2 rounded-[12px] bg-[color:var(--phone)]" />
      <div className="flex h-[34px] items-center justify-between px-[18px] pt-[11px] text-[10.5px] font-semibold">
        <span>9:41</span>
        <i className="flex items-center gap-[3px] not-italic">
          <b className="block h-[7px] w-3 rounded-[2px] bg-[color:var(--ink)]" />
          <b className="block h-2 w-4 rounded-[3px] bg-[color:var(--ink)]" />
        </i>
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

function AccountCard({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={`rounded-[12px] border p-[9px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${line} ${surface} ${className}`}
    >
      <div
        className={`flex items-center gap-1.5 rounded-[8px] border px-[7px] py-1.5 text-[9.5px] font-medium ${line} ${
          compact ? "w-[60%]" : ""
        }`}
      >
        <UserIcon />
        BagUi Account
        {!compact && <em className={`ml-auto not-italic ${muted}`}>···</em>}
      </div>
      <div className={`mb-0.5 mt-2.5 text-[8.5px] ${muted}`}>Available balance</div>
      <div className="text-[21px] font-semibold tracking-[-0.02em]">
        <small className="mr-[3px] text-[15px]">$</small>500,00
      </div>
      <div className="mt-[9px] flex gap-[5px]">
        {["+ Top up", "⇄ Transfer", "◎ Exchange"].map((b) => (
          <span
            key={b}
            className={`flex-1 whitespace-nowrap rounded-[7px] border py-[5px] text-center text-[8.5px] font-medium ${line}`}
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Composant principal ---------- */
export default function FeatureBento({
  eyebrow = defaults.eyebrow,
  title = defaults.title,
  description = defaults.description,
  items = defaults.items,
}: FeatureBentoProps) {
  return (
    <section
      className="bg-[color:var(--bg)] px-6 py-14 font-[family-name:var(--font-inter,Inter,system-ui,-apple-system,'Segoe_UI',sans-serif)] leading-[normal] text-[color:var(--ink)] antialiased max-[520px]:px-3.5 max-[520px]:py-10 [--bg:#fff] [--card:#efefef] [--card-line:#e3e3e3] [--surface:#fff] [--ink:#0d0d0d] [--muted:#6b6b6b] [--line:#ececec] [--phone:#0d0d0d] [--pink-soft:#fbd6e4] dark:[--bg:#0e0e0e] dark:[--card:#1a1a1a] dark:[--card-line:#262626] dark:[--surface:#262626] dark:[--ink:#f4f4f4] dark:[--muted:#9a9a9a] dark:[--line:#333] dark:[--phone:#3a3a3a] dark:[--pink-soft:#4a2c38]"
    >
      <div className="mx-auto max-w-[1020px]">
        <header className="mb-10 text-center">
          <div className="font-[family-name:var(--font-mono,'JetBrains_Mono',ui-monospace,Menlo,monospace)] text-[12px] font-medium uppercase tracking-[0.06em]">
            {eyebrow}
          </div>
          <h2 className="mb-2 mt-[14px] text-[clamp(30px,4.4vw,42px)] font-bold leading-[1.1] tracking-[-0.03em]">
            {title}
          </h2>
          <p className={`text-[17px] tracking-[-0.01em] ${muted}`}>
            {description}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[18px] min-[901px]:grid-cols-3 min-[901px]:grid-rows-[250px_250px]">
          {/* 1 — Spend smarter */}
          <Card className="max-[900px]:min-h-[560px] min-[901px]:row-span-2">
            <Phone className="left-1/2 top-[42px] -translate-x-1/2">
              <NavBar title="SmartHome" />
              <AccountCard />
              <div className="mx-0.5 mb-1.5 mt-3 flex justify-between text-[9px] font-semibold">
                <span>Transactions</span>
                <u className="font-medium text-[#9b5de5] no-underline">See All</u>
              </div>
              <div className="flex items-center gap-[7px] px-1 py-[7px] text-[8.5px]">
                <span className="size-[18px] flex-none rounded-full bg-[#c9b9a6]" />
                <div className="leading-[1.25]">
                  To Anelka Bag
                  <small className={`block text-[7.5px] ${muted}`}>Today, 2:8pm</small>
                </div>
                <strong className="ml-auto font-semibold">-$250</strong>
              </div>
              <div className="my-1.5 flex justify-center gap-[3px]">
                <b className="h-[3px] w-2 rounded-[3px] bg-[#9a9a9a]" />
                <b className="size-[3px] rounded-full bg-[#cfcfcf]" />
                <b className="size-[3px] rounded-full bg-[#cfcfcf]" />
              </div>
              <div className="mt-2 flex justify-between text-[10px] font-semibold">
                <span>SmartWallet</span>
                <span>⊕</span>
              </div>
              <div className={`mt-2 ${miniBar}`} />
            </Phone>
            <CardCopy
              title={items[0].title}
              text={items[0].description}
              pMax="max-w-[290px]"
              className="absolute inset-x-6 bottom-6"
            />
          </Card>

          {/* 2 — Grow your money */}
          <Card className="max-[900px]:min-h-[360px] min-[901px]:col-span-2">
            <CardCopy
              title={items[1].title}
              text={items[1].description}
              className="max-w-[330px]"
            />
            <Float className="left-[292px] top-[72px] w-[186px] rounded-[14px] px-[13px] py-3 max-[900px]:left-[calc(50%-220px)] max-[900px]:top-[130px] max-[520px]:left-3">
              <h4 className="text-[11px] font-semibold tracking-[-0.01em]">Trending stocks</h4>
              <svg
                viewBox="0 0 160 62"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="mb-2 mt-1.5 block h-[62px] w-full"
              >
                <defs>
                  <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f08cb0" stopOpacity=".22" />
                    <stop offset="1" stopColor="#f08cb0" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 24 L18 20 L34 14 L48 56 L64 28 L80 34 L98 20 L116 26 L134 16 L160 12 L160 62 L0 62Z"
                  fill="url(#trend-fill)"
                />
                <path
                  d="M0 24 L18 20 L34 14 L48 56 L64 28 L80 34 L98 20 L116 26 L134 16 L160 12"
                  fill="none"
                  stroke="#f08cb0"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className={`flex items-center gap-1.5 border-t pt-2 text-[9.5px] font-medium ${line}`}>
                <span className="size-[9px] flex-none rounded-full border-2 border-[#f08cb0]" />
                <div>
                  Apple, Inc
                  <small className={`block text-[7.5px] font-normal ${muted}`}>APPL</small>
                </div>
                <div className="ml-auto text-right font-semibold">
                  $115,6
                  <small className="block text-[7.5px] font-medium text-[#22c55e]">0,54%</small>
                </div>
              </div>
            </Float>
            <Phone className="right-[22px] top-[34px] h-[330px] border-b-0 max-[900px]:right-1/2 max-[900px]:top-[160px] max-[900px]:z-[1] max-[900px]:translate-x-1/2 max-[520px]:-right-10 max-[520px]:translate-x-0">
              <NavBar />
              <AccountCard compact className="mt-[30px]" />
            </Phone>
          </Card>

          {/* 3 — Feel in control */}
          <Card className="max-[900px]:min-h-[300px]">
            <CardCopy
              title={items[2].title}
              text={items[2].description}
            />
            <Float className="left-[30px] top-[96px] w-[186px] rounded-[16px] px-[15px] py-3.5">
              <div className="flex items-start justify-between">
                <span className="grid size-[26px] place-items-center rounded-[9px] bg-[#f08cb0]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[13px]"
                  >
                    <rect x="3" y="6" width="18" height="13" rx="3" />
                    <path d="M3 10h18" />
                  </svg>
                </span>
                <span className="text-[10px] font-semibold text-[#22c55e]">+24%</span>
              </div>
              <div className={`mb-0.5 mt-3.5 text-[9.5px] ${muted}`}>Available balance</div>
              <div className="text-[27px] font-bold tracking-[-0.03em]">$234,850</div>
            </Float>
            <Float className="left-[172px] top-[140px] w-[136px] rounded-[12px] px-[11px] py-2.5">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-[11px] font-semibold tracking-[-0.01em]">To do list</h4>
                <span className="rounded-[10px] bg-[color:var(--pink-soft)] px-[7px] py-[3px] text-[7.5px] font-semibold text-[#d6568a]">
                  Add task
                </span>
              </div>
              <ul>
                {[
                  { t: "Review spending summary", done: true },
                  { t: "Allocate next week’s budget", done: false },
                  { t: "Schedule next round of savings", done: false },
                ].map(({ t, done }) => (
                  <li key={t} className={`flex items-center gap-1.5 py-1 text-[8px] ${done ? "" : muted}`}>
                    <span
                      className={`grid size-[9px] flex-none place-items-center rounded-[2px] border-[1.3px] ${
                        done ? "border-[color:var(--ink)] bg-[color:var(--ink)]" : "border-[#b5b5b5]"
                      }`}
                    >
                      {done && (
                        <span className="block h-[2px] w-1 border-b-[1.3px] border-l-[1.3px] border-white [transform:rotate(-45deg)_translate(0,-1px)]" />
                      )}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </Float>
          </Card>

          {/* 4 — Hit your goals */}
          <Card className="max-[900px]:min-h-[300px]">
            <CardCopy
              title={items[3].title}
              text={items[3].description}
            />
            <Phone className="left-7 top-[110px] h-[330px] w-[256px]">
              <div className={`mt-[70px] ${miniBar}`} />
            </Phone>
            <Float className="left-7 top-[138px] w-[184px] rounded-[14px] px-3.5 py-3">
              <div className={`flex justify-between text-[11px] font-medium ${muted}`}>
                <span>Total earning</span>
                <b className="text-[10px] font-semibold text-[#22c55e]">+200%</b>
              </div>
              <div className="mt-0.5 text-[27px] font-bold tracking-[-0.03em]">$100,000</div>
            </Float>
          </Card>
        </div>
      </div>
    </section>
  );
}