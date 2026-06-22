"use client";

import { motion, Variants } from "framer-motion";
import { Zap, Shield, Cpu, Gauge } from "lucide-react";

/* ─── Animation ─── */
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

/* ══════════════════════════════════════════
   SVG 1 — Invoice card
══════════════════════════════════════════ */
function InvoiceSvg() {
    return (
        <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Outer card */}
            <rect x="8" y="8" width="304" height="144" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.2"/>

            {/* Blue accent top-left corner square */}
            <rect x="24" y="24" width="32" height="32" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1"/>
            {/* Grid icon inside */}
            <line x1="34" y1="30" x2="34" y2="50" stroke="#93c5fd" strokeWidth="1.2"/>
            <line x1="46" y1="30" x2="46" y2="50" stroke="#93c5fd" strokeWidth="1.2"/>
            <line x1="28" y1="36" x2="52" y2="36" stroke="#93c5fd" strokeWidth="1.2"/>
            <line x1="28" y1="44" x2="52" y2="44" stroke="#93c5fd" strokeWidth="1.2"/>

            {/* Doc lines top-right */}
            <rect x="242" y="28" width="52" height="6" rx="3" fill="#f1f5f9"/>
            <rect x="242" y="38" width="40" height="5" rx="2.5" fill="#f1f5f9"/>
            <rect x="242" y="47" width="46" height="5" rx="2.5" fill="#f1f5f9"/>
            {/* Doc corner fold icon */}
            <rect x="266" y="22" width="22" height="28" rx="3" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
            <polyline points="278,22 288,32 278,32" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1"/>
            {/* Small icon bottom-right of doc */}
            <rect x="270" y="38" width="14" height="10" rx="2" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.8"/>
            <line x1="273" y1="42" x2="281" y2="42" stroke="#cbd5e1" strokeWidth="0.8"/>

            {/* Invoice details */}
            <text x="24" y="76" fontSize="7.5" fill="#94a3b8" fontFamily="Inter,sans-serif">INV-456789</text>
            <text x="24" y="96" fontSize="17" fontWeight="700" fill="#0f172a" fontFamily="Inter,sans-serif">$284,342.57</text>
            <text x="24" y="108" fontSize="7.5" fill="#94a3b8" fontFamily="Inter,sans-serif">Due in 15 days</text>

            {/* To / From / Address rows */}
            <text x="24" y="124" fontSize="7.5" fill="#94a3b8" fontFamily="Inter,sans-serif">To</text>
            <rect x="50" y="116" width="80" height="6" rx="3" fill="#e2e8f0"/>
            <text x="24" y="136" fontSize="7.5" fill="#94a3b8" fontFamily="Inter,sans-serif">From</text>
            <rect x="50" y="128" width="100" height="6" rx="3" fill="#e2e8f0"/>
            <text x="24" y="148" fontSize="7.5" fill="#94a3b8" fontFamily="Inter,sans-serif">Address</text>
            <rect x="60" y="140" width="70" height="6" rx="3" fill="#e2e8f0"/>
        </svg>
    );
}

