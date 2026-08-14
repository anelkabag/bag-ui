import test from "node:test";
import assert from "node:assert/strict";
import { buildVerificationEmail } from "./email.ts";

test("buildVerificationEmail includes the recipient and confirmation link", () => {
  const email = buildVerificationEmail({
    email: "user@example.com",
    username: "Ada",
    confirmationUrl: "https://example.com/verify",
  });

  assert.match(email.subject, /Verify your email/i);
  assert.match(email.html, /Ada/);
  assert.match(email.html, /user@example.com/);
  assert.match(email.html, /https:\/\/example\.com\/verify/);
});
