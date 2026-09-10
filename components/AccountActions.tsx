"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AccountActions() {
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Session</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign out of your BagUI account on this device.
        </p>
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-sm font-medium text-foreground transition hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
      >
        <LogOut size={16} />
        {isSigningOut ? "Signing out..." : "Sign out"}
      </button>
    </div>
  );
}