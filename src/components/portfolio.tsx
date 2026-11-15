"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { FILTERS, projects, type FilterValue, type Project } from "@/data/projects";
import { SITE } from "@/data/site";
import { cn } from "@/lib/utils";
import { Reveal, SectionLabel, SplitHeading } from "@/components/ui/reveal";
import { VideoCard } from "@/components/video-card";
import { VideoModal } from "@/components/video-modal";

export function Portfolio() {
  const [filter, setFilter] = useState<FilterValue>("All Projects");
  const [openId, setOpenId] = useState<number | null>(null);

  const visible = useMemo(
    () => (filter === "All Projects" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { "All Projects": projects.length };
    projects.forEach((p) => (c[p.category] = (c[p.category] ?? 0) + 1));
    return c;
  }, []);

  const open = openId != null ? projects.find((p) => p.id === openId) ?? null : null;
  const openIndex = open ? visible.findIndex((p) => p.id === open.id) : -1;

  const close = useCallback(() => setOpenId(null), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenId((cur) => {
        if (cur == null) return cur;
        const list = visible.length ? visible : projects;
        const i = list.findIndex((p) => p.id === cur);
        const base = i === -1 ? 0 : i;
        return list[(base + dir + list.length) % list.length].id;
      });
    },
    [visible],
  );
  const onOpen = useCallback((p: Project) => setOpenId(p.id), []);

  const mixed = filter === "All Projects";

  return (
    <section id="work" tabIndex={-1} aria-labelledby="work-title" className="relative bg-bg py-24 outline-none sm:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <header className="mb-12 flex flex-col justify-between gap-8 lg:mb-16 lg:flex-row lg:items-end">
          <div>
            <Reveal>
              <SectionLabel index="01">Portfolio</SectionLabel>
            </Reveal>
            <SplitHeading id="work-title"
              text="Selected work."
              className="mt-5 text-[clamp(3rem,9vw,8rem)]"
              accentWords={["work"]}
            />
          </div>
          <Reveal delay={0.1} className="max-w-sm">
            <p className="font-display text-xl font-medium leading-snug tracking-tight text-fg/90 sm:text-2xl">
              Every frame tells a story.
            </p>
            <p className="mt-3 text-sm text-muted">
              {projects.length} projects. Tap any card to watch it.
            </p>
          </Reveal>
        </header>

        {/* filters */}
        <Reveal>
          <LayoutGroup id="portfolio-filters">
            <div role="group" aria-label="Filter projects by category" className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
              {FILTERS.map((f) => {
                const active = filter === f;
                const count = counts[f] ?? 0;
                return (
                  <button
                    key={f}
                    type="button"
                    aria-pressed={active}
                    disabled={count === 0}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "relative inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 font-display text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-40",
                      active ? "border-transparent text-bg" : "border-line text-fg/80 hover:border-accent/70 hover:text-fg",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="filter-pill"
                        className="absolute inset-0 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{f}</span>
                    <span className={cn("relative font-mono text-[11px]", active ? "text-bg/70" : "text-muted")}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        {/* grid */}
        <p className="sr-only" role="status" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? "project" : "projects"} in {filter}.
        </p>
        <motion.ul
          layout
          className="grid auto-rows-[150px] grid-cols-2 gap-3 [grid-auto-flow:dense] sm:auto-rows-[160px] sm:grid-cols-3 sm:gap-4 lg:auto-rows-[180px] lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p, i) => (
              <VideoCard key={p.id} project={p} mixed={mixed} priority={i < 4} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.ul>

        <Reveal className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-muted">
            Prefer to browse the raw files? Everything lives in one shared folder.
          </p>
          <a
            href={SITE.driveFolder}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.08em] text-fg transition-colors hover:text-accent"
          >
            Open full folder on Google Drive
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </Reveal>
      </div>

      <AnimatePresence>
        {open && (
          <VideoModal
            key="video-modal"
            project={open}
            position={openIndex === -1 ? open.id : openIndex + 1}
            total={openIndex === -1 ? projects.length : visible.length}
            onClose={close}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
