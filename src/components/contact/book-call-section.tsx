"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export function BookCallSection() {
  useEffect(() => {
    // Cal.com inline embed initialization
    if (typeof window !== "undefined" && !(window as any).Cal) {
      (function (C: any, A: string, L: string) {
        let p = function (a: any, ar: any) {
          a.q.push(ar);
        };
        let d = C.document;
        C.Cal = C.Cal || function () {
          let cal = C.Cal;
          let ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement("script")).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api: any = function () {
              p(api, arguments);
            };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === "string") {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ["initNamespace", namespace]);
            } else p(cal, ar);
            return;
          }
          p(cal, ar);
        };
      })(window, "https://app.cal.com/embed/embed.js", "init");

      (window as any).Cal("init", "30min", { origin: "https://app.cal.com" });

      (window as any).Cal.ns["30min"]("inline", {
        elementOrSelector: "#my-cal-inline-30min",
        config: { layout: "month_view" },
        calLink: "virtuprose/30min",
      });

      (window as any).Cal.ns["30min"]("ui", {
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    }
  }, []);

  return (
    <section id="book-call" className="max-w-6xl mx-auto px-6 py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6"
      >
        <p className="text-xs uppercase tracking-[0.55em] text-[var(--text-subheading)]">
          Prefer a human conversation?
        </p>

        <h2 className="text-3xl font-semibold md:text-4xl text-[var(--text-heading)]">
          Book a strategy call with our team
        </h2>

        <p className="text-lg text-[var(--text-subheading)] max-w-2xl mx-auto">
          Schedule a 30-minute call to discuss implementing Orvia in your business, explore AI automation opportunities, integrations with your existing tools, or get expert guidance on scaling revenue with AI.
        </p>

        {/* Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            Orvia Implementation
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            AI Automation
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            Revenue Growth
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20">
            Integrations
          </span>
        </div>

        {/* Scheduler Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <div className="rounded-2xl dark:bg-white/5 dark:border-white/10 dark:text-white bg-white border-gray-300 text-gray-900 border shadow-md p-6">
            <div className="h-[520px] w-full overflow-hidden rounded-2xl bg-[var(--bg)] dark:bg-[var(--bg-secondary)]">
              {/* Cal.com Inline Embed */}
              <div
                id="my-cal-inline-30min"
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "scroll",
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

