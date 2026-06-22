"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

/* ─── Animation ─── */
const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.13 } },
};

/* ══════════════════════════════════════════
   SVG 1 — Connect your stack
   Radial web with real logo <img> via foreignObject
══════════════════════════════════════════ */
const LOGOS = [
    {
        label: "Stripe",
        src: "https://cdn.simpleicons.org/stripe",
        cx: 62,
        cy: 62,
    },
    {
        label: "HubSpot",
        src: "https://cdn.simpleicons.org/hubspot",
        cx: 198,
        cy: 62,
    },
    {
        label: "Vercel",
        src: "https://cdn.simpleicons.org/vercel",
        cx: 62,
        cy: 158,
    },
    {
        label: "Xero",
        src: "https://cdn.simpleicons.org/xero",
        cx: 198,
        cy: 158,
    },
];

function ConnectSvg() {
    const cx = 130, cy = 110;
    return (
        <svg viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Dashed circles */}
            <circle cx={cx} cy={cy} r="72" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 3"/>
            <circle cx={cx} cy={cy} r="44" stroke="#d1d5db" strokeWidth="1" strokeDasharray="4 3"/>
            <circle cx={cx} cy={cy} r="20" stroke="#d1d5db" strokeWidth="1"/>

            {/* Center globe */}
            <circle cx={cx} cy={cy} r="16" fill="white" stroke="#9ca3af" strokeWidth="1.3"/>
            <ellipse cx={cx} cy={cy} rx="6.5" ry="16" stroke="#9ca3af" strokeWidth="1" fill="none"/>
            <line x1={cx - 16} y1={cy} x2={cx + 16} y2={cy} stroke="#9ca3af" strokeWidth="1"/>
            <line x1={cx} y1={cy - 16} x2={cx} y2={cy + 16} stroke="#9ca3af" strokeWidth="1" opacity=".4"/>

            {/* Connector lines to logos */}
            {LOGOS.map(({ cx: lx, cy: ly, label }) => (
                <line key={label} x1={cx} y1={cy} x2={lx} y2={ly} stroke="#d1d5db" strokeWidth="1.3"/>
            ))}

            {/* Logo circles */}
            {LOGOS.map(({ cx: lx, cy: ly, src, label }) => (
                <g key={label}>
                    <circle cx={lx} cy={ly} r="26" fill="white" stroke="#e5e7eb" strokeWidth="1.4"/>
                    <foreignObject x={lx - 18} y={ly - 18} width="36" height="36">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={label}
                            width={36}
                            height={36}
                            style={{ borderRadius: "50%", objectFit: "contain", width: 36, height: 36 }}
                        />
                    </foreignObject>
                </g>
            ))}
        </svg>
    );
}

/* ══════════════════════════════════════════
   SVG 2 — Register once
   Tree: top pill → globe hub → 3 state nodes (evenly spaced)
══════════════════════════════════════════ */
function RegisterSvg() {
    const hub = { x: 130, y: 118 };
    const states = [
        { label: "Texas",      x: 52,  y: 188 },
        { label: "Washington", x: 130, y: 188 },
        { label: "California", x: 208, y: 188 },
    ];
    const pillW = 148, pillH = 26, pillX = 130 - pillW / 2, pillY = 20;

    return (
        <svg viewBox="0 0 260 215" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Top pill */}
            <rect x={pillX} y={pillY} width={pillW} height={pillH} rx="13" fill="#1a1a1a"/>
            <circle cx={pillX + 13} cy={pillY + 13} r="5" fill="#22c55e"/>
            <text x={pillX + 23} y={pillY + 17} fontSize="9" fill="white" fontWeight="600" fontFamily="Inter,sans-serif">
                Registered on Kintsugi
            </text>

            {/* Vertical trunk to hub */}
            <line x1="130" y1={pillY + pillH} x2="130" y2={hub.y - 18} stroke="#9ca3af" strokeWidth="1.5"/>

            {/* Globe hub */}
            <circle cx={hub.x} cy={hub.y} r="18" fill="white" stroke="#9ca3af" strokeWidth="1.4"/>
            <ellipse cx={hub.x} cy={hub.y} rx="7" ry="18" stroke="#9ca3af" strokeWidth="1" fill="none"/>
            <line x1={hub.x - 18} y1={hub.y} x2={hub.x + 18} y2={hub.y} stroke="#9ca3af" strokeWidth="1"/>
            <line x1={hub.x} y1={hub.y - 18} x2={hub.x} y2={hub.y + 18} stroke="#9ca3af" strokeWidth="1" opacity=".4"/>

            {/* Branch lines hub → state nodes */}
            {states.map(({ x, y, label }) => (
                <line key={label} x1={hub.x} y1={hub.y + 18} x2={x} y2={y - 11} stroke="#9ca3af" strokeWidth="1.5"/>
            ))}

            {/* State pill nodes */}
            {states.map(({ x, y, label }) => {
                const w = label.length * 6 + 22;
                return (
                    <g key={label}>
                        <rect x={x - w / 2} y={y - 11} width={w} height="22" rx="11" fill="white" stroke="#e5e7eb" strokeWidth="1.3"/>
                        <circle cx={x - w / 2 + 10} cy={y} r="4" fill="#22c55e"/>
                        <text
                            x={x - w / 2 + 19}
                            y={y + 4}
                            fontSize="8.5"
                            fill="#374151"
                            fontFamily="Inter,sans-serif"
                        >{label}</text>
                    </g>
                );
            })}
        </svg>
    );
}

