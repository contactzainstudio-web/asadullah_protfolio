"use client";

import { motion } from "motion/react";
import { Film, Megaphone, Mic2, Smartphone, Sparkles, MonitorPlay, type LucideIcon } from "lucide-react";
import { EASE } from "@/lib/motion";
import { Reveal, SectionLabel, SplitHeading } from "@/components/ui/reveal";

interface Service {
  n: string;
  title: string;
  body: string;
  Icon: LucideIcon;
  tags: string[];
}

const SERVICES: Service[] = [
  { n: "01", title: "Short-Form Video Editing", Icon: Smartphone, body: "Instagram Reels, TikTok, YouTube Shorts, engaging captions, dynamic pacing, and attention-grabbing edits.", tags: ["Reels", "TikTok", "Shorts"] },
  { n: "02", title: "YouTube Video Editing", Icon: MonitorPlay, body: "Long-form videos, storytelling, jump cuts, transitions, sound design, and engaging visual sequences.", tags: ["Long-form", "Sound design"] },
  { n: "03", title: "Commercial & Social Media Ads", Icon: Megaphone, body: "Promotional videos, product advertisements, brand content, and social media campaigns.", tags: ["Ads", "Brand content"] },
  { n: "04", title: "Motion Graphics", Icon: Sparkles, body: "Animated typography, graphics, transitions, visual effects, and motion-driven storytelling.", tags: ["Typography", "VFX"] },
  { n: "05", title: "Cinematic & Wedding Editing", Icon: Film, body: "Cinematic storytelling, emotional pacing, elegant transitions, and polished visual presentation.", tags: ["Cinematic", "Wedding"] },
  { n: "06", title: "Podcast & Long-Form Editing", Icon: Mic2, body: "Podcast episodes, interview editing, multicamera-style presentation where applicable, audio cleanup, and highlight clips.", tags: ["Podcast", "Interviews"] },
];

function ServiceCard({ s, i }: { s: Service; i: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors duration-500 hover:border-accent/50 sm:p-8"
    >
      {/* hover wash */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/15"
      />
      <div className="relative flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-xl border border-line bg-elevated text-accent transition-all duration-500 group-hover:rotate-[-6deg] group-hover:border-accent group-hover:bg-accent group-hover:text-bg">
          <s.Icon className="size-6" aria-hidden="true" />
        </span>
        <span className="font-display text-5xl font-bold leading-none tracking-tighter text-outline transition-opacity duration-500 group-hover:opacity-100 sm:text-6xl" aria-hidden="true">
          {s.n}
        </span>
      </div>
      <div className="relative mt-10">
        <h3 className="font-display text-2xl font-bold leading-[1.05] tracking-tight sm:text-[1.7rem]">
          <span className="sr-only">{s.n}. </span>
          {s.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.body}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Includes">
          {s.tags.map((t) => (
            <li key={t} className="rounded-full border border-line px-3 py-1 font-display text-[10px] font-medium uppercase tracking-[0.16em] text-fg/70 transition-colors group-hover:border-accent/40">
              {t}
            </li>
          ))}
        </ul>
      </div>
      {/* bottom accent line */}
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
    </motion.li>
  );
}

export function Services() {
  return (
    <section id="services" tabIndex={-1} aria-labelledby="services-title" className="relative border-t border-line bg-bg py-24 outline-none sm:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <header className="mb-14 grid gap-8 lg:mb-20 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <SectionLabel index="02">Services</SectionLabel>
            </Reveal>
            <SplitHeading id="services-title" text="What I create." className="mt-5 text-[clamp(3rem,9vw,8rem)]" accentWords={["create"]} />
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-md text-lg leading-relaxed text-fg/75 lg:ml-auto">
              Creative video editing solutions designed to make your content stand out.
            </p>
          </Reveal>
        </header>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SERVICES.map((s, i) => (
            <ServiceCard key={s.n} s={s} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}

