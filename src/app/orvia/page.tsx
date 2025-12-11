"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BellRing,
  Bot,
  Briefcase,
  Building2,
  CalendarClock,
  CreditCard,
  DatabaseZap,
  Globe2,
  LaptopMinimal,
  LineChart,
  MessagesSquare,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Timer,
  Shield,
  Key,
  FileCheck,
  Activity,
  Server,
  UsersRound,
  Workflow,
  Monitor,
  Phone,
  MessageCircle,
  Info,
  Check,
} from "lucide-react";

const problemPoints = [
  { text: "Slow replies kill conversions", icon: Timer },
  { text: "Missed DMs and calls go unanswered", icon: BellRing },
  { text: "Manual booking workflows frustrate teams", icon: CalendarClock },
  { text: "Staff gets buried in repetitive questions", icon: MessagesSquare },
  { text: "Customers abandon outdated forms", icon: AlertTriangle },
  { text: "Revenue leaks because responses take too long", icon: LineChart },
];

type IconListItem = {
  label: string;
  icon: LucideIcon;
};

const automationHighlights: IconListItem[] = [
  { label: "Appointment booking with live availability checks", icon: CalendarClock },
  { label: "Payments inside chat via Stripe, Razorpay, or Tap", icon: CreditCard },
  { label: "Real-time product search and recommendations", icon: Search },
  { label: "Lead capture, qualification, and routing", icon: UsersRound },
  { label: "Automatic CRM, POS, and sheet updates", icon: DatabaseZap },
  { label: "Confidence-based handoff to humans", icon: MessagesSquare },
];

const whyDifferent: IconListItem[] = [
  { label: "Performs transactions (books, charges, confirms)", icon: ShieldCheck },
  { label: "Connects to live databases, inventory, and calendars", icon: DatabaseZap },
  { label: "Triggers workflows inside CRM/POS tools automatically", icon: Workflow },
];

const useCases: IconListItem[] = [
  { label: "Clinics & salons", icon: Stethoscope },
  { label: "Real estate teams", icon: Building2 },
  { label: "E-commerce brands", icon: ShoppingBag },
  { label: "Service businesses", icon: Briefcase },
];

const automationColumns: { title: string; icon: LucideIcon; items: IconListItem[] }[] = [
  {
    title: "What it automates",
    icon: CalendarClock,
    items: automationHighlights,
  },
  {
    title: "Why it’s different",
    icon: Sparkles,
    items: whyDifferent,
  },
  {
    title: "Real deployments",
    icon: LaptopMinimal,
    items: useCases,
  },
];

const featureBlocks = [
  { title: "Appointment booking", copy: "Checks live availability, books, reschedules, cancels, and sends reminders.", icon: CalendarClock },
  {
    title: "Payments inside chat",
    copy: "Stripe, Razorpay, and Tap send hosted checkout links inside the conversation—deposits or full payments.",
    icon: CreditCard,
  },
  { title: "Live product catalog search", copy: "Filters by price, size, or attributes and drops deep links with media.", icon: Search },
  { title: "Lead qualification & routing", copy: "Captures contact/budget, scores intent, and routes to CRM or sales chat.", icon: UsersRound },
  { title: "Human handoff", copy: "Escalates on low confidence, gives agents full transcripts, and logs outcomes.", icon: MessagesSquare },
  { title: "Multi-channel support", copy: "Embed on your site, inside apps, and across WhatsApp with one brain.", icon: Bot },
  { title: "Integrations everywhere", copy: "Connects to CRMs, databases, calendars, and payment gateways via APIs.", icon: Workflow },
  { title: "Analytics & reporting", copy: "Tracks sessions, bookings, revenue, top intents, and time saved in one panel.", icon: LineChart },
];

const workflowSteps = [
  "User sends a question via WhatsApp, web, or app widget.",
  "Orvia identifies intent instantly.",
  "It pulls real-time data for availability, inventory, or pricing.",
  "It books, charges, or replies in 4-6 seconds.",
  "If the scenario needs a human, it hands off with full context.",
];

