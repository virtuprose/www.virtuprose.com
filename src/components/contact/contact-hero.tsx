"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { OrviaOpenChatButton } from "@/components/orvia-open-chat-button";

export function ContactHero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-6 py-20 text-center"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xs uppercase tracking-[0.55em] text-[var(--text-subheading)] mb-4"
      >
        Implement Orvia AI in your business
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-8 text-[var(--text-heading)] flex items-center justify-center gap-2 flex-wrap"
      >
        Talk to{" "}
        <span className="inline-flex items-center">
          <Image
            src="/assets/orvia-logo-black.svg"
            alt="Orvia"
            width={120}
            height={32}
            className="dark:invert h-6 md:h-7 lg:h-8 w-auto"
          />
        </span>{" "}
        or book time with the team.
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <OrviaOpenChatButton
          label="Chat With Orvia"
          className="rounded-full h-11 px-6 bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent)]/30"
        />
        <Button
          onClick={() => scrollToSection("book-call")}
          variant="outline"
          className="rounded-full h-11 px-6 border-[var(--text-heading)]/25 text-[var(--text-heading)]/80 hover:border-[var(--text-heading)]/40 hover:text-[var(--text-heading)]"
        >
          Book a Strategy Call
        </Button>
      </motion.div>
    </motion.section>
  );
}

