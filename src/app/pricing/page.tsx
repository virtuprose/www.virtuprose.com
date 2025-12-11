'use client';

import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Globe2,
  LineChart,
  Sparkles,
  Info,
} from "lucide-react";

type Plan = {
  title: string;
  price: string;
  subtitle: string;
  badge?: string;
  highlight?: boolean;
  icon: React.ElementType;
  cta: { label: string; href: string };
  features: string[];
};

type FormState = {
  services: string[];
  fullName: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  projectTitle: string;
  projectDescription: string;
  startTimeline: string;
  budget: string;
  brandAssets: string;
  techDocs: string;
  comments: string;
};

const plans: Plan[] = [
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

const servicePills = [
  "Digital Marketing",
  "Web Development",
  "UI/UX",
  "Mobile Apps",
  "Orvia AI Agent",
  "Custom Automation",
];

const timelineOptions = ["ASAP (within 1 month)", "1-3 months", "3-6 months", "6+ months", "Flexible / Not sure"];
const budgetOptions = ["Under $5k", "$5k - $10k", "$10k - $25k", "$25k - $50k", "$50k - $100k", "$100k+", "Not sure yet"];

const initialForm: FormState = {
  services: [],
  fullName: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  projectTitle: "",
  projectDescription: "",
  startTimeline: "",
  budget: "",
  brandAssets: "",
  techDocs: "",
  comments: "",
};

const inputClass =
  "rounded-2xl border border-[var(--border)] bg-white/70 px-4 py-3 text-[var(--text-primary)] shadow-[0_10px_30px_rgba(15,23,42,0.04)] focus:border-[var(--accent)] focus:outline-none dark:bg-[var(--bg-secondary)]/70";

export default function PricingPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ success?: string; error?: string }>({});

  const steps = useMemo(
    () => [
      { title: "What do you need?", description: "Pick the services you want to explore." },
      { title: "Project info", description: "Tell us who you are and what you’re building." },
      { title: "Timeline & budget", description: "Share timing and budget signals." },
      { title: "Assets & requirements", description: "Context that helps us scope faster." },
      { title: "Review & submit", description: "Confirm details before sending." },
    ],
    [],
  );

  const handleToggle = (service: string) => {
    setForm((prev) => {
      const exists = prev.services.includes(service);
      return { ...prev, services: exists ? prev.services.filter((s) => s !== service) : [...prev.services, service] };
    });
  };

  const updateField =
    (field: keyof FormState) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
      };

  const validateStep = (current: number) => {
    if (current === 0) return form.services.length > 0;
    if (current === 1)
      return Boolean(form.fullName && form.email && form.company && form.projectTitle && form.projectDescription.trim().length >= 10);
    if (current === 2) return Boolean(form.startTimeline && form.budget);
    if (current === 3) return Boolean(form.brandAssets && form.techDocs && form.comments.trim().length >= 10);
    return true;
  };

  const next = () => {
    if (!validateStep(step)) {
      setToast({ error: "Please complete this step before continuing." });
      return;
    }
    setToast({});
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const back = () => {
    setToast({});
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setToast({});
    if (!validateStep(3)) {
      setToast({ error: "Please complete the required fields." });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        timeline: form.startTimeline,
        techSpecs: form.techDocs,
      };
      const response = await fetch("/api/custom-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Unable to submit. Please try again.");
      setToast({ success: "Thank you! We received your request and will reply within 24 hours." });
      setForm(initialForm);
      setStep(0);
    } catch (error) {
      setToast({ error: error instanceof Error ? error.message : "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg)] text-[var(--text-primary)]">
      <div className="global-noise" aria-hidden="true" />
      <div className="relative z-10 space-y-12 pb-20 pt-12">
        <PricingHero />
        <PricingGrid />
        {/* PROJECT REQUEST SECTION - HIDDEN FOR NOW */}
        {/* <section className="container space-y-6">
          <div className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Project request</p>
            <h2 className="text-3xl font-semibold md:text-4xl">Tell us what to build</h2>
            <p className="text-sm text-[var(--text-secondary)]">A guided, lightweight flow so we can scope quickly.</p>
          </div>
          <div className="rounded-[32px] border border-[var(--border)]/70 bg-[var(--bg-secondary)]/90 px-4 py-6 shadow-[0_40px_140px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10">
            <Stepper steps={steps} activeStep={step} />
            <div className="mt-6 space-y-6">
              {toast.error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {toast.error}
                </div>
              ) : null}
              {toast.success ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
                  {toast.success}
                </div>
              ) : null}

              {step === 0 && <StepServices services={servicePills} selected={form.services} onToggle={handleToggle} />}
              {step === 1 && <StepProject form={form} onChange={updateField} />}
              {step === 2 && <StepBudget form={form} onChange={updateField} />}
              {step === 3 && <StepAssets form={form} onChange={updateField} />}
              {step === 4 && <ReviewSubmit form={form} />}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-[var(--text-secondary)]">We reply within 24 hours. No spam.</div>
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-full" onClick={back} disabled={step === 0 || submitting}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  {step < steps.length - 1 ? (
                    <Button className="rounded-full" onClick={next} disabled={submitting}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button className="rounded-full" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit request"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section> */}
      </div>
    </div>
  );
}

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

function PricingGrid() {
  return (
    <section className="container space-y-6" id="orvia-pricing">
      <div className="space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-secondary)]">Orvia pricing</p>
        <h2 className="text-3xl font-semibold md:text-4xl">Plans built to automate your business from day one</h2>
        <p className="text-sm text-[var(--text-secondary)]">Pricing made simple. Setup done for you. Results that scale with your team.</p>
      </div>
      <TooltipProvider>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard key={plan.title} plan={plan} />
          ))}
        </div>
      </TooltipProvider>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <Card
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
                {feature === "Free website included" && (
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
  );
}

function Stepper({ steps, activeStep }: { steps: { title: string; description: string }[]; activeStep: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-5">
      {steps.map((item, index) => {
        const isActive = index === activeStep;
        const isComplete = index < activeStep;
        return (
          <div
            key={item.title}
            className={`rounded-2xl border px-4 py-3 transition text-[var(--text-primary)] ${isActive
                ? "border-[var(--accent)]/70 bg-[var(--accent)]/12"
                : "border-[var(--border)]/70 bg-[var(--bg-secondary)]/80"
              }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border ${isActive || isComplete
                    ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
                    : "border-[var(--border)]/70 text-[var(--text-secondary)]"
                  }`}
              >
                {isComplete ? <Check className="h-4 w-4" /> : index + 1}
              </span>
              {item.title}
            </div>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">{item.description}</p>
          </div>
        );
      })}
    </div>
  );
}

function StepServices({
  services,
  selected,
  onToggle,
}: {
  services: string[];
  selected: string[];
  onToggle: (service: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">What do you need?</h3>
        <p className="text-sm text-[var(--text-secondary)]">Pick all that apply.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        {services.map((service) => {
          const active = selected.includes(service);
          return (
            <button
              key={service}
              type="button"
              onClick={() => onToggle(service)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${active
                  ? "border-[3px] border-[var(--accent)] bg-[var(--accent)]/12 text-[var(--accent)] shadow-[0_10px_30px_rgba(92,99,255,0.28)]"
                  : "border border-[var(--border)]/80 bg-[var(--bg-secondary)]/80 text-[var(--text-primary)] hover:border-[var(--accent)]/60 hover:text-[var(--accent)]"
                }`}
            >
              {service}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepProject({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">Project info</h3>
        <p className="text-sm text-[var(--text-secondary)]">Share the essentials so we can tailor next steps.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full Name" required>
          <input className={inputClass} value={form.fullName} onChange={onChange("fullName")} placeholder="John Doe" />
        </Field>
        <Field label="Email" required>
          <input className={inputClass} value={form.email} onChange={onChange("email")} placeholder="you@company.com" type="email" />
        </Field>
        <Field label="Phone">
          <input className={inputClass} value={form.phone} onChange={onChange("phone")} placeholder="+1 (555) 000-0000" type="tel" />
        </Field>
        <Field label="Company" required>
          <input className={inputClass} value={form.company} onChange={onChange("company")} placeholder="Your Company" />
        </Field>
        <Field label="Website">
          <input className={inputClass} value={form.website} onChange={onChange("website")} placeholder="https://yourwebsite.com" type="url" />
        </Field>
        <Field label="Project Title" required>
          <input className={inputClass} value={form.projectTitle} onChange={onChange("projectTitle")} placeholder="E.g., AI concierge for bookings" />
        </Field>
      </div>
      <Field label="Short project description" required>
        <textarea
          className={`${inputClass} min-h-[140px]`}
          value={form.projectDescription}
          onChange={onChange("projectDescription")}
          placeholder="Tell us about goals, key features, and what success looks like. (min 10 characters)"
        />
      </Field>
    </div>
  );
}

function StepBudget({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (field: keyof FormState) => (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">Timeline & budget</h3>
        <p className="text-sm text-[var(--text-secondary)]">Helps us propose realistic scope and speed.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="When do you want to start?" required>
          <select className={inputClass} value={form.startTimeline} onChange={onChange("startTimeline")}>
            <option value="">Select start</option>
            {timelineOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
        <Field label="Budget range" required>
          <select className={inputClass} value={form.budget} onChange={onChange("budget")}>
            <option value="">Select budget</option>
            {budgetOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

function StepAssets({
  form,
  onChange,
}: {
  form: FormState;
  onChange: (field: keyof FormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const radios = [
    {
      label: "Do you have brand assets?",
      field: "brandAssets" as const,
      options: ["Yes, full brand kit", "Some assets (logo/colors)", "No, need branding help"],
    },
    {
      label: "Do you have technical documentation?",
      field: "techDocs" as const,
      options: ["Yes, detailed specs", "Partial specs", "No, need help defining"],
    },
  ];
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">Assets & requirements</h3>
        <p className="text-sm text-[var(--text-secondary)]">Add context so we can get specific fast.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {radios.map((group) => (
          <div key={group.field} className="space-y-3 rounded-2xl border border-[var(--border)]/70 bg-white/60 p-4 dark:bg-[var(--bg-secondary)]/70">
            <p className="text-sm font-semibold text-[var(--text-primary)]">{group.label}</p>
            <div className="space-y-2">
              {group.options.map((option) => (
                <label
                  key={option}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${form[group.field] === option
                      ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]"
                      : "border-[var(--border)]/70 text-[var(--text-secondary)]"
                    }`}
                >
                  <input
                    type="radio"
                    className="accent-[var(--accent)]"
                    value={option}
                    checked={form[group.field] === option}
                    onChange={onChange(group.field)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Field label="Additional comments" required>
        <textarea
          className={`${inputClass} min-h-[120px]`}
          value={form.comments}
          onChange={onChange("comments")}
          placeholder="Links, references, success metrics, or anything else we should know. (min 10 characters)"
        />
      </Field>
    </div>
  );
}

function ReviewSubmit({ form }: { form: FormState }) {
  const summary = [
    { label: "Services", value: form.services.join(", ") || "Not selected" },
    { label: "Name", value: form.fullName || "—" },
    { label: "Email", value: form.email || "—" },
    { label: "Company", value: form.company || "—" },
    { label: "Website", value: form.website || "—" },
    { label: "Project", value: form.projectTitle || "—" },
    { label: "Start", value: form.startTimeline || "—" },
    { label: "Budget", value: form.budget || "—" },
    { label: "Brand assets", value: form.brandAssets || "—" },
    { label: "Tech docs", value: form.techDocs || "—" },
  ];
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-xl font-semibold">Review & submit</h3>
        <p className="text-sm text-[var(--text-secondary)]">Quick check before sending.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-[var(--border)]/70 bg-white/60 px-4 py-3 dark:bg-[var(--bg-secondary)]/70">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-secondary)]">{item.label}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-[var(--border)]/70 bg-white/60 p-4 text-sm text-[var(--text-secondary)] dark:bg-[var(--bg-secondary)]/70">
        <p className="font-semibold text-[var(--text-primary)]">Project description</p>
        <p className="mt-2 whitespace-pre-line">{form.projectDescription || "Not provided yet (min 10 characters required)."}</p>
        {form.comments ? (
          <>
            <p className="mt-4 font-semibold text-[var(--text-primary)]">Additional comments</p>
            <p className="mt-2 whitespace-pre-line">{form.comments}</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-[var(--text-secondary)]">
      <span className="text-[var(--text-primary)]">
        {label} {required ? <span className="text-red-500" aria-hidden="true">*</span> : null}
      </span>
      {children}
    </label>
  );
}
