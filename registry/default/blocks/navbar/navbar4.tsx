"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "motion/react";
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  Database,
  Gem,
  Lightbulb,
  MessageSquareHeart,
  Medal,
  Orbit,
  Presentation,
  Puzzle,
  Search,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  UserPlus,
  Wand2,
  Zap,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Données                                                                    */
/* -------------------------------------------------------------------------- */

type MenuItem = {
  title: string;
  desc: string;
  icon: ReactNode;
  href?: string;
  /** Icône ronde bleue (Platform Overview) */
  accent?: boolean;
  /** Ligne mise en évidence (Chrome Extension) */
  active?: boolean;
  /** Trait de séparation sous l'élément */
  separator?: boolean;
};

const GoogleG = () => (
  <svg viewBox="0 0 24 24" className="size-full" aria-hidden>
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.74 2.98-4.3 2.98-7.34z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.96-.9 6.62-2.43l-3.24-2.5c-.9.6-2.04.96-3.38.96-2.6 0-4.8-1.76-5.6-4.12H3.06v2.58A10 10 0 0 0 12 22z" />
    <path fill="#FBBC05" d="M6.4 13.9A6 6 0 0 1 6.1 12c0-.66.11-1.3.3-1.9V7.52H3.06A10 10 0 0 0 2 12c0 1.61.39 3.14 1.06 4.48l3.34-2.58z" />
    <path fill="#EA4335" d="M12 6.98c1.47 0 2.79.5 3.82 1.5l2.87-2.87C16.95 3.99 14.7 3 12 3 8.1 3 4.74 5.24 3.06 7.52L6.4 10.1C7.2 7.74 9.4 6.98 12 6.98z" />
  </svg>
);

const FEATURES: MenuItem[] = [
  {
    title: "Platform Overview",
    desc: "Connect directly with your ideal customers & close more deals.",
    icon: <Search />,
    accent: true,
    separator: true,
  },
  {
    title: "Pitch Intelligence",
    desc: "Deliver the right message, to the right person, at the right time.",
    icon: <Lightbulb />,
  },
  {
    title: "Chrome Extension",
    desc: "Build lists anywhere on the web with our Chrome Extension.",
    icon: <GoogleG />,
    active: true,
  },
  {
    title: "Integrations",
    desc: "Export directly to your existing tech stack in a single-click.",
    icon: <Puzzle />,
  },
];

const PREMIUM: MenuItem[] = [
  { title: "Data Enrichment", desc: "Keep your data up-to-date, no matter where it lives.", icon: <Database /> },
  { title: "Autopilot", desc: "Automate list-building efforts to build pipeline faster than ever.", icon: <Zap /> },
  { title: "Job Changes", desc: "Stay on top of key accounts & maintain an active pipeline.", icon: <Briefcase /> },
  { title: "Buyer Intent Data", desc: "Identify, prioritize, & engage with ready-to-buy accounts", icon: <Target /> },
  { title: "Writer", desc: "AI powered copy that cuts through the noise", icon: <Wand2 /> },
];

const SOLUTIONS: { label: string; icon: ReactNode }[] = [
  { label: "Sales Development Reps", icon: <Sparkles /> },
  { label: "Account Executives", icon: <MessageSquareHeart /> },
  { label: "VP of Sales", icon: <TrendingUp /> },
  { label: "Revenue Operations", icon: <Orbit /> },
  { label: "Founders", icon: <Medal /> },
  { label: "Marketing", icon: <Presentation /> },
  { label: "Customer Success", icon: <Smile /> },
  { label: "Recruiting", icon: <UserPlus /> },
];

/* -------------------------------------------------------------------------- */
/*  Animations                                                                 */
/* -------------------------------------------------------------------------- */

