"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import type { Database } from "@/types/supabase";
import { useAuth } from "@/hooks/useAuth";
import {
  SOCIAL_PLATFORMS,
  type SocialPlatform,
  type SocialLinks,
} from "@/components/ProfileHeader";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileEditFormProps {
  profile: Profile | null;
  email: string;
  bio: string;
  onBioChange: (bio: string) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  socials: SocialLinks;
  onSocialsChange: (platform: SocialPlatform, handle: string) => void;
}

export function ProfileEditForm({
  profile,
  email,
  bio,
  onBioChange,
  phone,
  onPhoneChange,
  socials,
  onSocialsChange,
}: ProfileEditFormProps) {
  const router = useRouter();
  const { signOut } = useAuth();

  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: profile?.username || email?.split("@")[0] || "",
    avatar_url: profile?.avatar_url || "",
  });

  // Delete account
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const restoreSavedProfile = () => {
    setFormData({
      username: profile?.username || email?.split("@")[0] || "",
      avatar_url: profile?.avatar_url || "",
    });
    onBioChange(profile?.bio ?? "");
    onPhoneChange(profile?.phone ?? "");
    (SOCIAL_PLATFORMS as readonly { id: SocialPlatform }[]).forEach((platform) => {
      const currentValue =
        platform.id === "instagram"
          ? profile?.instagram_username ?? ""
          : platform.id === "twitter"
            ? profile?.twitter_username ?? ""
            : platform.id === "linkedin"
              ? profile?.linkedin_username ?? ""
              : profile?.github_username ?? "";
      onSocialsChange(platform.id, currentValue);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/account", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          bio,
          phone,
          socials,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error updating profile");
      }

      setSuccess(true);
      setIsEditing(false);
      router.refresh();

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setDeleteError(null);

    if (!deletePassword) {
      setDeleteError("Enter your password to delete your account.");
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to delete your account.");
      }

      await signOut();
      router.replace("/");
      router.refresh();
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Unable to delete your account."
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
          Profile updated successfully!
        </div>
      )}

      {/* Profile details */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-border bg-muted">
              <Image
                src={formData.avatar_url || "/faviconblack.png"}
                alt="Avatar"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profile photo</p>
              <p className="text-2xl font-semibold text-foreground">
                {formData.username}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-muted/70 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Username
              </p>
              <p className="mt-2 text-lg font-medium text-foreground">
                {formData.username}
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/70 p-4">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Email
              </p>
              <p className="mt-2 text-lg font-medium text-foreground">{email}</p>
            </div>

            {phone && (
              <div className="rounded-lg border border-border bg-muted/70 p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Phone
                </p>
                <p className="mt-2 text-lg font-medium text-foreground">{phone}</p>
              </div>
            )}

            {bio && (
              <div className="rounded-lg border border-border bg-muted/70 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Bio
                </p>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                  {bio}
                </p>
              </div>
            )}

            {formData.avatar_url && (
              <div className="rounded-lg border border-border bg-muted/70 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Avatar URL
                </p>
                <p className="mt-2 truncate text-sm text-foreground/80">
                  {formData.avatar_url}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90"
          >
            Edit profile
          </button>
        </div>
      ) : (
        /* Edit form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-ring"
              disabled={isLoading}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="+1 555 555 5555"
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-ring"
              disabled={isLoading}
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              name="bio"
              rows={3}
              value={bio}
              onChange={(e) => onBioChange(e.target.value)}
              placeholder="Write something about yourself..."
              className="w-full resize-none rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-ring"
              disabled={isLoading}
            />
          </div>

          {/* Social links */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Social networks
            </label>
            <div className="space-y-3">
              {SOCIAL_PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.id} className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                      <Icon size={16} />
                    </span>
                    <input
                      type="text"
                      value={socials[platform.id] || ""}
                      onChange={(e) =>
                        onSocialsChange(platform.id, e.target.value)
                      }
                      placeholder={`${platform.label} username`}
                      className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-ring"
                      disabled={isLoading}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Avatar URL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Profile photo URL
            </label>
            <input
              type="url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://exemple.com/photo.jpg"
              className="w-full rounded-lg border border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-ring"
              disabled={isLoading}
            />
          </div>

          {/* Preview */}
          {formData.avatar_url && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Avatar preview</p>
              <div className="h-32 w-32 overflow-hidden rounded-lg border border-border bg-muted">
                <Image
                  src={formData.avatar_url}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                  onError={() => {
                    setFormData((prev) => ({
                      ...prev,
                      avatar_url: "",
                    }));
                    setError("The image could not be loaded");
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
                restoreSavedProfile();
              }}
              disabled={isLoading}
              className="rounded-lg border border-border bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Danger zone: delete account */}
      <div className="border-t border-red-500/20 pt-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-red-300">
          <Trash2 size={16} />
          Delete account
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          Permanently delete your BagUI account and everything tied to it.
        </p>
        <button
          type="button"
          onClick={() => setIsDeleteModalOpen(true)}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-red-500/15 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/25"
        >
          <Trash2 size={14} />
          Delete account
        </button>
      </div>

      {/* Delete account confirmation modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 py-8">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-[28px] border border-red-500/20 bg-card p-7 shadow-2xl shadow-black/20">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-red-300">
              <Trash2 size={18} />
              Delete your account
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              This action is permanent. If you delete your account, you will
              lose:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li>• Your profile, username, and avatar</li>
              <li>• Your bio, phone number, and connected social links</li>
              <li>• Your full component download history</li>
              <li>• Your current plan and BagUI Pro benefits</li>
            </ul>

            <form onSubmit={handleDeleteAccount} className="mt-5 space-y-3">
              <label className="sr-only" htmlFor="delete-account-password">
                Account password
              </label>
              <input
                id="delete-account-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Account password"
                autoComplete="current-password"
                disabled={isDeleting}
                className="w-full rounded-full border border-border bg-muted px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:border-red-400/50 focus:bg-accent disabled:opacity-50"
              />

              {deleteError && (
                <p className="text-sm text-red-300" role="alert">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="flex-1 rounded-full border border-border bg-muted px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting || !deletePassword}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-red-500/15 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}