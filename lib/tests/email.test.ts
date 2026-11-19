import test from "node:test";
import assert from "node:assert/strict";
import { buildVerificationEmail, buildWelcomeEmail } from "../email";

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

test("buildWelcomeEmail escapes the name and links to the registry", () => {
  const email = buildWelcomeEmail({
    email: "ada@example.com",
    username: "<Ada>",
  });

  assert.equal(email.subject, "Welcome to BagUI");
  assert.equal(email.from, "BagUI <updates@news.bagui.pro>");
  assert.deepEqual(email.to, ["ada@example.com"]);
  assert.match(email.html, /&lt;Ada&gt;/);
  assert.doesNotMatch(email.html, /<Ada>/);
  assert.match(email.html, /https:\/\/www\.bagui\.pro\/blocks/);
  assert.match(email.text, /ada@example.com|Your email is confirmed/);
});
