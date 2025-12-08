"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { servicesData } from "@/data/services";
import { Bot, BotMessageSquare, Briefcase, Calendar, Clock, CreditCard, Globe2, Inbox, LineChart, MessageCircle, MessageSquare, RefreshCcw, ShieldCheck, Store, TrendingUp, Workflow, Zap } from "lucide-react";
import { SentientGlobe } from "@/components/sentient-globe";
import { OutcomeWall } from "@/components/outcome-wall";
import { motion } from "framer-motion";

const heroMetrics = [
  { target: 10, label: "Years crafting digital experiences" },
  { target: 240, label: "Projects launched and scaled globally" },
  { target: 96, label: "Partner satisfaction built on real business outcomes" },
];

const partnerLogosRow1 = [
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-01-3.webp", alt: "Client 01 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-02-3.webp", alt: "Client 02 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-03-3.webp", alt: "Client 03 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-04.webp", alt: "Client 04 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-05-3.webp", alt: "Client 05 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-06-3.webp", alt: "Client 06 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-07-3.webp", alt: "Client 07 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-08.webp", alt: "Client 08 logo" },
];

const partnerLogosRow2 = [
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-09-3.webp", alt: "Client 09 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-10-3.webp", alt: "Client 10 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-11-3.webp", alt: "Client 11 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-12-3.webp", alt: "Client 12 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-14-3.webp", alt: "Client 13 logo" },
  { src: "/assets/client-logos/CLIENT-LOGO-MAIN-FILE-15-3.webp", alt: "Client 14 logo" },
  { src: "/assets/client-logos/Type-12-2048x499-1.webp", alt: "Client 15 logo" },
];


const showcaseProjects = [
  {
    title: "Nova Commerce",
    description: "Scaled paid media and CRO for a DTC brand in 90 days.",
    image: "/assets/service-visuals/growth.svg",
    href: "/services/growth-marketing",
  },
  {
    title: "Clinic Flow",
    description: "AI agent + booking automation that doubled confirmations.",
    image: "/assets/service-visuals/ai.svg",
    href: "/orvia",
  },
  {
    title: "SaaS Velocity",
    description: "Revamped onboarding UI and lifecycle journeys to lift activation.",
    image: "/assets/service-visuals/apps.svg",
    href: "/services/web-applications",
  },
];

const heroExamples = [
  "Design a website for my business",
  "Implement Orvia AI Agent to my business",
  "Automate bookings and sales 24/7 with Orvia",
];