/* ══════════════════════════════════════════
   SVG 3 — Filing autopilot: clean table
══════════════════════════════════════════ */
const TAX_ROWS = [
    { state: "Alabama",    amount: "$83,176",  status: "Filed",  statusBg: "#dcfce7", statusColor: "#16a34a" },
    { state: "Texas",      amount: "$73,255",  status: "Filed",  statusBg: "#dcfce7", statusColor: "#16a34a" },
    { state: "California", amount: "$123,150", status: "Filing", statusBg: "#fef3c7", statusColor: "#d97706", highlight: true },
    { state: "New York",   amount: "$153,155", status: "Due",    statusBg: "#fee2e2", statusColor: "#dc2626" },
    { state: "Washington", amount: "$96,777",  status: "Due",    statusBg: "#fee2e2", statusColor: "#dc2626" },
];

function FilingSvg() {
    const colState = 30, colAmount = 148, colStatus = 222;
    const rowH = 30, headerY = 38, firstRowY = 58;

    return (
        <svg viewBox="0 0 260 210" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Card bg */}
            <rect x="14" y="10" width="232" height="190" rx="10" fill="white" stroke="#e5e7eb" strokeWidth="1.2"/>

            {/* Header row bg */}
            <rect x="14" y="10" width="232" height="32" rx="10" fill="#f9fafb"/>
            <rect x="14" y="30" width="232" height="12" fill="#f9fafb"/>

            {/* Header labels */}
            <text x={colState}  y={headerY} fontSize="8" fontWeight="600" fill="#9ca3af" fontFamily="Inter,sans-serif" letterSpacing="0.05em">STATE</text>
            <text x={colAmount} y={headerY} fontSize="8" fontWeight="600" fill="#9ca3af" fontFamily="Inter,sans-serif" letterSpacing="0.05em" textAnchor="end">AMOUNT</text>
            <text x={colStatus} y={headerY} fontSize="8" fontWeight="600" fill="#9ca3af" fontFamily="Inter,sans-serif" letterSpacing="0.05em" textAnchor="end">STATUS</text>

            {/* Divider under header */}
            <line x1="14" y1="42" x2="246" y2="42" stroke="#f3f4f6" strokeWidth="1"/>

            {TAX_ROWS.map(({ state, amount, status, statusBg, statusColor, highlight }, i) => {
                const y = firstRowY + i * rowH;
                const pillW = 38, pillH = 18;
                return (
                    <g key={state}>
                        {highlight && (
                            <rect x="14" y={y - 13} width="232" height={rowH} fill="#f0fdf4"/>
                        )}
                        <text
                            x={colState} y={y + 2}
                            fontSize="9.5"
                            fill={highlight ? "#15803d" : "#374151"}
                            fontWeight={highlight ? "600" : "400"}
                            fontFamily="Inter,sans-serif"
                        >{state}</text>
                        <text
                            x={colAmount} y={y + 2}
                            fontSize="9.5"
                            fill={highlight ? "#15803d" : "#374151"}
                            fontWeight={highlight ? "700" : "500"}
                            fontFamily="Inter,sans-serif"
                            textAnchor="end"
                        >{amount}</text>
                        {/* Status pill */}
                        <rect
                            x={colStatus - pillW} y={y - 11}
                            width={pillW} height={pillH}
                            rx="9" fill={statusBg}
                        />
                        <text
                            x={colStatus - pillW / 2} y={y + 2}
                            fontSize="8" fill={statusColor}
                            fontWeight="600" fontFamily="Inter,sans-serif"
                            textAnchor="middle"
                        >{status}</text>
                        {/* Row divider */}
                        {i < TAX_ROWS.length - 1 && (
                            <line x1="22" y1={y + 17} x2="238" y2={y + 17} stroke="#f3f4f6" strokeWidth="1"/>
                        )}
                    </g>
                );
            })}
        </svg>
    );
}

