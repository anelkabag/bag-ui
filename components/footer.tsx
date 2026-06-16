"use client";

import Link from "next/link";
import Image from "next/image";
import {
    FaXTwitter,    // X
    FaInstagram,   // Instagram
    FaLinkedin,    // LinkedIn
    FaGithub,      // GitHub
    FaYoutube,     // YouTube
    FaThreads,     // Threads
    FaWhatsapp     // WhatsApp
} from "react-icons/fa6";

const FOOTER_PRODUCT = [
    { label: "Blocks",     href: "/blocks" },
    { label: "Templates",  href: "/templates" },
    { label: "Pricing",    href: "/pricing" },
    { label: "Docs",       href: "/docs" },
    { label: "Changelog",  href: "/changelog" },
];

const FOOTER_MORE  = [
    { label: "FAQ", href: "/#faq" },
    { label: "Login", href: "/login" }
];

const FOOTER_LEGAL = [
    { label: "License", href: "/license" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms",   href: "/terms" },
    { label: "Contact", href: "mailto:anelka.bag@gmail.com" },
];

const SOCIAL_LINKS = [
    {
        label: "X",
        href: "https://x.com/anelkabag",
        Icon: FaXTwitter,
    },
    {
        label: "Instagram",
        href: "https://instagram.com/anelka.bag",
        Icon: FaInstagram,
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/in/anelkabag",
        Icon: FaLinkedin,
    },
    {
        label: "GitHub",
        href: "https://github.com/anelkabag",
        Icon: FaGithub,
    },
    {
        label: "YouTube",
        href: "https://youtube.com/@anelkabag",
        Icon: FaYoutube,
    },
    {
        label: "Threads",
        href: "https://www.threads.com/@anelka.bag",
        Icon: FaThreads,
    },
    {
        label: "WhatsApp",
        href: "https://whatsapp.com/channel/0029Vb7dYvr3mFYBKj9Dew25",
        Icon: FaWhatsapp,
    },
];

export function Footer() {
    return (
        <div className="w-full border-t border-gray-200">
            <footer className="max-w-7xl mx-auto px-6 pt-10 border-l border-r border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Image src="/logo.png" alt="BagUI" width={16} height={16} />
                            <span className="text-black font-semibold text-sm">Bag\Ui</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed max-w-[180px]">
                            Spend less time building UI from scratch. Ship faster with Bag/UI.
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Product</p>
                        <ul className="space-y-2.5">
                            {FOOTER_PRODUCT.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-gray-500 hover:text-black text-sm transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">More</p>
                        <ul className="space-y-2.5">
                            {FOOTER_MORE.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-gray-500 hover:text-black text-sm transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">Legal</p>
                        <ul className="space-y-2.5">
                            {FOOTER_LEGAL.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-gray-500 hover:text-black text-sm transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t border-gray-100">
                    <p className="text-gray-400 text-xs mb-5">
                        © {new Date().getFullYear()} Bag\UI - is not officially affiliated with shadcn/ui or Tailwind CSS. Built by{" "}
                        <a
                            href="https://www.anelka.life/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-gray-400 hover:text-black transition-colors underline underline-offset-4"
                        >
                            Anelka Bag
                        </a>
                    </p>
                    <div className="flex items-center gap-2 flex-wrap mb-5">
                        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={label}
                                className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-black  transition-all duration-200"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}