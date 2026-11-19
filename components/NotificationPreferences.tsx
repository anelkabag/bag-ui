"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";

export function NotificationPreferences() {
  const [enabled, setEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/account/notification-preferences")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load preferences");
        if (active) setEnabled(result.productUpdatesEnabled === true);
      })
      .catch((error: unknown) => {
        if (active) {
          setMessage(
            error instanceof Error ? error.message : "Could not load preferences",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function updatePreference(nextEnabled: boolean) {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/account/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productUpdatesEnabled: nextEnabled }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update preferences");
      setEnabled(result.productUpdatesEnabled === true);
      posthog.capture("notification_preference_updated", {
        product_updates_enabled: result.productUpdatesEnabled === true,
      });
      setMessage(nextEnabled ? "Product updates enabled." : "Product updates disabled.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update preferences",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section
      id="notifications"
      className="rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
        Email preferences
      </p>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            BagUI product updates
          </h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Get occasional emails when new components, blocks, and other
            resources are released. Emails are enabled by default, and you can
            turn them off here at any time.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          disabled={loading || saving}
          onClick={() => updatePreference(!enabled)}
          className="inline-flex min-w-32 items-center justify-center rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading..." : saving ? "Saving..." : enabled ? "Enabled" : "Enable emails"}
        </button>
      </div>
      {message && (
        <p className="mt-4 text-sm text-muted-foreground" role="status">
          {message}
        </p>
      )}
    </section>
  );
}
