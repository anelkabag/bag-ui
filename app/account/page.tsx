import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Mail, Bookmark, Pencil, CheckCircle2, Circle } from "lucide-react";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import type { Database } from "@/types/supabase";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("id, email, username, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle<{
      id: string;
      email: string;
      username: string;
      avatar_url: string | null;
      created_at: string;
      updated_at: string;
    }>();

  if (error && error.code !== "PGRST116") {
    redirect("/login");
  }

  const username =
    typeof user.user_metadata?.username === "string" &&
    user.user_metadata.username.trim().length > 0
      ? user.user_metadata.username
      : (profileData?.username ?? user.email?.split("@")[0] ?? "user");

  const profile = profileData ?? {
    id: user.id,
    email: user.email ?? "",
    username,
    avatar_url: null,
    created_at: user.created_at ?? new Date().toISOString(),
    updated_at: user.updated_at ?? new Date().toISOString(),
  };

  const joinedShort = new Date(profile.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const joinedLong = new Date(profile.created_at).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isEmailVerified = Boolean(user.email_confirmed_at);
  const provider = user.app_metadata?.provider
    ? user.app_metadata.provider.charAt(0).toUpperCase() +
      user.app_metadata.provider.slice(1)
    : "Email";
  const lastActive = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  const iconBtnClass =
    "flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white";

  const statusChips = [
    {
      label: "Email Verified",
      detail: isEmailVerified ? "Confirmed" : "Pending",
      active: isEmailVerified,
    },
    { label: "Sign-in Provider", detail: provider, active: false },
    { label: "Last Active", detail: lastActive, active: false },
  ];

  return (
    <main className="min-h-screen bg-[#0b0b0b] px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile header */}
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#111111]/90 shadow-2xl shadow-black/40">
          {/* Cover */}
          <div
            className="relative h-36 sm:h-44"
            style={{
              backgroundImage:
                "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 60%), linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "auto, 28px 28px, 28px 28px",
              backgroundColor: "#141414",
            }}
          >
            <span className="absolute right-6 top-6 text-xs font-semibold uppercase tracking-[0.35em] text-white/30">
              Bag\Ui
            </span>
          </div>

          <div className="px-8 pb-8 sm:px-10">
            {/* Avatar + name + edit button */}
            <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-3xl border-4 border-[#111111] bg-white/5 sm:h-28 sm:w-28 z-10">
                  <Image
                    src={profile.avatar_url ?? "/faviconblack.png"}
                    alt="Avatar"
                    width={112}
                    height={112}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="pb-1">
                  <h1 className="text-2xl font-semibold sm:text-3xl">
                    {profile.username}
                  </h1>
                  <p className="mt-1 text-sm text-white/60">BagUI Member</p>
                  <span className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                    Joined {joinedShort}
                  </span>
                </div>
              </div>
              <a
                href="#edit-profile"
                className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 text-xs font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <Pencil size={14} />
                Edit Profile
              </a>
            </div>

            {/* Quick actions */}
            <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-6">
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${user.email}`}
                  title="Send email"
                  className={iconBtnClass}
                >
                  <Mail size={16} />
                </a>
              </div>
              <button type="button" title="Save profile" className={iconBtnClass}>
                <Bookmark size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="rounded-full bg-white/10 px-4 py-2 font-medium text-white shadow-sm">
                Overview
              </span>
              <span className="px-4 py-2 text-white/40">Security</span>
              <span className="px-4 py-2 text-white/40">Activity</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40">
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">
            Summary
          </p>
          <p className="mt-6 text-sm leading-relaxed text-white/60">
            {profile.username} has been a BagUI member since {joinedLong},
            signed in with {user.email}.
          </p>
        </div>

        {/* Account status */}
        <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40">
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">
            Account Status
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {statusChips.map((chip) => (
              <span
                key={chip.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
              >
                {chip.active ? (
                  <CheckCircle2 size={16} className="text-green-400" />
                ) : (
                  <Circle size={16} className="text-white/30" />
                )}
                {chip.label}
                <span className="text-white/40">• {chip.detail}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Edit profile form */}
        <div
          id="edit-profile"
          className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">
            Edit Profile
          </p>
          <h2 className="mt-4 text-2xl font-semibold">
            Update your information
          </h2>
          <div className="mt-6">
            <ProfileEditForm profile={profile} email={user.email || ""} />
          </div>
        </div>
      </div>
    </main>
  );
}
