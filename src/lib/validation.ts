/** Shared by the client form and the /api/contact route (server re-validates everything). */

export const PROJECT_TYPES = [
  "Short-form (Reels / TikTok / Shorts)",
  "YouTube video",
  "Commercial / social ad",
  "Motion graphics",
  "Cinematic / wedding",
  "Podcast / long-form",
  "Something else",
] as const;

export const BUDGETS = [
  "Under $250",
  "$250 – $500",
  "$500 – $1,000",
  "$1,000 – $2,500",
  "$2,500+",
  "Not sure yet",
] as const;

export interface ContactInput {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export const LIMITS = { nameMin: 2, nameMax: 80, messageMin: 20, messageMax: 2000 };

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;
// eslint-disable-next-line no-control-regex
const CONTROL_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const clean = (v: unknown) =>
  typeof v === "string" ? v.replace(CONTROL_RE, "").trim() : "";

export function validateContact(
  raw: Partial<Record<keyof ContactInput, unknown>>,
): { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors } {
  const data: ContactInput = {
    name: clean(raw.name),
    email: clean(raw.email).toLowerCase(),
    projectType: clean(raw.projectType),
    budget: clean(raw.budget),
    message: clean(raw.message),
  };
  const errors: ContactErrors = {};

  if (data.name.length < LIMITS.nameMin) errors.name = "Please enter your full name.";
  else if (data.name.length > LIMITS.nameMax || /[\r\n]/.test(data.name))
    errors.name = "That name looks too long.";

  if (!data.email) errors.email = "Please enter your email address.";
  else if (data.email.length > 254 || !EMAIL_RE.test(data.email))
    errors.email = "Please enter a valid email address.";

  if (!(PROJECT_TYPES as readonly string[]).includes(data.projectType))
    errors.projectType = "Please choose a project type.";

  if (!(BUDGETS as readonly string[]).includes(data.budget))
    errors.budget = "Please choose an estimated budget.";

  if (data.message.length < LIMITS.messageMin)
    errors.message = `Tell me a little more (at least ${LIMITS.messageMin} characters).`;
  else if (data.message.length > LIMITS.messageMax)
    errors.message = `Please keep it under ${LIMITS.messageMax} characters.`;

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
