"use client";

import { useRef, useState } from "react";
import { motion, useInView, cubicBezier } from "framer-motion";
import { Mail, MapPin, Phone, ArrowRight, Check } from "lucide-react";

// ─── Animation variants ──────────────────────────────────────────────────────
const customEase = cubicBezier(0.4, 0, 0.2, 1);

const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.52, ease: customEase, delay } },
});

const fadeLeft = (delay = 0) => ({
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.52, ease: customEase, delay } },
});

const fadeRight = (delay = 0) => ({
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.52, ease: customEase, delay } },
});

// ─── Contact info items ──────────────────────────────────────────────────────
const contactInfo = [
    { icon: <Mail size={18} strokeWidth={1.8} />, label: "support@bagui.dev" },
    { icon: <MapPin size={18} strokeWidth={1.8} />, label: "123 Tech Avenue, San Francisco, USA" },
    { icon: <Phone size={18} strokeWidth={1.8} />, label: "+1 (000) 555-6666" },
];

// ─── Field component ─────────────────────────────────────────────────────────
function Field({
                   label,
                   placeholder,
                   type = "text",
                   textarea = false,
                   delay = 0,
                   inView,
               }: {
    label: string;
    placeholder: string;
    type?: string;
    textarea?: boolean;
    delay?: number;
    inView: boolean;
}) {
    const [focused, setFocused] = useState(false);

    const inputClass = [
        "w-full bg-white text-[14px] text-gray-800 placeholder:text-gray-400",
        "border border-gray-200 rounded-xl px-4 outline-none",
        "transition-all duration-200",
        focused ? "border-gray-800 ring-[3px] ring-gray-100" : "hover:border-gray-300",
        textarea ? "py-3.5 resize-none h-[140px]" : "h-[50px]",
    ].join(" ");

    return (
        <motion.div
            variants={fadeUp(delay)}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
        >
            <label className="block text-[13.5px] font-semibold text-gray-800 mb-2">
                {label}
            </label>
            {textarea ? (
                <textarea
                    placeholder={placeholder}
                    className={inputClass}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    className={inputClass}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            )}
        </motion.div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactSection() {
    const ref = useRef<HTMLElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => { setLoading(false); setSent(true); }, 1400);
    }

    return (
        <section
            ref={ref}
            className="w-full min-h-screen bg-white flex items-center justify-center px-6 py-24"
            style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
        >
            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-stretch">

                {/* ── Left column ── */}
                <div className="flex flex-col justify-between min-h-[520px]">

                    {/* Top: Headline + Subtitle */}
                    <div>
                        <motion.h1
                            variants={fadeLeft(0)}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            className="text-[52px] sm:text-[62px] font-black leading-[1.05] tracking-[-0.03em] text-gray-950 mb-6"
                        >
                            Talk to our<br />support team
                        </motion.h1>

                        <motion.p
                            variants={fadeLeft(0.1)}
                            initial="hidden"
                            animate={inView ? "visible" : "hidden"}
                            className="text-[15px] text-gray-400 leading-relaxed max-w-xs"
                        >
                            Feel free to reach out for help with your order or any questions you may have regarding your purchase.
                        </motion.p>
                    </div>

                    {/* Bottom: Contact info */}
                    <div className="flex flex-col gap-5 mb-2">
                        {contactInfo.map((item, i) => (
                            <motion.div
                                key={i}
                                variants={fadeLeft(0.18 + i * 0.08)}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                                className="flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-600 flex-shrink-0">
                                    {item.icon}
                                </div>
                                <span className="text-[14.5px] font-medium text-gray-700">{item.label}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ── Right column: form card ── */}
                <motion.div
                    variants={fadeRight(0.08)}
                    initial="hidden"
                    animate={inView ? "visible" : "hidden"}
                    className="bg-[#f5f5f5] rounded-3xl p-8 sm:p-10"
                >
                    {sent ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.42, ease: customEase }}
                            className="flex flex-col items-center justify-center py-16 text-center"
                        >
                            <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center mb-5">
                                <Check size={24} strokeWidth={2.2} className="text-white" />
                            </div>
                            <h3 className="text-[20px] font-bold text-gray-900 mb-2">Message sent!</h3>
                            <p className="text-[14px] text-gray-400">We'll get back to you as soon as possible.</p>
                            <button
                                onClick={() => setSent(false)}
                                className="mt-8 text-[13px] font-medium text-gray-500 underline underline-offset-2 hover:text-gray-800 transition-colors"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <Field label="Full Name" placeholder="Enter Your Full Name" delay={0.1} inView={inView} />
                            <Field label="Email Address" placeholder="Enter Your Email Address" type="email" delay={0.17} inView={inView} />
                            <Field label="Phone Number" placeholder="Enter Your Phone Number" type="tel" delay={0.24} inView={inView} />
                            <Field label="Message" placeholder="Write Your Message Here" textarea delay={0.31} inView={inView} />

                            <motion.div
                                variants={fadeUp(0.38)}
                                initial="hidden"
                                animate={inView ? "visible" : "hidden"}
                            >
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 active:scale-[.98] text-white font-semibold text-[14.5px] px-6 py-3.5 rounded-2xl transition-all duration-200 disabled:opacity-70 cursor-pointer"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                            </svg>
                                            Sending…
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <span className="transition-transform duration-200 group-hover:translate-x-1">
                                                <ArrowRight size={17} strokeWidth={2} />
                                            </span>
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    );
}