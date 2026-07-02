"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import {
  BadgeCheck,
  MessageCircle,
  Plus,
  CreditCard,
  Settings as SettingsIcon,
  Info,
  LogOut,
  Zap,
} from "lucide-react";

export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = () => {
    if (open) {
      // Play exit animation, then unmount
      setOpen(false);
      closeTimeout.current = setTimeout(() => setMounted(false), 150);
    } else {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
      setMounted(true);
      // Next tick so the enter transition can play from its initial state
      requestAnimationFrame(() => setOpen(true));
    }
  };

  const close = () => {
    setOpen(false);
    closeTimeout.current = setTimeout(() => setMounted(false), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimeout.current) clearTimeout(closeTimeout.current);
    };
  }, []);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="block rounded-full ring-2 ring-white shadow-sm hover:shadow-md transition cursor-pointer"
      >
        <Image
          src={profile?.avatar_url ?? "/faviconblack.png"}
          alt="User avatar"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />
      </button>

      {mounted && (
        <>
          {/* Backdrop to close on outside click */}
          <div className="fixed inset-0 z-40 cursor-pointer" onClick={close} />

          <div
            className={`absolute right-0 z-50 mt-2 w-60 origin-top-right overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl transition-all duration-150 ease-out ${
              open
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 -translate-y-1"
            }`}
          >
            {/* Header: identity card */}
            <div className="p-2.5">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 p-2.5">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900">
                    {profile?.username ?? "Your account"}
                  </p>
                  <p className="truncate text-sm text-gray-400">{user.email}</p>
                </div>

                <div className="relative shrink-0">
                  <div className="rounded-full bg-gradient-to-tr from-orange-400 via-pink-400 to-sky-400 p-[2px]">
                    <Image
                      src={profile?.avatar_url ?? "/faviconblack.png"}
                      alt="User avatar"
                      width={38}
                      height={38}
                      className="h-[38px] w-[38px] rounded-full border-2 border-white object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary actions */}
            <div className="flex flex-col gap-0.5 px-2.5 pb-2 text-sm text-gray-700">
              <MenuItem
                href="/profile"
                icon={<BadgeCheck className="h-5 w-5" />}
                active
                onClick={() => close()}
              >
                Profile
              </MenuItem>

              <MenuItem
                href="https://whatsapp.com/channel/0029Vb7dYvr3mFYBKj9Dew25"
                icon={<MessageCircle className="h-5 w-5" />}
                onClick={() => close()}
                right={
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
                    <Plus className="h-3.5 w-3.5 text-gray-500" />
                  </span>
                }
              >
                Community
              </MenuItem>

              <MenuItem
                href="/subscription"
                icon={<CreditCard className="h-5 w-5" />}
                onClick={() => close()}
                right={
                  <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <Zap className="h-3 w-3 fill-emerald-700" />
                    PRO
                  </span>
                }
              >
                Subscription
              </MenuItem>

              <MenuItem
                href="/settings"
                icon={<SettingsIcon className="h-5 w-5" />}
                onClick={() => close()}
              >
                Settings
              </MenuItem>
            </div>

            <div className="border-t border-gray-100" />

            {/* Secondary actions */}
            <div className="flex flex-col gap-0.5 p-2.5 text-sm text-gray-700">
              <MenuItem
                href="/help"
                icon={<Info className="h-5 w-5" />}
                onClick={() => close()}
              >
                Help center
              </MenuItem>

              <MenuItem
                icon={<LogOut className="h-5 w-5" />}
                onClick={() => {
                  close();
                  signOut();
                }}
              >
                Sign out
              </MenuItem>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  children,
  right,
  active = false,
  href,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  right?: React.ReactNode;
  active?: boolean;
  href?: string;
  onClick?: () => void;
}) {
  const className = `group flex w-full items-center justify-between gap-3 rounded-2xl px-2.5 py-2 text-left transition-colors duration-150 cursor-pointer ${
    active
      ? "bg-gray-100 font-medium text-gray-900"
      : "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
  }`;

  const content = (
    <>
      <span className="flex items-center gap-3">
        <span className="text-gray-700 transition-transform duration-150 ease-out group-hover:scale-110 group-hover:text-gray-900">
          {icon}
        </span>
        <span className="transition-colors duration-150 group-hover:text-gray-900">
          {children}
        </span>
      </span>
      {right}
    </>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
