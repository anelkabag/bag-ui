"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

interface ProfileEditFormProps {
  profile: Profile | null;
  email: string;
}

export function ProfileEditForm({ profile, email }: ProfileEditFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: profile?.username || email?.split("@")[0] || "",
    avatar_url: profile?.avatar_url || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        body: JSON.stringify(formData),
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
            <div className="h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-white/5">
              <Image
                src={formData.avatar_url || "/faviconblack.png"}
                alt="Avatar"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm text-white/60">Profile photo</p>
              <p className="text-2xl font-semibold text-white">
                {formData.username}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Username
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {formData.username}
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Email
              </p>
              <p className="mt-2 text-lg font-medium text-white">{email}</p>
            </div>

            {formData.avatar_url && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 sm:col-span-2">
                <p className="text-xs uppercase tracking-widest text-white/40">
                  Avatar URL
                </p>
                <p className="mt-2 truncate text-sm text-white/80">
                  {formData.avatar_url}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-2.5 text-sm font-medium text-black transition-all hover:bg-white/90"
          >
            Edit profile
          </button>
        </div>
      ) : (
        /* Edit form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Your username"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-white/30 focus:bg-white/10"
              disabled={isLoading}
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Profile photo URL
            </label>
            <input
              type="url"
              name="avatar_url"
              value={formData.avatar_url}
              onChange={handleChange}
              placeholder="https://exemple.com/photo.jpg"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition-all focus:border-white/30 focus:bg-white/10"
              disabled={isLoading}
            />
          </div>

          {/* Preview */}
          {formData.avatar_url && (
            <div>
              <p className="text-sm text-white/60 mb-2">Avatar preview</p>
              <div className="h-32 w-32 overflow-hidden rounded-lg border border-white/10 bg-white/5">
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
              className="flex-1 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
                setFormData({
                  username: profile?.username || email?.split("@")[0] || "",
                  avatar_url: profile?.avatar_url || "",
                });
              }}
              disabled={isLoading}
              className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
