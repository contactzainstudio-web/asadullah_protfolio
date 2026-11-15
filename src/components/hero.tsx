"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SITE } from "@/data/site";
import { projects } from "@/data/projects";
import { EASE } from "@/lib/motion";
import { goTo } from "@/lib/scroll";
import { ctaClass } from "@/components/ui/cta-button";
import { Magnetic } from "@/components/ui/magnetic";
import { SplitHeading } from "@/components/ui/reveal";
import { ArrowDown, ArrowUpRight } from "lucide-react";

// Real frames from the portfolio, arranged as a cinematic contact strip.
const FRAMES = ["viral-car-edit", "mub-next-final", "football-2", "wedding-lu-3", "mubashir-final-video", "photoshop"]
  .map((slug) => projects.find((p) => p.slug === slug)!)
  .filter(Boolean);

function Frame({ slug, index }: { slug: string; index: number }) {
  const p = projects.find((x) => x.slug === slug)!;
  return (
    <div className="relative aspect-[9/16] w-[34vw] max-w-[190px] shrink-0 overflow-hidden rounded-md border border-white/10 bg-surface sm:w-[22vw] lg:w-[15vw]">
      <Image
        src={p.thumbnail}
        alt=""
        fill
        sizes="(min-width:1024px) 15vw, 190px"
        className="object-cover"
        priority={index < 3}
      />
      <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-fg/80">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const stripY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const stripY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-34%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const col = (offset: number[]) => offset.map((i) => FRAMES[i % FRAMES.length].slug);

  return (
    <section
      ref={ref}
      id="home"
      tabIndex={-1}
      className="grain relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-bg pb-14 pt-28 outline-none sm:pb-16 lg:pb-20"
    >
      {/* Cinematic backdrop: parallax columns of real project frames, heavily darkened */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-6 top-0 flex h-[130%] gap-3 sm:right-0 sm:gap-4 lg:right-[3%] lg:gap-5">
          <motion.div style={{ y: stripY }} className="relative flex flex-col gap-3 pt-24 sm:gap-4 lg:gap-5">
            <div className="sprockets-v absolute -left-2 top-0 h-full w-1.5 opacity-60" />
            {col([0, 1, 2]).map((s, i) => (
              <Frame key={s} slug={s} index={i} />
            ))}
          </motion.div>
          <motion.div style={{ y: stripY2 }} className="relative flex flex-col gap-3 pt-0 sm:gap-4 lg:gap-5">
            <div className="sprockets-v absolute -left-2 top-0 h-full w-1.5 opacity-60" />
            {col([3, 4, 5]).map((s, i) => (
              <Frame key={s} slug={s} index={i + 3} />
            ))}
          </motion.div>
        </div>
        {/* readability scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/90 to-bg/30 sm:via-bg/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/70" />
        <div className="absolute inset-y-0 left-0 w-full bg-bg/40 sm:hidden" />
      </div>

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12"
      >
        <motion.p
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          className="mb-6 flex items-center gap-3 font-display text-xs font-medium uppercase tracking-[0.3em] text-muted sm:mb-8"
        >
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          Video Editor &amp; Motion Designer
        </motion.p>

        <SplitHeading
          as="h1"
          onMount
          delay={0.2}
          text="I turn raw footage into stories that hit."
          accentWords={["hit"]}
          className="max-w-[16ch] text-[clamp(2.9rem,10.2vw,9.25rem)]"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
          className="mt-7 max-w-xl text-base leading-relaxed text-fg/75 sm:text-lg"
        >
          {SITE.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1.25 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <Magnetic className="sm:inline-block">
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                goTo("work");
              }}
              className={ctaClass("primary", "w-full sm:w-auto")}
            >
              Explore my work
              <ArrowDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </Magnetic>
          <Magnetic className="sm:inline-block">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                goTo("contact");
              }}
              className={ctaClass("ghost", "w-full bg-bg/40 backdrop-blur-sm sm:w-auto")}
            >
              Let&apos;s work together
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </Magnetic>
        </motion.div>

        {/* Timeline motif + scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-14 flex items-end justify-between gap-6 sm:mt-20"
        >
          <div aria-hidden="true" className="relative hidden h-9 flex-1 overflow-hidden sm:block">
            <div className="timeline-ticks absolute inset-x-0 bottom-0 h-3" />
            <div className="absolute inset-x-0 bottom-3 h-px bg-line" />
            <motion.div
              className="absolute bottom-0 top-0 w-px bg-accent"
              initial={{ left: "0%" }}
              animate={{ left: "100%" }}
              transition={{ duration: 7, ease: "linear", repeat: Infinity }}
            >
              <span className="absolute -left-[5px] top-0 size-[11px] rounded-sm bg-accent" />
            </motion.div>
          </div>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              goTo("work");
            }}
            className="group flex shrink-0 items-center gap-3 font-display text-[11px] font-medium uppercase tracking-[0.3em] text-muted transition-colors hover:text-fg"
            aria-label="Scroll to selected work"
          >
            Scroll
            <span className="relative h-10 w-px overflow-hidden bg-line" aria-hidden="true">
              <span className="scroll-cue-bar absolute inset-x-0 top-0 h-1/2 bg-accent [animation:scroll-cue_1.8s_ease-in-out_infinite]" />
            </span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
