import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { ProfileEditForm } from "@/components/ProfileEditForm";
import type { Database } from "@/types/supabase";

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();

  // Utiliser getUser() au lieu de getSession() pour une vérification authentique
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profileData, error } = await supabase
    .from("profiles")
    .select("id, email, username, avatar_url, created_at, updated_at")
    .eq("id", user.id)
    .maybeSingle<{
      id: string;
      email: string;
      username: string;
      avatar_url: string | null;
      created_at: string;
      updated_at: string;
    }>();

  if (error && error.code !== "PGRST116") {
    redirect("/login");
  }

  const username =
    typeof user.user_metadata?.username === "string" &&
    user.user_metadata.username.trim().length > 0
      ? user.user_metadata.username
      : (profileData?.username ?? user.email?.split("@")[0] ?? "user");

  const profile = profileData ?? {
    id: user.id,
    email: user.email ?? "",
    username,
    avatar_url: null,
    created_at: user.created_at ?? new Date().toISOString(),
    updated_at: user.updated_at ?? new Date().toISOString(),
  };

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                Compte
              </p>
              <h1 className="mt-4 text-4xl font-semibold">
                Bienvenue {profile.username}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/60">
                Gérez votre profil et vos paramètres de sécurité.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                <Image
                  src={profile.avatar_url ?? "/faviconblack.png"}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-white/50">Membre depuis</p>
                <p className="text-lg font-semibold">
                  {new Date(profile.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Edit Form */}
          <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40 lg:col-span-1">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                Profil
              </p>
              <h2 className="mt-4 text-2xl font-semibold">Mon profil</h2>
            </div>
            <ProfileEditForm profile={profile} email={user.email || ""} />
          </div>

          {/* Info Section */}
          <div className="space-y-4 lg:col-span-1">
            {/* Account Info */}
            <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40">
              <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                Infos du compte
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Email
                  </p>
                  <p className="mt-2 font-medium text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    ID utilisateur
                  </p>
                  <p className="mt-2 truncate font-mono text-sm text-white/80">
                    {profile.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/40">
                    Compte créé
                  </p>
                  <p className="mt-2 text-white">
                    {new Date(profile.created_at).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40">
              <p className="text-sm uppercase tracking-[0.35em] text-white/40">
                Sécurité
              </p>
              <div className="mt-6">
                <p className="text-sm text-white/70">
                  Votre session est gérée de manière sécurisée par Supabase Auth
                  avec des tokens persistants et une restauration de session
                  côté serveur.
                </p>
                <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                  <p className="text-sm text-green-400">
                    ✓ Authentification sécurisée
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
