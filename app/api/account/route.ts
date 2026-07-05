import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseRouteHandlerClient();

  // Utiliser getSession() pour les route handlers (les cookies sont toujours disponibles)
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return NextResponse.json({ profile: null }, { status: 401 });
  }

  const user = session.user;

  const { data: profile, error } = await supabase
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
    return NextResponse.json({ profile: null }, { status: 500 });
  }

  const username =
    typeof user.user_metadata?.username === "string" &&
    user.user_metadata.username.trim().length > 0
      ? user.user_metadata.username
      : (profile?.username ?? user.email?.split("@")[0] ?? "user");

  const plan = (user.user_metadata?.plan ??
    user.user_metadata?.subscription_plan ??
    user.app_metadata?.plan ??
    user.app_metadata?.subscription_plan ??
    "free") as string;

  const fallbackProfile = {
    id: user.id,
    email: user.email ?? "",
    username,
    avatar_url: profile?.avatar_url ?? null,
    created_at:
      profile?.created_at ?? user.created_at ?? new Date().toISOString(),
    updated_at:
      profile?.updated_at ?? user.updated_at ?? new Date().toISOString(),
    plan,
    subscription_plan: plan,
  };

  return NextResponse.json({ profile: profile ?? fallbackProfile });
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseRouteHandlerClient();

    // Utiliser getSession() pour les route handlers
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = session.user;

    // Récupérer les données de la requête
    const body = await request.json();
    const { username, avatar_url } = body;

    // Validation basique
    if (!username || username.trim().length === 0) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur est requis" },
        { status: 400 },
      );
    }

    if (username.trim().length < 2 || username.trim().length > 50) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur doit avoir entre 2 et 50 caractères" },
        { status: 400 },
      );
    }

    // Vérifier que l'username ne contient que des caractères autorisés
    if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      return NextResponse.json(
        {
          error:
            "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores",
        },
        { status: 400 },
      );
    }

    // Mettre à jour le profil
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: username.trim(),
        avatar_url: avatar_url?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour du profil" },
        { status: 500 },
      );
    }

    return NextResponse.json({ profile: data?.[0] });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 },
    );
  }
}
