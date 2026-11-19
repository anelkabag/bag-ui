import {
  LegalDocument,
  Prose,
  SectionHeading,
  textLink,
} from "@/components/legal/LegalDocument";

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
    <LegalDocument
      current="privacy"
      firstLine="Your data."
      secondLine="How BagUI"
      emphasis="handles it."
      description="This policy explains how BagUI collects, uses, and protects the information you share while using the website and services."
      sections={sections}
    >
      <section>
        <SectionHeading id="overview">Overview</SectionHeading>
        <Prose>
          We respect your privacy and aim to collect only the data needed to
          provide a smooth, secure, and useful experience. This policy covers
          information collected on BagUI, including account, product, and
          browsing interactions.
        </Prose>
      </section>

      <section>
        <SectionHeading id="data-collected">Data we collect</SectionHeading>
        <div className="space-y-4">
          <Prose>
            We may collect information such as account details, email address,
            product activity, download history, analytics data, and technical
            information related to browser, device, and usage patterns.
          </Prose>
          <Prose>
            We also process communication data when you contact us through a
            form, email, or support request.
          </Prose>
        </div>
      </section>

      <section>
        <SectionHeading id="how-we-use">How we use your data</SectionHeading>
        <ul className="space-y-3">
          {[
            "To provide access to the catalog, account features, and downloads.",
            "To improve the performance, quality, and usability of the platform.",
            "To personalize your experience and maintain account security.",
            "To send occasional product release emails by default. You can turn them off at any time in your account preferences or unsubscribe from any release email.",
            "To respond to support requests and service messages.",
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
        <SectionHeading id="cookies">Cookies and tracking</SectionHeading>
        <Prose>
          We may use cookies or similar technologies to remember preferences,
          support authentication, and understand how visitors use the site.
          You can disable cookies in your browser, but some features may not
          work as expected.
        </Prose>
      </section>

      <section>
        <SectionHeading id="sharing">Sharing and third parties</SectionHeading>
        <Prose>
          We do not sell personal data. We may share information with trusted
          service providers that help us operate the platform, including
          hosting, analytics, authentication, and email delivery services,
          under confidentiality and security obligations.
        </Prose>
      </section>

      <section>
        <SectionHeading id="security">Security</SectionHeading>
        <Prose>
          We apply reasonable administrative, technical, and organizational
          safeguards to protect your information. However, no digital system is
          completely risk-free, and we cannot guarantee absolute security.
        </Prose>
      </section>

      <section>
        <SectionHeading id="rights">Your rights</SectionHeading>
        <Prose>
          Depending on your location, you may have the right to access,
          correct, delete, or restrict the processing of your personal data. If
          you would like to exercise one of these rights, please contact us
          using the details below.
        </Prose>
      </section>

      <section>
        <SectionHeading id="contact">Contact</SectionHeading>
        <Prose>
          For privacy questions or requests, contact us at{" "}
          <a href="mailto:anelka.bag@gmail.com" className={textLink}>
            anelka.bag@gmail.com
          </a>
          .
        </Prose>
      </section>
    </LegalDocument>
  );
}
