"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Fade + rise when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered word-by-word headline reveal. Each word slides up from a mask.
 * The full sentence stays in the DOM for screen readers via aria-label.
 */
export function SplitHeading({
  text,
  className,
  delay = 0,
  as = "h2",
  onMount = false,
  accentWords = [],
  id,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3";
  /** true = animate on load (hero); false = animate when scrolled into view */
  onMount?: boolean;
  /** words (without punctuation, lowercase) rendered in the accent colour */
  accentWords?: string[];
  id?: string;
}) {
  const reduce = useReducedMotion();
  const Comp = as === "h1" ? motion.h1 : as === "h3" ? motion.h3 : motion.h2;
  const words = text.split(" ");
  const trigger = onMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "-80px" } };

  return (
    <Comp
      id={id}
      aria-label={text}
      className={cn("display-xl", className)}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.07, delayChildren: delay } },
      }}
    >
      {words.map((w, i) => {
        const accent = accentWords.includes(w.toLowerCase().replace(/[^a-z']/g, ""));
        return (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.08em] align-bottom"
          >
            <motion.span
              className={cn("inline-block", accent && "text-accent")}
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: { y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
              }}
            >
              {w}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        );
      })}
    </Comp>
  );
}

export function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.28em] text-muted">
      <span className="text-accent">{index}</span>
      <span className="h-px w-10 bg-line" aria-hidden="true" />
      {children}
    </p>
  );
}
