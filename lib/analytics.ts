import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

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

export async function ensureProjectIdConfig(
  projectRoot = process.cwd(),
): Promise<string> {
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
