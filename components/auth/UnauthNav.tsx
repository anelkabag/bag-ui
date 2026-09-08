import Link from "next/link";

export default function UnauthNav() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white dark:hover:bg-neutral-900"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      >
        Sign Up
      </Link>
    </div>
  );
}
