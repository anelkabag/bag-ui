"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Theme = "dark" | "light" | "system";

const NAV_LINKS = [
    { label: "Services", href: "#services" },
    { label: "Coverage", href: "#coverage" },
    { label: "Offers", href: "#offers" },
    { label: "Price", href: "#price" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
];

const SunIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
);

const MoonIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
    </svg>
);

const SystemIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
    </svg>
);

const UserIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const PlusIcon = () => (
    <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
    >
        <path d="M12 5v14M5 12h14" />
    </svg>
);

export default function Navbar1() {
    const [activeLink, setActiveLink] = useState("Services");
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "system";
        const storedTheme = window.localStorage.getItem("theme") as Theme | null;
        return storedTheme === "dark" ||
        storedTheme === "light" ||
        storedTheme === "system"
            ? storedTheme
            : "system";
    });
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const prefersDark =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const visibleTheme = mounted ? theme : "system";
    const isDark =
        mounted &&
        (visibleTheme === "dark" || (visibleTheme === "system" && prefersDark));

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        Promise.resolve().then(() => setMounted(true));
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = window.document.documentElement;
        const shouldUseDark =
            theme === "dark" ||
            (theme === "system" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);

        root.classList.toggle("dark", shouldUseDark);
        window.localStorage.setItem("theme", theme);
    }, [mounted, theme]);

    useEffect(() => {
        if (theme !== "system") return;
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (event: MediaQueryListEvent) => {
            window.document.documentElement.classList.toggle("dark", event.matches);
        };
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [theme]);

    const themeButtons: { key: Theme; icon: React.ReactNode; label: string }[] = [
        { key: "dark", icon: <MoonIcon />, label: "Dark mode" },
        { key: "system", icon: <SystemIcon />, label: "System" },
        { key: "light", icon: <SunIcon />, label: "Light mode" },
    ];

    return (
        <header className="relative flex justify-center px-4 py-4">
            <motion.nav
                initial={{ y: -24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={[
                    "w-full max-w-5xl rounded-2xl border px-6 flex items-center h-[62px] gap-0 transition-all duration-300",
                    isDark
                        ? "bg-[#0f0f0f] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
                        : "bg-white border-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
                    scrolled ? "shadow-2xl" : "",
                ].join(" ")}
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 mr-8 shrink-0">
                    <img
                        src="https://bagui.vercel.app/logoR.png"
                        alt="Debisol icon"
                        width={36}
                        height={36}
                        className="rounded-lg"
                    />

                    <span
                        className={`font-bold text-[20px] tracking-tight transition-colors duration-300 ${
                            isDark ? "text-white" : "text-[#111]"
                        }`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
            Bag<span className="text-[#F59431]">\</span>Ui
          </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center flex-1">
                    {NAV_LINKS.map((link, i) => (
                        <motion.a
                            key={link.label}
                            href={link.href}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.05 * i + 0.15,
                                duration: 0.35,
                                ease: "easeOut",
                            }}
                            onClick={() => setActiveLink(link.label)}
                            className={[
                                "relative px-[13px] h-[62px] flex items-center text-[13.5px] transition-all duration-200 cursor-pointer whitespace-nowrap select-none",
                                activeLink === link.label
                                    ? isDark
                                        ? "text-white"
                                        : "text-[#111]"
                                    : isDark
                                        ? "text-white/50 hover:text-white hover:bg-white/5"
                                        : "text-black/40 hover:text-black hover:bg-black/5",
                            ].join(" ")}
                        >
                            {link.label}
                            {activeLink === link.label && (
                                <motion.span
                                    layoutId="nav-underline"
                                    className="absolute bottom-0 left-[13px] right-[13px] h-[2px] rounded-t-full bg-[#F59431]"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </motion.a>
                    ))}
                </div>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-2 shrink-0">
                    {/* Theme Switcher */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className={`flex items-center rounded-[10px] p-[3px] gap-[2px] border ${
                            isDark
                                ? "bg-white/8 border-white/10"
                                : "bg-black/5 border-black/10"
                        }`}
                        role="group"
                        aria-label="Theme switcher"
                    >
                        {themeButtons.map(({ key, icon, label }) => (
                            <button
                                key={key}
                                onClick={() => setTheme(key)}
                                title={label}
                                className={[
                                    "w-7 h-7 rounded-[8px] flex items-center justify-center transition-all duration-200 cursor-pointer",
                                    visibleTheme === key
                                        ? isDark
                                            ? "bg-[#0f0f0f] text-white border border-white/10 shadow-sm"
                                            : "bg-white text-[#111] border border-black/10 shadow-sm"
                                        : isDark
                                            ? "text-white/40 hover:text-white hover:bg-white/10"
                                            : "text-black/35 hover:text-black hover:bg-black/8",
                                ].join(" ")}
                            >
                                {icon}
                            </button>
                        ))}
                    </motion.div>

                    {/* Divider */}
                    <div
                        className={`w-px h-5 ${isDark ? "bg-white/10" : "bg-black/10"}`}
                    />

                    {/* Login */}
                    <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 }}
                    >
                        <Link
                            href="/login"
                            className={[
                                "h-[34px] px-4 rounded-[10px] border text-[13px] font-medium flex items-center gap-[6px] transition-all duration-200 whitespace-nowrap",
                                isDark
                                    ? "text-white/80 bg-white/8 border-white/10 hover:bg-white/14 hover:text-white"
                                    : "text-[#111] bg-black/5 border-black/10 hover:bg-black/10 hover:text-black",
                            ].join(" ")}
                        >
                            <UserIcon />
                            Log in
                        </Link>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.62 }}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Link
                            href="/register"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={[
                                "h-[34px] px-4 rounded-[10px] text-[13px] font-semibold flex items-center gap-[6px] transition-opacity duration-200 whitespace-nowrap",
                                isDark
                                    ? "bg-[#F59431] text-[#0f0f0f] hover:opacity-90"
                                    : "bg-[#111] text-white hover:opacity-85",
                            ].join(" ")}
                        >
                            <PlusIcon />
                            Create Free Account
                        </Link>
                    </motion.div>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className={`ml-auto md:hidden flex flex-col gap-[5px] justify-center items-center w-9 h-9 rounded-lg transition-colors ${
                        isDark
                            ? "text-white hover:bg-white/10"
                            : "text-black hover:bg-black/5"
                    }`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    <motion.span
                        animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
                        className={`block w-5 h-[1.5px] ${isDark ? "bg-white" : "bg-black"}`}
                    />
                    <motion.span
                        animate={{ opacity: mobileOpen ? 0 : 1 }}
                        className={`block w-5 h-[1.5px] ${isDark ? "bg-white" : "bg-black"}`}
                    />
                    <motion.span
                        animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
                        className={`block w-5 h-[1.5px] ${isDark ? "bg-white" : "bg-black"}`}
                    />
                </button>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className={[
                            "absolute top-[72px] left-4 right-4 rounded-2xl border p-4 flex flex-col gap-1",
                            isDark
                                ? "bg-[#0f0f0f] border-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.6)]"
                                : "bg-white border-black/10 shadow-[0_16px_48px_rgba(0,0,0,0.12)]",
                        ].join(" ")}
                    >
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => {
                                    setActiveLink(link.label);
                                    setMobileOpen(false);
                                }}
                                className={[
                                    "px-4 py-3 rounded-xl text-[14px] font-medium transition-all duration-200",
                                    activeLink === link.label
                                        ? isDark
                                            ? "bg-amber-400/10 text-[#F59431]"
                                            : "bg-amber-50 text-[#F59431]"
                                        : isDark
                                            ? "text-white/60 hover:text-white hover:bg-white/6"
                                            : "text-black/50 hover:text-black hover:bg-black/5",
                                ].join(" ")}
                            >
                                {link.label}
                            </a>
                        ))}

                        <div
                            className={`my-2 h-px ${isDark ? "bg-white/10" : "bg-black/8"}`}
                        />

                        {/* Mobile Theme Switcher */}
                        <div className="flex items-center justify-between px-2">
              <span
                  className={`text-[12px] ${isDark ? "text-white/40" : "text-black/35"}`}
              >
                Theme
              </span>
                            <div
                                className={`flex items-center rounded-[10px] p-[3px] gap-[2px] border ${
                                    isDark
                                        ? "bg-white/8 border-white/10"
                                        : "bg-black/5 border-black/10"
                                }`}
                            >
                                {themeButtons.map(({ key, icon, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setTheme(key)}
                                        title={label}
                                        className={[
                                            "w-7 h-7 rounded-[8px] flex items-center justify-center transition-all duration-200",
                                            visibleTheme === key
                                                ? isDark
                                                    ? "bg-[#0f0f0f] text-white border border-white/10"
                                                    : "bg-white text-[#111] border border-black/10"
                                                : isDark
                                                    ? "text-white/40 hover:text-white"
                                                    : "text-black/35 hover:text-black",
                                        ].join(" ")}
                                    >
                                        {icon}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-1 px-0">
                            <Link
                                href="/"
                                className={[
                                    "h-10 px-4 rounded-[10px] border text-[13px] font-medium flex items-center gap-2 justify-center",
                                    isDark
                                        ? "text-white/80 bg-white/8 border-white/10"
                                        : "text-[#111] bg-black/5 border-black/10",
                                ].join(" ")}
                            >
                                <UserIcon /> Log in
                            </Link>
                            <Link
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={[
                                    "h-10 px-4 rounded-[10px] text-[13px] font-semibold flex items-center gap-2 justify-center",
                                    isDark
                                        ? "bg-[#F59431] text-[#0f0f0f]"
                                        : "bg-[#111] text-white",
                                ].join(" ")}
                            >
                                <PlusIcon /> Create Free Account
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
