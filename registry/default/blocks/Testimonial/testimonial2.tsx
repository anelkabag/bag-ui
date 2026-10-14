// components/testimonials.tsx
// Next.js (App Router) + Tailwind CSS — noir & blanc
// Server component: no "use client" needed.

type Variant = "icon" | "bold" | "wide" | "xwide";

type Testimonial = {
  name: string;
  handle: string;
  role: string;
  /** Use **text** for bold. Emojis are rendered in grayscale automatically. */
  paragraphs: string[];
  company: { name: string; variant: Variant };
  date: string;
  avatar: {
    bg: string;
    body: string;
    skin: string;
    hair: string;
    beard?: boolean;
    glasses?: boolean;
  };
};

/* ---------------------------------------------------------------------------
   Contenu : textes d'exemple écrits à partir du positionnement de BagUI
   (blocks shadcn/ui, React, Next.js, Tailwind, open source).
   Les noms et entreprises sont fictifs : remplace-les par de vrais avis.
--------------------------------------------------------------------------- */
const columns: Testimonial[][] = [
  [
    {
      name: "Léa Moreau",
      handle: "@lea.moreau",
      role: "Frontend Developer",
      paragraphs: [
        "Dropped a BagUI pricing block into our Next.js app and the page was live the same afternoon. 🚀",
        "Clean **shadcn/ui conventions**, nothing to fight with!",
      ],
      company: { name: "Northline", variant: "icon" },
      date: "Sep 18, 2026",
      avatar: {
        bg: "#d9d9d9",
        body: "#3a3a3a",
        skin: "#bdbdbd",
        hair: "#111",
        glasses: true,
      },
    },
    {
      name: "Marc Dubois",
      handle: "@marcdev",
      role: "Developer",
      paragraphs: [
        "Copy, paste, then **customize everything** with Tailwind 🧡 and the TypeScript types just work.",
      ],
      company: { name: "Lumio", variant: "bold" },
      date: "Oct 2, 2026",
      avatar: {
        bg: "#e2e2e2",
        body: "#222",
        skin: "#c9c9c9",
        hair: "#2a2a2a",
        beard: true,
      },
    },
  ],
  [
    {
      name: "Nora Adams",
      handle: "@nora.builds",
      role: "Co-Founder",
      paragraphs: [
        "We rebuilt our **SaaS landing page** with BagUI blocks. Hero, pricing and FAQ matched without extra work. 🔥",
      ],
      company: { name: "KESTREL", variant: "wide" },
      date: "Sep 24, 2026",
      avatar: { bg: "#e6e6e6", body: "#555", skin: "#d2d2d2", hair: "#222" },
    },
    {
      name: "Tom Keller",
      handle: "@tomkeller",
      role: "Product Manager",
      paragraphs: [
        "Designers and developers finally speak the same language. **Ready-made sections** speed up every review. 🎉",
      ],
      company: { name: "VANTA", variant: "xwide" },
      date: "Aug 12, 2026",
      avatar: {
        bg: "#d4d4d4",
        body: "#1a1a1a",
        skin: "#cfcfcf",
        hair: "#4a4a4a",
      },
    },
  ],
  [
    {
      name: "Inès Carter",
      handle: "@ines.carter",
      role: "Jr. Designer",
      paragraphs: [
        "Handcrafted sections that look **polished out of the box** and are easy to restyle to our brand.",
        "The animations feel smooth, never heavy. 😍",
      ],
      company: { name: "Orbitly", variant: "icon" },
      date: "Oct 8, 2026",
      avatar: {
        bg: "#dedede",
        body: "#2b2b2b",
        skin: "#c4c4c4",
        hair: "#6a6a6a",
        beard: true,
      },
    },
    {
      name: "Sam Rivera",
      handle: "@samrivera",
      role: "Freelancer",
      paragraphs: [
        "Open source and **free to start**, perfect for client projects 🧡 I ship faster every time.",
      ],
      company: { name: "Pixelhaus", variant: "bold" },
      date: "Oct 12, 2026",
      avatar: {
        bg: "#e2e2e2",
        body: "#222",
        skin: "#c9c9c9",
        hair: "#2a2a2a",
        beard: true,
      },
    },
  ],
];

/* ------------------------------ Helpers ---------------------------------- */

