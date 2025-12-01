import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { OrviaChat } from "@/components/orvia-chat";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
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
  title: "VirtuProse Solutions | Intelligent Growth Engines",
  description:
    "VirtuProse Solutions builds AI-powered growth engines across web, marketing, and automation.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://virtuprose.com"),
  icons: {
    icon: "/assets/vps-icon.svg",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover",
  },
  openGraph: {
    title: "VirtuProse Solutions",
    description:
      "AI-inspired growth marketing, UI/UX, web apps, and automation built to scale brands 24/7.",
    url: "https://virtuprose.com",
    siteName: "VirtuProse Solutions",
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
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
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
          <OrviaChat />
        </ThemeProvider>
      </body>
    </html>
  );
}
