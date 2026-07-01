"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !username || !password) {
      setError("Please fill all fields.");
      return;
    }

    const message = await signUp(email, password, username);
    if (message) {
      setError(message);
      return;
    }

    setIsVerificationModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
      {isVerificationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
            <div className="w-full max-w-[420px] rounded-[28px] bg-[#F5F3EF] p-8 text-center shadow-2xl shadow-black/20">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black">
                <svg
                    className="h-6 w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                >
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <h2 className="mt-6 text-2xl font-semibold text-[#111]">
                Check your email
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#111]/60">
                A confirmation email has been sent. Check your inbox, then you’ll
                be redirected to the homepage.
              </p>

              <button
                  onClick={() => {
                    setIsVerificationModalOpen(false);
                    router.replace("/");
                  }}
                  className="mt-6 w-full rounded-2xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Got it
              </button>
            </div>
          </div>
      )}

      <div className="w-full max-w-[480px] rounded-[32px] border border-white/10 bg-[#151515]/95 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Register with email and password or continue with Google.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-white/20"
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-[#111] transition hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={signInWithGoogle}
            className="w-full rounded-2xl border border-white/10 bg-transparent py-3 text-sm font-semibold text-white transition hover:border-white/20"
          >
            Continue with Google
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-white/50">
          Already have an account?{" "}
          <Link href="/login" className="text-white">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
