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
      <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40">
        <p className="text-sm uppercase tracking-[0.35em] text-white/40">
          Download History
        </p>
        <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
          <Download size={32} className="mb-4 text-white/30" />
          <p className="text-sm text-white/60">
            No components downloaded yet
          </p>
          <p className="mt-1 text-xs text-white/40">
            Start downloading components to see your history here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-white/40">
            Download History
          </p>
          <h2 className="mt-4 text-2xl font-semibold">
            Your downloaded components
          </h2>
        </div>
        <div className="flex flex-col items-end rounded-full border border-white/10 bg-white/5 px-4 py-2">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="text-xs text-white/60">downloads</span>
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
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition hover:bg-white/5 hover:border-white/10"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {download.component}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/60">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={12} />
                    {formattedDate}
                  </span>
                  {download.os && (
                    <span className="inline-block rounded-full bg-white/5 px-2 py-1">
                      {download.os}
                    </span>
                  )}
                  {download.cli_version && (
                    <span className="inline-block rounded-full bg-white/5 px-2 py-1">
                      CLI v{download.cli_version}
                    </span>
                  )}
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs font-semibold text-blue-300">
                  {download.count}
                </span>
                <span className="mt-1 text-xs text-white/40">{formattedTime}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="text-xs text-white/40">
          Showing {downloads.length} of {total} downloads • Last 50 downloads
        </p>
      </div>
    </div>
  );
}
