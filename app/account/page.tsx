import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileHeader } from "@/components/ProfileHeader";
import { DownloadsHistory } from "@/components/DownloadsHistory";
import { AccountActions } from "@/components/AccountActions";

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
    .select(
      "id, email, username, avatar_url, bio, phone, instagram_username, twitter_username, linkedin_username, github_username, created_at, updated_at, plan"
    )
    .eq("id", user.id)
    .maybeSingle<{
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
    }>();

  // Do not redirect to /login when the profile query fails.
  if (error) {
    console.error("Error reading profile:", error);
  }

  // Load the download history.
  interface DownloadItem {
    component: string;
    count: number;
    lastDownloaded: string;
    os: string;
    cli_version?: string;
  }

  let downloadsData: { downloads: DownloadItem[]; total: number } = {
    downloads: [],
    total: 0,
  };
  try {
    const { data: downloads, error: downloadsError } = await supabase
      .from("component_downloads")
      .select("id, component, created_at, os, cli_version")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!downloadsError && downloads) {
      // Group downloads by component and count them.
      const groupedDownloads: DownloadItem[] = downloads.reduce(
        (acc: DownloadItem[], download) => {
          const existing = acc.find((d) => d.component === download.component);
          if (existing) {
            existing.count += 1;
            if (
              new Date(download.created_at) >
              new Date(existing.lastDownloaded)
            ) {
              existing.lastDownloaded = download.created_at;
            }
          } else {
            acc.push({
              component: download.component,
              count: 1,
              lastDownloaded: download.created_at,
              os: download.os || "Unknown",
              cli_version: download.cli_version,
            });
          }
          return acc;
        },
        []
      );

      downloadsData = {
        downloads: groupedDownloads,
        total: downloads.length,
      };
    }
  } catch (err) {
    console.error("Error fetching downloads:", err);
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
    bio: null,
    phone: null,
    instagram_username: null,
    twitter_username: null,
    linkedin_username: null,
    github_username: null,
    created_at: user.created_at ?? new Date().toISOString(),
    updated_at: user.updated_at ?? new Date().toISOString(),
    plan: "free",
  };

  // The plan is now read from profiles.plan.
  const rawPlan =
    profile.plan ??
    user.user_metadata?.plan ??
    user.app_metadata?.plan ??
    "free";

  const plan = String(rawPlan).toLowerCase();

  const isProPlan = ["monthly", "yearly", "lifetime", "pro"].includes(plan);

  const joinedShort = new Date(profile.created_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Profile header */}
        <div className="overflow-hidden rounded-[32px] border border-border bg-card/90 shadow-2xl shadow-black/20">
          {/* Cover */}
          <div
            className="relative h-36 overflow-hidden sm:h-44"
            style={{
              background:
                "linear-gradient(135deg, rgb(15, 23, 42) 0%, rgb(148, 163, 184) 35%, rgb(255, 255, 255) 50%, rgb(148, 163, 184) 65%, rgb(15, 23, 42) 100%)",
            }}
          >
            <span className="absolute right-6 top-6 text-xs font-semibold uppercase tracking-[0.35em] text-slate-900/40 dark:text-white/30">
              Bag\Ui
            </span>
          </div>

          <div className="px-6 pb-8 sm:px-10">
            <ProfileHeader
              profile={profile}
              email={user.email || ""}
              isProPlan={isProPlan}
              joinedShort={joinedShort}
            />
          </div>
        </div>

        {/* Downloads history */}
        <DownloadsHistory
          downloads={downloadsData.downloads}
          total={downloadsData.total}
        />

        {/* Account actions */}
        <div className="rounded-[32px] border border-border bg-card/90 p-10 shadow-2xl shadow-black/20">
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Account Actions
          </p>
          <div className="mt-6">
            <AccountActions />
          </div>
        </div>
      </div>
    </main>
  );
}