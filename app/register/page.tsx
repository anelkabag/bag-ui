"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const { signUp, signInWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !username || !password) {
      setError("Please fill all fields.");
      return;
    }

    const message = await signUp(email, password, username);
    if (message) {
      setError(message);
      return;
    }
    setSuccess("Signup successful! Check your email for verification.");
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
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
          {success && <p className="text-sm text-emerald-400">{success}</p>}

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
