import {
  LegalDocument,
  Prose,
  SectionHeading,
  textLink,
} from "@/components/legal/LegalDocument";

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
    <LegalDocument
      current="terms"
      firstLine="The rules."
      secondLine="Terms of"
      emphasis="service."
      description="These terms govern your access to BagUI and the services made available through the website."
      sections={sections}
    >
      <section>
        <SectionHeading id="overview">Overview</SectionHeading>
        <Prose>
          By accessing BagUI, you agree to use the platform in compliance with
          these terms and all applicable laws. If you do not agree, you should
          not continue using the website or the services.
        </Prose>
      </section>

      <section>
        <SectionHeading id="service">Use of the service</SectionHeading>
        <div className="space-y-4">
          <Prose>
            You may use BagUI for lawful personal or commercial purposes, as
            long as you do not misuse the service, interfere with its
            operation, or violate the rights of others.
          </Prose>
          <Prose>
            We reserve the right to suspend or restrict access to any user or
            activity that appears abusive, harmful, or incompatible with the
            platform’s intended use.
          </Prose>
        </div>
      </section>

      <section>
        <SectionHeading id="accounts">Accounts and access</SectionHeading>
        <ul className="space-y-3">
          {[
            "You are responsible for the accuracy of the information you provide.",
            "You are responsible for keeping your account credentials secure.",
            "We may suspend access for security or policy violations.",
          ].map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-6 text-muted-foreground"
            >
              <span className="mt-2 size-1 shrink-0 rounded-full bg-foreground" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <SectionHeading id="payments">Payments and plans</SectionHeading>
        <Prose>
          Some features or access levels may require a paid plan. Fees are
          billed according to the selected plan and applicable terms at the
          time of purchase. We may modify prices or plans with prior notice
          when required by law or business conditions.
        </Prose>
      </section>

      <section>
        <SectionHeading id="intellectual-property">
          Intellectual property
        </SectionHeading>
        <Prose>
          BagUI and its content, design, UI blocks, templates, and branding are
          protected by intellectual property rights. You may use the platform
          in accordance with the applicable license terms, but you may not
          copy, resell, or redistribute the product in a way that violates
          those terms.
        </Prose>
      </section>

      <section>
        <SectionHeading id="liability">Liability</SectionHeading>
        <Prose>
          The service is provided “as is” without warranties of any kind,
          whether express or implied. We are not liable for indirect,
          incidental, or consequential damages arising from your use of the
          platform, except to the extent required by law.
        </Prose>
      </section>

      <section>
        <SectionHeading id="termination">Termination</SectionHeading>
        <Prose>
          We may suspend or terminate access to the service at any time, with
          or without notice, if we determine that the user has violated these
          terms, engaged in harmful activity, or created a risk to the platform
          or other users.
        </Prose>
      </section>

      <section>
        <SectionHeading id="contact">Contact</SectionHeading>
        <Prose>
          If you have questions about these terms, contact us at{" "}
          <a href="mailto:anelka.bag@gmail.com" className={textLink}>
            anelka.bag@gmail.com
          </a>
          .
        </Prose>
      </section>
    </LegalDocument>
  );
}
