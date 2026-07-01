import Link from "next/link";

export default function UnauthNav() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-100 transition"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition"
      >
        Sign Up
      </Link>
    </div>
  );
}
