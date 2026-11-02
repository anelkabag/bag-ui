export const PRODUCTION_SITE_URL = "https://www.bagui.pro";
export const PRODUCTION_REGISTRY_URL = `${PRODUCTION_SITE_URL}/r/registry.json`;

export interface PublishedResource {
  resource_key: string;
  resource_type: string;
  resource_name: string;
  description: string;
  category: string;
  resource_url: string;
  image_url: string | null;
}

export interface ProductionDeploymentStatus {
  deploymentId: number;
  statusId: number;
  state: string;
  environment: string;
  productionEnvironment: boolean;
  environmentUrl: string;
}

interface RegistryFile {
  path?: unknown;
}

interface RegistryItem {
  name?: unknown;
  type?: unknown;
  title?: unknown;
  description?: unknown;
  category?: unknown;
  image?: unknown;
  files?: unknown;
  status?: unknown;
  published?: unknown;
  isDraft?: unknown;
  preview?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanText(value: unknown, fallback: string, limit: number) {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, limit) : fallback;
}

function getRegistryCategory(item: RegistryItem) {
  if (typeof item.category === "string" && item.category.trim()) {
    return item.category.trim().slice(0, 80);
  }

  if (Array.isArray(item.files)) {
    for (const file of item.files as RegistryFile[]) {
      if (typeof file?.path !== "string") continue;
      const parts = file.path.split("/");
      const blocksIndex = parts.indexOf("blocks");
      if (blocksIndex >= 0 && parts[blocksIndex + 1]) {
        return parts[blocksIndex + 1].slice(0, 80);
      }
    }
  }

  return typeof item.type === "string"
    ? item.type.replace(/^registry:/, "").slice(0, 80)
    : "Resource";
}

function getPreviewImage(value: unknown) {
  if (typeof value !== "string") return null;

  try {
    const url = new URL(value);
    if (url.protocol === "https:" && url.hostname === "bagui.pro") {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function normalizePublishedRegistry(input: unknown): PublishedResource[] {
  if (!isRecord(input) || !Array.isArray(input.items)) {
    throw new Error("Production registry response has an invalid shape");
  }
  if (
    input.environment === "preview" ||
    input.deployment === "preview" ||
    input.isPreview === true
  ) {
    throw new Error("Preview registry data cannot create release notifications");
  }
  if (input.items.length > 10_000) {
    throw new Error("Production registry contains too many resources");
  }

  const resources = new Map<string, PublishedResource>();
  for (const candidate of input.items) {
    if (!isRecord(candidate)) continue;
    const item = candidate as RegistryItem;
    const status =
      typeof item.status === "string" ? item.status.toLowerCase() : "";
    if (
      typeof item.name !== "string" ||
      !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,99}$/.test(item.name) ||
      typeof item.type !== "string" ||
      !item.type.startsWith("registry:") ||
      item.published === false ||
      item.isDraft === true ||
      item.preview === true ||
      ["draft", "preview", "unpublished"].includes(status)
    ) {
      continue;
    }

    const name = item.name.trim();
    const resourceType = item.type.slice("registry:".length).trim().toLowerCase();
    if (!name || !resourceType) continue;

    const resourceKey = `${resourceType}:${name.toLowerCase()}`;
    resources.set(resourceKey, {
      resource_key: resourceKey,
      resource_type: resourceType.slice(0, 80),
      resource_name: cleanText(item.title, name, 160),
      description: cleanText(item.description, "", 400),
      category: getRegistryCategory(item),
      resource_url: `${PRODUCTION_SITE_URL}/blocks/${encodeURIComponent(name)}`,
      image_url: getPreviewImage(item.image),
    });
  }

  return Array.from(resources.values());
}

export function getResendEventStatus(eventType: string) {
  switch (eventType) {
    case "email.sent":
      return "sent";
    case "email.delivered":
      return "delivered";
    case "email.delivery_delayed":
      return "delayed";
    case "email.failed":
      return "failed";
    case "email.bounced":
      return "bounced";
    case "email.complained":
      return "complained";
    default:
      return null;
  }
}

export function isRetryableResendError(statusCode: number | null | undefined) {
  return statusCode == null || statusCode === 429 || statusCode >= 500;
}

export function isProductionNotificationRuntime(vercelEnvironment: string | undefined) {
  return vercelEnvironment === "production";
}

export function isProductionDeploymentStatus(
  event: ProductionDeploymentStatus,
) {
  if (
    !Number.isSafeInteger(event.deploymentId) ||
    event.deploymentId <= 0 ||
    !Number.isSafeInteger(event.statusId) ||
    event.statusId <= 0 ||
    event.state !== "success" ||
    event.environment.trim().toLowerCase() !== "production" ||
    event.productionEnvironment !== true
  ) {
    return false;
  }

  try {
    const url = new URL(event.environmentUrl);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      (!url.port || url.port === "443") &&
      (url.hostname === "bagui.pro" ||
        url.hostname === "www.bagui.pro" ||
        url.hostname.endsWith(".vercel.app"))
    );
  } catch {
    return false;
  }
}

export function isReleaseNotificationAdmin(
  email: string | undefined | null,
  configuredAdmins = process.env.RELEASE_NOTIFICATION_ADMIN_EMAILS,
) {
  if (!email || !configuredAdmins) return false;
  const normalizedEmail = email.trim().toLowerCase();
  return configuredAdmins
    .split(",")
    .map((admin) => admin.trim().toLowerCase())
    .filter(Boolean)
    .includes(normalizedEmail);
}
