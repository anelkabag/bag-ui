import type { PublishedResource } from "./release-notifications";

export interface ReleaseEmailParams extends PublishedResource {
  unsubscribeUrl: string;
  preferencesUrl: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function buildReleaseNotificationEmail(resource: ReleaseEmailParams) {
  const title = escapeHtml(resource.resource_name);
  const description = escapeHtml(resource.description);
  const category = escapeHtml(resource.category);
  const resourceUrl = escapeHtml(resource.resource_url);
  const unsubscribeUrl = escapeHtml(resource.unsubscribeUrl);
  const preferencesUrl = escapeHtml(resource.preferencesUrl);
  const previewImage = resource.image_url
    ? `<img src="${escapeHtml(resource.image_url)}" alt="${title} preview" width="552" style="display:block;width:100%;height:auto;border:0;border-radius:16px;background:#f3f4f6" />`
    : "";
  const replyTo = process.env.BAGUI_SUPPORT_EMAIL;

  return {
    from: "BagUI <updates@news.bagui.pro>",
    ...(replyTo ? { replyTo } : {}),
    subject: `New on BagUI: ${resource.resource_name} is here!`,
    text: [
      `New on BagUI: ${resource.resource_name} is here!`,
      resource.description,
      `Category: ${resource.category}`,
      `Explore Component: ${resource.resource_url}`,
      "You can turn off emails about new BagUI components anytime in your account email preferences or by unsubscribing below.",
      `Notification preferences: ${resource.preferencesUrl}`,
      `Unsubscribe: ${resource.unsubscribeUrl}`,
    ].join("\n\n"),
    headers: {
      "List-Unsubscribe": `<${unsubscribeUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>New on BagUI: ${title} is here!</title>
    <style>
      @media (prefers-color-scheme: dark) {
        body, .page { background:#111827 !important; color:#f9fafb !important; }
        .card { background:#1f2937 !important; border-color:#374151 !important; }
        .muted { color:#9ca3af !important; }
      }
      @media only screen and (max-width: 600px) {
        .page { padding:20px 12px !important; }
        .card { padding:24px 20px !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;color:#111827;font-family:Arial,Helvetica,sans-serif">
    <div class="page" style="padding:40px 16px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;margin:0 auto">
        <tr><td style="padding:0 8px 18px;font-size:19px;font-weight:700;letter-spacing:-.04em">BagUI<span style="color:#6b7280"> / updates</span></td></tr>
        <tr><td class="card" style="padding:36px;border:1px solid #e5e7eb;border-radius:24px;background:#ffffff">
          <p style="margin:0 0 12px;color:#6b7280;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">Fresh from the registry</p>
          <h1 style="margin:0 0 16px;font-size:30px;line-height:1.2;letter-spacing:-.04em">Meet ${title}</h1>
          <p class="muted" style="margin:0 0 22px;color:#4b5563;font-size:16px;line-height:1.65">${description}</p>
          <p style="margin:0 0 24px"><span style="display:inline-block;padding:6px 10px;border:1px solid #e5e7eb;border-radius:999px;color:#4b5563;font-size:12px">${category}</span></p>
          ${previewImage}
          <p style="margin:28px 0 0">
            <a href="${resourceUrl}" style="display:inline-block;padding:13px 20px;border-radius:999px;background:#111827;color:#ffffff;font-size:14px;font-weight:700;text-decoration:none">Explore Component</a>
          </p>
        </td></tr>
        <tr><td class="muted" style="padding:22px 8px;color:#6b7280;font-size:12px;line-height:1.7">
          You’re receiving occasional emails when new BagUI resources are released. You can turn these emails off at any time in your account email preferences or by unsubscribing below.<br />
          <a href="${preferencesUrl}" style="color:inherit">Notification preferences</a>
          &nbsp;·&nbsp;
          <a href="${unsubscribeUrl}" style="color:inherit">Unsubscribe</a>
        </td></tr>
      </table>
    </div>
  </body>
</html>`,
  };
}
