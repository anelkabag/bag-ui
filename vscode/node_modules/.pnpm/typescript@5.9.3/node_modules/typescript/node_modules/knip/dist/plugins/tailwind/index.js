import { hasDependency } from "../../util/plugin.js";
import compiler from "./compiler.js";
const title = 'Tailwind';
const enablers = ['tailwindcss'];
const isEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);
const entry = ['tailwind.config.{js,cjs,mjs,ts}'];
const registerCompilers = ({ registerCompiler, hasDependency }) => {
    if (hasDependency('tailwindcss'))
        registerCompiler({ extension: '.css', compiler });
};
const plugin = {
    title,
    enablers,
    isEnabled,
    entry,
    registerCompilers,
};
export default plugin;
