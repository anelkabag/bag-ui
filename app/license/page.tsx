import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";

const licenseText = `MIT License

Copyright (c) 2023 Anelka Bag

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="mx-auto max-w-7xl border-x border-border px-6">
        <div className="border-b border-border py-8 md:py-10">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 transition-colors hover:border-foreground/30 hover:text-foreground"
              >
                <ArrowLeft size={14} />
                Back to home
              </Link>
            </div>
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
                  License
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Bag/UI is distributed under the MIT License, a permissive open-source
              license that allows commercial and personal use, modification, and
              redistribution with the required attribution.
            </p>
          </div>

          <div className="grid gap-0 md:grid-cols-[1.2fr_0.8fr]">
            <div className="border-r border-border bg-background">
              <div className="border-b border-border p-5 md:p-8">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Full text
                </p>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-xl border border-border bg-muted/20 p-4 text-sm leading-7 text-foreground md:p-5">
                  {licenseText}
                </pre>
              </div>
            </div>

            <aside className="bg-background">
              <div className="border-b border-border p-5 md:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Summary
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  <li>• You may use the project freely in personal or commercial work.</li>
                  <li>• You may modify, distribute, and sublicense the code.</li>
                  <li>• You must keep the copyright and license notice included.</li>
                  <li>• The software is provided “as is”, without warranty.</li>
                </ul>
              </div>

              <div className="p-5 md:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                  Project
                </p>
                <p className="mt-3 text-sm text-foreground">Bag/UI</p>
                <p className="mt-1 text-sm text-muted-foreground">Open-source UI blocks and templates.</p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
