"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import {
  FaXTwitter, // X
  FaInstagram, // Instagram
  FaLinkedin, // LinkedIn
  FaGithub, // GitHub
  FaYoutube, // YouTube
  FaThreads, // Threads
  FaWhatsapp, // WhatsApp
} from "react-icons/fa6";

const FOOTER_PRODUCT = [
  { label: "Blocks", href: "/blocks" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
  { label: "Changelog", href: "/changelog" },
];

const FOOTER_MORE = [
  { label: "FAQ", href: "/#faq" },
  { label: "Login", href: "/login" },
];

const FOOTER_LEGAL = [
  { label: "License", href: "/license" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "mailto:anelka.bag@gmail.com" },
];

const SOCIAL_LINKS = [
  {
    label: "X",
    href: "https://x.com/BagUi_pro",
    Icon: FaXTwitter,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/bagui.pro",
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
  const { theme, setTheme, resolvedTheme } = useTheme();

  // resolvedTheme reflects the actual applied theme when using 'system'
  const active = (resolvedTheme ?? theme) as string | undefined;

  return (
    <div className="w-full border-t border-border">
      <footer className="mx-auto max-w-7xl border-l border-r border-border px-6 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative h-4 w-4">
                <Image
                  src="/logo.png"
                  alt="BagUI"
                  fill
                  className="object-contain dark:hidden"
                />

                <Image
                  src="/logoW.png"
                  alt="BagUI"
                  fill
                  className="hidden object-contain dark:block"
                />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Bag\Ui
              </span>
            </div>
            <p className="max-w-[180px] text-xs leading-relaxed text-muted-foreground mb-3">
              Spend less time building UI from scratch. Ship faster with Bag/UI.
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex h-8 w-[68px] items-center rounded-[10px] p-[3px] gap-[2px] border bg-muted/40 border-border"
              role="group"
              aria-label="Theme switcher"
            >
              {[
                {
                  key: "light",
                  icon: <Sun size={13} />,
                  label: "Light mode",
                },
                {
                  key: "dark",
                  icon: <Moon size={13} />,
                  label: "Dark mode",
                },
              ].map(({ key, icon, label }) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  title={label}
                  className={[
                    "h-6 w-7 rounded-[7px] flex items-center justify-center transition-all duration-200 cursor-pointer",
                    active === key
                      ? "bg-background text-foreground border border-border shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50",
                  ].join(" ")}
                >
                  {icon}
                </button>
              ))}
            </motion.div>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Product
            </p>
            <ul className="space-y-2.5">
              {FOOTER_PRODUCT.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-gray-500 hover:text-black dark:hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              More
            </p>
            <ul className="space-y-2.5">
              {FOOTER_MORE.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-gray-500 hover:text-black dark:hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Legal
            </p>
            <ul className="space-y-2.5">
              {FOOTER_LEGAL.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-gray-500 hover:text-black dark:hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="mb-5 text-xs text-muted-foreground">
            © {new Date().getFullYear()} Bag\UI - is not officially affiliated
            with shadcn/ui or Tailwind CSS. Built by{" "}
            <a
              href="https://www.anelka.life/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
            >
              Anelka Bag 🇨🇩
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
                className="flex h-9 w-9 items-center justify-center text-muted-foreground transition-all duration-200 hover:text-foreground"
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
