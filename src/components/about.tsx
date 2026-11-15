"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Reveal, SectionLabel, SplitHeading } from "@/components/ui/reveal";

export function About() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-30, 40]);
  const rot = useTransform(scrollYProgress, [0, 1], [-4, 3]);

  return (
    <section ref={ref} id="about" tabIndex={-1} aria-labelledby="about-title" className="relative overflow-hidden border-t border-line bg-surface py-24 outline-none sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -left-4 top-10 select-none font-display text-[26vw] font-bold leading-none tracking-tighter text-outline opacity-[0.07]">
        A.
      </div>
      <div className="relative mx-auto grid w-full max-w-[1440px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <div className="lg:col-span-7 lg:pt-6">
          <Reveal>
            <SectionLabel index="03">About</SectionLabel>
          </Reveal>
          <SplitHeading id="about-title"
            text="The editor behind the frames."
            className="mt-5 text-[clamp(2.6rem,7.4vw,6.75rem)]"
            accentWords={["frames"]}
          />
          <Reveal delay={0.15} className="mt-10 max-w-2xl">
            <p className="text-xl leading-[1.6] text-fg/85 sm:text-2xl sm:leading-[1.55]">
              I&apos;m Asadullah, a creative video editor and motion designer focused on transforming raw footage into
              engaging visual stories. From fast-paced social media content to cinematic edits and brand videos, I
              approach every project with attention to storytelling, rhythm, detail, and visual impact.
            </p>
          </Reveal>
          <Reveal delay={0.25} className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {["Storytelling", "Rhythm", "Detail", "Visual impact"].map((t, i) => (
              <p key={t} className="flex items-center gap-3 font-display text-sm font-medium uppercase tracking-[0.18em]">
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>
                {t}
              </p>
            ))}
          </Reveal>
        </div>

        {/* editorial visual composition: real project frames, offset + parallax; portrait placeholder */}
        <div className="relative mx-auto h-[420px] w-full max-w-[460px] sm:h-[520px] lg:col-span-5 lg:h-[600px] lg:max-w-none">
          <motion.figure style={{ y: y1, rotate: rot }} className="absolute left-0 top-0 aspect-[9/16] w-[46%] overflow-hidden rounded-xl border border-line bg-elevated shadow-2xl">
            <Image src="/thumbnails/viral-car-edit.webp" alt="Frame from Video 1" fill sizes="(min-width:1024px) 20vw, 40vw" className="object-cover" />
          </motion.figure>
          <motion.figure style={{ y: y2 }} className="absolute right-0 top-[14%] aspect-[9/16] w-[50%] overflow-hidden rounded-xl border border-line bg-elevated shadow-2xl">
            <Image src="/thumbnails/mub-next-final.webp" alt="Frame from Video 13" fill sizes="(min-width:1024px) 22vw, 44vw" className="object-cover" />
          </motion.figure>
          <figure className="absolute bottom-0 left-[18%] flex aspect-square w-[42%] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-accent/50 bg-bg/80 p-4 text-center backdrop-blur">
            <span aria-hidden="true" className="font-display text-4xl font-bold text-accent">A.</span>
            <figcaption className="text-[11px] uppercase tracking-[0.16em] text-muted">Portrait coming soon</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
