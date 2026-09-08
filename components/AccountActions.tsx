"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AccountActions() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  const handleDeleteAccount = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!password) {
      setError("Enter your password to delete your account.");
      return;
    }

    if (!window.confirm("Are you sure you want to permanently delete your account?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete your account.");
      }

      await signOut();
      router.replace("/");
      router.refresh();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete your account.",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Session</h2>
          <p className="mt-1 text-sm text-white/50">
            Sign out of your BagUI account on this device.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut || isDeleting}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut size={16} />
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>

      <div className="border-t border-red-500/20 pt-6">
        <div className="mb-4">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-red-300">
            <Trash2 size={18} />
            Delete account
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-white/50">
            This permanently deletes your profile, download history, and account.
            Enter your password to confirm.
          </p>
        </div>

        <form onSubmit={handleDeleteAccount} className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <label className="sr-only" htmlFor="delete-account-password">
            Account password
          </label>
          <input
            id="delete-account-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Account password"
            autoComplete="current-password"
            disabled={isDeleting || isSigningOut}
            className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition focus:border-red-400/50 focus:bg-white/10 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isDeleting || isSigningOut || !password}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500/15 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={16} />
            {isDeleting ? "Deleting..." : "Delete account"}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-red-300" role="alert">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
