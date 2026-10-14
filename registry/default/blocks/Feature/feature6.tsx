import type { ReactNode } from "react";

/* ---------- Cartes ---------- */

const CARD =
  "flex flex-col rounded-[22px] border border-[var(--line)] bg-[var(--card)] p-4";

function BigCard({
  title,
  text,
  className = "",
  children,
}: {
  title: string;
  text: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`${CARD} min-[761px]:row-span-2 ${className}`}>
      <div className="mb-0 aspect-[3/2] overflow-hidden rounded-[14px] bg-[var(--panel)] bg-[radial-gradient(var(--dot)_1px,transparent_1px)] bg-[length:8px_8px] min-[761px]:mb-auto">
        {children}
      </div>
      <h3 className="mt-[18px] mb-1.5 text-sm font-medium tracking-[-0.01em]">{title}</h3>
      <p className="text-[12.5px] leading-normal text-[var(--mute)]">{text}</p>
    </article>
  );
}

function SmallCard({
  title,
  text,
  className = "",
  children,
}: {
  title: string;
  text: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <article className={`${CARD} min-h-[130px] px-5 py-[18px] min-[761px]:min-h-0 ${className}`}>
      <svg
        viewBox="0 0 24 24"
        className="mb-3 size-[26px] text-[var(--ink)]"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <h3 className="mb-1.5 text-sm font-medium tracking-[-0.01em]">{title}</h3>
      <p className="text-[12.5px] leading-normal text-[var(--mute)]">{text}</p>
    </article>
  );
}

/* ---------- Illustrations ---------- */

function FullPageIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" stroke="var(--stroke)" strokeWidth={1} className="block h-full w-full" aria-hidden="true">
      <g stroke="var(--soft)">
        <path d="M0 150 L150 225 M0 110 L200 210 M0 70 L250 195 M0 30 L300 180 M40 0 L300 130 M100 0 L300 100" />
        <path d="M300 150 L150 225 M300 110 L100 210 M300 70 L50 195 M300 30 L0 180" />
      </g>
      <g transform="translate(150,-8) skewY(26)">
        <rect x="0" y="0" width="100" height="150" fill="var(--paper)" />
        <path d="M12 20h45M12 30h76M12 40h60" stroke="var(--soft)" />
        <rect x="12" y="62" width="76" height="30" fill="var(--paper)" stroke="var(--soft)" />
      </g>
      <g transform="translate(38,42) skewY(26)">
        <rect x="0" y="0" width="100" height="150" rx="3" fill="var(--paper)" strokeWidth={1.3} />
        <path d="M12 20h30M12 30h76M12 40h60M12 50h70" stroke="var(--soft)" />
        <rect x="12" y="68" width="76" height="30" fill="var(--paper)" stroke="var(--soft)" />
        <rect x="38" y="76" width="24" height="8" fill="var(--btn)" stroke="none" />
        <path d="M12 112h76M12 122h64M12 132h70" stroke="var(--soft)" />
      </g>
    </svg>
  );
}