/* ══════════════════════════════════════════
   SVG 2 — Spending Limit / Data Viz card
══════════════════════════════════════════ */
function SpendingSvg() {
    const barTotal = 248;
    const usedPct = 0.4;
    const usedW = barTotal * usedPct;

    return (
        <svg viewBox="0 0 320 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Card */}
            <rect x="8" y="8" width="304" height="144" rx="12" fill="white" stroke="#e2e8f0" strokeWidth="1.2"/>

            {/* Header */}
            <text x="24" y="34" fontSize="13" fontWeight="700" fill="#f59e0b" fontFamily="Inter,sans-serif">Spending</text>
            <text x="102" y="34" fontSize="13" fontWeight="700" fill="#0f172a" fontFamily="Inter,sans-serif"> Limit</text>
            <text x="24" y="48" fontSize="8" fill="#94a3b8" fontFamily="Inter,sans-serif">New users by First user primary channel group</text>

            {/* Progress bar */}
            {/* bg */}
            <rect x="24" y="58" width={barTotal} height="12" rx="6" fill="#e2e8f0"/>
            {/* used (blue) */}
            <rect x="24" y="58" width={usedW} height="12" rx="6" fill="#1e40af"/>
            {/* free overlay (striped feel — lighter) */}
            <rect x={24 + usedW} y="58" width={barTotal - usedW} height="12" rx="0" fill="#bfdbfe" opacity=".4"/>
            <rect x={24 + barTotal - 6} y="58" width="6" height="12" rx="6" fill="#bfdbfe" opacity=".4"/>

            {/* Labels */}
            <text x="24"  y="83" fontSize="14" fontWeight="700" fill="#0f172a" fontFamily="Inter,sans-serif">40%</text>
            <text x="224" y="83" fontSize="14" fontWeight="700" fill="#0f172a" fontFamily="Inter,sans-serif">60%</text>
            <text x="24"  y="94" fontSize="8"  fill="#94a3b8"   fontFamily="Inter,sans-serif">Used</text>
            <text x="224" y="94" fontSize="8"  fill="#94a3b8"   fontFamily="Inter,sans-serif">Free</text>

            {/* Divider */}
            <line x1="24" y1="104" x2="296" y2="104" stroke="#f1f5f9" strokeWidth="1"/>

            {/* Bullet rows */}
            <circle cx="30" cy="116" r="4" fill="#1e40af"/>
            <text x="40" y="120" fontSize="8" fill="#374151" fontFamily="Inter,sans-serif">
                Running (20%) average of 12 Minutes
            </text>
            <circle cx="30" cy="133" r="4" fill="#94a3b8"/>
            <text x="40" y="137" fontSize="8" fill="#94a3b8" fontFamily="Inter,sans-serif">
                Swimming (20%)
            </text>
        </svg>
    );
}

/* ─── Bottom features ─── */
const bottomFeatures = [
    {
        Icon: Zap,
        title: "Faaast",
        desc: "It supports an entire helping developers and innovate.",
    },
    {
        Icon: Gauge,
        title: "Powerful",
        desc: "It supports an entire helping developers and businesses.",
    },
    {
        Icon: Shield,
        title: "Security",
        desc: "An helping developers businesses innovate.",
    },
    {
        Icon: Cpu,
        title: "AI Powered",
        desc: "Helping developers businesses innovate.",
    },
];

/* ─── Section ─── */
export default function FeaturesSection3() {
    return (
        <section className="w-full py-16 px-4 ">
            <div className="max-w-4xl mx-auto">

                {/* ── Top 2-col grid ── */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={stagger}
                >
                    {/* Col 1 — Invoice */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-[17px] font-semibold text-[#0f172a] mb-2">Intuitive Invoice Creation</h3>
                            <p className="text-[13.5px] text-[#64748b] leading-relaxed">
                                Create professional invoices instantly with our intuitive tools. Customize templates
                                and automate billing to save time.
                            </p>
                        </div>
                        {/* Card illustration */}
                        <motion.div
                            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.07)" }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f8fafc] p-1 shadow-sm"
                        >
                            <InvoiceSvg />
                        </motion.div>
                    </motion.div>

                    {/* Col 2 — Data viz */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-4">
                        <div>
                            <h3 className="text-[17px] font-semibold text-[#0f172a] mb-2">Data Visualization</h3>
                            <p className="text-[13.5px] text-[#64748b] leading-relaxed">
                                Transform complex data into intuitive visualizations. Our powerful tools help you
                                uncover insights and communicate findings effectively.
                            </p>
                        </div>
                        {/* Card illustration */}
                        <motion.div
                            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.07)" }}
                            transition={{ duration: 0.2 }}
                            className="rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f8fafc] p-1 shadow-sm"
                        >
                            <SpendingSvg />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* ── Divider ── */}
                <div className="h-px bg-[#e2e8f0] mb-10" />

                {/* ── Bottom 4-col features ── */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    variants={stagger}
                >
                    {bottomFeatures.map(({ Icon, title, desc }) => (
                        <motion.div key={title} variants={fadeUp} className="flex flex-col gap-2">
                            <Icon className="w-4 h-4 text-[#0f172a]" strokeWidth={1.8} />
                            <h4 className="text-[13.5px] font-semibold text-[#0f172a]">{title}</h4>
                            <p className="text-[12.5px] text-[#64748b] leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}