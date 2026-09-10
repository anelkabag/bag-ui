export type ProfileSocials = Partial<
  Record<"instagram" | "twitter" | "linkedin" | "github", string>
>;

export type ProfileUpdateInput = {
  username?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  socials?: ProfileSocials;
};

export function normalizeProfileUpdatePayload(input: ProfileUpdateInput) {
  const username = typeof input.username === "string" ? input.username.trim() : "";
  const avatarUrl =
    typeof input.avatar_url === "string" ? input.avatar_url.trim() : "";
  const bio = typeof input.bio === "string" ? input.bio.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const socials = input.socials ?? {};

  const normalizeHandle = (value?: string) => {
    if (typeof value !== "string") return null;
    const cleaned = value.trim().replace(/^@/, "");
    return cleaned.length > 0 ? cleaned : null;
  };

  return {
    username,
    avatar_url: avatarUrl || null,
    bio: bio || null,
    phone: phone || null,
    instagram_username: normalizeHandle(socials.instagram),
    twitter_username: normalizeHandle(socials.twitter),
    linkedin_username: normalizeHandle(socials.linkedin),
    github_username: normalizeHandle(socials.github),
  };
}
