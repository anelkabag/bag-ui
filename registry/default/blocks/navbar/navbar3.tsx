"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

export interface GooeyNavbarLink {
  label: string;
  href: string;
}

export interface GooeyNavbarProps {
  /** Liens affichés dans la pilule centrale. */
  links?: GooeyNavbarLink[];
  /** Bouton d’action à droite. */
  cta?: GooeyNavbarLink;
  /** Destination du logo. */
  logoHref?: string;
  /** Remplace le globe par défaut. */
  logo?: React.ReactNode;
  className?: string;
}

const DEFAULT_LINKS: GooeyNavbarLink[] = [
  { label: "Security", href: "#security" },
  { label: "Products", href: "#products" },
  { label: "Support", href: "#support" },
];

const DEFAULT_CTA: GooeyNavbarLink = { label: "Download App", href: "#download" };

/* Animation d’entrée : le logo et le bouton partent du menu et s’en détachent
   comme des gouttes grâce au filtre « goo ». */
const spring = { type: "spring", stiffness: 220, damping: 20 } as const;

const fromRight: Variants = {
  hidden: { x: 56, scale: 0.55, opacity: 0 },
  show: { x: 0, scale: 1, opacity: 1, transition: { ...spring, delay: 0.15 } },
};
const fromLeft: Variants = {
  hidden: { x: -56, scale: 0.55, opacity: 0 },
  show: { x: 0, scale: 1, opacity: 1, transition: { ...spring, delay: 0.15 } },
};
const grow: Variants = {
  hidden: { scaleX: 0.7, opacity: 0 },
  show: { scaleX: 1, opacity: 1, transition: spring },
};

function GlobeLogo() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-[4.1em] stroke-[#f4f1ea]"
      aria-hidden="true"
    >
      <circle cx="32" cy="32" r="28" />
      <path d="M22 6c-10 12-10 40 3 52" />
      <path d="M44 7c4 10 4 20-3 28" />
      <path d="M6 36c14 2 34 4 52-6" />
      <path d="M14 52c14-14 28-26 40-36" />
    </svg>
  );
}

interface RowProps extends Required<Pick<GooeyNavbarProps, "links" | "cta" | "logoHref">> {
  logo: React.ReactNode;
  /** Calque de fond : formes noires seulement, le contenu est invisible. */
  ghost?: boolean;
  animate: boolean;
}

function Row({ links, cta, logoHref, logo, ghost = false, animate }: RowProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  const shape = cn(
    "flex h-[6.6em] items-center rounded-full",
    ghost && "bg-[#222] dark:bg-[#262626] [&>*]:invisible",
  );
  const ring = "border-[1.5px] border-[#3a3a3a] dark:border-[#3f3f3f]";

  return (
    <motion.div
      className="flex items-center [&>*+*]:-ml-[0.3em]"
      initial={animate ? "hidden" : false}
      animate="show"
    >
      {/* Logo */}
      <motion.div variants={fromRight} className={cn(shape, "w-[6.6em] justify-center")}>
        <Link
          href={logoHref}
          aria-label="Accueil"
          className="flex size-full items-center justify-center rounded-full outline-offset-[-4px] focus-visible:outline-2 focus-visible:outline-white"
        >
          {logo}
        </Link>
      </motion.div>

      {/* Menu */}
      <motion.div variants={grow} className={cn(shape, "px-[1.1em]")}>
        <div
          className={cn("flex h-[5em] items-center rounded-full px-[1.5em]", ring)}
          onMouseLeave={() => setHovered(null)}
        >
          {links.map((link, i) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className={cn(
                "relative whitespace-nowrap px-[0.72em] text-[1.1em] leading-[2.1] tracking-[0.005em] text-[#c9c9c9] transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none",
                "first:pl-0 last:pr-0",
                i > 0 && "border-l-[1.5px] border-[#4a4a4a]",
              )}
            >
              {!ghost && hovered === i && (
                <motion.span
                  layoutId="bagui-gooey-hover"
                  className="absolute -inset-x-[0.55em] inset-y-0 rounded-full bg-white/10"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              <span className="relative">{link.label}</span>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Bouton */}
      <motion.div variants={fromLeft} className={cn(shape, "pl-[1.1em] pr-[0.8em]")}>
        <Link
          href={cta.href}
          className={cn(
            "flex h-[5em] items-center rounded-full px-[2.75em] font-medium text-white transition-[background-color,transform] duration-200 hover:bg-white/[0.07] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97]",
            ring,
          )}
        >
          <span className="whitespace-nowrap text-[1.15em]">{cta.label}</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export function GooeyNavbar({
  links = DEFAULT_LINKS,
  cta = DEFAULT_CTA,
  logoHref = "/",
  logo,
  className,
}: GooeyNavbarProps) {
  const reduceMotion = useReducedMotion();
  const rowProps = {
    links,
    cta,
    logoHref,
    logo: logo ?? <GlobeLogo />,
    animate: !reduceMotion,
  };

  return (
    <nav
      aria-label="Navigation principale"
      // Tout est en `em` : la barre se met à l’échelle avec la largeur de l’écran.
      className={cn(
        "relative inline-flex font-sans antialiased text-[length:clamp(9px,2.2vw,16px)]",
        className,
      )}
    >
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id="bagui-gooey"
            x="-20%"
            y="-40%"
            width="140%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            />
          </filter>
        </defs>
      </svg>

      {/* Fond : les trois formes noires fusionnent là où elles se touchent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center"
        style={{ filter: "url(#bagui-gooey)" }}
      >
        <Row ghost {...rowProps} />
      </div>

      {/* Contenu interactif */}
      <Row {...rowProps} />
    </nav>
  );
}

export { GooeyNavbar as NavbarEx3 };

export default GooeyNavbar;