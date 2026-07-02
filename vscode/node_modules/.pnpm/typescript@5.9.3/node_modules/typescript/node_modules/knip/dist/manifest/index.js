import { isDefinitelyTyped } from "../util/modules.js";
import { timerify } from "../util/Performance.js";
import { loadPackageManifest } from "./helpers.js";
const getMetaDataFromPackageJson = ({ cwd, dir, packageNames }) => {
    const hostDependencies = new Map();
    const installedBinaries = new Map();
    const hasTypesIncluded = new Set();
    for (const packageName of packageNames) {
        const manifest = loadPackageManifest({ cwd, dir, packageName });
        if (manifest) {
            const binaryName = packageName.replace(/^@[^/]+\//, '');
            const binaries = typeof manifest.bin === 'string' ? [binaryName] : Object.keys(manifest.bin ?? {});
            for (const binaryName of binaries) {
                if (installedBinaries.has(binaryName)) {
                    installedBinaries.get(binaryName)?.add(packageName);
                }
                else {
                    installedBinaries.set(binaryName, new Set([packageName]));
                }
                if (installedBinaries.has(packageName)) {
                    installedBinaries.get(packageName)?.add(binaryName);
                }
                else {
                    installedBinaries.set(packageName, new Set([binaryName]));
                }
            }
            const packagePeerDependencies = Object.keys(manifest.peerDependencies ?? {});
            for (const packagePeerDependency of packagePeerDependencies) {
                const hostDependency = {
                    name: packageName,
                    isPeerOptional: manifest.peerDependenciesMeta?.[packagePeerDependency]?.optional ?? false,
                };
                if (hostDependencies.has(packagePeerDependency)) {
                    hostDependencies.get(packagePeerDependency)?.push(hostDependency);
                }
                else {
                    hostDependencies.set(packagePeerDependency, [hostDependency]);
                }
            }
            if (!isDefinitelyTyped(packageName) && (manifest.types || manifest.typings))
                hasTypesIncluded.add(packageName);
        }
    }
    return {
        hostDependencies,
        installedBinaries,
        hasTypesIncluded,
    };
};
export const getDependencyMetaData = timerify(getMetaDataFromPackageJson);
