"use client";

import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Image from "next/image";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Video,
  Globe,
  Rocket,
} from "lucide-react";

type NavItem = { title: string; description: string };
type NavLink = { label: string; dropdown: boolean; items?: NavItem[] };

const NAV_LINKS: NavLink[] = [
  {
    label: "Solutions",
    dropdown: true,
    items: [
      { title: "For Startups", description: "Ship scheduling fast" },
      { title: "For Enterprise", description: "Scale your meeting infra" },
      { title: "For Agencies", description: "Client booking, streamlined" },
    ],
  },
  { label: "Enterprise", dropdown: false },
  {
    label: "Developers",
    dropdown: true,
    items: [
      { title: "API Reference", description: "Build on the platform" },
      { title: "Webhooks", description: "React to booking events" },
      { title: "SDKs", description: "Official client libraries" },
    ],
  },
  {
    label: "Resources",
    dropdown: true,
    items: [
      { title: "Blog", description: "Product updates & guides" },
      { title: "Help Center", description: "Get support fast" },
      { title: "Changelog", description: "See what shipped" },
    ],
  },
  { label: "Pricing", dropdown: false },
];

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
// Reference "today" — also the default selected date
const TODAY = { year: 2026, month: 3, day: 5 }; // April 5, 2026

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstWeekday(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isPastDate(year: number, month: number, day: number) {
  return (
    new Date(year, month, day) < new Date(TODAY.year, TODAY.month, TODAY.day)
  );
}
function isAvailable(year: number, month: number, day: number) {
  const weekday = new Date(year, month, day).getDay();
  const isWeekend = weekday === 0 || weekday === 6;
  return !isWeekend && !isPastDate(year, month, day);
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const monthVariants: Variants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Hero2() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [viewDate, setViewDate] = useState({
    year: TODAY.year,
    month: TODAY.month,
  });
  const [direction, setDirection] = useState(0);

  const [selectedDate, setSelectedDate] = useState({ ...TODAY });

  function changeMonth(offset: number) {
    setDirection(offset);
    setViewDate(({ year, month }) => {
      const d = new Date(year, month + offset, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  function handleSelectDay(day: number) {
    if (!isAvailable(viewDate.year, viewDate.month, day)) return;
    setSelectedDate({ year: viewDate.year, month: viewDate.month, day });
  }

  const leadingBlanks = firstWeekday(viewDate.year, viewDate.month);
  const totalDays = daysInMonth(viewDate.year, viewDate.month);
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const selectedWeekday =
    WEEKDAY_NAMES[
      new Date(selectedDate.year, selectedDate.month, selectedDate.day).getDay()
    ];
  const selectedMonthShort = MONTH_NAMES[selectedDate.month].slice(0, 3);

  return (
    <section className="relative w-full overflow-hidden bg-white text-neutral-900">
      {/* click-away layer for dropdowns */}
      {openDropdown && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* Nav */}
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6"
      >
        <span className="text-[19px] font-semibold tracking-tight">
          BagUi.pro
        </span>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <div key={link.label} className="relative">
              <button
                onClick={() =>
                  link.dropdown &&
                  setOpenDropdown(
                    openDropdown === link.label ? null : link.label,
                  )
                }
                className="flex items-center gap-1 text-[14px] font-medium text-neutral-700 transition-colors hover:text-neutral-950 cursor-pointer"
              >
                {link.label}
                {link.dropdown && (
                  <motion.span
                    animate={{ rotate: openDropdown === link.label ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {link.dropdown && openDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-0 top-full z-20 mt-3 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.12)]"
                  >
                    {link.items?.map((item) => (
                      <button
                        key={item.title}
                        className="flex w-full flex-col items-start gap-0.5 rounded-lg px-3 py-2 text-left transition-colors hover:bg-neutral-50 cursor-pointer"
                      >
                        <span className="text-[13.5px] font-medium text-neutral-900">
                          {item.title}
                        </span>
                        <span className="text-[12px] text-neutral-500">
                          {item.description}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <button className="text-[14px] font-medium text-neutral-400 hover:text-neutral-600 cursor-pointer">
            Login
          </button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-[14px] font-medium text-white cursor-pointer"
          >
            <span className="grid h-4 w-4 place-items-center text-[10px]">
              <Rocket size={12} />
            </span>
            Sign up for free
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero copy */}
      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pt-10 text-center">
        <motion.button
          custom={1}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mb-6 flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-1.5 text-[13px] font-medium text-neutral-600 shadow-sm"
        >
          BagUI.pro launches v0.8
          <ChevronRight className="h-3.5 w-3.5" />
        </motion.button>

        <motion.h1
          custom={2}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-[42px] font-semibold leading-[1.08] tracking-tight sm:text-[56px]"
        >
          The better way to
          <br />
          schedule your meetings
        </motion.h1>

        <motion.p
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-neutral-500"
        >
          A fully customizable scheduling experience for individuals, businesses
          taking calls and developers building scheduling platforms where users
          meet users.
        </motion.p>

        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-7 flex flex-col items-center gap-3 sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-[14px] font-medium text-white cursor-pointer"
          >
            <GoogleIcon />
            Sign up with google
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-[14px] font-medium text-neutral-800 cursor-pointer"
          >
            Sign up with Email
          </motion.button>
        </motion.div>

        <motion.p
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="mt-4 text-[13px] text-neutral-400"
        >
          No credit card required
        </motion.p>
      </div>

      {/* Booking card preview */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto mt-14 max-w-5xl px-4"
      >
        <div className="relative overflow-hidden rounded-t-2xl border-x-8 border-t-8 border-neutral-200 bg-white shadow-[0_-8px_40px_-12px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col sm:flex-row">
            {/* Left: event info */}
            <div className="shrink-0 border-b border-neutral-100 p-7 sm:w-[280px] sm:border-b-0 sm:border-r">
              <Image
                src="/avatar.png"
                alt="Avatar"
                width={36}
                height={36}
                className="mb-4 rounded-full object-cover"
              />
              <p className="text-[13px] text-neutral-400">Anelka Bag</p>
              <h3 className="mt-1 text-[18px] font-semibold text-neutral-900">
                Design Workshop
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-neutral-500">
                A longer chat to run through design.
              </p>

              <div className="mt-6 flex flex-col gap-3 text-[13.5px] text-neutral-600">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  30 mins
                </div>
                <div className="flex items-center gap-2.5">
                  <Video className="h-4 w-4 text-neutral-400" />
                  Cal video
                </div>
                <button className="flex items-center gap-2.5 text-left">
                  <Globe className="h-4 w-4 text-neutral-400" />
                  DR Congo/Goma
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedDate.year}-${selectedDate.month}-${selectedDate.day}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 rounded-xl bg-neutral-50 px-3.5 py-3"
                >
                  <p className="text-[13px] font-medium text-neutral-900">
                    {selectedWeekday}, {selectedMonthShort} {selectedDate.day}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Calendar */}
            <div className="flex-1 p-7">
              <div className="mb-5 flex items-center justify-between">
                <h4 className="text-[16px] font-semibold text-neutral-900">
                  {MONTH_NAMES[viewDate.month]}{" "}
                  <span className="font-normal text-neutral-400">
                    {viewDate.year}
                  </span>
                </h4>
                <div className="flex items-center gap-1">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => changeMonth(-1)}
                    className="grid h-7 w-7 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => changeMonth(1)}
                    className="grid h-7 w-7 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-y-3 text-center">
                {WEEKDAYS.map((day) => (
                  <span
                    key={day}
                    className="text-[11px] font-medium text-neutral-400"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={`${viewDate.year}-${viewDate.month}`}
                    custom={direction}
                    variants={monthVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="grid grid-cols-7 gap-y-3 pt-3 text-center"
                  >
                    {cells.map((day, i) => {
                      if (day === null) return <span key={`blank-${i}`} />;

                      const available = isAvailable(
                        viewDate.year,
                        viewDate.month,
                        day,
                      );
                      const selected =
                        selectedDate.year === viewDate.year &&
                        selectedDate.month === viewDate.month &&
                        selectedDate.day === day;
                      const today =
                        TODAY.year === viewDate.year &&
                        TODAY.month === viewDate.month &&
                        TODAY.day === day;

                      return (
                        <motion.button
                          key={day}
                          whileTap={available ? { scale: 0.9 } : undefined}
                          disabled={!available}
                          onClick={() => handleSelectDay(day)}
                          className={[
                            "relative mx-auto flex h-9 w-9 items-center justify-center rounded-xl text-[13.5px] transition-colors",
                            available
                              ? "cursor-pointer hover:bg-neutral-100"
                              : "cursor-not-allowed",
                          ].join(" ")}
                        >
                          {selected && (
                            <motion.span
                              layoutId="day-highlight"
                              className="absolute inset-0 rounded-xl bg-neutral-900"
                              transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 30,
                              }}
                            />
                          )}
                          <span
                            className={[
                              "relative z-10",
                              selected
                                ? "text-white"
                                : available
                                  ? "text-neutral-900"
                                  : "text-neutral-300",
                            ].join(" ")}
                          >
                            {day}
                          </span>
                          {today && !selected && (
                            <span className="absolute -bottom-1 h-1 w-1 rounded-xl bg-neutral-400" />
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* bottom fade, matching the cropped hero look */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.87 2.68-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33C2.44 15.98 5.48 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
      />
    </svg>
  );
}
