import test from "node:test";
import assert from "node:assert/strict";

import {
  getResendEventStatus,
  isReleaseNotificationAdmin,
  isProductionDeploymentStatus,
  isProductionNotificationRuntime,
  isRetryableResendError,
  normalizePublishedRegistry,
} from "../release-notifications";
import {
  hasValidBearerToken,
  createUnsubscribeToken,
  verifyUnsubscribeToken,
} from "../notification-security";
import { buildReleaseNotificationEmail } from "../release-notification-email";
import { POST as handleResendWebhook } from "../../app/api/webhooks/resend/route";

test("normalizes published production resources and ignores malformed entries", () => {
  const resources = normalizePublishedRegistry({
    items: [
      {
        name: "hero-01",
        type: "registry:block",
        title: "Hero 01",
        description: "  A new   hero block. ",
        files: [{ path: "registry/default/blocks/Hero/hero-01.tsx" }],
        image: "https://bagui.pro/previews/hero.png",
      },
      { name: "../draft", type: "registry:block" },
      { name: "unknown", type: "private" },
    ],
  });

  assert.deepEqual(resources, [
    {
      resource_key: "block:hero-01",
      resource_type: "block",
      resource_name: "Hero 01",
      description: "A new hero block.",
      category: "Hero",
      resource_url: "https://www.bagui.pro/blocks/hero-01",
      image_url: "https://bagui.pro/previews/hero.png",
    },
  ]);
});

test("draft and preview entries do not create production releases", () => {
  const resources = normalizePublishedRegistry({
    items: [
      { name: "drafted", type: "registry:block", status: "draft" },
      { name: "unpublished", type: "registry:block", published: false },
      { name: "preview", type: "registry:block", preview: true },
      { name: "published", type: "registry:block", status: "published" },
    ],
  });

  assert.deepEqual(resources.map((resource) => resource.resource_name), [
    "published",
  ]);
  assert.throws(
    () =>
      normalizePublishedRegistry({
        environment: "preview",
        items: [{ name: "preview", type: "registry:block" }],
      }),
    /Preview registry data/,
  );
  assert.equal(isProductionNotificationRuntime("preview"), false);
  assert.equal(isProductionNotificationRuntime("development"), false);
  assert.equal(isProductionNotificationRuntime("production"), true);
});

test("only successful production deployment statuses can publish registry releases", () => {
  const event = {
    deploymentId: 10,
    statusId: 20,
    state: "success",
    environment: "Production",
    productionEnvironment: true,
    environmentUrl: "https://bagui-git-main.vercel.app",
  };

  assert.equal(isProductionDeploymentStatus(event), true);
  assert.equal(
    isProductionDeploymentStatus({ ...event, environment: "Preview" }),
    false,
  );
  assert.equal(
    isProductionDeploymentStatus({ ...event, productionEnvironment: false }),
    false,
  );
  assert.equal(isProductionDeploymentStatus({ ...event, state: "failure" }), false);
  assert.equal(
    isProductionDeploymentStatus({
      ...event,
      environmentUrl: "https://attacker.example",
    }),
    false,
  );
  assert.equal(
    isProductionDeploymentStatus({ ...event, deploymentId: Number.MAX_SAFE_INTEGER + 1 }),
    false,
  );
});

test("resource identity is stable across ordinary metadata updates", () => {
  const first = normalizePublishedRegistry({
    items: [{ name: "hero-01", type: "registry:block", title: "Hero 01" }],
  });
  const updated = normalizePublishedRegistry({
    items: [{ name: "hero-01", type: "registry:block", title: "Updated hero" }],
  });

  assert.equal(first[0].resource_key, updated[0].resource_key);
  assert.notEqual(first[0].resource_name, updated[0].resource_name);
});

test("does not accept preview images from arbitrary hosts", () => {
  const [resource] = normalizePublishedRegistry({
    items: [
      {
        name: "test",
        type: "registry:animation",
        image: "https://attacker.example/image.png",
      },
    ],
  });

  assert.equal(resource.image_url, null);
  assert.equal(resource.resource_type, "animation");
});

