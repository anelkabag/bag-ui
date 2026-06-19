import Link from "next/link";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-20 border-x border-gray-200">
        {/* Main */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 relative overflow-hidden">
          {/* Grid background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#f0f0f0 1px, transparent 1px), linear-gradient(90deg, #f0f0f0 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              opacity: 0.6,
            }}
          />
          {/* Radial fade */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 30%, white 80%)",
            }}
          />

          <div className="relative z-10 max-w-lg mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-gray-500 border border-gray-200 rounded-full px-3.5 py-1 mb-7">
              <span className="w-1.5 h-1.5 bg-black rounded-full" />
              Page not found
            </div>

            {/* 404 */}
              <div className="text-[clamp(120px,25vw,220px)] font-extrabold leading-none tracking-[-8px] text-black mb-2">
                  4<span className="text-gray-200">0</span>4
              </div>

            <h1 className="text-xl font-semibold text-black mb-3">
              This block doesn&apos;t exist.
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed mb-9">
              The page you&apos;re looking for has moved, been deleted,
              <br className="hidden sm:block" />
              or never existed in the first place.
            </p>

            {/* Actions */}
            <div className="flex items-center justify-center gap-2.5 flex-wrap">
              <Link
                href="/blocks"
                className="inline-flex items-center gap-1.5 bg-black text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-gray-900 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M2 7h10M7 2l5 5-5 5" />
                </svg>
                Browse blocks
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 bg-white text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Go home
              </Link>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