/* ─── Steps ─── */
const steps = [
    {
        num: "01",
        title: "Connect your stack in minutes.",
        desc: "Link Chargebee, Stripe, QuickBooks, and NetSuite. Our native integrations mean the setup is simple and the connection is stable.",
        Illustration: ConnectSvg,
    },
    {
        num: "02",
        title: "Register once, collect everywhere.",
        desc: "We identify where you need to pay sales tax. Then we handle the state registrations so you can collect the right sales tax on every invoice.",
        Illustration: RegisterSvg,
    },
    {
        num: "03",
        title: "Put filing on autopilot.",
        desc: "Returns are filed and paid on time. Sales tax runs quietly in the background while you focus on growth.",
        Illustration: FilingSvg,
    },
];

/* ─── Main ─── */
export default function FeaturesSection2() {
    return (
        <section className="w-full py-20 px-4">
            <div className="max-w-5xl mx-auto">

                {/* ── Hero copy ── */}
                <motion.div
                    className="text-center max-w-3xl mx-auto mb-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={stagger}
                >
                    <motion.h2
                        variants={fadeUp}
                        className="text-[2.4rem] sm:text-[3rem] font-semibold text-[#1a1a1a] leading-[1.1] tracking-tight mb-6"
                    >
                        A tax platform designed for your business.
                    </motion.h2>
                    <motion.p variants={fadeUp} className="text-[15px] text-[#6b7280] leading-relaxed mb-3 max-w-xl mx-auto">
                        You spend days fixing sync errors between your tax software and QuickBooks. Your support
                        tickets take a week to get a real answer. You track nexus thresholds on a spreadsheet,
                        hoping you don't miss one.
                    </motion.p>
                    <motion.p variants={fadeUp} className="text-[15px] text-[#6b7280]">
                        There is a simpler way to work.
                    </motion.p>
                </motion.div>

                {/* ── 3-col panel ── */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 border border-[#d1d5db] rounded-2xl overflow-hidden bg-white"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-60px" }}
                    variants={stagger}
                >
                    {steps.map(({ num, title, desc, Illustration }, i) => (
                        <motion.div
                            key={num}
                            variants={fadeUp}
                            className={[
                                "flex flex-col",
                                i < steps.length - 1 ? "md:border-r border-[#e5e7eb]" : "",
                                "border-b md:border-b-0 border-[#e5e7eb]",
                            ].join(" ")}
                        >
                            {/* Top: text */}
                            <div className="p-6 border-b border-[#e5e7eb]">
                                <p className="text-[12px] font-medium text-[#9ca3af] mb-3 tracking-widest">{num}</p>
                                <h3 className="text-[15px] font-semibold text-[#111827] mb-2 leading-snug">{title}</h3>
                                <p className="text-[13px] text-[#6b7280] leading-relaxed">{desc}</p>
                            </div>
                            {/* Bottom: illustration */}
                            <div className="flex-1 flex items-center justify-center p-5 bg-white min-h-[200px]">
                                <Illustration />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}