import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Vérifier la session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

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
      .eq("id", session.user.id)
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