const orviaHomeHighlights = [
  {
    title: "Instant replies for every customer",
    description: "People get answers in seconds instead of being left waiting.",
    icon: MessageSquare,
  },
  {
    title: "Your calendar fills itself",
    description: "Availability shared, appointments confirmed, no-shows reduced.",
    icon: Calendar,
  },
  {
    title: "Payments collected faster",
    description: "Secure payment links sent automatically so deals close quicker.",
    icon: CreditCard,
  },
  {
    title: "Support that never switches off",
    description: "Routine questions, triage, and routing handled without draining your team.",
    icon: ShieldCheck,
  },
  {
    title: "Every conversation captured and organized",
    description: "All customer details and actions synced into your system with zero manual work.",
    icon: Workflow,
  },
  {
    title: "Convert more leads without touching a single chat",
    description: "Orvia runs the conversations that normally eat up your team's time.",
    icon: Zap,
  },
  {
    title: "Your revenue grows even while you sleep",
    description: "Sales, bookings, and customer handling continue around the clock.",
    icon: Clock,
  },
  {
    title: "Works for any industry",
    description: "Clinics, agencies, beauty, real estate, services, retail — Orvia adapts instantly.",
    icon: Store,
  },
];

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [heroInput, setHeroInput] = useState("");
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let animationFrame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(raf);
    };

    animationFrame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    if (!cursorDot || !cursorRing) return;

    const move = (event: PointerEvent) => {
      const { clientX, clientY } = event;
      cursorDot.style.transform = `translate(${clientX}px, ${clientY}px)`;
      cursorRing.style.transform = `translate(${clientX}px, ${clientY}px)`;
    };

    const interactiveSelectors = "a, button, [data-interactive]";
    const interactive = Array.from(
      document.querySelectorAll<HTMLElement>(interactiveSelectors)
    );

    const handleEnter = () => cursorRing.classList.add("active");
    const handleLeave = () => cursorRing.classList.remove("active");

    document.addEventListener("pointermove", move);
    interactive.forEach((node) => {
      node.addEventListener("pointerenter", handleEnter);
      node.addEventListener("pointerleave", handleLeave);
    });

    return () => {
      document.removeEventListener("pointermove", move);
      interactive.forEach((node) => {
        node.removeEventListener("pointerenter", handleEnter);
        node.removeEventListener("pointerleave", handleLeave);
      });
    };
  }, []);

  const openOrviaChat = (detail?: string) => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent("open-orvia-chat", { detail }));
  };

  const handleHeroSubmit = () => {
    const text = heroInput.trim();
    if (!text) return;
    openOrviaChat(text);
    setHeroInput("");
  };

  const handleExample = (example: string) => {
    setHeroInput(example);
    openOrviaChat(example);
  };

  const scrollToLaunchLab = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById("launch-lab");
    if (element && lenisRef.current) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const targetPosition = rect.top + scrollTop - 96; // 96px offset (6rem)
      lenisRef.current.scrollTo(targetPosition, {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const letters = "0101010110011010◇◈▢△▣";
    const fontSize = 16;
    let columns = 0;
    let drops: number[] = [];
    let frame = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(1);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(4, 4, 17, 0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#13e8ff";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        const x = i * fontSize;
        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] = y + 1;
      });

      frame = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    frame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll<HTMLElement>("[data-target]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = Number(el.dataset.target ?? 0);
            const duration = 2000;
            const start = performance.now();

            const update = (now: number) => {
              const progress = Math.min((now - start) / duration, 1);
              const value = Math.floor(progress * target);
              const formatted = target > 100 ? value.toLocaleString() : value;
              el.textContent = `${formatted}${el.dataset.suffix ?? ""}`;
              if (progress < 1) requestAnimationFrame(update);
              else el.textContent = `${target.toLocaleString()}${
                el.dataset.suffix ?? ""
              }`;
            };

            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    counters.forEach((counter) => observer.observe(counter));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-hero-animate]", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.15,
      });

      gsap.utils.toArray<HTMLElement>("[data-section]").forEach((section) => {
        gsap.from(section, {
          opacity: 0,
          y: 80,
          duration: 0.9,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-glow]');

    const handleGlow = (event: PointerEvent) => {
      const target = event.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      target.style.setProperty("--x", `${x}px`);
      target.style.setProperty("--y", `${y}px`);
    };

    targets.forEach((target) => {
      target.addEventListener("pointermove", handleGlow);
    });

    return () => {
      targets.forEach((target) => {
        target.removeEventListener("pointermove", handleGlow);
      });
    };
  }, []);


  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="global-noise" />
      <canvas ref={canvasRef} id="matrix-canvas" aria-hidden="true" />
      <div ref={cursorDotRef} className="cursor-dot" />
      <div ref={cursorRingRef} className="cursor-ring" />

      <div className="relative z-10 flex flex-col gap-24 pb-24 pt-10">
        <section
          id="home"
          data-section
          className="container relative overflow-hidden rounded-[32px] border border-[var(--border)]/70 bg-gradient-to-br from-[var(--bg-secondary)]/95 via-[var(--bg-secondary)]/90 to-[var(--bg-secondary)]/85 pt-0 px-10 pb-10 sm:p-10 shadow-[0_40px_120px_rgba(15,23,42,0.15)] backdrop-blur-xl mt-[10px] sm:mt-0 w-[97%] mx-auto"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(39,231,236,0.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(90,165,204,0.12),transparent_35%)] blur-3xl pointer-events-none" />
          
          <div className="relative space-y-10">
            {/* Mobile-only reordered structure */}
            <div className="flex flex-col gap-4 sm:hidden">
              {/* Orvia logo - First on mobile */}
              <div className="order-1 pt-6">
                <Image
                  src="/assets/orvia-logo-black.svg"
                  alt="Orvia logo"
                  width={140}
                  height={36}
                  className="dark:invert"
                  priority
                />
              </div>
              {/* Your first AI closer - Second on mobile */}
              <span className="order-2 rounded-full border border-[var(--border)]/60 bg-[var(--bg)]/60 px-3 py-1 text-[0.6rem] uppercase tracking-[0.4em] text-[var(--text-secondary)] backdrop-blur-sm whitespace-nowrap w-fit">
                Your first AI closer
              </span>
            </div>

            {/* Desktop structure - Original order */}
            <div className="hidden sm:flex sm:flex-col sm:items-start sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Image
                    src="/assets/orvia-logo-black.svg"
                    alt="Orvia logo"
                    width={140}
                    height={36}
                    className="dark:invert"
                    priority
                  />
                  <span className="rounded-full border border-[var(--border)]/60 bg-[var(--bg)]/60 px-3 py-1 text-xs uppercase tracking-[0.4em] text-[var(--text-secondary)] backdrop-blur-sm whitespace-nowrap">
                    Your first AI closer
                  </span>
                </div>
              </div>
            </div>

            {/* Hero Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2
                  data-hero-animate
                  className="text-4xl font-semibold leading-tight tracking-tight text-[var(--text-primary)] md:text-5xl lg:text-6xl mt-[3px] sm:mt-0"
                >
                  More bookings. More sales. Zero extra staff.
                </h2>
              </div>
              
              <p data-hero-animate className="text-[0.7875rem] leading-relaxed text-[var(--text-secondary)] sm:text-lg md:text-xl">
                Orvia replies instantly, books appointments, collects payments, and closes sales. Deploy Orvia across Web, WhatsApp, and Voice channels. Never lose a lead again, not even at 3 AM.
              </p>

              <div data-hero-animate className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link href="#launch-lab" onClick={scrollToLaunchLab}>View Demo</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6 border-[var(--border)]/60 hover:bg-[var(--bg-secondary)]">
                  <Link href="/orvia">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Outcome Wall */}
            <OutcomeWall />
          </div>
        </section>

        <section
          id="launch-lab"
          data-section
          className="container space-y-6 p-1 vp-hero scroll-mt-24"
          style={{ scrollMarginTop: '6rem' }}
        >
          <div className="rounded-[30px] border border-white/15 bg-white/5 p-8 shadow-[0_30px_100px_rgba(3,22,26,0.25)] backdrop-blur">
            <div className="space-y-3 text-center text-[var(--gunmetal)]">
              <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--gunmetal)]/70">Rated ★★★★★ by teams that replaced slow replies, missed leads, and manual work with AI-driven execution.</p>
              <h3 className="text-3xl font-bold leading-tight text-[var(--gunmetal)] md:text-4xl">
                You're one conversation away from more revenue. Don't miss it.
              </h3>
            </div>
            <div className="mx-auto mt-4 w-full max-w-6xl space-y-3 px-4">
              <div className="flex flex-wrap items-center justify-center gap-2 overflow-x-auto pb-1">
                <button
                  type="button"
                  onClick={() => {
                    openOrviaChat("Automate my leads with Orvia");
                  }}
                  className="rounded-full border border-[var(--gunmetal)]/35 bg-white/30 px-[0.7rem] py-[0.35rem] sm:px-4 sm:py-2 text-[0.7rem] sm:text-sm font-semibold text-[var(--gunmetal)] backdrop-blur-sm transition hover:bg-white/50"
                >
                  Automate my leads with Orvia
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openOrviaChat("Book meetings and calls automatically");
                  }}
                  className="rounded-full border border-[var(--gunmetal)]/35 bg-white/30 px-[0.7rem] py-[0.35rem] sm:px-4 sm:py-2 text-[0.7rem] sm:text-sm font-semibold text-[var(--gunmetal)] backdrop-blur-sm transition hover:bg-white/50"
                >
                  Book meetings and calls automatically
                </button>
                <button
                  type="button"
                  onClick={() => {
                    openOrviaChat("Turn conversations into sales 24/7");
                  }}
                  className="rounded-full border border-[var(--gunmetal)]/35 bg-white/30 px-[0.7rem] py-[0.35rem] sm:px-4 sm:py-2 text-[0.7rem] sm:text-sm font-semibold text-[var(--gunmetal)] backdrop-blur-sm transition hover:bg-white/50"
                >
                  Turn conversations into sales 24/7
                </button>
              </div>
              <div className="vp-hero-card mx-auto flex w-full max-w-full sm:max-w-5xl items-center gap-3 border border-white/15 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
                <textarea
                  className="flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/65 outline-none backdrop-blur-sm"
                  placeholder="Tell Orvia what you want it to automate…"
                  value={heroInput}
                  onChange={(event) => setHeroInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleHeroSubmit();
                    }
                  }}
                  rows={3}
                />
                <button
                  type="button"
                  aria-label="Submit"
                  onClick={handleHeroSubmit}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--rich-black)] text-white shadow-[0_10px_25px_#27e7ec59] transition hover:-translate-y-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-black">
              This opens a conversation with Orvia, your AI agent that runs customer operations for you. Free website included.
            </p>
          </div>
        </section>


        {false && (
        <section className="container space-y-4 rounded-[32px] border border-[var(--border)]/70 bg-[var(--bg-secondary)]/80 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[var(--text-secondary)]">Startups built with VirtuProse</p>
              <h3 className="text-2xl font-semibold text-[var(--text-primary)]">Growth builds we’ve launched</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Product, GTM, and AI agents crafted for fast-moving founders and marketing teams.
              </p>
            </div>
            <Button asChild>
              <Link href="/services">Browse portfolio</Link>
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {showcaseProjects.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)]/70 bg-[var(--bg)]/90 transition hover:border-[var(--accent)]/60"
              >
                <div className="relative h-44 w-full overflow-hidden bg-[var(--bg-secondary)]">
                  <Image src={item.image} alt={item.title} fill className="object-contain p-6 transition duration-500 group-hover:scale-105" />
                </div>
                <div className="space-y-1 p-4">
                  <p className="text-base font-semibold text-[var(--text-primary)]">{item.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                  <span className="text-xs text-[var(--accent)]">Browse →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
        )}


        <section className="py-20 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-100/80 dark:from-transparent dark:to-[#041F29] overflow-hidden relative">
          <div className="max-w-6xl mx-auto px-6 text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300">
              Trusted by operators worldwide
            </p>
            <h2 className="text-3xl font-semibold mt-3 text-gray-900 dark:text-white">
              Partner stories across industries
            </h2>
          </div>

          {/* Rail 1 */}
          <div className="flex gap-4 animate-scroll-left whitespace-nowrap will-change-transform mb-6">
            {[...partnerLogosRow1, ...partnerLogosRow1].map((logo, index) => (
              <div
                key={`rail1-${logo.src}-${index}`}
                className="rounded-2xl h-20 w-40 md:h-24 md:w-48 bg-gray-900/95 dark:bg-white/5 backdrop-blur-md border border-gray-700 dark:border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-800/95 dark:from-teal-300/5 dark:to-cyan-200/5 shadow-[0_6px_25px_rgba(0,0,0,0.35)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.35)] flex items-center justify-center hover:scale-[1.03] hover:shadow-[0_10px_35px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_10px_35px_rgba(0,0,0,0.45)] transition-all duration-300 flex-shrink-0"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={80}
                  className="max-h-11 md:max-h-10 object-contain opacity-70 dark:opacity-70 hover:opacity-100 mix-blend-screen transition-opacity"
                />
              </div>
            ))}
          </div>

          {/* Rail 2 */}
          <div className="flex gap-4 animate-scroll-right whitespace-nowrap will-change-transform">
            {[...partnerLogosRow2, ...partnerLogosRow2].map((logo, index) => (
              <div
                key={`rail2-${logo.src}-${index}`}
                className="rounded-2xl h-20 w-40 md:h-24 md:w-48 bg-gray-900/95 dark:bg-white/5 backdrop-blur-md border border-gray-700 dark:border-white/10 bg-gradient-to-br from-gray-900/95 to-gray-800/95 dark:from-teal-300/5 dark:to-cyan-200/5 shadow-[0_6px_25px_rgba(0,0,0,0.35)] dark:shadow-[0_6px_25px_rgba(0,0,0,0.35)] flex items-center justify-center hover:scale-[1.03] hover:shadow-[0_10px_35px_rgba(0,0,0,0.45)] dark:hover:shadow-[0_10px_35px_rgba(0,0,0,0.45)] transition-all duration-300 flex-shrink-0"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={180}
                  height={80}
                  className="max-h-11 md:max-h-10 object-contain opacity-70 dark:opacity-70 hover:opacity-100 mix-blend-screen transition-opacity"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Premium CTA Section - Stripe Style */}
        <section data-section className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[32px] border border-[var(--border)]/70 bg-gradient-to-br from-[var(--bg-secondary)]/95 via-[var(--bg-secondary)]/90 to-[var(--bg-secondary)]/85 p-12 md:p-16 shadow-[0_40px_120px_rgba(15,23,42,0.15)] backdrop-blur-xl"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/8 via-transparent to-[var(--accent)]/5 pointer-events-none" />
            
            <div className="relative mx-auto max-w-4xl text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-3xl font-semibold leading-tight text-[var(--text-primary)] md:text-4xl lg:text-5xl">
                  What would your business look like if every lead was answered instantly?
                </h3>
                <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                  Talk to us. We'll show you where Orvia creates the biggest wins in your business.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative inline-block"
              >
                {/* Soft glow behind button */}
                <div className="absolute inset-0 blur-2xl bg-[var(--accent)]/30 rounded-full -z-10" />
                <Button
                  asChild
                  size="lg"
                  className="relative rounded-full px-8 h-12 font-semibold bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent)]/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[var(--accent)]/40"
                >
                  <Link href="/contact">Show me what Orvia can do</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
