import type { ReactNode } from "react";
import { useEffect, useState } from "react";

type Theme = "black" | "grey" | "purple" | "lime";

export type ReviewPost = {
  id: string;
  handle: string;
  initials: string;
  text: string;
  date?: string;
  permalink?: string;
  theme: Theme;
  place: string;
  gradient: string;
  avatar?: string;
  verified?: boolean;
};

type ThreadsReply = Omit<ReviewPost, "theme" | "place" | "gradient">;
type ReviewLoadState =
  | { status: "loading" }
  | { status: "ready"; posts: ReviewPost[] }
  | { status: "error"; message: string };

const THEMES: Record<
  Theme,
  { card: string; muted: string; line: string; text: string }
> = {
  black: {
    card: "bg-[#090909] text-white",
    muted: "text-white/50",
    line: "border-white/15",
    text: "font-medium",
  },
  grey: {
    card: "bg-muted text-foreground",
    muted: "text-muted-foreground",
    line: "border-border",
    text: "font-medium",
  },
  purple: {
    card: "bg-foreground text-background",
    muted: "text-background/70",
    line: "border-background/25",
    text: "font-medium",
  },
  lime: {
    card: "bg-[#f3eee8] text-[#171513] dark:bg-[#28231f] dark:text-white",
    muted: "text-[#77716b] dark:text-white/55",
    line: "border-[#ded7cf] dark:border-white/15",
    text: "font-semibold",
  },
};

const THEMES_BY_INDEX: Theme[] = ["black", "grey", "purple", "lime", "grey"];
const GRADIENTS = [
  "from-[#f6a35c] to-[#e0566b]",
  "from-[#6fb1fc] to-[#4364f7]",
  "from-[#ffd36e] to-[#ff7e5f]",
  "from-[#8e7cf8] to-[#c471ed]",
  "from-[#1f1f1f] to-[#5b5b5b]",
];
const PLACEMENTS_BY_COUNT: Record<number, string[]> = {
  1: ["left-[378px] top-[210px] rotate-0 z-[1]"],
  2: [
    "left-[245px] top-[200px] rotate-[-5deg] z-[1]",
    "left-[511px] top-[220px] rotate-[5deg] z-[2]",
  ],
  3: [
    "left-[205px] top-[220px] rotate-[-6deg] z-[1]",
    "left-[378px] top-[150px] rotate-[2deg] z-[3]",
    "left-[551px] top-[225px] rotate-[6deg] z-[2]",
  ],
  4: [
    "left-[183px] top-[221px] rotate-[-6deg] z-[1]",
    "left-[581px] top-[168px] rotate-[10deg] z-[2]",
    "left-[354px] top-[123px] rotate-[-9deg] z-[3]",
    "left-[497px] top-[255px] rotate-[7deg] z-[4]",
  ],
  5: [
    "left-[183px] top-[221px] rotate-[-6deg] z-[1]",
    "left-[581px] top-[168px] rotate-[10deg] z-[2]",
    "left-[354px] top-[123px] rotate-[-9deg] z-[3]",
    "left-[315px] top-[280px] rotate-[-3deg] z-[4]",
    "left-[497px] top-[255px] rotate-[10deg] z-[5]",
  ],
};

function decoratePosts(posts: ThreadsReply[]): ReviewPost[] {
  const placements = PLACEMENTS_BY_COUNT[posts.length] ?? PLACEMENTS_BY_COUNT[5];
  return posts.map((post, index) => ({
    ...post,
    theme: THEMES_BY_INDEX[index % THEMES_BY_INDEX.length],
    gradient: GRADIENTS[index % GRADIENTS.length],
    place: placements[index] ?? PLACEMENTS_BY_COUNT[5][index % 5],
  }));
}

const ERROR_MESSAGES: Record<string, string> = {
  not_configured:
    "Configure THREADS_ACCESS_TOKEN et THREADS_POST_ID côté serveur pour afficher les réponses.",
  invalid_configuration:
    "THREADS_POST_ID doit être l’ID numérique du post Threads.",
  rate_limited:
    "Threads limite temporairement les requêtes. Réessayez dans quelques minutes.",
  upstream_error:
    "Threads n’a pas pu fournir les réponses. Vérifiez le token, les permissions et l’ID du post.",
  upstream_unavailable:
    "L’API Threads est momentanément inaccessible. Réessayez plus tard.",
  invalid_upstream_response:
    "La réponse reçue de Threads n’a pas pu être lue.",
};

const ICONS = {
  external:
    "M14 4h6v6M20 4l-9 9M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5",
};

