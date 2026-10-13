"use client";

import { useState } from "react";
import { motion, Variants } from "motion/react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const card =
  "relative overflow-hidden rounded-[22px] border border-[#ececef] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.04)] dark:border-[#2a2a2f] dark:bg-[#1f1f23]";
const pill = "bg-[#f1f1f2] dark:bg-[#2a2a2f]";
const subtle = "text-[10px] text-[#8b8b92]";
const title = "text-[12.5px] font-medium text-[#111827] dark:text-zinc-100";

const ZapierMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" aria-hidden>
    <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
  </svg>
);

const SlackIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <rect x="1" y="5.5" width="5" height="2.4" rx="1.2" fill="#36c5f0" />
    <rect x="5.5" y="1" width="2.4" height="5" rx="1.2" fill="#2eb67d" />
    <rect x="8" y="6" width="5" height="2.4" rx="1.2" fill="#ecb22e" />
    <rect x="6" y="8" width="2.4" height="5" rx="1.2" fill="#e01e5a" />
  </svg>
);

const TeamsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <rect x="1" y="3" width="12" height="9" rx="2.5" fill="#5059c9" />
    <circle cx="8" cy="3.5" r="2.3" fill="#7b83eb" />
    <rect x="3" y="5.5" width="6" height="1.6" fill="#fff" />
    <rect x="5.2" y="5.5" width="1.6" height="4.5" fill="#fff" />
  </svg>
);

const NotionIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
    <rect x="1.5" y="1.5" width="11" height="11" rx="2.6" fill="#ffd23f" />
    <path d="M4.5 4h5M4.5 7h5M4.5 10h3" stroke="#111" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const KeyboardIcon = () => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" aria-hidden>
    <rect width="16" height="10" rx="2.2" />
    <g className="fill-white dark:fill-[#1f1f23]">
      <rect x="2" y="2.2" width="2" height="1.4" rx=".4" />
      <rect x="5" y="2.2" width="2" height="1.4" rx=".4" />
      <rect x="8" y="2.2" width="2" height="1.4" rx=".4" />
      <rect x="11" y="2.2" width="3" height="1.4" rx=".4" />
      <rect x="4" y="6" width="8" height="1.4" rx=".4" />
    </g>
  </svg>
);

