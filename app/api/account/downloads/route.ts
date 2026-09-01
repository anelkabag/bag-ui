import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseRouteHandlerClient();

    // Vérifier la session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer l'historique de téléchargement de l'utilisateur
    const { data: downloads, error } = await supabase
      .from("component_downloads")
      .select("id, component, created_at, os, cli_version")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(50); // Limiter à 50 derniers téléchargements

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Erreur lors de la récupération de l'historique" },
        { status: 500 }
      );
    }

    // Grouper par composant et compter les téléchargements
    const groupedDownloads = downloads?.reduce(
      (acc, download) => {
        const existing = acc.find((d) => d.component === download.component);
        if (existing) {
          existing.count += 1;
          if (
            new Date(download.created_at) >
            new Date(existing.lastDownloaded)
          ) {
            existing.lastDownloaded = download.created_at;
          }
        } else {
          acc.push({
            component: download.component,
            count: 1,
            lastDownloaded: download.created_at,
            os: download.os || "Unknown",
            cli_version: download.cli_version,
          });
        }
        return acc;
      },
      [] as Array<{
        component: string;
        count: number;
        lastDownloaded: string;
        os: string;
        cli_version?: string;
      }>
    );

    return NextResponse.json({
      downloads: groupedDownloads || [],
      total: downloads?.length || 0,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
