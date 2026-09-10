import test from "node:test";
import assert from "node:assert/strict";

import { normalizeProfileUpdatePayload } from "../profile";

test("normalizes profile field values before saving to Supabase", () => {
  const payload = normalizeProfileUpdatePayload({
    username: " alice ",
    avatar_url: " https://example.com/avatar.png ",
    bio: "  Hello world  ",
    phone: " +1 555 123 4567 ",
    socials: {
      instagram: " @alice ",
      twitter: "  bagui ",
      linkedin: "  my-link ",
      github: "   ",
    },
  });

  assert.deepStrictEqual(payload, {
    username: "alice",
    avatar_url: "https://example.com/avatar.png",
    bio: "Hello world",
    phone: "+1 555 123 4567",
    instagram_username: "alice",
    twitter_username: "bagui",
    linkedin_username: "my-link",
    github_username: null,
  });
});
