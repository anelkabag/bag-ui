import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "service", label: "Use of the service" },
  { id: "accounts", label: "Accounts and access" },
  { id: "payments", label: "Payments and plans" },
  { id: "intellectual-property", label: "Intellectual property" },
  { id: "liability", label: "Liability" },
  { id: "termination", label: "Termination" },
  { id: "contact", label: "Contact" },
] as const;

export default function TermsPage() {
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
                <FileText className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Legal
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-5xl">
                  Terms of Service
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              These Terms of Service govern your access to and use of Bag/UI and the
              services made available through the website.
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
                    By accessing Bag/UI, you agree to use the platform in compliance with
                    these Terms and all applicable laws. If you do not agree, you should
                    not continue using the website or the services.
                  </p>
                </section>

                <section id="service" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    2. Use of the service
                  </h2>
                  <div className="mt-4 space-y-3 text-sm leading-7 text-muted-foreground md:text-base">
                    <p>
                      You may use Bag/UI for lawful personal or commercial purposes, as
                      long as you do not misuse the service, interfere with its operation,
                      or violate the rights of others.
                    </p>
                    <p>
                      We reserve the right to suspend or restrict access to any user or
                      activity that appears abusive, harmful, or incompatible with the
                      platform’s intended use.
                    </p>
                  </div>
                </section>

                <section id="accounts" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    3. Accounts and access
                  </h2>
                  <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-muted-foreground md:text-base">
                    <li>You are responsible for the accuracy of the information you provide.</li>
                    <li>You are responsible for keeping your account credentials secure.</li>
                    <li>We may suspend access for security or policy violations.</li>
                  </ul>
                </section>

                <section id="payments" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    4. Payments and plans
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    Some features or access levels may require a paid plan. Fees are
                    billed according to the selected plan and applicable terms at the time
                    of purchase. We may modify prices or plans with prior notice when
                    required by law or business conditions.
                  </p>
                </section>

                <section id="intellectual-property" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    5. Intellectual property
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    Bag/UI and its content, design, UI blocks, templates, and branding are
                    protected by intellectual property rights. You may use the platform in
                    accordance with the applicable license terms, but you may not copy,
                    resell, or redistribute the product in a way that violates those terms.
                  </p>
                </section>

                <section id="liability" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    6. Liability
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    The service is provided “as is” without warranties of any kind, whether
                    express or implied. We are not liable for indirect, incidental, or
                    consequential damages arising from your use of the platform, except to
                    the extent required by law.
                  </p>
                </section>

                <section id="termination" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    7. Termination
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    We may suspend or terminate access to the service at any time, with or
                    without notice, if we determine that the user has violated these terms,
                    engaged in harmful activity, or created a risk to the platform or other
                    users.
                  </p>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                    8. Contact
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
                    If you have questions about these Terms, contact us at
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
