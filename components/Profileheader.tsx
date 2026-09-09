"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Bookmark, Pencil, BadgeCheck, X } from "lucide-react";
import { ProfileEditForm } from "@/components/ProfileEditForm";

interface ProfileHeaderProps {
  profile: {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
    plan: string | null;
  };
  email: string;
  isProPlan: boolean;
  joinedShort: string;
}

export function ProfileHeader({
  profile,
  email,
  isProPlan,
  joinedShort,
}: ProfileHeaderProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showBadgeTip, setShowBadgeTip] = useState(false);

  const pillClass =
    "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60";

  return (
    <>
      {/* Avatar + top-right actions */}
      <div className="relative flex flex-col items-center gap-4 -mt-12 sm:-mt-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="relative z-20 h-24 w-24 shrink-0 overflow-hidden rounded-3xl border-4 border-[#111111] bg-[#111111] shadow-xl sm:h-28 sm:w-28">
          <Image
            src={profile.avatar_url ?? "/faviconblack.png"}
            alt="Avatar"
            width={112}
            height={112}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center gap-2 sm:mt-14 sm:flex-col sm:items-end">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <Pencil size={14} />
            Edit Profile
          </button>
          <button
            type="button"
            title="Save profile"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Bookmark size={16} />
          </button>
        </div>
      </div>

      {/* Name + badge + pills */}
      <div className="mt-5 text-center sm:text-left">
        <h1 className="flex items-center justify-center gap-2 text-2xl font-semibold text-white sm:justify-start sm:text-3xl">
          <span>{profile.username}</span>

          {isProPlan ? (
            <BadgeCheck
              size={20}
              className="shrink-0 text-sky-400 sm:h-6 sm:w-6"
              aria-label="Premium member"
            />
          ) : (
            <span
              className="relative shrink-0"
              onMouseEnter={() => setShowBadgeTip(true)}
              onMouseLeave={() => setShowBadgeTip(false)}
            >
              <BadgeCheck
                size={20}
                className="text-white/30 sm:h-6 sm:w-6"
                aria-label="Locked badge"
              />
              {showBadgeTip && (
                <span className="absolute left-1/2 top-full z-30 mt-2 w-56 -translate-x-1/2 rounded-lg border border-white/10 bg-[#111111] px-3 py-2 text-[11px] leading-snug text-white/60 shadow-2xl shadow-black/40">
                  Support BagUI in Pricing to unlock the Pro badge.
                </span>
              )}
            </span>
          )}
        </h1>

        <p className="mt-1 text-sm text-white/60">BagUI Member</p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className={pillClass}>Joined {joinedShort}</span>

          <a
            href={`mailto:${email}`}
            title="Send email"
            className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <Mail size={12} />
          </a>

          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className={`${pillClass} border-dashed transition hover:bg-white/10 hover:text-white`}
          >
            Add social network +
          </button>
        </div>
      </div>

      {/* Edit profile modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsEditOpen(false)}
          />
          <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[32px] border border-white/10 bg-[#111111] p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                Edit Profile
              </p>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-white">
              Update your information
            </h2>

            <div className="mt-6">
              <ProfileEditForm profile={profile} email={email} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}