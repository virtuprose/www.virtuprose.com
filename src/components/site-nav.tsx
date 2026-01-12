"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
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
  { href: "/who-we-are", label: "About Zaid" },
  { href: "/orvia", label: "The Orvia Method" },
  { href: "/pricing", label: "Engagement Models" },
  // { href: "/contact", label: "Contact" },
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
          className="group h-9 w-9 rounded-xl hover:bg-[var(--text-primary)]/5"
          variant="ghost"
          size="icon"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5 text-[var(--text-secondary)]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-l border-[var(--border)]/50 bg-[var(--bg)] backdrop-blur-2xl">
        <SheetHeader>
          <SheetTitle className="text-left text-sm font-medium text-[var(--text-secondary)]">Menu</SheetTitle>
        </SheetHeader>
        <div className="mt-6 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-4 py-3 text-[15px] font-medium transition-all duration-200",
                pathname === link.href
                  ? "bg-[var(--text-primary)]/5 text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 hover:text-[var(--text-primary)]",
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="my-3 h-px bg-[var(--border)]/50" />
          <Link
            href="/contact"
            className="group relative flex items-center justify-center gap-3 rounded-xl bg-[var(--text-primary)] px-4 py-3 text-[var(--bg)] transition-all duration-300"
          >
            <span className="text-sm font-semibold">Book Zaid</span>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );

  const desktopMenu = (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList className="items-center gap-1">
        {NAV_LINKS.map((link) => (
          <NavigationMenuItem key={link.href}>
            <NavigationMenuLink asChild>
              <Link
                href={link.href}
                className={cn(
                  "relative rounded-lg px-4 py-2 text-[13px] font-medium tracking-[-0.01em] transition-all duration-200",
                  pathname === link.href
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[var(--accent)]" />
                )}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        <div className="mx-2 h-5 w-px bg-[var(--border)]/60" />
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/contact"
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-300",
                "bg-[var(--text-primary)] text-[var(--bg)]",
                "hover:shadow-lg hover:scale-[1.02]",
              )}
            >
              <span>Book Zaid</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );

  return (
    <header
      ref={(node) => {
        containerRef.current = node;
      }}
      className="sticky top-0 z-40 w-full border-b border-[var(--border)]/40 bg-[var(--bg)]/80 px-4 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="relative h-9 w-32">
            <Image
              src="/newbranding/logo-light.svg"
              alt="VirtuProse logo"
              fill
              className="object-contain dark:hidden"
              sizes="128px"
              priority
            />
            <Image
              src="/newbranding/logo-dark.svg"
              alt="VirtuProse logo"
              fill
              className="hidden object-contain dark:block"
              sizes="128px"
              priority
            />
          </div>
        </Link>

        {!isMobile && desktopMenu}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isMobile && mobileMenu}
        </div>
      </div>
    </header>
  );
}
