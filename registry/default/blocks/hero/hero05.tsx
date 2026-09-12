"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Search,
  Bell,
  Bookmark,
  Video,
  Briefcase,
  LayoutGrid,
  BarChart3,
  Package,
  ChevronRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Data                                                                 */
/* ------------------------------------------------------------------ */

const talentMenu = [
  { label: "Browse Jobs", description: "Explore open roles from vetted companies" },
  { label: "Career Resources", description: "Guides to help you land your next role" },
  { label: "Salary Guide", description: "Benchmark your compensation by role" },
];

const companiesMenu = [
  { label: "Post a Job", description: "Reach qualified candidates in days" },
  { label: "Talent Search", description: "Browse a curated pool of vetted talent" },
  { label: "Pricing", description: "Plans for teams of every size" },
];

const otherVacancies = [
  { name: "Sarah Connor", role: "Backend Engineer", company: "Quantix Corporation, Inc.", time: "1:00 PM - 2:00 PM" },
  { name: "Ahsan Rahman", role: "UI/UX Designer", company: "Nimbus Labs, Inc.", time: "3:30 PM - 4:00 PM" },
];

/* ------------------------------------------------------------------ */
/* Small atoms                                                          */
/* ------------------------------------------------------------------ */

function HireteamLogo({ size = 22, textClassName = "text-[17px]" }: { size?: number; textClassName?: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size * 0.7} viewBox="0 0 30 20" fill="none">
        <ellipse cx="11" cy="10" rx="10" ry="9" fill="#171614" />
        <ellipse cx="21" cy="10" rx="8" ry="7.2" fill="#171614" fillOpacity="0.92" />
      </svg>
      <span className={`font-semibold tracking-tight text-neutral-900 ${textClassName}`}>Hireteam</span>
    </div>
  );
}

