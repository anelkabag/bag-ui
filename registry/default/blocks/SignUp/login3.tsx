"use client";

import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

// Le formulaire rétrécit par paliers sur les écrans peu hauts pour toujours tenir sans scroll
const fit =
  "[@media(max-height:720px)_and_(min-height:641px)]:[zoom:.9] " +
  "[@media(max-height:640px)_and_(min-height:561px)]:[zoom:.8] " +
  "[@media(max-height:560px)_and_(min-height:481px)]:[zoom:.7] " +
  "[@media(max-height:480px)_and_(min-height:401px)]:[zoom:.6] " +
  "[@media(max-height:400px)]:[zoom:.5]";

const btn =
  "flex h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-full text-xs font-medium transition";
const outline = `${btn} border border-[#e6e6e6] bg-white text-[#0a0a0a] hover:bg-[#fafafa]`;
const primary = `${btn} border border-[#0a0a0a] bg-[#0a0a0a] font-semibold text-white hover:opacity-[.88]`;

const label = "text-[11px] font-semibold leading-[14px] text-[#0a0a0a]";
const input =
  "h-10 w-full rounded-full border border-[#e6e6e6] bg-white px-[18px] text-[11px] text-[#0a0a0a] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#0a0a0a]";

export default function SignInPage() {
  return (
    <main
      className={`${geistSans.variable} ${geistMono.variable} grid h-dvh grid-cols-1 overflow-hidden bg-white font-[family-name:var(--font-geist-mono)] text-[#0a0a0a] antialiased min-[821px]:grid-cols-[42.3%_1fr]`}
    >
      {/* Left : form */}
      <section className="flex items-center justify-center px-6 min-[821px]:justify-start min-[821px]:pl-[clamp(32px,5.5vw,80px)]">
        <form
          onSubmit={(e) => e.preventDefault()}
          className={`w-full max-w-[368px] ${fit}`}
        >
          <Image src="/logo.png" alt="Logo" width={24} height={24} priority className="block h-6 w-6" />

          <h1 className="mt-11 font-[family-name:var(--font-geist-sans)] text-[26px] font-semibold leading-7 tracking-[-0.02em]">
            Sign In
          </h1>
          <p className="mt-6 text-xs leading-4 text-[#8c8c8c]">
            Continue to access your dashboard
          </p>

          <div className="mt-[42px] flex flex-col gap-5">
            <button type="button" className={outline}>
              <svg className="h-[18px] w-[18px] flex-none" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Sign in with Google
            </button>
            <button type="button" className={outline}>
              <svg className="h-[18px] w-[18px] flex-none" viewBox="0 0 24 24" fill="#0a0a0a" aria-hidden="true">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
              </svg>
              Sign in with Apple
            </button>
          </div>

          <div className="mb-11 mt-[41px] flex items-center gap-6 text-[10px] leading-[14px] text-[#8c8c8c] before:h-px before:flex-1 before:bg-[#e6e6e6] before:content-[''] after:h-px after:flex-1 after:bg-[#e6e6e6] after:content-['']">
            OR
          </div>

          <div>
            <div className="mb-[14px] flex items-center justify-between">
              <label htmlFor="email" className={label}>Email</label>
            </div>
            <input id="email" type="email" placeholder="Enter your email" autoComplete="email" className={input} />
          </div>

          <div className="mt-[30px]">
            <div className="mb-[14px] flex items-center justify-between">
              <label htmlFor="password" className={label}>Password</label>
              <a href="#" className={`${label} underline underline-offset-2`}>Forgot Password?</a>
            </div>
            <input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" className={input} />
          </div>

          <button type="submit" className={`${primary} mt-[30px]`}>Sign In</button>

          <div className="mt-7 text-center text-[11px] leading-[14px]">
            <p className="text-[#8c8c8c]">Don&apos;t have an account?</p>
            <a href="#" className="mt-4 inline-block font-semibold underline underline-offset-2">
              Create an Account
            </a>
          </div>
        </form>
      </section>

      {/* Right : halftone (public/halftone.png) */}
      <aside
        aria-hidden="true"
        className="hidden bg-white bg-[url('/halftone.png')] bg-cover bg-center bg-no-repeat min-[821px]:block"
      />
    </main>
  );
}