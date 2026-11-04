import * as React from "react";
import Image from "next/image";
import Link from "next/link";

/* ----------------------------- Données ----------------------------- */

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const primaryLinks: FooterLink[] = [
  { label: "Product", href: "#" },
  { label: "Use Cases", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Download", href: "#" },
];

const columns: FooterColumn[] = [
  { title: "Primary", links: primaryLinks },
  { title: "Primary", links: primaryLinks },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

/* ------------------------------ Icônes ------------------------------ */

type IconProps = React.SVGProps<SVGSVGElement>;

const LinkedInIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2ZM8.34 18H5.67V9.64h2.67V18ZM7 8.5a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1ZM18.34 18h-2.67v-4.06c0-.97-.02-2.21-1.35-2.21-1.35 0-1.56 1.05-1.56 2.14V18h-2.67V9.64h2.56v1.14h.04c.36-.67 1.23-1.39 2.53-1.39 2.7 0 3.2 1.78 3.2 4.09V18h-.08Z" />
  </svg>
);

const XIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.19L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.16h1.7L7.4 4.74H5.57l11.1 14.42Z" />
  </svg>
);

const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
  </svg>
);

const socials = [
  { label: "LinkedIn", href: "#", Icon: LinkedInIcon },
  { label: "X", href: "#", Icon: XIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
];

/* ----------------------------- Styles ----------------------------- */

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#2d8cf0] focus-visible:rounded";

/* ---------------------------- Composant ---------------------------- */

export default function Footer4() {
  return (
    // Marge extérieure -> effet "flottant" (jamais collé aux bords de la fenêtre)
    <div className="flex min-h-screen w-full flex-col justify-end px-[clamp(6px,1vw,14px)] pb-[clamp(12px,2vw,28px)] font-sans antialiased">
      <footer className="mx-auto w-[60vw] overflow-hidden rounded-[30px] border border-[#dcdce3] bg-gradient-to-b from-[#eeeef2] to-[#e3e3e9] px-1.5 pt-1.5">
        {/* Carte blanche */}
        <div className="flex flex-col gap-8 rounded-3xl bg-white px-[clamp(24px,4vw,44px)] pb-[34px] pt-9 shadow-[0_2px_10px_rgba(20,20,40,0.10),0_0_0_1px_rgba(20,20,40,0.03)] min-[680px]:flex-row min-[680px]:justify-between min-[680px]:gap-10">
          {/* Marque */}
          <div className="max-w-[205px]">
            <Link
              href="/"
              aria-label="BagUi"
              className={`flex items-center gap-[7px] ${focusRing}`}
            >
              <Image
                src="/logo.png"
                alt=""
                width={28}
                height={28}
                className="block h-7 w-auto"
              />
              <span className="text-[25px] font-semibold leading-none tracking-[-0.5px] text-[#17171c]">
                BagUi
              </span>
            </Link>

            <p className="mt-[22px] text-[13px] leading-[1.34] text-[#3d3d44]">
              Spend less time building UI from scratch. Ship faster with BagUI.
            </p>

            <div className="mt-6 flex gap-[7px]">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`grid h-8 w-8 place-items-center rounded-[9px] border border-[#e6e6ec] bg-white text-[#17171c] transition-colors hover:border-[#d4d4dc] hover:bg-[#f5f5f8] ${focusRing}`}
                >
                  <Icon className="h-[15px] w-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          <nav
            aria-label="Pied de page"
            className="flex flex-wrap gap-y-7 pt-0.5 min-[680px]:flex-nowrap min-[680px]:gap-y-0"
          >
            {columns.map((column, index) => (
              <div
                key={`${column.title}-${index}`}
                className="w-1/2 min-[680px]:w-[clamp(110px,12vw,130px)]"
              >
                <h4 className="mb-[15px] text-xs font-normal text-[#6b6b73]">
                  {column.title}
                </h4>
                <ul className="space-y-[7px]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className={`inline-block text-[13px] font-medium leading-[15.5px] text-[#151515] transition-opacity hover:opacity-[0.65] ${focusRing}`}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Barre du bas */}
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-4 text-[13px] text-[#6a6a72] min-[680px]:h-[50px] min-[680px]:flex-row min-[680px]:justify-between min-[680px]:px-[clamp(24px,4vw,44px)] min-[680px]:py-0">
          <p>© 2025 BagUi. All rights reserved.</p>

          <div className="flex items-center">
            <a
              href="#"
              className={`text-[#6a6a72] transition-colors hover:text-[#151515] ${focusRing}`}
            >
              Privacy Policy
            </a>
            <span aria-hidden="true" className="mx-3.5 h-[13px] w-px bg-[#cfcfd6]" />
            <a
              href="#"
              className={`text-[#6a6a72] transition-colors hover:text-[#151515] ${focusRing}`}
            >
              Terms &amp; Conditions
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}