import type { RegistryItem, AccessTier } from "@/lib/block-categories";

export type InstallAccessAction = "install" | "signin" | "upgrade";

export interface InstallAccessState {
  action: InstallAccessAction;
  label: string;
  description: string;
  href: string;
}

export interface AccessProfileLike {
  id?: string | null;
  plan?: string | null;
  subscription_plan?: string | null;
}

export interface AccessComponentLike {
  access?: {
    tier?: AccessTier | null;
  } | null;
}

export function getComponentAccessTier(
  component: AccessComponentLike | null | undefined,
): AccessTier {
  return component?.access?.tier === "pro" ? "pro" : "free";
}

export function isLoggedIn(
  user: AccessProfileLike | null | undefined,
): boolean {
  return Boolean(user?.id);
}

export function hasProAccess(
  profile: AccessProfileLike | null | undefined,
): boolean {
  // For now, access is determined from the active profile plan only.
  // We do not inspect billing/payment history here.
  const plan = (
    profile?.plan ??
    profile?.subscription_plan ??
    "free"
  ).toLowerCase();

  return ["monthly", "yearly", "lifetime", "pro"].includes(plan);
}

export function canAccess(
  _component: AccessComponentLike | null | undefined,
  _profile: AccessProfileLike | null | undefined,
): boolean {
  return true;
}

export function canInstall(
  component: AccessComponentLike | null | undefined,
  profile: AccessProfileLike | null | undefined,
): boolean {
  if (!isLoggedIn(profile)) {
    return false;
  }

  return getComponentAccessTier(component) === "free" || hasProAccess(profile);
}

export function getInstallAccessState(
  component: AccessComponentLike | null | undefined,
  profile: AccessProfileLike | null | undefined,
  redirectPath = "/blocks",
): InstallAccessState {
  if (canInstall(component, profile)) {
    return {
      action: "install",
      label: "Install",
      description: "Install this component with the CLI command below.",
      href: redirectPath,
    };
  }

  if (!isLoggedIn(profile)) {
    return {
      action: "signin",
      label: "Sign in to install",
      description: "Sign in to unlock installation for this component.",
      href: `/login?redirect=${encodeURIComponent(redirectPath)}`,
    };
  }

  return {
    action: "upgrade",
    label: "Upgrade to Pro",
    description: "Upgrade your plan to install this Pro component.",
    href: "/pricing",
  };
}

export function getRegistryAccessTier(
  component: RegistryItem | null | undefined,
): AccessTier {
  return getComponentAccessTier(component);
}
