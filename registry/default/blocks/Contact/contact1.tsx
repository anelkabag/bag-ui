"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Video, Clock, CalendarDays, Globe, X } from "lucide-react";
import Image from "next/image";

/**
 * Contact1 — Booking / scheduling card (responsive)
 * Stack: Next.js (App Router) + Tailwind CSS + Framer Motion
 */

const details = [
  { icon: Clock, label: "60 minutes one-on-one session" },
  { icon: Video, label: "Video Call (Google Meet)" },
  { icon: CalendarDays, label: "2:00 PM - 3:00 PM Tuesday, Feb 20, 2025" },
  { icon: Globe, label: "GMT +7" },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Contact1() {
  const [message, setMessage] = useState("");
  const [portfolio, setPortfolio] = useState<"share" | "none">("share");

  const maxLength = 200;

  return (
    <section className="flex min-h-screen w-full items-center justify-center px-4 py-8 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-2xl border border-zinc-200 bg-black shadow-2xl shadow-black/10 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]"
      >
        {/* Left panel — session summary (dark) */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex h-full flex-col gap-5 bg-zinc-950 p-5 sm:gap-6 sm:p-7"
        >
          <motion.div
            variants={item}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800"
          >
            <Image
              src="/logoW.png"
              alt="BagUI"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          </motion.div>

          <motion.div variants={item} className="space-y-1">
            <p className="text-xs text-zinc-400">Bag\Ui - by Anelka</p>
            <h2 className="text-base font-semibold tracking-tight text-white sm:text-lg">
              Interview - Product Designer
            </h2>
          </motion.div>

          <div className="flex flex-col gap-3 sm:gap-3.5">
            {details.map(({ icon: Icon, label }) => (
              <motion.div
                key={label}
                variants={item}
                className="flex items-center gap-3 text-xs text-zinc-400"
              >
                <Icon className="h-4 w-4 shrink-0 text-zinc-500" />
                <span>{label}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            variants={item}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-medium text-white transition-colors hover:bg-zinc-800 cursor-pointer md:mt-auto"
          >
            Set Call Setting
          </motion.button>
        </motion.div>

        {/* Right panel — form (white, padded so the div reads as its own surface) */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-4 bg-white p-5 m-1.5 rounded-lg sm:p-7 sm:m-2"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">
              Input Details
            </h3>
            <button
              type="button"
              aria-label="Close"
              className="rounded-full p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-700">Full name</span>
            <input
              type="text"
              placeholder="Your name..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-700">
              Email Address
            </span>
            <input
              type="email"
              placeholder="your@example.com"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-700">
              What would you like to discuss?
            </span>
            <div className="relative">
              <textarea
                value={message}
                maxLength={maxLength}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your goals and questions for the session..."
                rows={2}
                className="w-full resize-none rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 pb-5 text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300"
              />
              <span className="pointer-events-none absolute bottom-1.5 right-2.5 text-[10px] text-zinc-400">
                {message.length}/{maxLength}
              </span>
            </div>
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-xs font-medium text-zinc-700 mb-1">
              Will you be sharing your portfolio during the session?
            </legend>

            <label className="flex cursor-pointer items-center gap-2.5">
              <span
                onClick={() => setPortfolio("share")}
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  portfolio === "share" ? "border-zinc-900" : "border-zinc-300"
                }`}
              >
                {portfolio === "share" && (
                  <motion.span
                    layoutId="portfolio-dot"
                    className="h-1.5 w-1.5 rounded-full bg-zinc-900"
                  />
                )}
              </span>
              <span className="text-xs text-zinc-700">
                Yes, I&apos;ll share my portfolio
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2.5">
              <span
                onClick={() => setPortfolio("none")}
                className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  portfolio === "none" ? "border-zinc-900" : "border-zinc-300"
                }`}
              >
                {portfolio === "none" && (
                  <motion.span
                    layoutId="portfolio-dot"
                    className="h-1.5 w-1.5 rounded-full bg-zinc-900"
                  />
                )}
              </span>
              <span className="text-xs text-zinc-700">
                No portfolio review needed
              </span>
            </label>
          </fieldset>

          <p className="text-[11px] leading-relaxed text-zinc-500">
            By proceeding, you agree to our{" "}
            <a
              href="#"
              className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-zinc-700 underline underline-offset-2 hover:text-zinc-900"
            >
              Privacy Policy
            </a>
          </p>

          <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="text-[11px] text-zinc-500">
              24 hours free cancellation
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="w-full rounded-lg border border-zinc-200 px-4 py-2 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 cursor-pointer sm:w-auto"
              >
                Reset
              </button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-zinc-800 cursor-pointer sm:w-auto"
              >
                Schedule Now
              </motion.button>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </section>
  );
}
