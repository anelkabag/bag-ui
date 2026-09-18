import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "data-collected", label: "Data collected" },
  { id: "how-we-use", label: "How we use it" },
  { id: "cookies", label: "Cookies" },
  { id: "sharing", label: "Sharing" },
  { id: "security", label: "Security" },
  { id: "rights", label: "Your rights" },
  { id: "contact", label: "Contact" },
] as const;

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl border-x border-border px-6">
        <div className="border-b border-border py-8 md:py-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <ArrowLeft size={14} />
              Back to home
            </Link>
          </div>
        </div>

        <section className="overflow-hidden border-b border-border">
          <div className="border-b border-border bg-muted/20 px-6 py-8 md:px-10 md:py-10">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background">
                <ShieldCheck className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Legal
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">
                  Privacy Policy
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              This Privacy Policy explains how Bag/UI collects, uses, and protects
              the information you share while using our website and services.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-[260px_1fr]">
            <aside className="border-r border-border bg-background">
              <div className="p-5 md:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  On this page
                </p>
                <nav className="mt-5 space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {section.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            <div className="bg-background">
              <div className="space-y-8 p-5 md:p-8">
                <section id="overview" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    1. Overview
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    We respect your privacy and aim to collect only the data needed to
                    provide a smooth, secure, and useful experience. This policy covers
                    information collected on Bag/UI, including account, product, and
                    browsing interactions.
                  </p>
                </section>

                <section id="data-collected" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    2. Data we collect
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
                    <p>
                      We may collect information such as account details, email address,
                      product activity, download history, analytics data, and technical
                      information related to browser, device, and usage patterns.
                    </p>
                    <p>
                      We also process communication data when you contact us through a
                      form, email, or support request.
                    </p>
                  </div>
                </section>

                <section id="how-we-use" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    3. How we use your data
                  </h2>
                  <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground md:text-base">
                    <li>To provide access to the catalog, account features, and downloads.</li>
                    <li>To improve the performance, quality, and usability of the platform.</li>
                    <li>To personalize your experience and maintain account security.</li>
                    <li>To communicate updates, product notifications, and support responses.</li>
                  </ul>
                </section>

                <section id="cookies" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    4. Cookies and tracking
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    We may use cookies or similar technologies to remember preferences,
                    support authentication, and understand how visitors use the site. You
                    can disable cookies in your browser, but some features may not work as
                    expected.
                  </p>
                </section>

                <section id="sharing" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    5. Sharing and third parties
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    We do not sell personal data. We may share information with trusted
                    service providers that help us operate the platform, such as hosting,
                    analytics, and authentication services, under confidentiality and
                    security obligations.
                  </p>
                </section>

                <section id="security" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    6. Security
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    We apply reasonable administrative, technical, and organizational
                    safeguards to protect your information. However, no digital system is
                    completely risk-free, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section id="rights" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    7. Your rights
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    Depending on your location, you may have the right to access, correct,
                    delete, or restrict the processing of your personal data. If you would
                    like to exercise one of these rights, please contact us using the
                    details below.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    8. Contact
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    For privacy questions or requests, contact us at
                    <a
                      href="mailto:anelka.bag@gmail.com"
                      className="ml-1 text-foreground underline underline-offset-4"
                    >
                      anelka.bag@gmail.com
                    </a>
                    .
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
