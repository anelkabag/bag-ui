import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchLogRecordProcessor, LoggerProvider } from "@opentelemetry/sdk-logs";

const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogToken = process.env.NEXT_PUBLIC_POSTHOG_KEY;

const loggerProvider =
  posthogHost && posthogToken
    ? new LoggerProvider({
        resource: resourceFromAttributes({ "service.name": "bag-ui" }),
        processors: [
          new BatchLogRecordProcessor({
            exporter: new OTLPLogExporter({
              url: `${posthogHost}/i/v1/logs`,
              headers: {
                Authorization: `Bearer ${posthogToken}`,
                "Content-Type": "application/json",
              },
            }),
          }),
        ],
      })
    : null;

if (!loggerProvider && process.env.NODE_ENV !== "production") {
  const missingVariable = posthogToken
    ? "NEXT_PUBLIC_POSTHOG_HOST"
    : "NEXT_PUBLIC_POSTHOG_KEY";

  console.warn(
    new Error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
    ),
  );
}

const posthogLogger = loggerProvider?.getLogger("bag-ui.posthog");

export function logPosthogInfo(
  body: string,
  attributes: Record<string, boolean | number | string>,
) {
  posthogLogger?.emit({
    body,
    severityNumber: SeverityNumber.INFO,
    attributes,
  });
}

export async function flushPosthogLogs() {
  await loggerProvider?.forceFlush().catch(() => {});
}

export function register() {}
