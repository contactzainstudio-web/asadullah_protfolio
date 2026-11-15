"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";

type Variant = "primary" | "ghost";

const base =
  "group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-7 font-display text-sm font-bold uppercase tracking-[0.06em] transition-colors duration-300 cursor-pointer select-none";
const variants: Record<Variant, string> = {
  primary: "bg-accent text-bg hover:bg-fg",
  ghost: "border border-line text-fg hover:border-accent hover:text-accent",
};

export function ctaClass(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

export function CtaLink({
  href,
  children,
  variant = "primary",
  className,
  magnetic = true,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  external?: boolean;
}) {
  const link = (
    <a
      href={href}
      className={ctaClass(variant, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <span>{children}</span>
      <ArrowUpRight
        className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
