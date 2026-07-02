import { isFile } from "../../util/fs.js";
const title = 'pnpm';
const isEnabled = async ({ cwd, manifest }) => manifest.packageManager?.startsWith('pnpm@') || isFile(cwd, 'pnpm-lock.yaml') || isFile(cwd, 'pnpm-workspace.yaml');
const isRootOnly = true;
const config = ['.pnpmfile.cjs'];
const plugin = {
    title,
    isEnabled,
    isRootOnly,
    config,
};
export default plugin;
