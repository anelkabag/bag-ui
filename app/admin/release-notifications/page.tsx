import { notFound, redirect } from "next/navigation";
import { ReleaseNotificationCampaigns } from "@/components/ReleaseNotificationCampaigns";
import { isReleaseNotificationAdmin } from "@/lib/release-notifications";
import {
  createSupabaseRouteHandlerClient,
  createSupabaseServiceRoleClient,
} from "@/lib/supabase/server";

export default async function ReleaseNotificationAdminPage() {
  const authClient = await createSupabaseRouteHandlerClient();
  const {
    data: { user },
  } = await authClient.auth.getUser();

  if (!user) redirect("/login");
  if (!isReleaseNotificationAdmin(user.email)) notFound();

  const supabase = await createSupabaseServiceRoleClient();
  const { data, error } = await supabase
    .from("release_notification_stats")
    .select(
      "id, resource_name, resource_type, category, created_at, total_recipients, emails_sent, delivered, delayed, failed, retryable_failed, bounced, complained, pending",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Could not load release notification admin page", error.code);
    throw new Error("Unable to load release notification history");
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto max-w-7xl space-y-6">
        <header>
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Administration
          </p>
          <h1 className="mt-3 text-3xl font-semibold">
            Release email campaigns
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Delivery totals update as Resend events arrive. Retry applies only
            to retryable failures and currently opted-in users.
          </p>
        </header>
        <ReleaseNotificationCampaigns campaigns={data ?? []} />
      </div>
    </main>
  );
}