function ZapierCard() {
  const [enabled, setEnabled] = useState(true);

  return (
    <motion.section
      variants={fadeUp}
      className={`${card} flex min-h-[340px] flex-col justify-between md:col-start-1 md:row-span-3 md:row-start-1 md:min-h-[430px]`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[55%] w-[70%] bg-[linear-gradient(#f3efe9_1px,transparent_1px),linear-gradient(90deg,#f3efe9_1px,transparent_1px)] bg-[length:44px_44px] opacity-90 [-webkit-mask-image:radial-gradient(circle_at_100%_0,#000,transparent_70%)] [mask-image:radial-gradient(circle_at_100%_0,#000,transparent_70%)] dark:opacity-10"
      />

      <div className="relative px-5 pt-5">
        <div className="grid size-[38px] place-items-center rounded-[10px] bg-gradient-to-br from-[#ff8a3d] to-[#f0541a] shadow-[0_4px_10px_rgba(240,84,26,0.28)]">
          <ZapierMark />
        </div>
        <h2 className="mb-3.5 mt-[62px] text-[14.5px] font-medium tracking-tight text-[#0f172a] dark:text-zinc-100">
          Zapier Integration
        </h2>
        <p className="text-xs leading-[1.65] text-[#8b8b92]">
          Unlock effortless automation. Connect your favorite apps, streamline workflows, and supercharge productivity with ease.
        </p>
      </div>

      <div className="relative mt-auto flex items-center justify-between border-t border-[#f1f1f2] px-4 pb-3.5 pt-3.5 dark:border-[#2a2a2f]">
        <button
          type="button"
          className={`inline-flex items-center gap-[7px] rounded-full px-3 py-2 text-[11.5px] font-medium ${pill} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0541a]`}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="#f0541a" aria-hidden>
            <rect x="1" y="2" width="9" height="4" rx="1.2" />
            <rect x="6" y="9" width="9" height="4" rx="1.2" opacity=".75" />
          </svg>
          Configure
        </button>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Enable Zapier integration"
          onClick={() => setEnabled((v) => !v)}
          className={`relative h-[22px] w-10 rounded-full ${pill} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0541a]`}
        >
          <span
            className={`absolute left-[3px] top-[3px] size-4 rounded-full transition-all duration-200 ${
              enabled ? "translate-x-[18px] bg-[#f0541a]" : "bg-[#a3a3aa]"
            }`}
          />
        </button>
      </div>
    </motion.section>
  );
}

function TrackersCard() {
  return (
    <motion.section variants={fadeUp} className={`${card} flex items-center justify-between px-4 py-3 md:col-start-2 md:row-start-1`}>
      <div>
        <div className={title}>Trackers Connected</div>
        <div className={`mt-[5px] ${subtle}`}>03 Active Integrations</div>
      </div>
      <div className="flex" aria-hidden>
        {[SlackIcon, TeamsIcon, NotionIcon].map((Icon, i) => (
          <span
            key={i}
            className={`grid size-[26px] place-items-center rounded-full border-2 border-[#f1ece8] bg-white shadow-[0_0_0_1px_#fff] dark:border-[#2a2a2f] dark:bg-[#1f1f23] dark:shadow-none ${i > 0 ? "-ml-1.5" : ""}`}
          >
            <Icon />
          </span>
        ))}
      </div>
    </motion.section>
  );
}

function FocusCard() {
  return (
    <motion.section variants={fadeUp} className={`${card} flex min-h-[190px] flex-col p-4 md:col-start-2 md:row-start-2`}>
      <div className="flex items-baseline justify-between">
        <span className={title}>Focusing</span>
        <span className="text-[10px] font-medium text-[#f08a5c]">Range Ratio</span>
      </div>
      <div className={`mt-[5px] ${subtle}`}>Productivity Analytics</div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="my-auto py-[18px] pb-3 text-[56px] font-medium leading-none tracking-[-0.04em] text-[#0f172a] dark:text-zinc-50"
      >
        42%
      </motion.div>

      <div className={`flex justify-between ${subtle}`}>
        <span>Maximum of focus</span>
        <b className="font-medium text-[#0c0c0d] dark:text-zinc-100">Monthly Focus</b>
      </div>
    </motion.section>
  );
}

function ProductivityCard() {
  return (
    <motion.section
      variants={fadeUp}
      className={`${card} flex min-h-[280px] flex-col justify-between px-5 py-[18px] md:col-start-3 md:row-span-2 md:row-start-1`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-[65%] w-[80%] bg-[radial-gradient(#d9d9de_1.1px,transparent_1.3px)] bg-[length:7px_7px] [-webkit-mask-image:radial-gradient(circle_at_100%_0,#000,transparent_72%)] [mask-image:radial-gradient(circle_at_100%_0,#000,transparent_72%)] dark:opacity-30"
      />
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-[52px] font-medium leading-none tracking-[-0.04em] text-[#0f172a] dark:text-zinc-50"
      >
        10X
      </motion.div>
      <div className="relative">
        <h3 className={`mb-[9px] ${title}`}>Team’s Productivity</h3>
        <p className="max-w-[190px] text-[11px] leading-[1.6] text-[#8b8b92]">
          Boost your team’s efficiency with our next-gen productivity solutions.
        </p>
      </div>
    </motion.section>
  );
}

function ShortcutCard() {
  return (
    <motion.section
      variants={fadeUp}
      className={`${card} flex items-center justify-between gap-3 py-3 pl-3 pr-4 md:col-span-2 md:col-start-2 md:row-start-3`}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <span className={`grid h-6 w-8 flex-none place-items-center rounded-md text-[#f0541a] ${pill}`} aria-hidden>
          <KeyboardIcon />
        </span>
        <div className="min-w-0">
          <div className={title}>Shortcut Keys</div>
          <div className={`mt-[5px] truncate max-md:whitespace-normal ${subtle}`}>
            Faster way to access the features.
          </div>
        </div>
      </div>

      <div className="flex flex-none items-center gap-2">
        <kbd className={`rounded-full px-4 py-[9px] font-sans text-xs font-medium tracking-wider ${pill}`}>⌘ + ⌥</kbd>
        <span className="text-[11px] font-medium text-[#0f172a] dark:text-zinc-100">+</span>
        <kbd className={`grid size-8 place-items-center rounded-full font-sans text-[11px] font-medium text-[#f0541a] ${pill}`}>M</kbd>
      </div>
    </motion.section>
  );
}

export default function FeaturesSection4() {
  return (
    <section className="w-full px-4 py-16">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={stagger}
        className="mx-auto max-w-[880px]"
      >
        <div className="mb-8 text-center">
          <h2 className="text-[28px] font-medium tracking-tight text-[#0f172a] dark:text-zinc-50">Product Features</h2>
          <p className="mx-auto mt-2.5 max-w-[320px] text-[12.5px] leading-[1.55] text-[#8b8b92]">
            Organize, prioritize, and control your tasks more efficiently with a trusted workflow platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-1.5 rounded-[26px] border-2 border-[#fafafa] bg-[#f4f4f5] p-1.5 md:grid-cols-3 md:grid-rows-[auto_1fr_auto] dark:border-[#232327] dark:bg-[#1a1a1d]">
          <ZapierCard />
          <TrackersCard />
          <FocusCard />
          <ProductivityCard />
          <ShortcutCard />
        </div>
      </motion.div>
    </section>
  );
}