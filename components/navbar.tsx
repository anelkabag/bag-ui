"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/auth/UserMenu";
import UnauthNav from "@/components/auth/UnauthNav";

const NAV_LINKS = [
  { label: "Blocks", href: "/blocks" },
  { label: "Templates", href: "/templates" },
  { label: "Components", href: "/components" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
] as const;

const Logo = () => (
  <div className="flex items-center gap-2 shrink-0">
    <Link href="/" className="flex items-center gap-2">
      <div className="relative h-5 w-5 shrink-0">
        {/* Light Logo */}
        <Image
          src="/logo.png"
          alt="BagUI Logo"
          fill
          priority
          className="object-contain dark:hidden"
        />

        {/* Dark Logo */}
        <Image
          src="/logoW.png"
          alt="BagUI Logo"
          fill
          priority
          className="hidden object-contain dark:block"
        />
      </div>

      <span className="text-[15px] font-semibold tracking-tight text-foreground">
        Bag\Ui
      </span>
    </Link>

    <Link
      href="https://x.com/anelkabag"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
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
    className={`relative ${size === "xs" ? "text-[13px]" : "text-sm"} font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground group inline-flex items-baseline gap-0.5`}
  >
    {label}
    {external && (
      <sup className="text-[10px] text-muted-foreground leading-none">↗</sup>
    )}
    <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
  </Link>
);

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("bagui-theme");
  return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {});

  return (
    <>
      <div className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
        <nav className="max-w-7xl mx-auto flex h-14 items-center justify-between border-x border-border px-8">
          <Logo />

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2">
              {user ? <UserMenu /> : <UnauthNav />}
            </div>
            <button
              className="md:hidden p-2 text-foreground"
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
        } flex-col bg-background px-6 pt-24 pb-10`}
      >
        <nav className="flex flex-col gap-1 flex-1">
          {NAV_LINKS.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="block py-3 text-[38px] font-extrabold leading-none tracking-tight text-foreground transition-opacity hover:opacity-60"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          {user ? (
            <button
              onClick={() => {
                setMobileOpen(false);
                window.location.href = "/account";
              }}
              className="w-full py-4 rounded-xl border border-border text-foreground text-[14px] font-bold flex items-center justify-center hover:bg-muted transition-colors"
            >
              Account
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 rounded-xl border border-border text-foreground text-[14px] font-bold flex items-center justify-center hover:bg-muted transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full py-4 rounded-xl bg-black text-white text-[14px] font-bold flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
