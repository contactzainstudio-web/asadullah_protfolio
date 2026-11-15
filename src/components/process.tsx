"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { EASE } from "@/lib/motion";
import { Reveal, SectionLabel, SplitHeading } from "@/components/ui/reveal";

const STEPS = [
  { n: "01", title: "Discover", body: "Understand the client's vision, goals, audience, and creative direction." },
  { n: "02", title: "Edit", body: "Build the story using pacing, visuals, transitions, music, and sound." },
  { n: "03", title: "Refine", body: "Polish the edit with revisions, color correction, motion graphics, and finishing touches." },
  { n: "04", title: "Deliver", body: "Export and deliver the final video in the agreed format." },
];

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="process" tabIndex={-1} aria-labelledby="process-title" className="relative border-t border-line bg-bg py-24 outline-none sm:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <header className="mb-16 lg:mb-24">
          <Reveal>
            <SectionLabel index="04">Process</SectionLabel>
          </Reveal>
          <SplitHeading id="process-title" text="From idea to final frame." className="mt-5 max-w-[14ch] text-[clamp(2.8rem,8vw,7.5rem)]" accentWords={["final"]} />
        </header>

        <div className="relative">
          {/* connecting line: vertical on mobile, horizontal on lg */}
          <div aria-hidden="true" className="absolute left-[22px] top-3 h-[calc(100%-24px)] w-px bg-line lg:left-0 lg:top-[22px] lg:h-px lg:w-full" />
          <motion.div
            aria-hidden="true"
            style={{ scaleY: progress }}
            className="absolute left-[22px] top-3 h-[calc(100%-24px)] w-px origin-top bg-accent lg:hidden"
          />
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress }}
            className="absolute left-0 top-[22px] hidden h-px w-full origin-left bg-accent lg:block"
          />

          <ol ref={ref} className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
                className="group relative pl-16 lg:pl-0 lg:pt-20"
              >
                <span className="absolute left-0 top-0 grid size-11 place-items-center rounded-full border border-line bg-bg font-display text-sm font-bold text-accent transition-all duration-300 group-hover:scale-110 group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
                  {s.n}
                </span>
                <h3 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">{s.title}</h3>
                <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-muted">{s.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
