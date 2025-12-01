"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  href: string;
  label: string;
  cta?: boolean;
  ctaText?: string;
};

const NAV_LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/who-we-are", label: "Who We Are" },
  { href: "/contact", label: "Contact Us" },
  { href: "/orvia", label: "Orvia", cta: true, ctaText: "Explore Orvia →" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const checkWidth = () => {
      if (containerRef.current) {
        setIsMobile(containerRef.current.offsetWidth < 1024);
      }
    };
    checkWidth();
    const resizeObserver = new ResizeObserver(checkWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  const mobileMenu = (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="group h-10 w-10 hover:bg-[var(--accent)]/15"
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 border-l border-[var(--border)] bg-[var(--bg-secondary)]">
        <SheetHeader>
          <SheetTitle>Navigate</SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) =>
            link.cta ? (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-3 py-2 text-sm font-semibold text-[var(--accent)] shadow-[0_8px_30px_rgba(99,102,241,0.25)]"
              >
                {link.ctaText ?? link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--bg)]/60",
                  pathname === link.href ? "text-[var(--accent)]" : "text-[var(--text-secondary)]",
                )}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

  const desktopMenu = (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="items-center gap-2">
        {NAV_LINKS.filter((link) => !link.cta).map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  pathname === link.href ? "text-[var(--accent)]" : "text-[var(--text-secondary)] hover:text-[var(--accent)]",
                )}
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <header
      ref={(node) => {
        containerRef.current = node;
      }}
      className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--bg)]/95 px-4 shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl overflow-hidden"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 sm:gap-4 min-w-0">
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 min-w-0">
          <div className="relative h-[2.6rem] w-28 sm:w-36 flex-shrink-0">
            <Image
              src="/newbranding/logo-light.svg"
              alt="VirtuProse logo"
              fill
              className="object-contain dark:hidden"
              sizes="(max-width: 640px) 112px, 144px"
              priority
            />
            <Image
              src="/newbranding/logo-dark.svg"
              alt="VirtuProse logo"
              fill
              className="hidden object-contain dark:block"
              sizes="(max-width: 640px) 112px, 144px"
              priority
            />
          </div>
        </Link>

        {isMobile ? mobileMenu : desktopMenu}

        <div className="flex items-center gap-3">
          {!isMobile && (
            <Button asChild className="rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/15 px-4 py-2 text-sm font-semibold text-[var(--accent)] shadow-[0_8px_30px_rgba(99,102,241,0.25)]">
              <Link href="/orvia">{NAV_LINKS.find((link) => link.cta)?.ctaText ?? "Explore Orvia"}</Link>
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