/** **bold** -> <b>, emojis keep their original colors */
function Rich({ text }: { text: string }) {
  const parts = text
    .split(/(\*\*.+?\*\*|\p{Extended_Pictographic}\uFE0F?)/u)
    .filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**"))
          return (
            <b key={i} className="font-semibold">
              {part.slice(2, -2)}
            </b>
          );
        if (/^\p{Extended_Pictographic}/u.test(part))
          return (
            <span key={i} className="inline-block">
              {part}
            </span>
          );
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function Avatar({
  bg,
  body,
  skin,
  hair,
  beard,
  glasses,
}: Testimonial["avatar"]) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden="true"
      className="size-[38px] shrink-0 rounded-full"
    >
      <circle cx="20" cy="20" r="20" fill={bg} />
      <path d="M6 40c1-9 7-13 14-13s13 4 14 13z" fill={body} />
      <circle cx="20" cy="18" r="8" fill={skin} />
      <path
        d="M11.5 17c0-6 4-9.5 8.5-9.5s8.5 3.5 8.5 9.5c-2-3-5-4-8.5-4s-6.5 1-8.5 4z"
        fill={hair}
      />
      {beard && (
        <path
          d="M12 20c0 7 3.5 10 8 10s8-3 8-10c0 3-3 5-8 5s-8-2-8-5z"
          fill={hair}
        />
      )}
      {glasses && (
        <g fill="#0a0a0a">
          <rect x="11" y="16" width="8" height="5" rx="2" />
          <rect x="21" y="16" width="8" height="5" rx="2" />
        </g>
      )}
    </svg>
  );
}

function Wordmark({ name, variant }: Testimonial["company"]) {
  const styles: Record<Variant, string> = {
    icon: "gap-1.5 text-sm font-medium tracking-tight",
    bold: "text-sm font-bold tracking-tighter",
    wide: "text-xs font-bold tracking-[0.14em]",
    xwide: "text-xs font-medium tracking-[0.38em]",
  };
  return (
    <span
      className={`inline-flex items-center text-neutral-700 dark:text-neutral-200 ${styles[variant]}`}
    >
      {variant === "icon" && (
        <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M2 9.5 17.5 2.5l-5 15-3-6.5z" fill="currentColor" />
        </svg>
      )}
      {name}
    </span>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white/90 px-5 pb-4 pt-[18px] shadow-sm shadow-black/5 backdrop-blur-sm transition-colors dark:border-neutral-800 dark:bg-neutral-950/90 dark:shadow-black/20">
      <div className="flex items-center gap-2.5 pb-4">
        <Avatar {...t.avatar} />
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight text-neutral-900 dark:text-neutral-50">
            {t.name}
          </p>
          <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            {t.handle}
          </p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
          {t.role}
        </span>
      </div>

      <div className="space-y-4 border-t border-neutral-200 py-4 text-[13.5px] leading-[1.55] text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
        {t.paragraphs.map((p, i) => (
          <p key={i}>
            <Rich text={p} />
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-3.5 text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
        <Wordmark {...t.company} />
        <time className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {t.date}
        </time>
      </div>
    </article>
  );
}

/* ------------------------------ Section ---------------------------------- */

export default function TestimonialsBlock2() {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f4f5] px-4 py-12 text-neutral-950 md:py-[72px] dark:bg-[#09090b] dark:text-neutral-50"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />
      <div className="relative mx-auto w-full max-w-[1120px]">
        <header className="mb-11 flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:px-14">
          <div>
            <span className="mb-5 inline-block rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 ring-1 ring-neutral-200 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700">
              BagUI
            </span>
            <h2
              id="testimonials-title"
              className="text-[clamp(2.125rem,4.4vw,3rem)] font-medium leading-[1.12] tracking-[-0.025em] text-neutral-950 dark:text-neutral-50"
            >
              What are developers
              <br className="hidden md:block" /> saying about BagUI?
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-6 md:mt-8 md:gap-9">
            <p className="max-w-[210px] text-[13px] leading-normal text-neutral-600 dark:text-neutral-400">
              Handcrafted React &amp; shadcn/ui blocks to{" "}
              <span className="font-semibold text-neutral-950 dark:text-neutral-50">
                plug in, customize, and ship.
              </span>
            </p>
            <a
              href="https://www.bagui.pro/blocks"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-neutral-950 px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 dark:bg-white dark:text-neutral-950 dark:focus-visible:outline-white"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="1" y="1" width="4" height="4" rx="1" />
                <rect x="9" y="1" width="4" height="4" rx="1" />
                <rect x="1" y="9" width="4" height="4" rx="1" />
                <rect x="9" y="9" width="4" height="4" rx="1" opacity=".5" />
              </svg>
              Explore blocks
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 items-start gap-3.5 md:grid-cols-3">
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-3.5">
              {col.map((t) => (
                <Card key={t.name + t.date} t={t} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
