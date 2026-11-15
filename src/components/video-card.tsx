"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Play } from "lucide-react";
import type { Project } from "@/data/projects";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Grid footprint (lg: 4 columns, 180px row unit). Only "All Projects" gets the mixed layout. */
function spanClass(p: Project, mixed: boolean) {
  if (p.orientation === "horizontal") return "col-span-2 row-span-2";
  if (mixed && p.size === "featured") return "col-span-2 row-span-4";
  return "row-span-3";
}

export function VideoCard({
  project,
  mixed,
  priority,
  onOpen,
}: {
  project: Project;
  mixed: boolean;
  priority?: boolean;
  onOpen: (p: Project) => void;
}) {
  const featured = mixed && project.size === "featured";
  const horizontal = project.orientation === "horizontal";

  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.5, ease: EASE, layout: { duration: 0.5, ease: EASE } }}
      className={cn("min-h-0", spanClass(project, mixed), horizontal && "max-sm:col-span-2")}
    >
      <button
        type="button"
        onClick={() => onOpen(project)}
        aria-label={`Play ${project.title} — ${project.category}`}
        className="group relative block size-full cursor-pointer overflow-hidden rounded-xl border border-line bg-surface text-left transition-[border-color,box-shadow] duration-500 hover:border-accent/60 hover:shadow-[0_0_0_1px_rgba(198,255,61,0.25),0_24px_60px_-24px_rgba(198,255,61,0.25)]"
      >
        <Image
          src={project.thumbnail}
          alt={`Frame from ${project.title}`}
          fill
          sizes={
            featured || horizontal
              ? "(min-width:1024px) 50vw, 100vw"
              : "(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          }
          priority={priority}
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />

        {/* gradient for text legibility */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 transition-opacity duration-500 group-hover:from-black/95"
        />

        {/* top row */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
          <span className="rounded-full bg-black/60 px-2.5 py-1 font-mono text-[11px] tracking-wider text-fg/90 backdrop-blur">
            {String(project.id).padStart(2, "0")}
          </span>
          <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1 font-display text-[10px] font-medium uppercase tracking-[0.16em] text-fg backdrop-blur sm:text-[11px]">
            {project.category}
          </span>
        </div>

        {/* play button */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full bg-accent text-bg opacity-90 shadow-[0_0_0_8px_rgba(198,255,61,0.18)] transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:shadow-[0_0_0_14px_rgba(198,255,61,0.22)] sm:size-16"
        >
          <Play className="ml-0.5 size-6 fill-current" />
        </span>

        {/* title */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3
            className={cn(
              "font-display font-bold leading-[1.05] tracking-tight text-fg transition-transform duration-500 group-hover:-translate-y-1",
              featured ? "text-2xl sm:text-3xl lg:text-4xl" : "text-lg sm:text-xl",
            )}
          >
            {project.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-2 text-xs text-fg/60 transition-colors group-hover:text-accent">
            <span className="h-px w-5 bg-current" aria-hidden="true" />
            Watch project
          </p>
        </div>
      </button>
    </motion.li>
  );
}
