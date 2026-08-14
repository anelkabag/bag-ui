import assert from "node:assert/strict";
import test from "node:test";

import { componentLoaders } from "./registry-loaders.ts";

test("ui preview loaders include deploy and github components", () => {
  assert.ok(componentLoaders["registry/default/ui/deploybtn.tsx"]);
  assert.ok(componentLoaders["registry/default/ui/stargithub.tsx"]);
});
