"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, Maximize2, X } from "lucide-react";
import { previewUrl, viewUrl, type Project } from "@/data/projects";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Video player dialog. The Drive <iframe> is mounted only while this component is rendered
 * (i.e. after the visitor opens a project), and is keyed per video so switching resets it.
 */
export function VideoModal({
  project,
  position,
  total,
  onClose,
  onStep,
}: {
  project: Project;
  position: number;
  total: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [slow, setSlow] = useState(false);
  const vertical = project.orientation === "vertical";
  // ONE width drives header, player and footer, so their left/right edges always line up.
  // The player is at most 66% of the viewport height, which keeps the whole dialog on-screen.
  const playerWidth = vertical ? "calc(66dvh * 9 / 16)" : "min(1100px, calc(66dvh * 16 / 9))";
  const dialogWidth = `min(100%, max(320px, ${playerWidth}))`;

  // reset the loading state whenever the project changes
  useEffect(() => {
    setLoaded(false);
    setSlow(false);
    const t = setTimeout(() => setSlow(true), 7000);
    // Safety net: never leave the loading cover up forever if the iframe never reports "load".
    const t2 = setTimeout(() => setLoaded(true), 20000);
    return () => {
      clearTimeout(t);
      clearTimeout(t2);
    };
  }, [project.id]);

  // scroll lock + focus management + keyboard
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const gap = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    if (gap > 0) root.style.paddingRight = `${gap}px`;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Don't swallow Escape that is exiting browser fullscreen
        if (document.fullscreenElement) return;
        onClose();
      } else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])',
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = "";
      root.style.paddingRight = "";
      previouslyFocused?.focus?.();
    };
  }, [onClose, onStep]);

  const fullscreen = useCallback(() => {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen?.().catch(() => {
      /* Some browsers block it; the iframe's own fullscreen button still works. */
    });
  }, []);

  const iconBtn =
    "grid size-10 shrink-0 cursor-pointer sm:size-11 place-items-center rounded-full border border-line bg-surface/80 text-fg transition-colors duration-200 hover:border-accent hover:text-accent disabled:opacity-40";

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        style={{ width: dialogWidth }}
        className="relative flex max-h-full flex-col items-center gap-4"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        {/* header */}
        <div className="flex w-full items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-[11px] font-medium uppercase tracking-[0.18em] text-accent">
              {project.category} · {String(position).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2
              id="video-modal-title"
              className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl"
            >
              {project.title}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button type="button" className={iconBtn} onClick={() => onStep(-1)} aria-label="Previous project">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" className={iconBtn} onClick={() => onStep(1)} aria-label="Next project">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
            <button type="button" className={iconBtn} onClick={fullscreen} aria-label="Toggle fullscreen">
              <Maximize2 className="size-4" aria-hidden="true" />
            </button>
            <button ref={closeRef} type="button" className={cn(iconBtn, "border-accent/50")} onClick={onClose} aria-label="Close video">
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* player */}
        <div
          ref={playerRef}
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-line bg-black",
            vertical ? "aspect-[9/16]" : "aspect-video",
          )}
        >
          <iframe
            key={project.driveId}
            src={previewUrl(project.driveId)}
            title={`${project.title} — video player`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            referrerPolicy="no-referrer"
            onLoad={() => setLoaded(true)}
            className="absolute inset-0 size-full border-0"
          />

          {/* Loading cover: sits ON TOP of the iframe until Drive's player has loaded, then fades out. */}
          <AnimatePresence>
            {!loaded && (
              <motion.div
                key="loading"
                role="status"
                aria-live="polite"
                className="pointer-events-none absolute inset-0 z-10 grid place-items-center bg-black"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Image
                  src={project.thumbnail}
                  alt=""
                  fill
                  sizes="(min-width:1024px) 600px, 90vw"
                  className="object-cover opacity-30 blur-md"
                />
                <div className="relative flex flex-col items-center gap-3">
                  <Loader2 className="size-10 animate-spin text-accent motion-reduce:animate-none" aria-hidden="true" />
                  <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-fg">Loading video…</p>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-line/60">
                  <span className="modal-loadbar block h-full w-1/3 bg-accent" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* footer */}
        <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm text-muted">
          <p aria-live="polite">
            {slow && !loaded
              ? "Still loading… you can open it directly on Google Drive."
              : "Video not playing? Drive may be blocking embeds in your browser."}
          </p>
          <a
            href={viewUrl(project.driveId)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 font-display text-xs font-bold uppercase tracking-[0.1em] text-fg transition-colors hover:border-accent hover:text-accent"
          >
            Watch on Google Drive
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}
