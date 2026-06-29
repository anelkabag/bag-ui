"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

// ─── Avatar data — real photos via DiceBear (open-source, no key needed) ──────
const AVATARS = [
  {
    id: 1,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=JK&backgroundColor=b6e3f4",
  },
  {
    id: 2,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=AM&backgroundColor=c0aede",
  },
  {
    id: 3,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=SL&backgroundColor=ffdfbf",
  },
  {
    id: 4,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=TR&backgroundColor=d1d4f9",
  },
  {
    id: 5,
    src: "https://api.dicebear.com/9.x/notionists/svg?seed=PW&backgroundColor=ffd5dc",
  },
];

// ─── Motion variants ──────────────────────────────────────────────────────────
const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const slide: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const panelVariant: Variants = {
  hidden: { opacity: 0, scale: 0.975 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut", delay: 0.1 },
  },
};

const currentYear = new Date().getFullYear();

function AvatarStack() {
  return (
    <motion.div variants={slide} className="flex items-center">
      <div className="flex -space-x-2.5">
        {AVATARS.map((a) => (
          <div
            key={a.id}
            className="w-10 h-10 rounded-sm border-2 border-white overflow-hidden bg-zinc-100 select-none flex-shrink-0"
          >
            <Image
              src={a.src}
              alt="team member"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LeftHeading() {
  return (
    <motion.h2
      variants={slide}
      className="text-[1.85rem] sm:text-[2.1rem] leading-[1.18] tracking-[-0.025em] text-zinc-900"
      style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
    >
      We build digital products
      <br />
      that help ambitious
      <br />
      businesses grow faster.{" "}
      <span role="img" aria-label="heart">
        👨🏾‍💻
      </span>
    </motion.h2>
  );
}

function CTACard() {
  return (
    <motion.div
      variants={slide}
      className="flex items-center gap-4 rounded-2xl px-5 py-4 w-fit bg-gray-100"
    >
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="text-sm font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 bg-black text-white cursor-pointer"
      >
        Let&apos;s talk
      </motion.button>
      <div
        className="text-[12px] leading-[1.6]"
        style={{
          color: "#71717a",
          fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
        }}
      >
        <p>Book a free strategy call.</p>
        <p>Tell us about your project.</p>
      </div>
    </motion.div>
  );
}

function TrustBadges() {
  return (
    <motion.div variants={slide} className="flex items-center gap-6 flex-wrap">
      {/* Clutch */}
      <div className="flex flex-col gap-0.5">
        <p
          className="text-[9px] font-semibold uppercase tracking-widest"
          style={{
            color: "#71717a",
            fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
          }}
        >
          Reviewed on
        </p>
        <div className="flex items-center gap-1.5">
          <span
            className="text-[1.25rem] font-bold tracking-tight leading-none text-zinc-900"
            style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
          >
            Clutch
          </span>
          <span className="text-red-500 text-sm leading-none">★★★★★</span>
        </div>
        <p
          className="text-[9px] -mt-0.5"
          style={{
            color: "#71717a",
            fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
          }}
        >
          10 reviews
        </p>
      </div>

      <div className="w-px h-10 bg-zinc-200" />

      {/* Webflow */}
      <div className="flex flex-col gap-0.5">
        <p
          className="text-[9px] font-semibold uppercase tracking-widest"
          style={{
            color: "#71717a",
            fontFamily: "'Geist', 'Inter', system-ui, sans-serif",
          }}
        >
          Professional Partner
        </p>
        <div className="flex items-center gap-1.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M17.6 3.6H6.4C4.9 3.6 3.6 4.9 3.6 6.4v11.2c0 1.5 1.3 2.8 2.8 2.8h11.2c1.5 0 2.8-1.3 2.8-2.8V6.4c0-1.5-1.3-2.8-2.8-2.8z"
              fill="#4353FF"
            />
            <path
              d="M15.5 8.5l-2.3 4.6-1.1-2.8L10.5 14 9 8.5H7l2.5 7h2l1.2-3.5 1.1 3.5h2L18 8.5h-2.5z"
              fill="white"
            />
          </svg>
          <span
            className="text-[1.25rem] font-bold tracking-tight leading-none text-zinc-900"
            style={{ fontFamily: "'Geist', 'Inter', system-ui, sans-serif" }}
          >
            Webflow
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function RightPanel() {
  const socialLinks = ["x", "behance", "linkedin", "dribbble"];
  const font = { fontFamily: "'Geist', 'Inter', system-ui, sans-serif" };

  return (
    <motion.div
      variants={panelVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="h-full rounded-[2rem] flex flex-col justify-between p-10 sm:p-12"
      style={{ backgroundColor: "#09090b" }}
    >
      <div className="space-y-7">
        <div className="space-y-2">
          <h3
            className="text-[#fafafa] text-2xl sm:text-[1.75rem] font-semibold leading-[1.25] tracking-[-0.02em]"
            style={font}
          >
            Let&apos;s build something your
            <br />
            customers will remember.
          </h3>
          <p
            className="text-base font-normal"
            style={{ color: "#52525b", ...font }}
          >
            Ready to get started?
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 cursor-pointer"
            style={{ backgroundColor: "#fafafa", color: "#09090b", ...font }}
          >
            Start a Project
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="text-sm font-semibold px-6 py-3 rounded-xl transition-colors duration-200 focus:outline-none focus-visible:ring-2 cursor-pointer"
            style={{ backgroundColor: "#27272a", color: "#fafafa", ...font }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#3f3f46")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#27272a")
            }
          >
            Book a Call
          </motion.button>
        </div>
      </div>

      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mt-10 pt-8"
        style={{ borderTop: "1px solid #27272a" }}
      >
        <div className="space-y-1">
          <p className="text-sm" style={{ color: "#71717a", ...font }}>
            support@bagui.dev
          </p>
          <p className="text-xs" style={{ color: "#3f3f46", ...font }}>
            © {currentYear} BagUI. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          {socialLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs capitalize transition-colors duration-200"
              style={{ color: "#52525b", ...font }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
            >
              {link}
            </a>
          ))}
          <span
            className="w-px h-3 hidden sm:block"
            style={{ backgroundColor: "#27272a" }}
          />
          <a
            href="#"
            className="text-xs transition-colors duration-200"
            style={{ color: "#52525b", ...font }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fafafa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#52525b")}
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function DivBlockFooter() {
  return (
    <footer
      className="w-full px-6 sm:px-10 lg:px-16 py-10 sm:py-14"
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        <motion.div
          className="w-full lg:w-[30%] flex flex-col justify-between gap-6"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <AvatarStack />
          <LeftHeading />
          <CTACard />
          <TrustBadges />
        </motion.div>

        <div className="w-full lg:w-[70%] flex flex-col">
          <RightPanel />
        </div>
      </div>
    </footer>
  );
}
