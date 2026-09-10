"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, BadgeCheck, X, Check } from "lucide-react";
import { FaInstagram, FaXTwitter, FaLinkedin, FaGithub } from "react-icons/fa6";
import type { IconType } from "react-icons";
import { ProfileEditForm } from "@/components/ProfileEditForm";

interface ProfileHeaderProps {
  profile: {
    id: string;
    email: string;
    username: string;
    avatar_url: string | null;
    bio: string | null;
    phone: string | null;
    instagram_username: string | null;
    twitter_username: string | null;
    linkedin_username: string | null;
    github_username: string | null;
    created_at: string;
    updated_at: string;
    plan: string | null;
  };
  email: string;
  isProPlan: boolean;
  joinedShort: string;
}

export type SocialPlatform = "instagram" | "twitter" | "linkedin" | "github";

export type SocialLinks = Partial<Record<SocialPlatform, string>>;

interface SocialPlatformConfig {
  id: SocialPlatform;
  label: string;
  icon: IconType;
  url: (handle: string) => string;
}

export const SOCIAL_PLATFORMS: SocialPlatformConfig[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: FaInstagram,
    url: (handle) => `https://instagram.com/${handle}`,
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    icon: FaXTwitter,
    url: (handle) => `https://x.com/${handle}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin,
    url: (handle) => `https://linkedin.com/in/${handle}`,
  },
  {
    id: "github",
    label: "GitHub",
    icon: FaGithub,
    url: (handle) => `https://github.com/${handle}`,
  },
];

const buildProfileSocials = (profile: ProfileHeaderProps["profile"]): SocialLinks => ({
  ...(profile.instagram_username ? { instagram: profile.instagram_username } : {}),
  ...(profile.twitter_username ? { twitter: profile.twitter_username } : {}),
  ...(profile.linkedin_username ? { linkedin: profile.linkedin_username } : {}),
  ...(profile.github_username ? { github: profile.github_username } : {}),
});

