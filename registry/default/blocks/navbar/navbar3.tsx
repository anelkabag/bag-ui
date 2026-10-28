"use client";

import * as React from "react";
import Image from "next/image";
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
  /** Remplace le logo par défaut (`/logo.png`). */
  logo?: React.ReactNode;
  /** Classes du conteneur (centré horizontalement, marge de 1.5rem en haut). */
  className?: string;
}

const DEFAULT_LINKS: GooeyNavbarLink[] = [
  { label: "Blocks", href: "#blocks" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const DEFAULT_CTA: GooeyNavbarLink = { label: "Download App", href: "#download" };

/* Entrée : le logo et le bouton partent du menu et s’en détachent
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

/** Logo par défaut : place ton fichier dans `public/logo.png`. */
function LogoImage() {
  return (
    <Image
      src="/logoW.png"
      alt=""
      width={128}
      height={128}
      priority
      draggable={false}
      className="size-[3.1em] object-contain"
    />
  );
}

interface RowProps extends Required<Pick<GooeyNavbarProps, "links" | "cta" | "logoHref">> {
  logo: React.ReactNode;
  /** Calque de fond : formes noires seulement, le contenu est invisible. */
  ghost?: boolean;
  animate: boolean;
}

function Row({ links, cta, logoHref, logo, ghost = false, animate }: RowProps) {
  // `shrink-0` : les formes ne rétrécissent jamais, sinon le contenu déborde de sa pilule.
  const shape = cn(
    "flex h-[6.6em] shrink-0 items-center rounded-full",
    ghost && "bg-[#222] [&>*]:invisible",
  );
  const ring = "border-[1.5px] border-[#3a3a3a]";

  return (
    <motion.div
      className="flex shrink-0 items-center [&>*+*]:-ml-[0.3em]"
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
        <div className={cn("flex h-[5em] items-center rounded-full px-[1.5em]", ring)}>
          {links.map((link, i) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className={cn(
                "whitespace-nowrap px-[0.72em] text-[1.1em] leading-[2.1] tracking-[0.005em] text-[#c9c9c9] transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:outline-none",
                "first:pl-0 last:pr-0",
                i > 0 && "border-l-[1.5px] border-[#4a4a4a]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Bouton */}
      <motion.div variants={fromLeft} className={cn(shape, "pl-[1.1em] pr-[0.8em]")}>
        <Link
          href={cta.href}
          className={cn(
            "flex h-[5em] items-center rounded-full px-[2.75em] font-medium text-white transition-[border-color,transform] duration-200 hover:border-[#5a5a5a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:scale-[0.97]",
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
    logo: logo ?? <LogoImage />,
    animate: !reduceMotion,
  };

  return (
    <div
      className={cn(
        // Tout est en `em` : la taille de police du conteneur règle la taille de la barre.
        // Pour la changer : className="text-[11px]" (plus petit) ou "text-[15px]" (plus grand).
        "flex w-full justify-center px-4 pt-6 text-[length:clamp(7.5px,2vw,12px)]",
        className,
      )}
    >
      <nav
        aria-label="Navigation principale"
        className="relative inline-flex shrink-0 font-sans antialiased"
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

        {/* Contenu interactif : au-dessus du fond */}
        <div className="relative z-10 shrink-0">
          <Row {...rowProps} />
        </div>
      </nav>
    </div>
  );
}

export default GooeyNavbar;