function Icon({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px] shrink-0 fill-none stroke-current"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

function Badge() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3 w-3 shrink-0"
      aria-label="Verified"
    >
      <circle cx="12" cy="12" r="11" fill="#e8854a" />
      <path
        d="M7 12.5l3.2 3.2L17 9"
        fill="none"
        stroke="#fff"
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PostCard({ post, logo }: { post: ReviewPost; logo?: ReactNode }) {
  const theme = THEMES[post.theme];

  return (
    <article
      className={`flex min-h-[200px] w-full flex-col overflow-hidden rounded-2xl border border-border/70 p-[14px] text-left shadow-[0_12px_32px_rgba(0,0,0,0.08)] lg:absolute lg:h-[200px] lg:w-[250px] lg:-translate-x-1/2 lg:-translate-y-1/2 ${theme.card} ${post.place}`}
    >
      <header className="flex items-center gap-[9px]">
        {post.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.avatar}
            alt=""
            className="h-[34px] w-[34px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <span
            className={`grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-gradient-to-br text-[12px] font-bold text-white ${post.gradient}`}
          >
            {post.initials}
          </span>
        )}
        <div className="min-w-0 leading-tight">
          <p className="flex items-center gap-1 text-[12px] font-bold tracking-[-0.01em]">
            <span className="truncate">@{post.handle}</span>
            {post.verified && <Badge />}
          </p>
          <p className={`truncate text-[11px] ${theme.muted}`}>Threads reply</p>
        </div>
        <span className="ml-auto h-[18px] w-[18px] shrink-0 [&>svg]:h-full [&>svg]:w-full [&>svg]:fill-current">
          {logo}
        </span>
      </header>

      <p
        className={`mt-[10px] line-clamp-4 text-[12px] leading-[1.35] ${theme.text}`}
      >
        {post.text}
      </p>

      {post.date && (
        <p className={`mt-2 text-[10px] ${theme.muted}`}>{post.date}</p>
      )}

      <div
        className={`mt-auto flex items-center border-t pt-2 ${theme.line} ${theme.muted}`}
      >
        {post.permalink && (
          <a
            href={post.permalink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[10.5px] transition-colors hover:text-foreground"
          >
            View reply on Threads
            <Icon d={ICONS.external} />
          </a>
        )}
      </div>
    </article>
  );
}

export default function Reviews({
  posts,
  logo,
}: {
  posts?: ReviewPost[];
  logo?: ReactNode;
}) {
  const [loadState, setLoadState] = useState<ReviewLoadState>({
    status: "loading",
  });
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (posts !== undefined) return;

    const controller = new AbortController();
    const loadPosts = async () => {
      try {
        const response = await fetch("/api/landing/reviews", {
          signal: controller.signal,
          cache: "no-store",
        });
        const result = (await response.json()) as {
          posts?: ThreadsReply[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(result.error ?? "upstream_error");
        }
        if (!Array.isArray(result.posts)) {
          throw new Error("invalid_upstream_response");
        }

        setLoadState({ status: "ready", posts: decoratePosts(result.posts) });
      } catch (error) {
        if (controller.signal.aborted) return;
        const errorCode =
          error instanceof Error ? error.message : "upstream_error";
        setLoadState({
          status: "error",
          message:
            ERROR_MESSAGES[errorCode] ??
            "Impossible de charger les réponses Threads. Réessayez plus tard.",
        });
      }
    };

    void loadPosts();
    return () => controller.abort();
  }, [posts, retryCount]);

  const loadStatus = posts !== undefined ? "ready" : loadState.status;
  const visiblePosts =
    posts ?? (loadState.status === "ready" ? loadState.posts : []);

  return (
    <section className="overflow-hidden border-y border-border bg-muted/20 px-4 py-16 text-center md:px-6 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Threads replies
        </p>
        <h2 className="mt-3 text-[clamp(28px,4vw,40px)] font-medium leading-[1.1] tracking-[-0.035em] text-foreground">
          Trusted by people
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
          Replies to the selected Threads post.
        </p>
      </div>

      {loadStatus === "loading" && (
        <p className="mt-10 text-sm text-muted-foreground" role="status">
          Loading replies…
        </p>
      )}

      {loadStatus === "error" && posts === undefined && (
        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
          <p role="alert">
            {loadState.status === "error"
              ? loadState.message
              : "Impossible de charger les réponses Threads."}
          </p>
          <button
            type="button"
            onClick={() => {
              setLoadState({ status: "loading" });
              setRetryCount((count) => count + 1);
            }}
            className="mt-3 rounded-full border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            Réessayer
          </button>
        </div>
      )}

      {loadStatus === "ready" && visiblePosts.length > 0 && (
        <>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} logo={logo} />
            ))}
          </div>

          <div className="relative mx-auto mt-10 hidden h-[430px] w-[756px] max-w-full lg:block">
            {visiblePosts.map((post) => (
              <PostCard key={post.id} post={post} logo={logo} />
            ))}
          </div>
        </>
      )}

      {loadStatus === "ready" && visiblePosts.length === 0 && (
        <p className="mt-10 text-sm text-muted-foreground">
          Aucune réponse textuelle à afficher pour le moment.
        </p>
      )}
    </section>
  );
}
