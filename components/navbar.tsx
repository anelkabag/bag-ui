"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Lenis from "@studio-freight/lenis";

const NAV_LINKS = [
  { label: "Blocks", href: "/blocks" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
] as const;

const Logo = () => (
  <div className="flex items-center gap-2 shrink-0">
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="BagUI Logo"
        width={20}
        height={20}
        className="shrink-0"
        priority
      />
      <span className="text-[15px] font-semibold tracking-tight text-black">
        Bag\Ui
      </span>
    </Link>
    <Link
      href="https://x.com/anelkabag"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[13px] text-gray-400 hover:text-black transition-colors"
    >
      by Anelka Bag
    </Link>
  </div>
);

const NavLink = ({
  href,
  label,
  external,
  size = "sm",
  onClick,
}: {
  href: string;
  label: string;
  external?: boolean;
  size?: "sm" | "xs";
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`relative ${size === "xs" ? "text-[13px]" : "text-sm"} text-gray-500 font-medium hover:text-black transition-colors duration-150 group inline-flex items-baseline gap-0.5`}
  >
    {label}
    {external && (
      <sup className="text-[10px] text-gray-400 leading-none">↗</sup>
    )}
    <span className="absolute left-0 -bottom-[2px] h-[1.5px] w-0 group-hover:w-full transition-all duration-300 bg-black" />
  </Link>
);

const Sep = () => (
  <div className="hidden sm:block w-px h-5 self-center shrink-0 bg-gray-200" />
);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;

    const onScroll = ({ scroll }: { scroll: number }) =>
      setScrolled(scroll > 40);
    lenis.on("scroll", onScroll);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.off("scroll", onScroll);
      lenis.destroy();
    };
  }, []);

  const transition = { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };
  const flatAnim = scrolled ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 };
  const pillAnim = scrolled ? { y: 0, opacity: 1 } : { y: -80, opacity: 0 };

  return (
    <>
      {/* Flat navbar */}
      <motion.div
        className="sticky top-0 z-50 w-full"
        initial={{ y: -60, opacity: 0 }}
        animate={flatAnim}
        transition={transition}
        style={{ pointerEvents: scrolled ? "none" : "auto" }}
      >
        <nav className="flex items-center justify-between px-8 h-14 bg-white ">
          <Logo />
          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              >
                <NavLink {...item} />
              </motion.div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.42 }}
              className="hidden sm:flex items-center gap-2"
            >
              <Link
                href="/login"
                className="h-9 px-4 rounded-full text-sm font-medium text-black border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all inline-flex items-center justify-center"
              >
                Login
              </Link>
              <Link
                href="/access"
                className="h-9 px-4 rounded-full text-sm font-medium text-white bg-black border border-black hover:bg-gray-800 transition-all inline-flex items-center justify-center"
              >
                Get access
              </Link>
            </motion.div>
            <button
              className="md:hidden p-2 text-black"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </motion.div>

      {/* Pill navbar */}
      <motion.div
        className="fixed top-0 inset-x-0 z-50 flex justify-center pt-[10px]"
        initial={{ y: -80, opacity: 0 }}
        animate={pillAnim}
        transition={transition}
        style={{ pointerEvents: scrolled ? "auto" : "none" }}
      >
        <div
          className="flex items-center gap-4 px-5 py-[9px] rounded-full bg-white"
          style={{
            boxShadow: "0 4px 28px rgba(0,0,0,0.11)",
            width: "min(760px, calc(100% - 32px))",
            justifyContent: "space-between",
          }}
        >
          <Logo />
          <Sep />
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.href} {...item} size="xs" />
            ))}
          </div>
          <Sep />
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex h-8 px-4 rounded-full text-[13px] font-medium text-black border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all items-center justify-center"
            >
              Login
            </Link>
            <Link
              href="/access"
              className="
                  inline-flex
                  h-8
                  px-3
                  sm:px-4
                  rounded-full
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  whitespace-nowrap
                  text-white
                  bg-black
                  border
                  border-black
                  hover:bg-gray-800
                  transition-all
                  items-center
                  justify-center
                "
            >
              Get access
            </Link>
            <button
              className="md:hidden p-2 text-black"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <motion.div
        className="md:hidden fixed inset-0 z-40 flex flex-col px-6 pt-24 pb-10 bg-white"
        initial={{ opacity: 0, y: -30 }}
        animate={mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
        style={{ pointerEvents: mobileOpen ? "auto" : "none" }}
      >
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_LINKS.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -24 }}
              animate={
                mobileOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }
              }
              transition={{
                duration: 0.35,
                delay: mobileOpen ? 0.08 * (i + 1) : 0,
              }}
            >
              <Link
                href={item.href}
                className="block text-[38px] font-extrabold tracking-tight leading-none py-3 text-black hover:opacity-60 transition-opacity"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={mobileOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.35, delay: mobileOpen ? 0.42 : 0 }}
          className="flex flex-col gap-3"
        >
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="w-full py-4 rounded-xl border border-gray-300 text-black text-[14px] font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/access"
            onClick={() => setMobileOpen(false)}
            className="w-full py-4 rounded-xl bg-black text-white text-[14px] font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            Get access
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
}