const panelVariants: Variants = {
  hidden: { opacity: 0, y: -10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      opacity: { duration: 0.22, ease: "easeOut" },
      default: { type: "spring", stiffness: 420, damping: 34, mass: 0.9 },
      delayChildren: 0.05,
      staggerChildren: 0.045,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

/* -------------------------------------------------------------------------- */
/*  Petits composants                                                          */
/* -------------------------------------------------------------------------- */

const buttonBase =
  "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg border px-3 text-[13px] font-medium leading-none outline-none focus-visible:ring-2 focus-visible:ring-[#1f5bff] focus-visible:ring-offset-2";

function ColumnTitle({ children }: { children: ReactNode }) {
  return <h3 className="mb-[11px] h-3.5 text-xs font-medium leading-[14px] text-[#7b8195]">{children}</h3>;
}

function FeatureLink({ item, premium = false }: { item: MenuItem; premium?: boolean }) {
  const hover = premium ? "hover:bg-white/55" : "hover:bg-[#f1f2f6]";
  return (
    <a
      href={item.href ?? "#"}
      className={[
        "relative flex items-start gap-2.5 rounded-[10px] p-2 outline-none focus-visible:ring-2 focus-visible:ring-[#1f5bff]",
        item.active ? "bg-[#f1f2f6]" : hover,
        item.separator
          ? "mb-[5px] after:absolute after:inset-x-0 after:-bottom-[5px] after:h-px after:bg-[#e9ebf2]"
          : "",
      ].join(" ")}
    >
      <span
        className={[
          "grid size-8 shrink-0 place-items-center p-[7px] [&_svg]:size-full [&_svg]:stroke-[1.6]",
          item.accent
            ? "rounded-full bg-[#1f5bff] text-white [&_svg]:stroke-2"
            : "rounded-lg border border-[#e9ebf2] bg-white text-[#3a4056] shadow-[0_1px_2px_rgba(28,32,51,.05)]",
        ].join(" ")}
      >
        {item.icon}
      </span>
      <span>
        <span className="block text-[13px] font-medium leading-[18px] text-[#1c2033]">{item.title}</span>
        <span className="block text-[13px] leading-[18px] text-[#6c7287]">{item.desc}</span>
      </span>
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                     */
/* -------------------------------------------------------------------------- */

type NavbarProps = {
  /** Menu "Products" ouvert au premier rendu */
  defaultOpen?: boolean;
};

export default function Navbar({ defaultOpen = true }: NavbarProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  // Fermeture : touche Échap ou clic en dehors
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const navLink =
    "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 text-[13px] font-medium leading-none text-[#1c2033] outline-none transition-colors hover:bg-[#eef0f6] focus-visible:ring-2 focus-visible:ring-[#1f5bff]";

  return (
    // reducedMotion="user" : respecte la préférence « réduire les animations »
    <MotionConfig reducedMotion="user">
      <div
        ref={rootRef}
        className="relative mx-auto mt-6 w-[min(max(45vw,620px),100%)] font-sans text-[13px] text-[#1c2033] antialiased"
      >
        {/* Barre */}
        <nav
          aria-label="Navigation principale"
          className="flex h-[52px] items-center gap-1 rounded-2xl bg-white px-3 shadow-[0_1px_2px_rgba(28,32,51,.04),0_8px_24px_rgba(28,32,51,.06)]"
        >
          <button
            type="button"
            className={`${navLink} ${open ? "bg-[#eef0f6]" : ""}`}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            Products
            <motion.span
              className="inline-flex"
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 30 }}
            >
              <ChevronDown className="size-3 stroke-2 text-[#7b8195]" />
            </motion.span>
          </button>

          <button type="button" className={navLink}>
            Customers
            <ChevronDown className="size-3 stroke-2 text-[#7b8195]" />
          </button>
          <button type="button" className={navLink}>
            Company
            <ChevronDown className="size-3 stroke-2 text-[#7b8195]" />
          </button>
          <a href="#" className={navLink}>
            Talk to Sales
          </a>

          <span className="flex-1" />

          <a href="#" className={`${buttonBase} border-[#e9ebf2] bg-[#f6f7fb] text-[#1c2033] hover:bg-[#eef0f6]`}>
            Login
          </a>
          <a
            href="#"
            className={`${buttonBase} ml-1 border-[#1f5bff] bg-[#1f5bff] text-white shadow-[0_1px_2px_rgba(31,91,255,.35)] hover:bg-[#164be0]`}
          >
            Get started
          </a>
        </nav>

        {/* Menu (le wrapper gère le centrage, motion gère l'animation) */}
        <div className="absolute left-1/2 top-full z-50 mt-[21px] w-[min(870px,calc(100vw-2rem))] -translate-x-1/2">
          <AnimatePresence initial={false}>
            {open && (
              <motion.section
                id={panelId}
                aria-label="Products"
                variants={panelVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                style={{ transformOrigin: "50% 0" }}
                className="overflow-hidden rounded-[20px] bg-white shadow-[0_1px_2px_rgba(28,32,51,.04),0_8px_24px_rgba(28,32,51,.06)]"
              >
                <div className="grid grid-cols-1 gap-3 px-5 pb-[9px] pt-[7px] md:grid-cols-[290px_317px_1fr] md:gap-5">
                  {/* Features */}
                  <motion.div variants={blockVariants} className="pt-[15px]">
                    <ColumnTitle>FEATURES</ColumnTitle>
                    <div className="flex flex-col gap-[3px]">
                      {FEATURES.map((item) => (
                        <FeatureLink key={item.title} item={item} />
                      ))}
                    </div>
                  </motion.div>

                  {/* Premium */}
                  <motion.div
                    variants={blockVariants}
                    className="rounded-[14px] bg-[linear-gradient(165deg,#eceffc_0%,#f2f4fd_55%,#f8f9fe_100%)] px-3.5 pb-3.5 pt-[15px]"
                  >
                    <ColumnTitle>PREMIUM</ColumnTitle>
                    <div className="flex flex-col gap-[3px]">
                      {PREMIUM.map((item) => (
                        <FeatureLink key={item.title} item={item} premium />
                      ))}
                    </div>
                  </motion.div>

                  {/* Solutions */}
                  <motion.div variants={blockVariants} className="pl-px pt-[15px]">
                    <h3 className="mb-3.5 h-3.5 text-xs font-medium leading-[14px] text-[#7b8195]">SOLUTIONS</h3>
                    <ul>
                      {SOLUTIONS.map(({ label, icon }) => (
                        <li key={label}>
                          <a
                            href="#"
                            className="flex h-9 items-center gap-3 rounded-lg px-2 text-[13px] font-medium text-[#1c2033] outline-none hover:bg-[#f1f2f6] focus-visible:ring-2 focus-visible:ring-[#1f5bff]"
                          >
                            <span className="size-[18px] shrink-0 text-[#565c72] [&_svg]:size-full [&_svg]:stroke-[1.6]">
                              {icon}
                            </span>
                            {label}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href="#"
                          className="flex h-9 items-center gap-2 rounded-lg px-2 text-[13px] font-medium text-[#1f5bff] outline-none hover:bg-[#f1f2f6] focus-visible:ring-2 focus-visible:ring-[#1f5bff]"
                        >
                          All Solutions
                          <ArrowRight className="size-[15px] stroke-2" />
                        </a>
                      </li>
                    </ul>
                  </motion.div>
                </div>

                {/* Pied de menu */}
                <motion.div
                  variants={blockVariants}
                  className="mx-2 flex h-[73px] flex-wrap items-center gap-3 border-t border-[#e9ebf2] pl-[29px] pr-[27px]"
                >
                  <span className="grid size-[30px] shrink-0 place-items-center rounded-full bg-[linear-gradient(160deg,#7cc4ff,#2f7bff)] shadow-[0_2px_6px_rgba(47,123,255,.35)]">
                    <Gem className="size-4 fill-white/95 stroke-white" />
                  </span>
                  <span className="flex-1 text-[#6c7287]">
                    <strong className="font-semibold text-[#1c2033]">Want Free Leads?</strong> Take Acme for a Test Drive
                  </span>
                  <a
                    href="#"
                    className={`${buttonBase} border-[#e9ebf2] bg-[#f6f7fb] text-[#1c2033] shadow-[0_1px_2px_rgba(28,32,51,.06)] hover:bg-[#eef0f6]`}
                  >
                    Get Started
                  </a>
                </motion.div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}