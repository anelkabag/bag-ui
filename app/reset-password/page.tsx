"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get(
      "access_token",
    );
    setAccessToken(token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!accessToken) {
      setError("Invalid password reset link.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken, password }),
    });
    setLoading(false);

    const data = await response.json();
    if (!response.ok) {
      setError(data.error ?? "Unable to reset password.");
      return;
    }

    setMessage("Password reset successful. Please log in.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#111] flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] rounded-[32px] border border-white/10 bg-[#151515]/95 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Reset password</h1>
          <p className="mt-2 text-sm text-white/60">
            Choose a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/60">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-white/20"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#111] px-4 py-3 text-white outline-none focus:border-white/20"
            />
          </div>

          {error && <p className="text-sm text-rose-400">{error}</p>}
          {message && <p className="text-sm text-emerald-400">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white py-3 text-sm font-semibold text-[#111] transition hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Resetting password…" : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}
