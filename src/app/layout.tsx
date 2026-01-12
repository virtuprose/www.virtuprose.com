import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { OrviaChatUI } from "@/components/orvia-chatui";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const themeInitializer = `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = stored === 'light' || stored === 'dark' ? stored : system;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  } catch (error) {
    console.error('theme init', error);
  }
})();`;

export const metadata: Metadata = {
  title: "Muhammad Zaid | Strategic Automation Partner",
  description:
    "I help ambitious brands scale with intelligent automation engines. Leveraging 10 years of experience to replace manual work with scalable systems.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://virtuprose.com"),
  icons: {
    icon: "/assets/favicon.png",
    shortcut: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },
  openGraph: {
    title: "Muhammad Zaid | Strategic Automation Partner",
    description:
      "I help ambitious brands scale with intelligent automation engines. Leveraging 10 years of experience to replace manual work with scalable systems.",
    url: "https://virtuprose.com",
    siteName: "Muhammad Zaid",
    images: [
      {
        url: "/assets/vps-icon.svg",
        width: 512,
        height: 512,
        alt: "VirtuProse Halo Icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeInitializer }} />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[var(--bg)] text-[var(--text-primary)]`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative flex min-h-screen flex-col bg-[var(--bg)]">
            <div className="aurora-overlay" aria-hidden="true" />
            <SiteNav />
            <main className="flex-1 bg-[var(--bg)] pt-8 text-[var(--text-primary)] md:pt-12">{children}</main>
            <SiteFooter />
          </div>
          <OrviaChatUI />
        </ThemeProvider>
      </body>
    </html>
  );
}