const industries = [
  {
    label: "Clinics & Salons",
    bullets: ["Automatic booking & rescheduling", "Reminders + payments before visits", "Cuts front-desk workload"],
    icon: Stethoscope,
  },
  {
    label: "Real Estate",
    bullets: ["Property discovery + matching", "Tour scheduling & follow-ups", "Lead scoring with instant dossiers"],
    icon: Building2,
  },
  {
    label: "E-commerce",
    bullets: ["Product filtering + price checks", "Cart building + checkout links", "Post-purchase support 24/7"],
    icon: ShoppingBag,
  },
  {
    label: "Service Providers",
    bullets: ["Smart lead capture", "Calendar booking & reminders", "Deposits within the conversation"],
    icon: Briefcase,
  },
];

const differentiators = [
  { text: "Transaction-first design (far beyond FAQ bots)", icon: CreditCard },
  { text: "Multi-currency & localization ready", icon: Globe2 },
  { text: "White-label mode for agencies", icon: ShieldCheck },
  { text: "API-first architecture for POS/ERP/CRM", icon: Workflow },
  { text: "Real-time bookings + payments", icon: CalendarClock },
  { text: "Works across every platform you use", icon: LaptopMinimal },
  { text: "4-6 second average response time", icon: Timer },
  { text: "Enterprise-grade stack and hosting", icon: ShieldCheck },
];

const pricingPlans: {
  title: string;
  price: string;
  subtitle: string;
  icon: LucideIcon;
  highlight?: boolean;
  badge?: string;
  cta: { label: string; href: string };
  features: string[];
}[] = [
    {
      title: "Starter",
      price: "$299/month",
      subtitle: "Free site + 24/7 web AI agent",
      icon: Sparkles,
      cta: { label: "Get Started", href: "/contact" },
      features: ["Your branded website built for conversions", "Booking and scheduling system", "200 conversations every month", "Web AI Agent that responds instantly", "Complete setup done for you"],
    },
    {
      title: "Growth",
      price: "$499/month",
      subtitle: "Most loved by scaling teams",
      badge: "Most Popular",
      highlight: true,
      icon: LineChart,
      cta: { label: "Get Started", href: "/contact" },
      features: ["High-performance website crafted to convert more leads", "Smart booking engine that runs your calendar automatically", "500 conversations every month", "Web AI Agent for nonstop customer handling", "Full setup and optimization"],
    },
    {
      title: "Custom",
      price: "Custom pricing",
      subtitle: "Tailored automations & enterprise",
      icon: Globe2,
      cta: { label: "Contact Team", href: "/contact" },
      features: ["Unlimited conversations", "Web, WhatsApp, and Voice automations", "Custom booking and scheduling system", "Tailored website and customer journey", "Enterprise-grade workflows and integrations", "Payment reminders", "Custom dashboards & reporting"],
    },
  ];

const testimonials = [
  "“Response time dropped to seconds and bookings jumped instantly.”",
  "“Sales team focuses on qualified leads—Orvia handles the rest.”",
  "“We replaced outdated forms and doubled conversion from DMs.”",
];

const securityPoints = [
  { icon: Shield, text: "Bank-level encryption protects every message and file in transit and at rest." },
  { icon: Key, text: "Role-based access controls ensure only approved teammates see sensitive data." },
  { icon: FileCheck, text: "Compliance-friendly logging keeps transcripts and payments audit-ready." },
  { icon: Activity, text: "Live monitoring alerts our team to suspicious behavior before it becomes a risk." },
  { icon: Server, text: "Hardened infrastructure and regional hosting keep your stack resilient." },
];