function FormatsIllustration() {
  const labels = [
    { t: "PDF", x: 52, y: 140, w: 38, r: [71, 150], tx: 71, ty: 152 },
    { t: "JPG", x: 92, y: 126, w: 38, r: [111, 140], tx: 111, ty: 138 },
    { t: "PNG", x: 128, y: 112, w: 38, r: [147, 130], tx: 147, ty: 124 },
    { t: "WEBP", x: 164, y: 98, w: 42, r: [185, 120], tx: 185, ty: 110 },
  ];
  return (
    <svg viewBox="0 0 300 200" className="block h-full w-full" fontFamily="inherit" aria-hidden="true">
      <g fill="var(--paper)" stroke="var(--stroke)" strokeWidth={1.2}>
        <rect x="150" y="34" width="62" height="100" rx="14" transform="rotate(-22 181 84) skewX(-12)" stroke="var(--soft)" />
        <rect x="116" y="42" width="62" height="100" rx="14" transform="rotate(-22 147 92) skewX(-12)" stroke="var(--soft)" />
        <rect x="82" y="50" width="62" height="100" rx="14" transform="rotate(-22 113 100) skewX(-12)" />
        <rect x="48" y="58" width="62" height="100" rx="14" transform="rotate(-22 79 108) skewX(-12)" />
      </g>
      <g fontSize={9} fontWeight={500} fill="var(--btnink)" textAnchor="middle">
        {labels.map((l) => (
          <g key={l.t} transform={`rotate(-22 ${l.r[0]} ${l.r[1]})`}>
            <rect x={l.x} y={l.y} width={l.w} height="18" rx="2" fill="var(--btn)" />
            <text x={l.tx} y={l.ty}>{l.t}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function ResponsiveIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" className="block h-full w-full" fontFamily="inherit" aria-hidden="true">
      <g stroke="var(--stroke)" strokeWidth={1}>
        <rect x="14" y="40" width="58" height="108" fill="var(--paper)" />
        <rect x="86" y="30" width="200" height="118" fill="var(--paper)" />
      </g>
      <g fill="var(--ink)" fontSize={5.5}>
        <text x="20" y="58">Say goodbye to</text>
        <text x="20" y="66">cluttered</text>
        <text x="20" y="74">Screenshots</text>
        <text x="124" y="52" fontSize={6.5}>Say goodbye to cluttered Screenshots</text>
      </g>
      <rect x="38" y="82" width="10" height="4" fill="var(--btn)" />
      <rect x="176" y="72" width="26" height="8" fill="var(--btn)" />
      <g stroke="var(--stroke)" strokeWidth={1}>
        <rect x="20" y="104" width="46" height="36" rx="3" fill="var(--paper)" />
        <rect x="108" y="96" width="156" height="52" rx="3" fill="var(--paper)" />
      </g>
    </svg>
  );
}

function DarkModeIllustration() {
  return (
    <svg viewBox="0 0 300 200" fill="none" className="block h-full w-full" fontFamily="inherit" aria-hidden="true">
      <rect x="26" y="34" width="248" height="118" fill="#f9f9f9" stroke="#1a1a1a" />
      <rect x="150" y="34" width="124" height="118" fill="#1c1c1c" stroke="#1a1a1a" />
      <text x="40" y="66" fontSize={6.5} fill="#111">Say goodbye to cluttered Screenshots</text>
      <text x="150" y="66" fontSize={6.5} fill="#fff" opacity={0.9}>cluttered Screenshots</text>
      <rect x="36" y="100" width="116" height="52" rx="3" fill="#f0f0f0" stroke="#1a1a1a" />
      <rect x="150" y="100" width="108" height="52" rx="3" fill="#0d0d0d" />
      <rect x="134" y="80" width="16" height="9" fill="#000" />
      <rect x="150" y="80" width="12" height="9" fill="#fff" stroke="#000" />
    </svg>
  );
}

/* ---------- Section ---------- */

export default function SmartFeatures() {
  return (
    <main className="mx-auto max-w-[920px] px-5 pt-[72px] pb-20">
      <h1 className="text-center text-[clamp(26px,4vw,36px)] font-normal tracking-[-0.025em]">
        Smart features for flawless screenshots
      </h1>
      <p className="mx-auto mt-[18px] mb-[38px] max-w-[340px] text-center text-[13px] leading-[1.55] text-[var(--mute)]">
        Everything you need — from full-page capture to custom tweaks and clean outputs.
      </p>

      <div className="grid grid-cols-1 gap-3 min-[761px]:auto-rows-[136px] min-[761px]:grid-cols-3">
        {/* Colonne gauche */}
        <BigCard
          title="High-quality full-page screenshots"
          text="Capture the entire webpage — pixel-perfect and scroll-free."
          className="min-[761px]:col-start-1 min-[761px]:row-start-1"
        >
          <FullPageIllustration />
        </BigCard>
        <BigCard
          title="Responsive Screenshot"
          text="Capture in Desktop, Tablet, or Mobile view."
          className="min-[761px]:col-start-1 min-[761px]:row-start-3"
        >
          <ResponsiveIllustration />
        </BigCard>

        {/* Colonne centrale */}
        <SmallCard
          title="Ad & banner blocking"
          text="Auto-removes ads, cookie banners and overlays."
          className="min-[761px]:col-start-2 min-[761px]:row-start-1"
        >
          <rect x="3" y="4.5" width="18" height="16.5" rx="3" />
          <path d="M8 2.5v4M16 2.5v4" />
          <circle cx="12" cy="13.5" r="3.6" />
          <path d="M9.5 16l5-5" />
        </SmallCard>
        <SmallCard
          title="Widget removal"
          text="Kill sticky chat bubbles and support widgets instantly."
          className="min-[761px]:col-start-2 min-[761px]:row-start-2"
        >
          <path d="M12 3.5c-5 0-8.5 3-8.5 7.2 0 2.2 1 4.1 2.6 5.4L5.5 20.5l4.2-2c.7.2 1.5.3 2.3.3 5 0 8.5-3 8.5-7.2S17 3.5 12 3.5z" />
          <circle cx="12" cy="11.5" r="3" />
          <path d="M10 13.5l4-4" />
        </SmallCard>
        <SmallCard
          title="Custom CSS & JS injection"
          text="Tweak or clean the page before capture."
          className="min-[761px]:col-start-2 min-[761px]:row-start-3"
        >
          <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.2" />
          <circle cx="17.25" cy="6.75" r="3.8" />
          <path d="M17.25 5v3.5M15.5 6.75H19" />
        </SmallCard>
        <SmallCard
          title="Click & hide elements"
          text="Select and hide any unwanted parts."
          className="min-[761px]:col-start-2 min-[761px]:row-start-4"
        >
          <path d="M3 4l17 17" />
          <path d="M10.7 6.1C11.1 6 11.6 6 12 6c4.5 0 8 3.5 9.5 6-.6 1.1-1.6 2.4-2.9 3.5M6.6 7.9C4.8 9.1 3.4 10.8 2.5 12c1.5 2.5 5 6 9.5 6 1.2 0 2.3-.2 3.3-.7" />
          <path d="M9.9 10a3 3 0 004.1 4.1" />
        </SmallCard>

        {/* Colonne droite */}
        <BigCard
          title="Multiple output formats"
          text="Export your files as PNG, JPEG, WEBP and PDF"
          className="min-[761px]:col-start-3 min-[761px]:row-start-1"
        >
          <FormatsIllustration />
        </BigCard>
        <BigCard
          title="Dark mode rendering"
          text="Auto-detects and captures dark UI themes."
          className="min-[761px]:col-start-3 min-[761px]:row-start-3"
        >
          <DarkModeIllustration />
        </BigCard>
      </div>
    </main>
  );
}