import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileHeader } from "@/components/ProfileHeader";
import { DownloadsHistory } from "@/components/DownloadsHistory";
import { AccountActions } from "@/components/AccountActions";
import { NotificationPreferences } from "@/components/NotificationPreferences";
import AppShell from "@/components/shell/AppShell";
import PageHero from "@/components/shell/PageHero";

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
    <AppShell>
      <div className="mx-auto min-h-full max-w-[1440px] bg-background pb-16 text-foreground">
        <PageHero
          firstLine="Your workspace."
          secondLine="Manage your"
          emphasis="account."
          className="pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]"
        >
          <p className="max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
            Profile, downloads, and email preferences for your BagUI account.
            {isProPlan ? " Pro access is active on this profile." : " You are on the free plan."}
          </p>
        </PageHero>

        <div className="mx-5 mt-2 grid gap-4 md:mx-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="border-b border-border px-6 py-5 md:px-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Profile
              </p>
            </div>
            <div className="px-6 py-6 md:px-8 md:py-8">
              <ProfileHeader
                profile={profile}
                email={user.email || ""}
                isProPlan={isProPlan}
                joinedShort={joinedShort}
              />
            </div>
          </section>

          <div className="space-y-4">
            <DownloadsHistory
              downloads={downloadsData.downloads}
              total={downloadsData.total}
            />
            <NotificationPreferences />
            <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Account actions
              </p>
              <div className="mt-5">
                <AccountActions />
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
