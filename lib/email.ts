import { Resend } from "resend";

export function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

export interface VerificationEmailParams {
  email: string;
  username: string;
  confirmationUrl: string;
}

export function buildVerificationEmail({
  email,
  username,
  confirmationUrl,
}: VerificationEmailParams) {
  return {
    from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
    to: [email],
    subject: "Verify your email",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 12px;">Welcome, ${username}!</h2>
        <p style="margin-bottom: 16px;">Thanks for signing up to Bag UI. Please confirm your email address to activate your account.</p>
        <p style="margin-bottom: 16px;"><strong>Email:</strong> ${email}</p>
        <p style="margin-bottom: 24px;">
          <a href="${confirmationUrl}" style="background: #111; color: white; padding: 12px 18px; border-radius: 999px; text-decoration: none; display: inline-block;">Verify email</a>
        </p>
        <p style="color: #666; font-size: 12px;">If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  };
}

export async function sendVerificationEmail(params: VerificationEmailParams) {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "Missing RESEND_API_KEY" } as const;
  }

  try {
    const result = await resend.emails.send(buildVerificationEmail(params));
    return { success: true, data: result } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message } as const;
  }
}

export interface WelcomeEmailParams {
  email: string;
  username: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildWelcomeEmail({ email, username }: WelcomeEmailParams) {
  const safeName = escapeHtml(username);
  const blocksUrl = "https://bagui.pro/blocks";
  const docsUrl = "https://bagui.pro/docs";

  return {
    from: "BagUI <updates@news.bagui.pro>",
    to: [email],
    subject: "Welcome to BagUI",
    text: [
      `Welcome to BagUI, ${username}.`,
      "Your email is confirmed and your account is ready.",
      `Browse blocks: ${blocksUrl}`,
      `Read the docs: ${docsUrl}`,
    ].join("\n\n"),
    html: `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:0;background:#f3f4f6;color:#111827;font-family:Arial,Helvetica,sans-serif">
    <div style="padding:40px 16px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto">
        <tr><td style="padding:0 8px 18px;font-size:19px;font-weight:700;letter-spacing:-.04em">BagUI</td></tr>
        <tr><td style="padding:36px;border:1px solid #e5e7eb;border-radius:24px;background:#ffffff">
          <p style="margin:0 0 12px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">You're in</p>
          <h1 style="margin:0 0 16px;font-size:30px;line-height:1.2;letter-spacing:-.04em">Welcome, ${safeName}</h1>
          <p style="margin:0 0 22px;color:#4b5563;font-size:16px;line-height:1.65">Your email is confirmed and your BagUI account is ready. Browse the registry, install a block, and start building.</p>
          <p style="margin:0">
            <a href="${blocksUrl}" style="display:inline-block;padding:13px 20px;border-radius:999px;background:#111827;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">Browse blocks</a>
          </p>
          <p style="margin:18px 0 0;font-size:14px;line-height:1.6">
            <a href="${docsUrl}" style="color:#111827">Read the docs</a>
          </p>
        </td></tr>
        <tr><td style="padding:22px 8px;color:#6b7280;font-size:12px;line-height:1.7">
          This message was sent to ${escapeHtml(email)} because you confirmed a BagUI account.
        </td></tr>
      </table>
    </div>
  </body>
</html>`,
  };
}

export async function sendWelcomeEmail(params: WelcomeEmailParams) {
  const resend = getResendClient();
  if (!resend) {
    return { success: false, error: "Missing RESEND_API_KEY" } as const;
  }

  try {
    const result = await resend.emails.send(buildWelcomeEmail(params));
    return { success: true, data: result } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message } as const;
  }
}
