import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import type { Database } from "@/types/supabase";

export default async function AccountPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, username, avatar_url, created_at, updated_at")
    .eq("id", session.user.id)
    .single();

  const profile = data as
    | Database["public"]["Tables"]["profiles"]["Row"]
    | null;

  if (error || !profile) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-[#111111]/90 p-10 shadow-2xl shadow-black/40">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-white/40">
              Account
            </p>
            <h1 className="mt-4 text-4xl font-semibold">
              Welcome back, {profile.username}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Manage your profile, session, and secure access to Bag\Ui
              features.
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
              <p className="text-sm text-white/50">Joined</p>
              <p className="text-lg font-semibold">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-3xl border border-white/10 bg-[#0f0f0f]/80 p-6">
            <h2 className="text-lg font-semibold">Profile details</h2>
            <div className="space-y-2 text-sm text-white/70">
              <div>
                <p className="text-white/40">Username</p>
                <p>{profile.username}</p>
              </div>
              <div>
                <p className="text-white/40">Email</p>
                <p>{profile.email}</p>
              </div>
              <div>
                <p className="text-white/40">User ID</p>
                <p className="truncate">{profile.id}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-3xl border border-white/10 bg-[#0f0f0f]/80 p-6">
            <h2 className="text-lg font-semibold">Security</h2>
            <div className="text-sm text-white/70">
              <p>
                Your session is securely managed by Supabase Auth with
                persistent tokens and server-side session restoration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
