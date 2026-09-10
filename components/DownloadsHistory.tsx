import { Download, Calendar } from "lucide-react";

interface DownloadItem {
  component: string;
  count: number;
  lastDownloaded: string;
  os: string;
  cli_version?: string;
}

interface DownloadsHistoryProps {
  downloads: DownloadItem[];
  total: number;
}

export function DownloadsHistory({
  downloads,
  total,
}: DownloadsHistoryProps) {
  if (!downloads || downloads.length === 0) {
    return (
      <div className="rounded-[32px] border border-border bg-card/90 p-10 shadow-2xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
          Download History
        </p>
        <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
          <Download size={32} className="mb-4 text-muted-foreground/70" />
          <p className="text-sm text-foreground/80">
            No components downloaded yet
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Start downloading components to see your history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-border bg-card/90 p-10 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-muted-foreground">
            Download History
          </p>
          <h2 className="mt-4 text-2xl font-semibold text-foreground">
            Your downloaded components
          </h2>
        </div>
        <div className="flex flex-col items-end rounded-full border border-border bg-muted/70 px-4 py-2">
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">downloads</span>
        </div>
      </div>

      <div className="mt-6 space-y-3 max-h-96 overflow-y-auto">
        {downloads.map((download) => {
          const lastDownloadDate = new Date(download.lastDownloaded);
          const formattedDate = lastDownloadDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const formattedTime = lastDownloadDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={download.component}
              className="flex items-center justify-between rounded-2xl border border-border bg-muted/30 p-4 transition hover:bg-accent/60"
            >
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium text-foreground">
                  {download.component}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} />
                    {formattedDate}
                  </span>
                  {download.os && (
                    <span className="inline-block rounded-full bg-muted px-2 py-1 text-foreground/80">
                      {download.os}
                    </span>
                  )}
                  {download.cli_version && (
                    <span className="inline-block rounded-full bg-muted px-2 py-1 text-foreground/80">
                      CLI v{download.cli_version}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-semibold text-blue-500 dark:text-blue-300">
                  {download.count}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">{formattedTime}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className="text-xs text-muted-foreground">
          Showing {downloads.length} of {total} downloads • Last 50 downloads
        </p>
      </div>
    </div>
  );
}
