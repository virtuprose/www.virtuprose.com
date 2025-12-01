import Link from "next/link";
import Image from "next/image";

const footerColumns = [
  {
    label: "Company",
    links: [
      { href: "/who-we-are", text: "Who We Are" },
      { href: "/contact", text: "Contact" },
    ],
  },
  {
    label: "Solutions",
    links: [
      { href: "/services", text: "Services" },
      { href: "/pricing", text: "Pricing" },
      { href: "/orvia", text: "Orvia AI + Voice" },
    ],
  },
  {
    label: "Resources",
    links: [
      { href: "/privacy", text: "Privacy" },
      { href: "/terms", text: "Terms" },
      { href: "/refund", text: "Refunds" },
      { href: "/faq", text: "FAQs" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden rounded-t-[32px] border-t border-[var(--border)] bg-gradient-to-b from-[#0a0b13] via-[#0f1224] to-[#0b0d18] text-[var(--text-primary)]">
      <div className="absolute inset-0 opacity-40 blur-3xl" aria-hidden="true">
        <div className="aurora-overlay" />
      </div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--bg)]">
                <Image
                  src="/newbranding/icon-light.svg"
                  alt="VirtuProse icon"
                  width={44}
                  height={44}
                  className="dark:hidden"
                  priority
                  unoptimized
                />
                <Image
                  src="/newbranding/icon-dark.svg"
                  alt="VirtuProse icon"
                  width={44}
                  height={44}
                  className="hidden dark:block"
                  priority
                  unoptimized
                />
              </div>
              <div>
                <p className="text-base font-semibold text-white">VirtuProse Solutions</p>
                <p className="text-xs uppercase tracking-[0.4em] text-white/70">AI growth studio</p>
              </div>
            </div>
            <p className="max-w-xl text-sm text-white/70">
              intelligent growth engines for ambitious brands
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-white/80">
              <span className="rounded-full border border-white/20 px-3 py-1">Global delivery</span>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {footerColumns.map((section) => (
              <div key={section.label} className="space-y-3">
                <p className="text-sm font-semibold text-white">{section.label}</p>
                <div className="space-y-2 text-sm text-white/70">
                  {section.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block transition-colors hover:text-white"
                    >
                      {link.text}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60">
          <div className="flex flex-wrap gap-3">
            <span>© {new Date().getFullYear()} VirtuProse Solutions</span>
            <span>Secure · Global · Remote-first</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/support" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
