"use client";

import { MotionConfig } from "motion/react";

/** Honors the visitor's prefers-reduced-motion setting for every Motion animation. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
