"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const NAV_LINKS = [
  { label: "Blocks", href: "/blocks" },
  { label: "Templates", href: "/templates" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
] as const;

const Logo = () => (
  <div className="flex items-center gap-2 shrink-0">
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="BagUI Logo"
        width={20}
        height={20}
        className="shrink-0"
        priority
      />
      <span className="text-[15px] font-semibold tracking-tight text-black">
        Bag\Ui
      </span>
    </Link>
    <Link
      href="https://x.com/anelkabag"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[13px] text-gray-400 hover:text-black transition-colors"
    >
      by Anelka
    </Link>
  </div>
);

const NavLink = ({
  href,
  label,
  external,
  size = "sm",
  onClick,
}: {
  href: string;
  label: string;
  external?: boolean;
  size?: "sm" | "xs";
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`relative ${size === "xs" ? "text-[13px]" : "text-sm"} text-gray-500 font-medium hover:text-black transition-colors duration-150 group inline-flex items-baseline gap-0.5`}
  >
    {label}
    {external && (
      <sup className="text-[10px] text-gray-400 leading-none">↗</sup>
    )}
    <span className="absolute left-0 -bottom-[2px] h-[1.5px] w-0 group-hover:w-full transition-all duration-300 bg-black" />
  </Link>
);

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-6 pt-10s flex items-center justify-between px-8 h-14">
          <Logo />

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="h-9 px-4 rounded-full text-sm font-medium text-black border border-gray-300 hover:bg-gray-100 hover:border-gray-400 transition-all inline-flex items-center justify-center"
              >
                Login
              </Link>
              <Link
                href="/access"
                className="h-9 px-4 rounded-full text-sm font-medium text-white bg-black border border-black hover:bg-gray-800 transition-all inline-flex items-center justify-center"
              >
                Get access
              </Link>
            </div>
            <button
              className="md:hidden p-2 text-black"
              onClick={() => setMobileOpen((v) => !v)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 ${
          mobileOpen ? "flex" : "hidden"
        } flex-col px-6 pt-24 pb-10 bg-white`}
      >
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_LINKS.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block text-[38px] font-extrabold tracking-tight leading-none py-3 text-black hover:opacity-60 transition-opacity"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="w-full py-4 rounded-xl border border-gray-300 text-black text-[14px] font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/access"
            onClick={() => setMobileOpen(false)}
            className="w-full py-4 rounded-xl bg-black text-white text-[14px] font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
          >
            Get access
          </Link>
        </div>
      </div>
    </>
  );
}
