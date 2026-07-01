import { NextResponse } from "next/server";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase/server";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const supabase = await createSupabaseRouteHandlerClient();
  const body = await request.json();

  if (!body?.email || !body?.password || !body?.action) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (body.action === "sign_in") {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ session: data.session });
  }

  if (body.action === "sign_up") {
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let session = null;
    let authError: { message: string } | null = null;

    if (serviceRoleKey) {
      const { data, error } = await supabase.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
        user_metadata: {
          username: body.username,
          plan: "free",
        },
      });

      if (error) {
        authError = error;
      } else {
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: body.email,
            password: body.password,
          });

        if (signInError) {
          authError = signInError;
        } else {
          session = signInData.session;
        }
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: { username: body.username, plan: "free" },
        },
      });

      if (error) {
        authError = error;
      } else {
        session = data.session;
      }
    }

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/verify-email?email=${encodeURIComponent(body.email)}`;
    await sendVerificationEmail({
      email: body.email,
      username: body.username || body.email,
      confirmationUrl,
    });

    return NextResponse.json({ session });
  }

  return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
}
