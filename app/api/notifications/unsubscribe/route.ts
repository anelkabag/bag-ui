import { PRODUCTION_SITE_URL } from "@/lib/release-notifications";
import { verifyUnsubscribeToken } from "@/lib/notification-security";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

function unsubscribePage(token: string) {
  const action = `${PRODUCTION_SITE_URL}/api/notifications/unsubscribe?token=${encodeURIComponent(token)}`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>BagUI email preferences</title></head>
<body style="margin:0;padding:40px 16px;background:#f3f4f6;color:#111827;font:16px Arial,sans-serif">
  <main style="max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:20px;background:#fff">
    <p style="font-weight:700">BagUI</p>
    <h1 style="font-size:24px">Unsubscribe from release emails?</h1>
    <p>You can turn product release emails back on anytime in your account settings.</p>
    <form method="post" action="${action}">
      <button style="padding:12px 18px;border:0;border-radius:999px;background:#111827;color:white;font-weight:700;cursor:pointer">Unsubscribe</button>
    </form>
  </main>
</body></html>`;
}

function htmlResponse(content: string, status = 200) {
  return new Response(content, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
    },
  });
}

function getToken(request: Request, submittedToken?: string) {
  return submittedToken ?? new URL(request.url).searchParams.get("token");
}

export async function GET(request: Request) {
  const token = getToken(request);
  if (!token) return htmlResponse("Invalid unsubscribe link.", 400);

  try {
    if (!verifyUnsubscribeToken(token)) {
      return htmlResponse("This unsubscribe link is invalid or has expired.", 400);
    }
  } catch (error) {
    console.error(
      "Unsubscribe token configuration error",
      error instanceof Error ? error.message : "unknown error",
    );
    return htmlResponse("Email preferences are temporarily unavailable.", 503);
  }

  return htmlResponse(unsubscribePage(token));
}

export async function POST(request: Request) {
  let submittedToken: string | undefined;
  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await request.formData();
      submittedToken = form.get("token")?.toString();
    } else if (contentType.includes("application/json")) {
      const body: unknown = await request.json();
      if (typeof body === "object" && body !== null && "token" in body) {
        submittedToken = typeof body.token === "string" ? body.token : undefined;
      }
    }
  } catch {
    return htmlResponse("Invalid unsubscribe request.", 400);
  }

  const token = getToken(request, submittedToken);
  if (!token) return htmlResponse("Invalid unsubscribe link.", 400);

  let userId: string | null;
  try {
    userId = verifyUnsubscribeToken(token);
  } catch (error) {
    console.error(
      "Unsubscribe token configuration error",
      error instanceof Error ? error.message : "unknown error",
    );
    return htmlResponse("Email preferences are temporarily unavailable.", 503);
  }
  if (!userId) return htmlResponse("This unsubscribe link is invalid or has expired.", 400);

  const supabase = await createSupabaseServiceRoleClient();
  const { error } = await supabase.rpc("set_notification_preference", {
    p_user_id: userId,
    p_enabled: false,
  });
  if (error) {
    if (error.code === "23503") {
      return htmlResponse("This account is no longer active. No further emails will be sent.");
    }
    console.error("Could not apply unsubscribe request", error.code);
    return htmlResponse("Unable to update your preferences. Please try again.", 503);
  }

  return htmlResponse("You have been unsubscribed from BagUI product updates.");
}
