import type { ConsoleStreamer } from '../ConsoleStreamer.ts';
import type { Issues } from '../types/issues.ts';
import type { MainOptions } from '../util/create-options.ts';
interface WatchReporter {
    issues: Issues;
    streamer: ConsoleStreamer;
    duration?: number;
    size: number;
}
declare const _default: (options: MainOptions, { issues, streamer, duration, size }: WatchReporter) => void;
export default _default;