export function ProfileHeader({
  profile,
  email,
  isProPlan,
  joinedShort,
}: ProfileHeaderProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showBadgeTip, setShowBadgeTip] = useState(false);

  const [bio, setBio] = useState(profile.bio ?? "");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState("");

  const [phone, setPhone] = useState(profile.phone ?? "");

  const [socials, setSocials] = useState<SocialLinks>(buildProfileSocials(profile));
  const [isAddingSocial, setIsAddingSocial] = useState(false);
  const [pendingPlatform, setPendingPlatform] =
    useState<SocialPlatform | null>(null);
  const [handleDraft, setHandleDraft] = useState("");

  useEffect(() => {
    setBio(profile.bio ?? "");
    setPhone(profile.phone ?? "");
    setSocials(buildProfileSocials(profile));
  }, [profile]);

  const resetProfileDrafts = () => {
    setBio(profile.bio ?? "");
    setPhone(profile.phone ?? "");
    setSocials(buildProfileSocials(profile));
    setIsEditingBio(false);
    setBioDraft("");
    setIsAddingSocial(false);
    setPendingPlatform(null);
    setHandleDraft("");
  };

  const pillClass =
    "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-white/60 sm:text-sm";

  const availablePlatforms = SOCIAL_PLATFORMS.filter((p) => !socials[p.id]);

  const persistProfile = async (
    nextBio: string,
    nextPhone: string,
    nextSocials: SocialLinks,
  ) => {
    try {
      await fetch("/api/account", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profile.username,
          avatar_url: profile.avatar_url,
          bio: nextBio,
          phone: nextPhone,
          socials: nextSocials,
        }),
      });
    } catch (error) {
      console.error("Error saving profile from header:", error);
    }
  };

  const updateSocial = (platform: SocialPlatform, handle: string) => {
    setSocials((prev) => ({ ...prev, [platform]: handle }));
  };

  const startEditingBio = () => {
    setBioDraft(bio);
    setIsEditingBio(true);
  };

  const saveBio = async () => {
    const nextBio = bioDraft.trim();
    setBio(nextBio);
    setIsEditingBio(false);
    await persistProfile(nextBio, phone, socials);
  };

  const cancelAddSocial = () => {
    setIsAddingSocial(false);
    setPendingPlatform(null);
    setHandleDraft("");
  };

  const confirmAddSocial = async () => {
    if (!pendingPlatform || !handleDraft.trim()) return;

    const nextHandle = handleDraft.trim().replace(/^@/, "");
    const nextSocials = {
      ...socials,
      [pendingPlatform]: nextHandle,
    };

    setSocials(nextSocials);
    cancelAddSocial();
    await persistProfile(bio, phone, nextSocials);
  };

  return (
    <>
      {/* Avatar + top-right actions */}
      <div className="relative flex flex-col items-center gap-4 -mt-14 sm:-mt-16 sm:flex-row sm:items-start sm:justify-between">
        <div className="relative z-20 h-28 w-28 shrink-0 overflow-hidden rounded-3xl border-4 border-[#111111] bg-[#111111] shadow-xl sm:h-32 sm:w-32">
          <Image
            src={profile.avatar_url ?? "/faviconblack.png"}
            alt="Avatar"
            width={128}
            height={128}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center gap-2 sm:mt-16 sm:flex-col sm:items-end">
          <button
            type="button"
            onClick={() => setIsEditOpen(true)}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <Pencil size={14} />
            Edit Profile
          </button>

          <span
            className={`inline-flex h-9 shrink-0 items-center justify-center rounded-full border px-4 text-xs font-medium ${
              isProPlan
                ? "border-sky-400/30 bg-sky-400/10 text-sky-400"
                : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            {isProPlan ? "Pro Plan" : "Free Plan"}
          </span>
        </div>
      </div>

      {/* Name + badge + bio + pills */}
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

        {/* Bio */}
        <div className="mt-2 flex justify-center sm:justify-start">
          {isEditingBio ? (
            <div className="flex w-full max-w-sm items-start gap-2">
              <textarea
                autoFocus
                rows={2}
                value={bioDraft}
                onChange={(e) => setBioDraft(e.target.value)}
                placeholder="Write something about yourself..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 outline-none placeholder:text-white/30 focus:border-white/20"
              />
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={saveBio}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <Check size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBio(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ) : bio ? (
            <p
              onClick={startEditingBio}
              className="max-w-sm cursor-pointer text-sm leading-relaxed text-white/60 transition hover:text-white/80"
            >
              {bio}
            </p>
          ) : (
            <button
              type="button"
              onClick={startEditingBio}
              className="text-sm text-white/40 transition hover:text-white/60"
            >
              + Add a bio
            </button>
          )}
        </div>

        {/* Pills: joined, socials, add social */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
          <span className={pillClass}>Joined {joinedShort}</span>

          {(Object.entries(socials) as [SocialPlatform, string][])
            .filter(([, handle]) => handle)
            .map(([platformId, handle]) => {
              const config = SOCIAL_PLATFORMS.find((p) => p.id === platformId)!;
              const Icon = config.icon;
              return (
                <a
                  key={platformId}
                  href={config.url(handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={config.label}
                  className={`${pillClass} transition hover:bg-white/10 hover:text-white`}
                >
                  <Icon size={14} />
                  <span>@{handle}</span>
                </a>
              );
            })}

          {isAddingSocial && (
            <>
              {pendingPlatform ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-3.5 pr-1.5 text-xs text-white/60 sm:text-sm">
                  {(() => {
                    const config = SOCIAL_PLATFORMS.find(
                      (p) => p.id === pendingPlatform
                    )!;
                    const Icon = config.icon;
                    return <Icon size={14} />;
                  })()}
                  <input
                    autoFocus
                    value={handleDraft}
                    onChange={(e) => setHandleDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && confirmAddSocial()}
                    placeholder="username"
                    className="w-24 bg-transparent text-xs text-white outline-none placeholder:text-white/30 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={confirmAddSocial}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-white/60 hover:text-white"
                  >
                    <Check size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={cancelAddSocial}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-white/60 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1.5">
                  {availablePlatforms.map((p) => {
                    const Icon = p.icon;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        title={p.label}
                        onClick={() => setPendingPlatform(p.id)}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                      >
                        <Icon size={14} />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={cancelAddSocial}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </>
          )}

          {!isAddingSocial && availablePlatforms.length > 0 && (
            <button
              type="button"
              onClick={() => setIsAddingSocial(true)}
              className={`${pillClass} border-dashed transition hover:bg-white/10 hover:text-white`}
            >
              Add social network +
            </button>
          )}
        </div>
      </div>

      {/* Edit profile modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              resetProfileDrafts();
              setIsEditOpen(false);
            }}
          />
          <div className="relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-[32px] border border-white/10 bg-[#111111] p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                Edit Profile
              </p>
              <button
                type="button"
                onClick={() => {
                  resetProfileDrafts();
                  setIsEditOpen(false);
                }}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <h2 className="mt-4 text-xl font-semibold text-white">
              Update your information
            </h2>

            <div className="mt-6">
              <ProfileEditForm
                profile={profile}
                email={email}
                bio={bio}
                onBioChange={setBio}
                phone={phone}
                onPhoneChange={setPhone}
                socials={socials}
                onSocialsChange={updateSocial}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}