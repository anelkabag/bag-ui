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
  user_metadata?: {
    plan?: string | null;
    subscription_plan?: string | null;
    username?: string | null;
    [key: string]: unknown;
  } | null;
  app_metadata?: {
    plan?: string | null;
    subscription_plan?: string | null;
    [key: string]: unknown;
  } | null;
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
  const rawPlan = [
    profile?.plan,
    profile?.subscription_plan,
    profile?.user_metadata?.plan,
    profile?.user_metadata?.subscription_plan,
    profile?.app_metadata?.plan,
    profile?.app_metadata?.subscription_plan,
  ].find((value): value is string => Boolean(value && String(value).trim()));

  const plan = (rawPlan ?? "free").toLowerCase();

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
  if (getComponentAccessTier(component) === "free") {
    return true;
  }

  return isLoggedIn(profile) && hasProAccess(profile);
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
      action:
        getComponentAccessTier(component) === "free" ? "install" : "signin",
      label:
        getComponentAccessTier(component) === "free"
          ? "Install"
          : "Sign in to install",
      description:
        getComponentAccessTier(component) === "free"
          ? "Install this free component with the CLI command below."
          : "Sign in to unlock installation for this component.",
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
