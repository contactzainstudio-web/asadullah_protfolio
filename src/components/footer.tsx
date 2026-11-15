"use client";

import { ArrowUp } from "lucide-react";
import { SITE } from "@/data/site";
import { goTo } from "@/lib/scroll";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-bold tracking-tight">
              ASADULLAH<span className="text-accent">.</span>
            </p>
            <p className="mt-2 text-sm text-muted">{SITE.title}</p>
            <a href={SITE.mailto} className="mt-5 inline-block break-all text-sm text-fg underline decoration-accent underline-offset-4 transition-colors hover:text-accent">
              {SITE.email}
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-4">
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      goTo(l.id);
                    }}
                    className="inline-flex min-h-11 items-center font-display text-sm font-medium uppercase tracking-[0.14em] text-fg/80 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-4 md:col-span-3 md:items-end">
            {SITE.socials.length > 0 && (
              <ul className="flex flex-wrap gap-4" aria-label="Social profiles">
                {SITE.socials.map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-fg/80 transition-colors hover:text-accent">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => goTo("home")}
              className="group inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-line px-5 font-display text-xs font-bold uppercase tracking-[0.12em] transition-colors hover:border-accent hover:text-accent"
            >
              Back to top
              <ArrowUp className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <p className="mt-12 border-t border-line pt-6 text-xs text-muted">
          &copy; {year} Asadullah. All rights reserved.
        </p>
      </div>

      {/* subtle brand wordmark with a slow sheen */}
      <div aria-hidden="true" className="pointer-events-none mt-4 select-none overflow-hidden px-2 pb-2 text-center">
        <span className="wordmark block whitespace-nowrap font-display text-[clamp(3rem,17.5vw,17rem)] font-bold leading-[0.85] tracking-[-0.06em]">
          ASADULLAH
        </span>
      </div>
    </footer>
  );
}
