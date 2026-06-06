"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Calendar, Moon, Sun, Menu, X } from "lucide-react";

export default function Hero1() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true, margin: "-80px 0px" });

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 120]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);

  const bars = [40, 65, 45, 80, 75, 90];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const navLinks = [
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div
      className="min-h-screen bg-white dark:bg-zinc-950 overflow-hidden"
      style={{
        fontFamily: "var(--font-geist-sans, 'Geist', system-ui, sans-serif)",
      }}
      ref={heroRef}
    >
      <motion.header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)] dark:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]"
            : "bg-transparent",
        ].join(" ")}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-8"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <Link href="/" className="flex items-center gap-3 group">
                <img
                  src="https://bagui.vercel.app/logoR.png"
                  alt="BagUi logo"
                  className="w-8 h-8 object-contain rounded-lg"
                />
                <span className="font-semibold text-[15px] text-zinc-950 dark:text-white tracking-[-0.01em]">
                  Bag\Ui
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-0.5">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3 py-1.5 rounded-md text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-zinc-800/50 transition-all duration-150 font-medium"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </motion.div>

            <motion.div
              className="hidden md:flex items-center gap-2"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle theme"
              >
                {dark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                >
                  Sign up
                </Link>
              </motion.div>
            </motion.div>

            <div className="flex items-center gap-1 md:hidden">
              <button
                onClick={() => setDark(!dark)}
                className="p-2 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {dark ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {menuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800/60"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="px-4 py-3 space-y-0.5">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="block px-3 py-2.5 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2">
                <Link
                  href="/login"
                  className="block px-3 py-2.5 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="block px-3 py-2.5 rounded-md text-sm font-medium bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <section className="relative pt-28 pb-24 md:pt-36 md:pb-32 overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-zinc-100 dark:bg-zinc-900"
          style={{ y: y1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1 }}
        />
        <motion.div
          className="pointer-events-none absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-zinc-100 dark:bg-zinc-900"
          style={{ y: y2 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 0.2 }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
            <div className="lg:w-1/2 mb-14 lg:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-8"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-medium tracking-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  New — Beta v1.0 available
                </span>
              </motion.div>

              <motion.h1
                className="text-[2.6rem] sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1] tracking-[-0.03em] text-zinc-950 dark:text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                Organize events
                <br />
                to{" "}
                <span className="relative">
                  <span className="relative z-10">maximum impact</span>
                  <motion.span
                    className="absolute bottom-1 left-0 right-0 h-[5px] bg-zinc-200 dark:bg-zinc-700 rounded-full -z-0"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={heroInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.75 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed mb-9 max-w-md"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Bag\Ui simplifies event management for teams. Plan, organize,
                and track your seminars and conferences with ease.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 12 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                  >
                    Sign in
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                  >
                    Create account
                  </Link>
                </motion.div>
              </motion.div>

              <motion.div
                className="flex items-center gap-3 mt-8"
                initial={{ opacity: 0 }}
                animate={heroInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex -space-x-2">
                  {["#f97316", "#8b5cf6", "#06b6d4", "#10b981"].map(
                    (color, i) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-950"
                        style={{ background: color }}
                      />
                    ),
                  )}
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-900 dark:text-white">
                    +2 400
                  </span>{" "}
                  events organized this month
                </p>
              </motion.div>
            </div>

            <motion.div
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                duration: 0.75,
                delay: 0.35,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.div
                className="absolute -right-4 -bottom-4 w-32 h-32 bg-zinc-100 dark:bg-zinc-900 rounded-2xl"
                initial={{ rotate: 0 }}
                animate={{ rotate: 8 }}
                transition={{ type: "spring", stiffness: 60, delay: 1 }}
              />

              <div className="relative z-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 tracking-tight">
                    Bag\Ui — Dashboard
                  </span>
                  <div className="w-12" />
                </div>

                <div className="p-5 space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Events", value: "24", delta: "+3" },
                      { label: "Participants", value: "1 840", delta: "+12%" },
                      { label: "Satisfaction", value: "96%", delta: "↑" },
                    ].map((s, i) => (
                      <motion.div
                        key={i}
                        className="bg-zinc-50 dark:bg-zinc-950 rounded-xl p-3 border border-zinc-100 dark:border-zinc-800"
                        initial={{ opacity: 0, y: 8 }}
                        animate={heroInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
                      >
                        <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 mb-1 tracking-wide uppercase">
                          {s.label}
                        </p>
                        <p className="text-xl font-semibold text-zinc-950 dark:text-white tracking-tight">
                          {s.value}
                        </p>
                        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                          {s.delta}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white mb-3 tracking-tight">
                      Upcoming events
                    </p>
                    <div className="space-y-2">
                      {[
                        {
                          name: "Weka Launch",
                          date: "Dec 15, 2025",
                          count: "248",
                        },
                        {
                          name: "Web Seminar",
                          date: "Dec 20, 2025",
                          count: "124",
                        },
                      ].map((ev, i) => (
                        <motion.div
                          key={i}
                          className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800"
                          initial={{ opacity: 0, x: -8 }}
                          animate={heroInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                              <Calendar className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400" />
                            </div>
                            <div>
                              <p className="text-[13px] font-medium text-zinc-900 dark:text-white leading-none">
                                {ev.name}
                              </p>
                              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                                {ev.date}
                              </p>
                            </div>
                          </div>
                          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                            {ev.count} participants
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-white mb-3 tracking-tight">
                      Monthly stats
                    </p>
                    <div className="flex items-end gap-2 h-20 px-1">
                      {bars.map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 flex flex-col items-center gap-1"
                        >
                          <motion.div
                            className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-t-md"
                            style={{ height: `${h}%` }}
                            initial={{ scaleY: 0, originY: 1 }}
                            animate={heroInView ? { scaleY: 1 } : {}}
                            transition={{
                              delay: 0.8 + i * 0.06,
                              duration: 0.5,
                              ease: "easeOut",
                            }}
                          >
                            {h === 90 && (
                              <div className="w-full h-full bg-zinc-900 dark:bg-white rounded-t-md" />
                            )}
                          </motion.div>
                          <span className="text-[9px] text-zinc-400 dark:text-zinc-600">
                            {months[i]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-20"
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <p className="text-center text-xs font-medium text-zinc-400 dark:text-zinc-600 uppercase tracking-widest mb-6">
              Trusted by
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {[
                "https://www.google.com/favicon.ico",
                "https://www.microsoft.com/favicon.ico",
                "https://www.amazon.com/favicon.ico",
                "https://www.apple.com/favicon.ico",
              ].map((logo, i) => (
                <img
                  key={i}
                  src={logo}
                  alt={`Partner logo ${i + 1}`}
                  className="h-8 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
