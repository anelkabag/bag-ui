"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";

// ─── Avatars ──────────────────────────────────────────────────────────────────

const avatars = [
  "https://i.pravatar.cc/40?img=11",
  "https://i.pravatar.cc/40?img=22",
  "https://i.pravatar.cc/40?img=33",
];

// ─── Hover image with 3D tilt + glow ─────────────────────────────────────────

function HoverImage() {
  const ref = useRef<HTMLSpanElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-1, 1], [18, -18]), {
    stiffness: 300,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(rawX, [-1, 1], [-18, 18]), {
    stiffness: 300,
    damping: 25,
  });
  const scale = useSpring(1, { stiffness: 300, damping: 22 });

  function handleMouseMove(e: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    rawX.set((e.clientX - cx) / (rect.width / 2));
    rawY.set((e.clientY - cy) / (rect.height / 2));
    scale.set(1.18);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
    scale.set(1);
  }

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
        perspective: 600,
      }}
      className="inline-block w-11 h-11 md:w-13 md:h-13 rounded-xl overflow-hidden align-middle relative -top-1 cursor-pointer shadow-lg"
      whileHover={{ boxShadow: "0 0 24px 6px rgba(255,255,255,0.15)" }}
    >
      <img
        src="https://bagui.vercel.app/faviconblack.png"
        alt=""
        className="w-full h-full object-cover pointer-events-none"
      />
    </motion.span>
  );
}

// ─── FadeUp word ──────────────────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function CTASection1() {
  const [email, setEmail] = useState("");

  return (
    <section className="w-full py-28 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* ── Headline ── */}
        <h2
          className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold text-black leading-[1.15] tracking-tight mb-10"
          style={{ perspective: 800 }}
        >
          {/* Line 1 */}
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-2">
            <FadeUp delay={0}>Ship</FadeUp>
            <FadeUp delay={0.06}>beautiful</FadeUp>

            <FadeUp delay={0.11}>
              <HoverImage />
            </FadeUp>

            <FadeUp delay={0.15}>
              <em className="italic font-bold text-black">blocks</em>
            </FadeUp>

            <FadeUp delay={0.19}>
              <span className="text-black font-light">←</span>
            </FadeUp>
          </span>

          {/* Line 2 */}
          <span className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            <FadeUp delay={0.23}>faster with</FadeUp>

            <FadeUp delay={0.27}>
              <span className="text-red-500 font-black text-5xl leading-none">
                ✱
              </span>
            </FadeUp>

            <FadeUp delay={0.31}>zero</FadeUp>

            <FadeUp delay={0.35}>
              <span className="inline-flex items-center border-2 border-black rounded-full px-5 py-1 leading-none text-black">
                Bag/UI
              </span>
            </FadeUp>

            <FadeUp delay={0.39}>.</FadeUp>
          </span>
        </h2>

        {/* ── Subline ── */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.45,
            delay: 0.44,
            ease: "easeOut",
          }}
          className="text-sm text-zinc-500 mb-8 max-w-sm"
        >
          Premium shadcn/ui blocks — plug in, customize, ship.
        </motion.p>

        {/* ── Email form ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            delay: 0.48,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="flex items-center gap-3 w-full max-w-lg mb-5"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your e-mail"
            className="flex-1 bg-white text-zinc-950 placeholder-zinc-400 text-sm rounded-full px-5 py-3.5 outline-none border border-zinc-200 focus:border-zinc-400 transition-colors"
          />

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="bg-black text-white text-sm font-semibold rounded-full px-6 py-3.5 whitespace-nowrap hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Subscribe →
          </motion.button>
        </motion.div>

        {/* ── Social proof ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: 0.56,
            ease: "easeOut",
          }}
          className="flex items-center gap-2.5"
        >
          <div className="flex -space-x-2.5">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
              />
            ))}
          </div>

          <span className="text-[13px] text-zinc-600">
            11.5k+ devs already subscribed
          </span>
        </motion.div>
      </div>
    </section>
  );
}
