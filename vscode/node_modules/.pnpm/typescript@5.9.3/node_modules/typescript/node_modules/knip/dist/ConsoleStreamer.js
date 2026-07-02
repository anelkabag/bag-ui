export class ConsoleStreamer {
    isEnabled = false;
    isWatch = false;
    lines = 0;
    constructor(options) {
        this.isEnabled = options.isShowProgress;
        this.isWatch = options.isWatch;
    }
    clearLines(count) {
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                process.stdout.moveCursor(0, -1);
                process.stdout.clearLine(1);
            }
        }
        process.stdout.cursorTo(0);
    }
    clearScreen() {
        process.stdout.write('\x1b[2J\x1b[1;1f');
    }
    update(messages) {
        this.clear();
        process.stdout.write(`${messages.join('\n')}\n`);
        this.lines = messages.length;
    }
    cast(message, sub) {
        if (!this.isEnabled)
            return;
        if (Array.isArray(message))
            this.update(message);
        else
            this.update([`${message}${!sub || sub === '.' ? '' : ` (${sub})`}…`]);
    }
    clear() {
        if (!this.isEnabled)
            return;
        if (this.isWatch)
            this.clearScreen();
        else
            this.clearLines(this.lines);
    }
}
