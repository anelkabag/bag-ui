"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Campaign {
  id: string;
  resource_name: string;
  resource_type: string;
  category: string;
  created_at: string;
  total_recipients: number;
  emails_sent: number;
  delivered: number;
  failed: number;
  retryable_failed: number;
  bounced: number;
  complained: number;
  pending: number;
}

export function ReleaseNotificationCampaigns({
  campaigns,
}: {
  campaigns: Campaign[];
}) {
  const router = useRouter();
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function retry(releaseId: string) {
    setWorkingId(releaseId);
    setMessage(null);
    try {
      const response = await fetch("/api/admin/release-notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ releaseId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Retry failed");
      setMessage(`Queued ${result.retried} eligible failed delivery(s).`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Retry failed");
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {message && (
        <p className="text-sm text-muted-foreground" role="status">
          {message}
        </p>
      )}
      {campaigns.length === 0 ? (
        <p className="rounded-2xl border border-border p-6 text-sm text-muted-foreground">
          No release campaigns have been recorded yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Eligible</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Delivered</th>
                <th className="px-4 py-3">Failed</th>
                <th className="px-4 py-3">Bounced / complaints</th>
                <th className="px-4 py-3">Pending</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-t border-border">
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">
                      {campaign.resource_name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {campaign.resource_type} · {campaign.category}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {new Date(campaign.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">{campaign.total_recipients}</td>
                  <td className="px-4 py-4">{campaign.emails_sent}</td>
                  <td className="px-4 py-4">{campaign.delivered}</td>
                  <td className="px-4 py-4">{campaign.failed}</td>
                  <td className="px-4 py-4">
                    {campaign.bounced} / {campaign.complained}
                  </td>
                  <td className="px-4 py-4">{campaign.pending}</td>
                  <td className="px-4 py-4">
                    <button
                      type="button"
                      disabled={
                        campaign.retryable_failed === 0 ||
                        workingId === campaign.id
                      }
                      onClick={() => retry(campaign.id)}
                      className="whitespace-nowrap rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {workingId === campaign.id ? "Retrying..." : "Retry eligible"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
