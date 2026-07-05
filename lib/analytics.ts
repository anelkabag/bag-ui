export interface AnalyticsDownloadPayload {
  component: string;
  projectId: string;
  cliVersion?: string;
  os?: string;
  userId?: string | null;
}

export interface AnalyticsSummary {
  totalDownloads: number;
  downloadsToday: number;
  componentCount: number;
  projectCount: number;
  topComponents: Array<{
    component: string;
    downloads: number;
    projects: number;
    lastUsedAt: string | null;
  }>;
  dailySeries: Array<{ date: string; downloads: number }>;
}

export interface ProjectConfig {
  projectId: string;
}

const ANALYTICS_PROJECT_ID_KEY = "bagui.analytics.projectId";

function getRandomProjectId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `bagui-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getBrowserStorage(): Storage | null {
  const storageCandidate =
    typeof window !== "undefined"
      ? window.localStorage
      : typeof globalThis !== "undefined"
        ? (globalThis as typeof globalThis & { localStorage?: Storage })
            .localStorage
        : undefined;

  if (!storageCandidate) {
    return null;
  }

  try {
    return storageCandidate;
  } catch {
    return null;
  }
}

export function getOrCreateAnalyticsProjectId(
  storage?: Storage | null,
): string {
  const targetStorage = storage ?? getBrowserStorage();

  if (targetStorage) {
    const existing = targetStorage.getItem(ANALYTICS_PROJECT_ID_KEY);
    if (existing) {
      return existing;
    }

    const generated = getRandomProjectId();
    targetStorage.setItem(ANALYTICS_PROJECT_ID_KEY, generated);
    return generated;
  }

  return getRandomProjectId();
}

export async function ensureProjectIdConfig(
  projectRoot = process.cwd(),
): Promise<string> {
  if (typeof window !== "undefined") {
    return getOrCreateAnalyticsProjectId();
  }

  const { mkdir, readFile, writeFile } = await import("node:fs/promises");
  const path = (await import("node:path")).default;
  const { randomUUID } = await import("node:crypto");

  const configDir = path.join(projectRoot, ".bagui");
  const configPath = path.join(configDir, "config.json");

  try {
    const existing = await readFile(configPath, "utf8");
    const parsed = JSON.parse(existing) as Partial<ProjectConfig>;
    if (parsed.projectId) {
      return parsed.projectId;
    }
  } catch {
    // Ignore missing/invalid config and create a fresh one.
  }

  await mkdir(configDir, { recursive: true });
  const projectId = randomUUID();
  const contents = JSON.stringify({ projectId }, null, 2);
  await writeFile(configPath, contents, "utf8");
  return projectId;
}

export function buildAnalyticsPayload(payload: AnalyticsDownloadPayload) {
  return {
    component: payload.component,
    projectId: payload.projectId,
    cliVersion: payload.cliVersion ?? null,
    os: payload.os ?? null,
    userId: payload.userId ?? null,
  };
}

export async function fireAndForgetAnalytics(
  url: string,
  payload: AnalyticsDownloadPayload,
): Promise<void> {
  try {
    const body = JSON.stringify(buildAnalyticsPayload(payload));
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      return;
    }
  } catch {
    // Silently ignore analytics failures.
  }
}

export async function trackComponentDownload(
  component: string,
  options?: Partial<AnalyticsDownloadPayload>,
): Promise<void> {
  const projectId = options?.projectId ?? getOrCreateAnalyticsProjectId();

  await fireAndForgetAnalytics("/api/analytics/download", {
    component,
    projectId,
    cliVersion: options?.cliVersion,
    os: options?.os,
    userId: options?.userId ?? null,
  });
}
