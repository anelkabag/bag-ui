"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Loader2, Mail, Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  Types & copy                                                       */
/* ================================================================== */

type Mode = "signup" | "login";

const COPY: Record<Mode, { heading: string; subtext: string; cta: string; prompt: string; action: string }> = {
  signup: {
    heading: "Create your free account",
    subtext: "Create your free account to get started. No credit card required.",
    cta: "Continue",
    prompt: "Already have an account?",
    action: "Log in",
  },
  login: {
    heading: "Welcome back",
    subtext: "Log in to your account to continue.",
    cta: "Log in",
    prompt: "Don't have an account?",
    action: "Sign up",
  },
};

const TRUSTED_BY = [
  { name: "Northwind", dot: "bg-orange-400" },
  { name: "Vantage" },
  { name: "Fenwick" },
  { name: "Loomly" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ================================================================== */
/*  Small atoms                                                        */
/* ================================================================== */

function BrandMark() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
      <path d="M2 24 L10 8 L14 16 L18 8 L26 24 L21 24 L18 17.5 L14 25 L10 17.5 L7 24 Z" fill="#111111" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

function Toast({ message }: { message: string | null }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto rounded-full bg-neutral-900 px-4 py-2.5 text-[13px] font-medium text-white shadow-lg"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================================================================== */
/*  Root                                                                */
/* ================================================================== */

export default function SignUpCard() {
  const prefersReduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = COPY[mode];

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  useEffect(() => {
    if (mode === "login") {
      const id = setTimeout(() => passwordRef.current?.focus(), 180);
      return () => clearTimeout(id);
    }
  }, [mode]);

  const pushToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  };

  const triggerShake = () => setShake(true);

  const switchMode = () => {
    setMode((m) => (m === "signup" ? "login" : "signup"));
    setEmailError(null);
    setPassword("");
  };

  const handleGoogle = () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setTimeout(() => {
      setGoogleLoading(false);
      pushToast("This demo doesn't connect to a real Google account.");
    }, 900);
  };

  const handleDemoLink = (label: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    pushToast(`${label} is just a placeholder link here.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setEmailError("Enter a valid email address.");
      triggerShake();
      emailRef.current?.focus();
      return;
    }
    if (mode === "login" && password.length === 0) {
      triggerShake();
      passwordRef.current?.focus();
      return;
    }
    setEmailError(null);
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (mode === "signup") {
        setSubmitted(true);
      } else {
        pushToast(`Logged in as ${email} — demo only.`);
        setPassword("");
      }
    }, 1100);
  };

  const useDifferentEmail = () => {
    setSubmitted(false);
    setEmail("");
    setTimeout(() => emailRef.current?.focus(), 50);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white px-6 py-16">
      <div className="w-full max-w-[380px]">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: prefersReduced ? 0 : 0.22 }}
              className="flex flex-col items-center text-center"
            >
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: prefersReduced ? 0 : 0.05 }}
                className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50"
              >
                <Check className="h-6 w-6 text-emerald-500" />
              </motion.div>
              <h1 className="text-[24px] font-bold tracking-tight text-neutral-900">Check your email</h1>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-500">
                We sent a confirmation link to <span className="font-medium text-neutral-800">{email}</span>. Open it to finish
                creating your account.
              </p>
              <button
                onClick={useDifferentEmail}
                className="mt-6 flex items-center gap-1.5 text-[13.5px] font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
              >
                <Mail className="h-3.5 w-3.5" />
                Use a different email
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: prefersReduced ? 0 : 0.22 }}
            >
              <div className="mb-7 flex justify-center">
                <BrandMark />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.16 }}
                  className="text-center"
                >
                  <h1 className="text-[26px] font-bold tracking-tight text-neutral-900">{copy.heading}</h1>
                  <p className="mx-auto mt-2 max-w-[300px] text-[14px] leading-relaxed text-neutral-500">{copy.subtext}</p>
                </motion.div>
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={handleGoogle}
                whileTap={{ scale: 0.98 }}
                className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full border border-neutral-200 bg-white py-3 text-[14px] font-medium text-neutral-800 transition-colors hover:bg-neutral-50 disabled:opacity-60"
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                ) : (
                  <GoogleIcon className="h-4 w-4" />
                )}
                Continue with Google
              </motion.button>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-[12.5px] text-neutral-400">or</span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <motion.div
                  animate={shake && !prefersReduced ? { x: [0, -8, 8, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.4 }}
                  onAnimationComplete={() => setShake(false)}
                  className="flex flex-col gap-2.5"
                >
                  <div>
                    <label htmlFor="auth-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="auth-email"
                      ref={emailRef}
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="you@example.com"
                      className={cn(
                        "w-full rounded-2xl border bg-white px-4 py-3 text-[14px] text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-2",
                        emailError
                          ? "border-rose-300 focus:border-rose-400 focus:ring-rose-100"
                          : "border-neutral-200 focus:border-blue-400 focus:bg-blue-50/40 focus:ring-blue-100"
                      )}
                    />
                  </div>

                  <AnimatePresence initial={false}>
                    {mode === "login" && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="relative">
                          <label htmlFor="auth-password" className="sr-only">
                            Password
                          </label>
                          <input
                            id="auth-password"
                            ref={passwordRef}
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 pr-11 text-[14px] text-neutral-900 placeholder:text-neutral-400 transition-colors focus:border-blue-400 focus:bg-blue-50/40 focus:outline-none focus:ring-2 focus:ring-blue-100"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => pushToast("Password reset isn't wired up in this demo.")}
                          className="mt-1.5 ml-1 text-[12.5px] text-neutral-500 hover:text-neutral-800"
                        >
                          Forgot password?
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-[12.5px] text-rose-500"
                  >
                    {emailError}
                  </motion.p>
                )}

                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                  disabled={submitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-3 text-[14px] font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-70"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {copy.cta}
                </motion.button>
              </form>

              <p className="mt-4 text-center text-[12.5px] leading-relaxed text-neutral-500">
                By continuing, you agree to our{" "}
                <a href="#" onClick={handleDemoLink("Terms of Service")} className="underline underline-offset-2 hover:text-neutral-800">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" onClick={handleDemoLink("Privacy Policy")} className="underline underline-offset-2 hover:text-neutral-800">
                  Privacy Policy
                </a>
                .
              </p>

              <p className="mt-6 text-center text-[13.5px] text-neutral-500">
                {copy.prompt}{" "}
                <button onClick={switchMode} className="font-semibold text-neutral-900 hover:underline">
                  {copy.action}
                </button>
              </p>

              <div className="mt-12">
                <p className="text-center text-[12px] text-neutral-400">Trusted by teams at</p>
                <div className="mt-4 flex items-center justify-center gap-6">
                  {TRUSTED_BY.map((brand, i) => (
                    <motion.span
                      key={brand.name}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * i }}
                      className="flex items-center gap-1.5 text-[14px] font-semibold tracking-tight text-neutral-300"
                    >
                      {brand.dot && <span className={cn("h-1.5 w-1.5 rounded-full", brand.dot)} />}
                      {brand.name}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Toast message={toast} />
    </div>
  );
}