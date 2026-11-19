import type { User } from "@supabase/supabase-js";
import { sendWelcomeEmail } from "@/lib/email";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

function usernameFor(user: User) {
  const username = user.user_metadata?.username;
  if (typeof username === "string" && username.trim()) {
    return username.trim().slice(0, 80);
  }
  return user.email?.split("@")[0] || "there";
}

export async function sendWelcomeEmailOnce(user: User | null | undefined) {
  if (!user?.email || !user.email_confirmed_at) return;
  if (user.user_metadata?.welcome_email_sent_at) return;

  const result = await sendWelcomeEmail({
    email: user.email,
    username: usernameFor(user),
  });
  if (!result.success) {
    console.error("Welcome email failed", result.error);
    return;
  }

  try {
    const admin = await createSupabaseServiceRoleClient();
    const { error } = await admin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        welcome_email_sent_at: new Date().toISOString(),
      },
    });
    if (error) {
      console.error("Could not record welcome email", error.message);
    }
  } catch (error) {
    console.error(
      "Could not record welcome email",
      error instanceof Error ? error.message : "unknown error",
    );
  }
}
