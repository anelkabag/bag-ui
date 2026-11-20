import { NextResponse } from "next/server";

interface ThreadsReply {
  id: string;
  text?: string;
  username?: string;
  timestamp?: string;
  permalink?: string;
  profile_picture_url?: string;
  is_verified?: boolean;
}

interface ThreadsResponse {
  data?: ThreadsReply[];
}

function getInitials(username: string) {
  return username.slice(0, 2).toUpperCase();
}

function formatDate(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export async function GET() {
  const token = process.env.THREADS_ACCESS_TOKEN?.trim();
  const postId = process.env.THREADS_POST_ID?.trim();

  if (!token || !postId) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  if (!/^\d+$/.test(postId)) {
    return NextResponse.json(
      { error: "invalid_configuration" },
      { status: 500 },
    );
  }

  const url = new URL(
    `https://graph.threads.com/v1.0/${postId}/replies`,
  );
  url.searchParams.set(
    "fields",
    "id,text,username,timestamp,permalink,profile_picture_url,is_verified",
  );
  url.searchParams.set("limit", "5");
  url.searchParams.set("reverse", "true");
  url.searchParams.set("access_token", token);

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: 3600 } });
  } catch (error) {
    console.error("[LandingReviews] Threads API request failed:", error);
    return NextResponse.json({ error: "upstream_unavailable" }, { status: 502 });
  }

  if (!response.ok) {
    const details = await response.text();
    console.error(
      `[LandingReviews] Threads API returned ${response.status}:`,
      details.slice(0, 1000),
    );

    return NextResponse.json(
      {
        error: response.status === 429 ? "rate_limited" : "upstream_error",
      },
      { status: response.status === 429 ? 503 : 502 },
    );
  }

  let result: ThreadsResponse;
  try {
    result = (await response.json()) as ThreadsResponse;
  } catch (error) {
    console.error("[LandingReviews] Invalid Threads API response:", error);
    return NextResponse.json(
      { error: "invalid_upstream_response" },
      { status: 502 },
    );
  }

  const replies = (result.data ?? []).flatMap((reply) => {
    const text = reply.text?.trim();
    if (!text) return [];

    const handle = reply.username ?? "threads_user";
    return [
      {
        id: reply.id,
        handle,
        initials: getInitials(handle),
        text,
        date: formatDate(reply.timestamp),
        permalink: reply.permalink,
        avatar: reply.profile_picture_url,
        verified: reply.is_verified,
      },
    ];
  });

  return NextResponse.json(
    { posts: replies },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
