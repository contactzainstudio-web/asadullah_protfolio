"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { SITE } from "@/data/site";
import { BUDGETS, LIMITS, PROJECT_TYPES, validateContact, type ContactErrors, type ContactInput } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { CtaLink, ctaClass } from "@/components/ui/cta-button";
import { Magnetic } from "@/components/ui/magnetic";
import { Reveal, SectionLabel, SplitHeading } from "@/components/ui/reveal";

type Status = "idle" | "sending" | "success" | "error";
const EMPTY: ContactInput = { name: "", email: "", projectType: "", budget: "", message: "" };

const fieldBase =
  "w-full rounded-lg border bg-surface px-4 py-3.5 text-[15px] text-fg placeholder:text-muted/70 transition-colors duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30";

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-display text-xs font-medium uppercase tracking-[0.16em] text-fg/80">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-sm text-red-400">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

export function Contact() {
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const renderedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    renderedAt.current = Date.now();
  }, []);

  const set = (k: keyof ContactInput, v: string) => {
    const next = { ...values, [k]: v };
    setValues(next);
    if (touched[k] || errors[k]) {
      const r = validateContact(next);
      setErrors((e) => ({ ...e, [k]: r.ok ? undefined : r.errors[k] }));
    }
  };
  const blur = (k: keyof ContactInput) => {
    setTouched((t) => ({ ...t, [k]: true }));
    const r = validateContact(values);
    setErrors((e) => ({ ...e, [k]: r.ok ? undefined : r.errors[k] }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const r = validateContact(values);
    if (!r.ok) {
      setErrors(r.errors);
      setTouched({ name: true, email: true, projectType: true, budget: true, message: true });
      const first = (Object.keys(r.errors) as (keyof ContactInput)[])[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setNotice("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot, t: renderedAt.current }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        setValues(EMPTY);
        setErrors({});
        setTouched({});
        return;
      }
      if (res.status === 422 && data.fields) setErrors(data.fields);
      setNotice(data.error || "Something went wrong. Please try again or email me directly.");
      setStatus("error");
    } catch {
      setNotice("Network error. Please check your connection or email me directly.");
      setStatus("error");
    }
  }

  const err = (k: keyof ContactInput) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-error` } : {});
  const border = (k: keyof ContactInput) => (errors[k] ? "border-red-400/70" : "border-line");

  return (
    <section id="contact" tabIndex={-1} aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line bg-bg py-24 outline-none sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />
      <div className="relative mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <Reveal>
          <SectionLabel index="05">Contact</SectionLabel>
        </Reveal>
        <SplitHeading id="contact-title"
          text="Have a project in mind?"
          className="mt-5 max-w-[14ch] text-[clamp(3rem,9.5vw,9rem)]"
          accentWords={["mind"]}
        />

        <div className="mt-12 grid gap-14 lg:mt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="font-display text-2xl font-medium leading-snug tracking-tight text-fg/90 sm:text-3xl">
                Let&apos;s make something worth watching.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-10">
              <p className="mb-2 font-display text-xs font-medium uppercase tracking-[0.2em] text-muted">Email</p>
              <a
                href={SITE.mailto}
                className="group inline-flex items-center gap-3 break-all font-display text-[clamp(1.25rem,3.2vw,2rem)] font-bold tracking-tight text-fg underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent"
              >
                <Mail className="size-6 shrink-0 text-accent" aria-hidden="true" />
                {SITE.email}
              </a>
            </Reveal>
            <Reveal delay={0.2} className="mt-10 flex flex-wrap gap-3">
              <CtaLink href={SITE.mailto}>Hire me</CtaLink>
              <CtaLink href={SITE.mailto} variant="ghost">Send an email</CtaLink>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              aria-labelledby="contact-form-title"
              className="rounded-2xl border border-line bg-surface/60 p-5 sm:p-8"
            >
              <h3 id="contact-form-title" className="font-display text-xl font-bold tracking-tight">
                Project inquiry
              </h3>

              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <motion.div
                    key="ok"
                    role="status"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="grid place-items-center gap-4 py-16 text-center"
                  >
                    <CheckCircle2 className="size-14 text-accent" aria-hidden="true" />
                    <p className="font-display text-3xl font-bold tracking-tight">Message sent.</p>
                    <p className="max-w-sm text-muted">Thanks for reaching out. I&apos;ll get back to you by email.</p>
                    <button type="button" onClick={() => setStatus("idle")} className={ctaClass("ghost", "mt-2")}>
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 grid gap-5 sm:grid-cols-2">
                    <Field id={id("name")} label="Full name" error={errors.name}>
                      <input id={id("name")} name="name" autoComplete="name" required maxLength={LIMITS.nameMax} value={values.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} placeholder="Jane Smith" className={cn(fieldBase, border("name"))} {...err("name")} />
                    </Field>
                    <Field id={id("email")} label="Email address" error={errors.email}>
                      <input id={id("email")} name="email" type="email" autoComplete="email" inputMode="email" required value={values.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} placeholder="you@company.com" className={cn(fieldBase, border("email"))} {...err("email")} />
                    </Field>
                    <Field id={id("projectType")} label="Project type" error={errors.projectType}>
                      <select id={id("projectType")} name="projectType" required value={values.projectType} onChange={(e) => set("projectType", e.target.value)} onBlur={() => blur("projectType")} className={cn(fieldBase, border("projectType"), !values.projectType && "text-muted/80")} {...err("projectType")}>
                        <option value="" disabled>Select a type…</option>
                        {PROJECT_TYPES.map((t) => (<option key={t} value={t} className="bg-surface text-fg">{t}</option>))}
                      </select>
                    </Field>
                    <Field id={id("budget")} label="Estimated budget" error={errors.budget}>
                      <select id={id("budget")} name="budget" required value={values.budget} onChange={(e) => set("budget", e.target.value)} onBlur={() => blur("budget")} className={cn(fieldBase, border("budget"), !values.budget && "text-muted/80")} {...err("budget")}>
                        <option value="" disabled>Select a range…</option>
                        {BUDGETS.map((b) => (<option key={b} value={b} className="bg-surface text-fg">{b}</option>))}
                      </select>
                    </Field>
                    <div className="sm:col-span-2">
                      <Field id={id("message")} label="Project description" error={errors.message} hint={`${values.message.trim().length}/${LIMITS.messageMax}`}>
                        <textarea id={id("message")} name="message" required rows={5} maxLength={LIMITS.messageMax} value={values.message} onChange={(e) => set("message", e.target.value)} onBlur={() => blur("message")} placeholder="Tell me about your footage, goals, deadline and any references you like." className={cn(fieldBase, border("message"), "resize-y")} {...err("message")} />
                      </Field>
                    </div>

                    {/* honeypot: hidden from people and assistive tech, bots fill it in */}
                    <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                      <label>
                        Leave this field empty
                        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                      </label>
                    </div>

                    <div className="sm:col-span-2">
                      {status === "error" && notice && (
                        <p role="alert" className="mb-4 flex gap-2 rounded-lg border border-red-400/40 bg-red-400/10 p-3.5 text-sm text-red-200">
                          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                          {notice}
                        </p>
                      )}
                      <Magnetic className="w-full sm:w-auto">
                        <button type="submit" disabled={status === "sending"} className={ctaClass("primary", "w-full disabled:cursor-wait disabled:opacity-70 sm:w-auto")}>
                          {status === "sending" ? (
                            <>
                              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                              Sending…
                            </>
                          ) : (
                            <>
                              Send inquiry
                              <Send className="size-4" aria-hidden="true" />
                            </>
                          )}
                        </button>
                      </Magnetic>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