export default function OrviaPage() {
  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="global-noise" />
      <div className="relative z-10 space-y-16 pb-20 pt-10 text-[var(--text-primary)]">
        {/* AI REVENUE ASSISTANT HERO - FIRST SECTION */}
        <section className="container rounded-[32px] border border-[var(--border)]/70 bg-[var(--bg-secondary)]/70 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.08)] text-[var(--text-primary)]">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="orvia-hero-logo">
              <Image src="/assets/orvia-logo-black.svg" alt="Orvia logo" width={160} height={40} priority />
              <span>AI Revenue Assistant</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-[var(--text-primary)] md:text-5xl">The AI assistant that books, charges, and closes for you</h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Orvia isn't a chatbot. It is a multi-layered AI engine engineered to understand intent, act on workflows, trigger automations, validate responses, and keep conversations grounded in real business logic. Every message is refined, checked, and executed through an intelligence stack purpose-built for reliability.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="#pricing">Pricing</Link>
              </Button>
            </div>
            <p className="uppercase tracking-[0.4em] text-[var(--text-secondary)]">4-6 second responses · 24/7 accuracy · 15–30% more bookings & sales</p>
          </div>
        </section>

        {/* WHERE ORVIA CAN BE EMBEDDED */}
        <section className="container space-y-6 rounded-[32px] border border-[var(--border)]/70 bg-[var(--bg-secondary)]/70 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.08)]">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Deploy anywhere</p>
            <h2 className="text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">Put Orvia Wherever Your Business Talks</h2>
            <p className="mx-auto max-w-2xl text-sm text-[var(--text-secondary)]">One AI agent, multiple channels. Deploy Orvia across your digital touchpoints.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-[var(--border)]/70 bg-[var(--bg)]/50 p-6 text-center transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--bg-secondary)]/80"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <Monitor className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">ORVIA Web</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Embed Orvia directly on your website as a chat widget. Visitors get instant responses without leaving your site.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-[var(--border)]/70 bg-[var(--bg)]/50 p-6 text-center transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--bg-secondary)]/80"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">ORVIA WhatsApp</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Connect Orvia to your WhatsApp Business number. Customers reach you on their favorite messaging platform.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-[var(--border)]/70 bg-[var(--bg)]/50 p-6 text-center transition-all hover:border-[var(--accent)]/50 hover:bg-[var(--bg-secondary)]/80"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">ORVIA Voice</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                Voice-enabled conversations with natural language processing. Orvia handles calls just like chat.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Other sections below */}
        <div className="space-y-16 pt-20">

          {/* Problems Section - Premium Redesign */}
          <section className="container space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Where teams struggle</p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">The real problems Orvia wipes out</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                Manual processes that slow down revenue and frustrate customers.
              </p>
            </motion.div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {problemPoints.map((point, index) => (
                <motion.div
                  key={point.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group relative overflow-hidden border-[var(--border)]/70 bg-[var(--bg-secondary)]/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-lg hover:shadow-[var(--accent)]/10">
                    <CardContent className="flex items-start gap-4 p-5">
                      <motion.span
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/10 text-[var(--accent)] shadow-sm transition-all group-hover:shadow-md group-hover:shadow-[var(--accent)]/20">
                        <point.icon className="h-5 w-5" />
                      </motion.span>
                      <span className="text-sm font-medium leading-relaxed text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{point.text}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Snapshot Section - Premium 3-Column Grid */}
          <section className="container space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Orvia snapshot</p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">Automation built for clinics, real estate, e-commerce, and services</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                Three pillars that make Orvia different from chatbots.
              </p>
            </motion.div>
            <div className="grid gap-6 lg:grid-cols-3">
              {automationColumns.map((block, colIndex) => (
                <motion.div
                  key={block.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: colIndex * 0.15 }}
                >
                  <Card className="group relative h-full overflow-hidden border-[var(--border)]/70 bg-gradient-to-br from-[var(--bg-secondary)]/80 to-[var(--bg-secondary)]/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-[var(--accent)]/50 hover:shadow-xl hover:shadow-[var(--accent)]/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <CardContent className="relative z-10 space-y-5 p-6">
                      <div className="flex items-center gap-3 border-b border-[var(--border)]/30 pb-4">
                        <motion.span
                          whileHover={{ scale: 1.1 }}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/10 text-[var(--accent)] shadow-lg shadow-[var(--accent)]/20"
                        >
                          <block.icon className="h-6 w-6" />
                        </motion.span>
                        <h3 className="text-xl font-semibold text-[var(--text-primary)]">{block.title}</h3>
                      </div>
                      <ul className="space-y-3">
                        {block.items.map((item, itemIndex) => (
                          <motion.li
                            key={item.label}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: colIndex * 0.15 + itemIndex * 0.1 }}
                            className="flex items-start gap-3 rounded-xl border border-[var(--border)]/50 bg-[var(--bg)]/60 p-3 transition-all duration-300 group-hover:border-[var(--accent)]/30 group-hover:bg-[var(--bg)]/80"
                          >
                            <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-[var(--accent)]">
                              <item.icon className="h-4 w-4" />
                            </span>
                            <span className="text-sm leading-relaxed text-[var(--text-secondary)]">{item.label}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Core Capabilities - Premium Grid */}
          <section className="container space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Core capabilities</p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">Feature blocks that power every interaction</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                Everything you need to automate conversations, bookings, and payments.
              </p>
            </motion.div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {featureBlocks.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <Card className="group relative h-full overflow-hidden border-[var(--border)]/70 bg-gradient-to-br from-[var(--bg-secondary)]/90 to-[var(--bg-secondary)]/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/8 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <CardContent className="relative z-10 space-y-3 p-5">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/10 text-[var(--accent)] shadow-md"
                      >
                        <feature.icon className="h-6 w-6" />
                      </motion.div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">{feature.title}</h3>
                      <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{feature.copy}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* How It Works - Premium Timeline */}
          <section className="container space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">How it works</p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">Five steps from query to booked & paid</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                A simple flow that turns conversations into revenue.
              </p>
            </motion.div>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent)]/30 via-[var(--accent)]/20 to-transparent hidden md:block" />
              <ol className="space-y-6">
                {workflowSteps.map((step, index) => (
                  <motion.li
                    key={step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex items-start gap-6 md:gap-8"
                  >
                    <motion.span
                      whileHover={{ scale: 1.15 }}
                      className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] text-white shadow-lg shadow-[var(--accent)]/30 font-semibold text-sm"
                    >
                      {index + 1}
                    </motion.span>
                    <div className="flex-1 space-y-2 pt-2">
                      <p className="text-base leading-relaxed text-[var(--text-secondary)]">{step}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </section>

          {/* Industries - Premium 4-Card Grid */}
          <section className="container space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Industries</p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">Orvia delivers across sectors</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                Proven automation patterns for different business models.
              </p>
            </motion.div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {industries.map((industry, index) => {
                const accentColors = [
                  "from-[var(--accent)]/20 to-[var(--accent)]/5",
                  "from-[var(--accent-hover)]/20 to-[var(--accent-hover)]/5",
                  "from-[var(--accent)]/15 to-[var(--accent)]/5",
                  "from-[var(--accent-hover)]/15 to-[var(--accent-hover)]/5",
                ];
                return (
                  <motion.div
                    key={industry.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group relative h-full overflow-hidden border-[var(--border)]/70 bg-gradient-to-br from-[var(--bg-secondary)]/90 to-[var(--bg-secondary)]/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-lg">
                      <div className={`absolute inset-0 bg-gradient-to-br ${accentColors[index]} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
                      <CardContent className="relative z-10 space-y-4 p-6">
                        <div className="flex items-center gap-3">
                          <motion.span
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/10 text-[var(--accent)] shadow-md"
                          >
                            <industry.icon className="h-6 w-6" />
                          </motion.span>
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">{industry.label}</h3>
                        </div>
                        <ul className="space-y-2.5">
                          {industry.bullets.map((bullet, bulletIndex) => (
                            <motion.li
                              key={bullet}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: index * 0.1 + bulletIndex * 0.05 }}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]" />
                              <span>{bullet}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section className="container space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Why Orvia wins</p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)]">Differentiators teams feel immediately</h2>
            </div>
            <ScrollArea className="rounded-[28px] border border-[var(--border)]/70 bg-[var(--bg-secondary)]/80">
              <div className="grid gap-3 p-6 text-sm text-[var(--text-secondary)] md:grid-cols-2">
                {differentiators.map((diff) => (
                  <div key={diff.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-2xl bg-[var(--accent)]/15 text-[var(--accent)]">
                      <diff.icon className="h-4 w-4" />
                    </span>
                    <span>{diff.text}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </section>

          {/* Pricing Section - Duplicated from Pricing Page */}
          <section id="pricing" className="container space-y-6 scroll-mt-24">
            <div className="space-y-2 text-center">
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Orvia pricing</p>
              <h2 className="text-3xl font-semibold md:text-4xl">Plans built to automate your business from day one</h2>
              <p className="text-sm text-[var(--text-secondary)]">Pricing made simple. Setup done for you. Results that scale with your team.</p>
            </div>
            <TooltipProvider>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {pricingPlans.map((plan) => (
                  <Card
                    key={plan.title}
                    className={`relative overflow-hidden border border-white/60 bg-white/40 shadow-[0_25px_90px_rgba(15,23,42,0.12)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_120px_rgba(15,23,42,0.16)] dark:border-[var(--border)]/70 dark:bg-[var(--bg-secondary)]/70 ${plan.highlight ? "ring-2 ring-[var(--accent)]/70" : ""
                      }`}
                    data-interactive
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/0 dark:from-white/5" />
                    <CardContent className="relative space-y-5 p-6">
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
                        {plan.badge ? (
                          <span className="rounded-full bg-[var(--accent)]/15 px-3 py-1 text-xs font-semibold text-[var(--accent)]">{plan.badge}</span>
                        ) : null}
                      </div>
                      <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                        {plan.features.map((feature) => (
                          <li key={`${plan.title}-${feature}`} className="flex items-center gap-3">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)]/12 text-[var(--accent)]">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                            <span className="flex items-center gap-2">
                              {feature}
                              {(feature === "Your branded website built for conversions" || feature === "High-performance website crafted to convert more leads") && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      type="button"
                                      className="inline-flex items-center justify-center rounded-full text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
                                      aria-label="More information"
                                    >
                                      <Info className="h-4 w-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)]">
                                    <p>Booking or Informative website</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button asChild className="w-full rounded-full" variant={plan.highlight ? "default" : "outline"}>
                        <Link href={plan.cta.href}>{plan.cta.label}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TooltipProvider>
          </section>

          {/* Testimonials - Premium Carousel */}
          <section className="container space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-3 text-center"
            >
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Testimonials</p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">Orvia in the field</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                Real results from teams using Orvia to automate conversations and bookings.
              </p>
            </motion.div>
            <div className="relative overflow-hidden">
              <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory">
                {testimonials.map((quote, index) => (
                  <motion.div
                    key={quote}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="flex-shrink-0 w-full md:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-1.25rem)] snap-start"
                  >
                    <Card className="group relative h-full overflow-hidden border-[var(--border)]/70 bg-gradient-to-br from-[var(--bg-secondary)]/90 to-[var(--bg-secondary)]/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <CardContent className="relative z-10 p-6">
                        <p className="text-base leading-relaxed text-[var(--text-secondary)] italic">{quote}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Security Section - Premium Two-Column Grid */}
          <section className="container space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Security</p>
              <h2 className="text-3xl font-semibold text-[var(--text-primary)] md:text-4xl">Enterprise-grade controls</h2>
              <p className="text-lg text-[var(--text-secondary)] max-w-2xl">
                Built with security and compliance at the core.
              </p>
            </motion.div>
            <div className="grid gap-5 md:grid-cols-2">
              {securityPoints.map((point, index) => (
                <motion.div
                  key={point.text}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group relative h-full overflow-hidden border-[var(--border)]/70 bg-gradient-to-br from-[var(--bg-secondary)]/90 to-[var(--bg-secondary)]/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40 hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <CardContent className="relative z-10 flex items-start gap-4 p-6">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/10 text-[var(--accent)] shadow-md"
                      >
                        <point.icon className="h-6 w-6" />
                      </motion.span>
                      <p className="text-sm leading-relaxed text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{point.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="container rounded-[32px] border border-[var(--border)]/70 bg-[var(--bg-secondary)]/70 p-8 text-center shadow-[0_40px_120px_rgba(15,23,42,0.08)]">
            <div className="flex flex-col items-center space-y-4">
              <div className="orvia-watermark">
                <Image src="/assets/orvia-logo-black.svg" alt="Orvia crest" width={96} height={26} />
              </div>
              <h3 className="text-3xl font-semibold">Deploy Orvia and capture every opportunity</h3>
              <p className="text-sm text-[var(--text-secondary)]">Book a full walkthrough or try a live demo with Orvia.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild className="rounded-full">
                  <Link href="/contact">Book Demo</Link>
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
