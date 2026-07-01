import { Resend } from "resend";

function getResendClient() {
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
