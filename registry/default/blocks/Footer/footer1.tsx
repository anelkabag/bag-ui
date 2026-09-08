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

export function Footer1() {
    return (
        <footer className="mt-24 border-t border-border bg-background px-6 py-16 text-foreground">
            <div className="max-w-7xl mx-auto px-6 pt-10s">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <Image src="/logo.png" alt="BagUI" width={16} height={16} className="dark:hidden" />
                            <Image src="/logoW.png" alt="BagUI" width={16} height={16} className="hidden dark:block" />
                            <span className="text-sm font-semibold text-foreground">Bag\Ui</span>
                        </div>
                        <p className="max-w-[180px] text-xs leading-relaxed text-muted-foreground">
                            Spend less time building UI from scratch. Ship faster with Bag/UI.
                        </p>
                    </div>
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Product</p>
                        <ul className="space-y-2.5">
                            {FOOTER_PRODUCT.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">More</p>
                        <ul className="space-y-2.5">
                            {FOOTER_MORE.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Legal</p>
                        <ul className="space-y-2.5">
                            {FOOTER_LEGAL.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Bag/UI - is not officially affiliated with shadcn/ui or Tailwind CSS. Built by{" "}
                        <a
                            href="https://www.anelka.life/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
                        >
                            Anelka Bag
                        </a>
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={label}
                                className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-all duration-200 hover:text-foreground"
                            >
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}