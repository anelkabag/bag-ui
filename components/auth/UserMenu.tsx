"use client";

import { useState } from "react";
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

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="block rounded-full ring-2 ring-white shadow-sm hover:shadow-md transition"
      >
        <Image
          src={profile?.avatar_url ?? "/faviconblack.png"}
          alt="User avatar"
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover cursor-pointer"
        />
      </button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
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
                onClick={() => setOpen(false)}
              >
                Profile
              </MenuItem>

              <MenuItem
                href="https://whatsapp.com/channel/0029Vb7dYvr3mFYBKj9Dew25"
                icon={<MessageCircle className="h-5 w-5" />}
                onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
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
                onClick={() => setOpen(false)}
              >
                Help center
              </MenuItem>

              <MenuItem
                icon={<LogOut className="h-5 w-5" />}
                onClick={() => {
                  setOpen(false);
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
  const className = `flex w-full items-center justify-between gap-3 rounded-2xl px-2.5 py-2 text-left transition ${
    active ? "bg-gray-100 font-medium text-gray-900" : "hover:bg-gray-50"
  }`;

  const content = (
    <>
      <span className="flex items-center gap-3">
        <span className="text-gray-700">{icon}</span>
        <span>{children}</span>
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
