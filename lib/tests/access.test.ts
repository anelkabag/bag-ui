import assert from "node:assert/strict";
import test from "node:test";

import {
  canInstall,
  getComponentAccessTier,
  getInstallAccessState,
  hasProAccess,
  isLoggedIn,
} from "./access.ts";

test("guests cannot install pro components", () => {
  const component = { access: { tier: "pro" as const } };

  assert.equal(getComponentAccessTier(component), "pro");
  assert.equal(isLoggedIn(null), false);
  assert.equal(canInstall(component, null), false);
  assert.equal(
    getInstallAccessState(component, null, "/blocks").action,
    "signin",
  );
});

test("signed-in free-plan users can install pro components", () => {
  const component = { access: { tier: "pro" as const } };

  assert.equal(hasProAccess({ plan: "free" }), false);
  assert.equal(canInstall(component, { id: "1", plan: "free" }), true);
  assert.equal(
    getInstallAccessState(component, { id: "1", plan: "free" }, "/blocks")
      .action,
    "install",
  );
});

test("signed-in pro-plan users can install pro components", () => {
  const component = { access: { tier: "pro" as const } };

  assert.equal(hasProAccess({ plan: "monthly" }), true);
  assert.equal(canInstall(component, { id: "1", plan: "monthly" }), true);
  assert.equal(
    getInstallAccessState(component, { id: "1", plan: "monthly" }, "/blocks")
      .action,
    "install",
  );
});