function NavDropdown({ label, items }: { label: string; items: { label: string; description: string }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-[14.5px] text-neutral-700 transition-colors hover:text-neutral-950"
      >
        {label}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-1/2 top-full z-30 mt-3 w-[240px] -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.15)]"
          >
            {items.map((item) => (
              <button
                key={item.label}
                onClick={() => setOpen(false)}
                className="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left hover:bg-neutral-50"
              >
                <span className="text-[13.5px] font-medium text-neutral-900">{item.label}</span>
                <span className="text-[12px] text-neutral-500">{item.description}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navbar                                                                */
/* ------------------------------------------------------------------ */

function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 sm:px-10"
    >
      <HireteamLogo />

      <nav className="hidden items-center gap-7 md:flex">
        <NavDropdown label="For Talent" items={talentMenu} />
        <NavDropdown label="For Companies" items={companiesMenu} />
        <button className="text-[14.5px] text-neutral-700 transition-colors hover:text-neutral-950">About</button>
        <button className="text-[14.5px] text-neutral-700 transition-colors hover:text-neutral-950">Resources</button>
      </nav>

      <div className="flex items-center gap-3">
        <button className="rounded-full border border-neutral-300 px-4 py-2 text-[13.5px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100">
          LogIn
        </button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-neutral-900 px-4 py-2 text-[13.5px] font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Get Started
        </motion.button>
      </div>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ */
/* Headline + CTAs                                                      */
/* ------------------------------------------------------------------ */

function HeroCopy() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 pt-20 text-center sm:pt-24">
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
        className="text-[40px] font-extrabold leading-[1.08] tracking-tight text-neutral-950 sm:text-[52px]"
      >
        Careers That Matter,
        <br />
        Talent That Transforms
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.22 }}
        className="mt-5 max-w-xl text-[15.5px] leading-relaxed text-neutral-500"
      >
        Hire top tech talent to meet your goals. Build a team ready to turn your vision into reality with skill and precision.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.34 }}
        className="mt-7 flex items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Hire Talent Now
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-neutral-300 px-5 py-2.5 text-[14px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
        >
          Learn More
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App preview                                                          */
/* ------------------------------------------------------------------ */

function SidebarNavItem({ icon: Icon, label, active }: { icon: React.ComponentType<{ className?: string }>; label: string; active?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] ${active ? "bg-neutral-100 font-medium text-neutral-900" : "text-neutral-600"}`}>
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

function VacancyRow({ item }: { item: (typeof otherVacancies)[number] }) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-neutral-200/70 px-5 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={`https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(item.name)}&backgroundColor=f4f1ec`}
          alt={item.name}
          className="h-8 w-8 shrink-0 rounded-full border border-neutral-200 bg-neutral-50 object-cover"
        />
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-neutral-900">{item.name}</p>
          <p className="truncate text-[12px] text-neutral-500">{item.role}</p>
        </div>
      </div>
      <div className="hidden text-[12.5px] text-neutral-600 sm:block">{item.time}</div>
      <div className="hidden truncate text-[12.5px] text-neutral-600 md:block">{item.company}</div>
      <button className="flex shrink-0 items-center gap-0.5 rounded-full border border-neutral-300 px-3 py-1.5 text-[12px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100">
        View <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  );
}

function AppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.45 }}
      className="relative mx-auto mt-14 max-w-4xl px-4 sm:px-6"
    >
      <div className="relative h-[320px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.15)] sm:h-[360px]">
        <div className="flex h-full">
          {/* sidebar */}
          <div className="hidden w-[190px] shrink-0 flex-col border-r border-neutral-200 p-4 sm:flex">
            <HireteamLogo size={18} textClassName="text-[14.5px]" />
            <p className="mt-6 mb-2 text-[11px] font-medium uppercase tracking-wider text-neutral-400">Menu</p>
            <div className="flex flex-col gap-0.5">
              <SidebarNavItem icon={LayoutGrid} label="Overview" active />
              <SidebarNavItem icon={BarChart3} label="Statistics" />
              <SidebarNavItem icon={Package} label="Products" />
            </div>
          </div>

          {/* main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-3.5">
              <p className="shrink-0 text-[13.5px] font-medium text-neutral-900">Hello, Jack Sparrow</p>
              <div className="hidden flex-1 items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 text-neutral-400 sm:flex sm:max-w-[220px]">
                <Search className="h-3.5 w-3.5" />
                <span className="text-[12px]">Search for any new job</span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500">
                  <Bell className="h-3.5 w-3.5" />
                  <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-neutral-900" />
                </span>
                <span className="relative hidden h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 sm:flex">
                  <Bookmark className="h-3.5 w-3.5" />
                  <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-neutral-900" />
                </span>
                <button className="rounded-full border border-neutral-300 px-3 py-1.5 text-[12px] font-medium text-neutral-800">Applied Jobs</button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden px-5 py-4">
              <div className="rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3">
                  <Video className="h-4 w-4 text-neutral-700" />
                  <p className="text-[13px] font-semibold text-neutral-900">Upcoming Interview</p>
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <img
                      src="https://api.dicebear.com/9.x/notionists/svg?seed=Jack-Sparrow&backgroundColor=f4f1ec"
                      alt="Jack Sparrow"
                      className="h-9 w-9 shrink-0 rounded-full border border-neutral-200 bg-neutral-50 object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-neutral-900">Jack Sparrow</p>
                      <p className="truncate text-[12px] text-neutral-500">Front-End Developer</p>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-[11px] text-neutral-400">Time</p>
                    <p className="text-[12.5px] font-medium text-neutral-800">10:30 AM - 11:30 AM</p>
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-[11px] text-neutral-400">Company</p>
                    <p className="text-[12.5px] font-medium text-neutral-800">Quantix Corporation, Inc.</p>
                  </div>
                  <button className="shrink-0 rounded-full border border-neutral-300 px-3 py-1.5 text-[12px] font-medium text-neutral-800 transition-colors hover:bg-neutral-100">
                    View Details
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-neutral-200">
                <div className="flex items-center gap-2 px-4 py-3">
                  <Briefcase className="h-4 w-4 text-neutral-700" />
                  <p className="text-[13px] font-semibold text-neutral-900">Other Vacancies</p>
                </div>
                {otherVacancies.map((v) => (
                  <VacancyRow key={v.name} item={v} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* fade-out mask to hint the app continues below */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F6F4EF] to-transparent" />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                  */
/* ------------------------------------------------------------------ */

export default function Hero5() {
  return (
    <section className="min-h-screen bg-[#F6F4EF]">
      <Navbar />
      <HeroCopy />
      <AppPreview />
      <div className="h-16" />
    </section>
  );
}