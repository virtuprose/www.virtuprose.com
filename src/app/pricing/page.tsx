'use client';

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Check,
  Globe2,
  LineChart,
  Sparkles,
  Info,
  Calendar,
  Users,
  Bell,
  MessageSquare,
  Zap,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA: VALUE BLOCKS (MONEY SAVED)
// ─────────────────────────────────────────────────────────────────────────────
const valueBlocks = [
  {
    icon: Calendar,
    savings: "$150–$300",
    label: "Booking System",
    tooltip: "You no longer need Calendly or a paid scheduling tool. Orvia handles multi-specialist bookings automatically.",
  },
  {
    icon: Users,
    savings: "$200–$400",
    label: "Lead Management",
    tooltip: "Orvia captures, qualifies, routes, and follows up on leads — replacing manual work or extra staff.",
  },
  {
    icon: Bell,
    savings: "$50–$100",
    label: "Reminder & No-Show System",
    tooltip: "Automated reminders reduce no-shows without needing a dedicated tool.",
  },
  {
    icon: MessageSquare,
    savings: "$300–$700",
    label: "AI FAQ & Customer Support",
    tooltip: "Orvia answers repeated questions 24/7, replacing the need for a support assistant.",
  },
  {
    icon: Zap,
    savings: "$200–$500",
    label: "Sales Follow-Ups",
    tooltip: "Orvia follows up automatically, turning lost inquiries into booked appointments.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DATA: PRICING PLANS
// ─────────────────────────────────────────────────────────────────────────────
type Feature = {
  text: string;
  tooltip: string;
};

type Plan = {
  title: string;
  price: string;
  subtitle: string;
  badge?: string;
  highlight?: boolean;
  icon: React.ElementType;
  cta: { label: string; href: string };
  includesFrom?: string;
  features: Feature[];
  controlCenterFeatures: string[];
  controlCenterMicroline: string;
};

const plans: Plan[] = [
  {
    title: "Starter",
    price: "$300/month",
    subtitle: "For businesses automating their daily lead flow",
    icon: Sparkles,
    cta: { label: "Get Started", href: "/contact" },
    features: [
      { text: "Up to 200 automated conversations", tooltip: "Enough for most small businesses to automate daily inquiries." },
      { text: "24/7 lead capture + instant replies", tooltip: "Never lose a lead again." },
      { text: "Smart booking engine with reminders", tooltip: "Reduces no-shows automatically." },
      { text: "Automatic follow-ups", tooltip: "Orvia nudges leads who don't respond." },
      { text: "AI-driven FAQs", tooltip: "Cuts repetitive questions." },
      { text: "Lead qualification", tooltip: "Filters serious customers." },
      { text: "Spam filtering", tooltip: "Keeps lead lists clean." },
      { text: "Done-for-you setup", tooltip: "Go live without touching any tech." },
    ],
    controlCenterFeatures: [
      "View and manage all leads and conversations",
      "Manage bookings, schedules, and reminders",
      "See basic performance insights",
    ],
    controlCenterMicroline: "Designed for daily lead flow and simple visibility.",
  },
  {
    title: "Growth",
    price: "$499/month",
    subtitle: "For teams ready to scale without increasing staff",
    badge: "Most Popular",
    highlight: true,
    icon: LineChart,
    cta: { label: "Get Started", href: "/contact" },
    includesFrom: "Everything in Starter, plus:",
    features: [
      { text: "Up to 500 automated conversations", tooltip: "Ideal for growing traffic." },
      { text: "Higher-conversion landing system", tooltip: "Optimized for more bookings." },
      { text: "Advanced booking automation", tooltip: "Manages availability + reminders." },
      { text: "No-show reduction sequences", tooltip: "Fewer missed appointments." },
      { text: "Faster, smarter AI agent", tooltip: "Better handling of complex inquiries." },
      { text: "Lead scoring + pre-screening", tooltip: "Identifies hot leads." },
      { text: "Smart routing", tooltip: "Sends leads to right services/staff." },
      { text: "Ongoing optimization", tooltip: "Monthly tuning for performance." },
    ],
    controlCenterFeatures: [
      "Everything in Starter",
      "Advanced performance insights and trends",
      "Lead quality and booking outcome visibility",
      "Smarter routing and optimization controls",
    ],
    controlCenterMicroline: "Built for teams focused on growth and efficiency.",
  },
  {
    title: "Custom",
    price: "Custom Pricing",
    subtitle: "Full automation for high-volume or multi-location operations",
    icon: Globe2,
    cta: { label: "Contact Team", href: "/contact" },
    includesFrom: "Everything in Growth, plus:",
    features: [
      { text: "Unlimited conversations", tooltip: "Ideal for chains and high traffic." },
      { text: "Web, WhatsApp, and Voice automations", tooltip: "Capture leads from everywhere." },
      { text: "Custom landing + journey", tooltip: "Matches your unique workflow." },
      { text: "Multi-specialist booking system", tooltip: "Staff-wise and service-wise scheduling." },
      { text: "Multi-location logic", tooltip: "Perfect for franchises." },
      { text: "CRM + tool integrations", tooltip: "Connect Odoo, Zoho, HubSpot, etc." },
      { text: "Enterprise workflows", tooltip: "Automate complex operations." },
      { text: "Dedicated success partner", tooltip: "Human support monthly." },
    ],
    controlCenterFeatures: [
      "Everything in Growth",
      "Full analytics and custom reporting",
      "Multi-location and multi-specialist visibility",
      "Workflow-level controls and integrations",
    ],
    controlCenterMicroline: "For high-volume or complex operations.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="global-noise" aria-hidden="true" />
      <div className="relative z-10 space-y-16 pb-24 pt-12">
        <PricingHero />
        <ValueBreakdown />
        <PricingGrid />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
function PricingHero() {
  return (
    <section className="container">
      <div className="relative overflow-hidden rounded-[32px] border border-[var(--border)]/70 bg-[linear-gradient(135deg,#5AA5CC_0%,#27E7EC_45%,#14A8BC_100%)] p-10 shadow-[0_30px_100px_rgba(2,53,96,0.18)] dark:bg-[radial-gradient(circle_at_75%_50%,rgba(39,231,236,0.18)_0%,transparent_52%),radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.05)_0%,transparent_58%),linear-gradient(145deg,#07141d_0%,#050d14_100%)] dark:shadow-[0_8px_18px_rgba(0,0,0,0.45),0_0_22px_rgba(39,231,236,0.15)]">
        <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-on-dark)]/80 dark:text-[var(--text-on-dark)]/60">Pricing</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl text-[var(--text-on-dark)]">Built for teams who want growth without hiring more people</h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-on-dark)]/85">
          Pick your Orvia plan and we'll configure the entire system for you. No forms, no friction, just instant operational power.
        </p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VALUE BREAKDOWN SECTION (MONEY SAVED)
// ─────────────────────────────────────────────────────────────────────────────
function ValueBreakdown() {
  return (
    <TooltipProvider delayDuration={100}>
      <section className="container space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">See how much you save with Orvia each month</p>
        </div>

        {/* Value Blocks Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {valueBlocks.map((block) => (
            <Tooltip key={block.label}>
              <TooltipTrigger asChild>
                <div
                  className="group relative cursor-pointer rounded-2xl border border-[var(--border)]/60 bg-white/50 p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[var(--accent)]/40 dark:bg-[var(--bg-secondary)]/50"
                >
                  {/* Icon */}
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] transition-transform duration-300 group-hover:scale-110">
                    <block.icon className="h-5 w-5" />
                  </div>
                  {/* Savings */}
                  <p className="text-xl font-bold text-[var(--text-primary)]">{block.savings}</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">monthly</p>
                  {/* Label */}
                  <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{block.label}</p>
                  {/* Info Icon */}
                  <Info className="absolute top-3 right-3 h-4 w-4 text-[var(--text-secondary)]/50 group-hover:text-[var(--accent)] transition-colors" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] p-3">
                <p className="text-sm">{block.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Summary Line */}
        <div className="text-center pt-4">
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            Most businesses save <span className="text-[var(--accent)]">$500–$1,500</span> every month by switching to Orvia.
          </p>
        </div>
      </section>
    </TooltipProvider>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING GRID
// ─────────────────────────────────────────────────────────────────────────────
function PricingGrid() {
  return (
    <section className="container space-y-8" id="orvia-pricing">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Orvia pricing</p>
        <h2 className="text-3xl font-semibold md:text-4xl">Plans built to automate your business from day one</h2>
        <p className="text-sm text-[var(--text-secondary)]">Pricing made simple. Setup done for you. Results that scale with your team.</p>
        <p className="mt-4 text-base text-[var(--text-primary)]">
          <span className="font-semibold">Meet the Orvia Control Center.</span>{" "}
          <span className="text-[var(--text-secondary)]">Your private dashboard to manage leads, bookings, and performance in real time.</span>
        </p>
      </div>
      <TooltipProvider delayDuration={100}>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.title} plan={plan} />
          ))}
        </div>
      </TooltipProvider>
      {/* Confidence Strip */}
      <p className="text-center text-sm text-[var(--text-secondary)] pt-6">
        Every Orvia plan includes access to the Orvia Control Center. No black boxes. You always know what's happening in your business.
      </p>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING CARD COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function PricingCard({ plan }: { plan: Plan }) {
  return (
    <Card
      className={`relative overflow-hidden border border-white/60 bg-white/40 shadow-[0_25px_90px_rgba(15,23,42,0.12)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_120px_rgba(15,23,42,0.16)] dark:border-[var(--border)]/70 dark:bg-[var(--bg-secondary)]/70 ${plan.highlight ? "ring-2 ring-[var(--accent)]/70" : ""
        }`}
      data-interactive
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/0 dark:from-white/5" />
      <CardContent className="relative space-y-5 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
              <plan.icon className="h-5 w-5" />
            </span>
            <div className="space-y-1">
              <p className="text-lg font-semibold text-[var(--text-primary)]">{plan.title}</p>
              <p className="text-sm text-[var(--text-secondary)]">{plan.subtitle}</p>
              <p className="text-2xl font-semibold text-[var(--text-primary)]">{plan.price}</p>
            </div>
          </div>
          {plan.badge && (
            <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent)]">{plan.badge}</span>
          )}
        </div>

        {/* Includes From */}
        {plan.includesFrom && (
          <p className="text-xs font-medium text-[var(--accent)] border-b border-[var(--border)]/50 pb-3">{plan.includesFrom}</p>
        )}

        {/* Features List */}
        <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
          {plan.features.map((feature) => (
            <li key={feature.text} className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/12 text-[var(--accent)] mt-0.5">
                <Check className="h-3 w-3" />
              </span>
              <span className="flex-1 flex items-center gap-1.5 flex-wrap">
                <span>{feature.text}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-full text-[var(--text-secondary)]/60 hover:text-[var(--accent)] transition-colors"
                      aria-label="More information"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] p-3">
                    <p className="text-sm">{feature.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </span>
            </li>
          ))}
        </ul>

        {/* Orvia Control Center Access */}
        <div className="border-t border-[var(--border)]/50 pt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">Orvia Control Center Access</p>
          <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
            {plan.controlCenterFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/12 text-[var(--accent)] mt-0.5">
                  <Check className="h-2.5 w-2.5" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs italic text-[var(--text-secondary)]/80">{plan.controlCenterMicroline}</p>
        </div>

        {/* CTA Button */}
        <Button asChild className="w-full rounded-full" variant={plan.highlight ? "default" : "outline"}>
          <Link href={plan.cta.href}>{plan.cta.label}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
