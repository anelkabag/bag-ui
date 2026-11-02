import { createHmac, timingSafeEqual } from "node:crypto";

function getTokenSecret() {
  const secret = process.env.NOTIFICATION_TOKEN_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("NOTIFICATION_TOKEN_SECRET must contain at least 32 bytes");
  }
  return secret;
}

export function assertNotificationTokenSecret() {
  getTokenSecret();
}

function sign(userId: string) {
  return createHmac("sha256", getTokenSecret())
    .update(`bagui-release-unsubscribe:${userId}`)
    .digest("base64url");
}

export function createUnsubscribeToken(userId: string) {
  return `${userId}.${sign(userId)}`;
}

export function verifyUnsubscribeToken(token: string) {
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const userId = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      userId,
    ) ||
    !/^[A-Za-z0-9_-]{43}$/.test(signature)
  ) {
    return null;
  }

  const expected = Buffer.from(sign(userId));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  return userId;
}

export function hasValidBearerToken(
  authorization: string | null,
  expectedToken: string | undefined,
) {
  if (
    !authorization?.startsWith("Bearer ") ||
    !expectedToken ||
    Buffer.byteLength(expectedToken) < 32
  ) {
    return false;
  }
  const supplied = Buffer.from(authorization.slice(7));
  const expected = Buffer.from(expectedToken);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}
