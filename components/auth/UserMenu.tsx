"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

export default function UserMenu() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm hover:shadow-md transition"
      >
        <Image
          src={profile?.avatar_url ?? "/faviconblack.png"}
          alt="User avatar"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span>{profile?.username ?? user.email}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-gray-200 bg-white shadow-lg">
          <div className="flex flex-col gap-1 p-3 text-sm text-gray-700">
            <button
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              className="w-full rounded-xl px-3 py-2 text-left hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