test("release email escapes untrusted content and includes required links", () => {
  const email = buildReleaseNotificationEmail({
    resource_key: "block:x",
    resource_type: "block",
    resource_name: "<script>alert(1)</script>",
    description: "A <strong>new</strong> block",
    category: "Hero & CTA",
    resource_url: "https://www.bagui.pro/blocks/example",
    image_url: null,
    unsubscribeUrl: "https://www.bagui.pro/unsubscribe?token=abc",
    preferencesUrl: "https://www.bagui.pro/account#notifications",
  });

  assert.equal(email.from, "BagUI <updates@news.bagui.pro>");
  assert.equal(email.subject, "New on BagUI: <script>alert(1)</script> is here!");
  assert.match(email.html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(email.html, /A &lt;strong&gt;new&lt;\/strong&gt; block/);
  assert.match(email.html, /Explore Component/);
  assert.match(email.html, /https:\/\/www\.bagui\.pro\/blocks\/example/);
  assert.match(email.html, /https:\/\/www\.bagui\.pro\/unsubscribe\?token=abc/);
  assert.match(email.html, /https:\/\/www\.bagui\.pro\/account#notifications/);
  assert.match(email.html, /turn these emails off at any time/);
  assert.match(email.text, /turn off emails about new BagUI components anytime/);
  assert.equal(
    email.headers["List-Unsubscribe-Post"],
    "List-Unsubscribe=One-Click",
  );
});

test("unsubscribe tokens are signed and reject modification", () => {
  const previousSecret = process.env.NOTIFICATION_TOKEN_SECRET;
  process.env.NOTIFICATION_TOKEN_SECRET = "test-secret-".padEnd(32, "x");
  try {
    const userId = "01234567-89ab-4cde-8f01-234567890abc";
    const token = createUnsubscribeToken(userId);
    assert.equal(verifyUnsubscribeToken(token), userId);
    assert.equal(verifyUnsubscribeToken(`${token.slice(0, -1)}x`), null);
    assert.equal(verifyUnsubscribeToken("not-a-token"), null);
  } finally {
    if (previousSecret === undefined) {
      delete process.env.NOTIFICATION_TOKEN_SECRET;
    } else {
      process.env.NOTIFICATION_TOKEN_SECRET = previousSecret;
    }
  }
});

test("worker bearer checks, admin matching, webhook status, and retry policy are strict", () => {
  const expectedToken = "x".repeat(40);
  const validAuthorization = ["Bea", "rer ", expectedToken].join("");
  assert.equal(
    hasValidBearerToken(validAuthorization, expectedToken),
    true,
  );
  assert.equal(hasValidBearerToken(["Bea", "rer wrong"].join(""), expectedToken), false);
  assert.equal(hasValidBearerToken(null, "a-long-secret"), false);

  assert.equal(
    isReleaseNotificationAdmin("ADMIN@BAGUI.PRO", "admin@bagui.pro,ops@bagui.pro"),
    true,
  );
  assert.equal(
    isReleaseNotificationAdmin("admin@bagui.pro.evil", "admin@bagui.pro"),
    false,
  );
  assert.equal(getResendEventStatus("email.delivered"), "delivered");
  assert.equal(getResendEventStatus("email.delivery_delayed"), "delayed");
  assert.equal(isRetryableResendError(429), true);
  assert.equal(isRetryableResendError(503), true);
  assert.equal(isRetryableResendError(422), false);
});

test("Resend webhook rejects invalid signatures before touching the database", async () => {
  const previousSecret = process.env.RESEND_WEBHOOK_SECRET;
  process.env.RESEND_WEBHOOK_SECRET = "whsec_test-signing-secret";
  try {
    const response = await handleResendWebhook(
      new Request("https://www.bagui.pro/api/webhooks/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "svix-id": "msg_test",
          "svix-timestamp": Math.floor(Date.now() / 1000).toString(),
          "svix-signature": "v1,invalid",
        },
        body: JSON.stringify({ type: "email.delivered", data: {} }),
      }),
    );

    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), {
      error: "Invalid webhook signature",
    });
  } finally {
    if (previousSecret === undefined) {
      delete process.env.RESEND_WEBHOOK_SECRET;
    } else {
      process.env.RESEND_WEBHOOK_SECRET = previousSecret;
    }
  }
});
