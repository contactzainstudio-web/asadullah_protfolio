import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_TO = "asadiftekhar76@gmail.com";

/* ---- Basic in-memory rate limit (per server instance) ------------------------------------
 * 3 requests / 10 minutes per IP. On serverless platforms each instance has its own memory,
 * so this is a best-effort brake; for hard guarantees use Upstash/Vercel KV or WAF rules. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): number {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_HITS) {
    hits.set(ip, recent);
    return Math.ceil((WINDOW_MS - (now - recent[0])) / 1000);
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return 0;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const json = (body: unknown, status = 200, headers?: Record<string, string>) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/** Lets the UI show an honest "not yet activated" notice when email isn't configured. */
export async function GET() {
  return json({ configured: Boolean(process.env.RESEND_API_KEY) });
}

export async function POST(req: Request) {
  // Same-origin only (basic CSRF protection for a public JSON endpoint)
  const origin = req.headers.get("origin");
  if (origin) {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    try {
      if (host && new URL(origin).host !== host) return json({ error: "Forbidden." }, 403);
    } catch {
      return json({ error: "Forbidden." }, 403);
    }
  }
  if (!(req.headers.get("content-type") ?? "").includes("application/json"))
    return json({ error: "Unsupported content type." }, 415);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const wait = rateLimited(ip);
  if (wait) {
    return json(
      { error: "Too many requests. Please try again in a few minutes, or email me directly." },
      429,
      { "Retry-After": String(wait) },
    );
  }

  const raw = await req.text();
  if (raw.length > 20_000) return json({ error: "Payload too large." }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  // Spam traps: hidden honeypot field + suspiciously fast submissions (<2.5s after render).
  // Respond with a fake success so bots learn nothing.
  const tooFast = typeof body.t === "number" && Date.now() - body.t < 2500;
  if ((typeof body.website === "string" && body.website.trim() !== "") || tooFast) {
    return json({ ok: true });
  }

  const result = validateContact(body as never);
  if (!result.ok) return json({ error: "Please check the highlighted fields.", fields: result.errors }, 422);
  const d = result.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return json(
      {
        error:
          "The contact form isn't activated yet. Please email asadiftekhar76@gmail.com directly.",
        code: "NOT_CONFIGURED",
      },
      503,
    );
  }

  const to = process.env.CONTACT_TO_EMAIL || DEFAULT_TO;
  const from = process.env.RESEND_FROM || "ASADULLAH Portfolio <onboarding@resend.dev>";

  const text = [
    `New project inquiry`,
    ``,
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Project type: ${d.projectType}`,
    `Budget: ${d.budget}`,
    ``,
    d.message,
  ].join("\n");
  const html = `<div style="font-family:Inter,Arial,sans-serif;max-width:560px;color:#111">
<h2 style="margin:0 0 16px">New project inquiry</h2>
<table style="border-collapse:collapse;width:100%;font-size:14px">
<tr><td style="padding:6px 0;color:#666;width:120px">Name</td><td>${esc(d.name)}</td></tr>
<tr><td style="padding:6px 0;color:#666">Email</td><td><a href="mailto:${esc(d.email)}">${esc(d.email)}</a></td></tr>
<tr><td style="padding:6px 0;color:#666">Project type</td><td>${esc(d.projectType)}</td></tr>
<tr><td style="padding:6px 0;color:#666">Budget</td><td>${esc(d.budget)}</td></tr></table>
<p style="white-space:pre-wrap;border-top:1px solid #ddd;margin-top:16px;padding-top:16px;font-size:15px;line-height:1.55">${esc(d.message)}</p>
</div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: d.email,
        subject: `New project inquiry from ${d.name.replace(/[\r\n]/g, " ")}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Log details server-side only; never leak provider errors to the browser.
      console.error("[contact] Resend error", res.status, (await res.text()).slice(0, 300));
      return json(
        { error: "Couldn't send your message right now. Please email asadiftekhar76@gmail.com directly." },
        502,
      );
    }
    return json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed", err instanceof Error ? err.message : err);
    return json(
      { error: "Couldn't send your message right now. Please email asadiftekhar76@gmail.com directly." },
      502,
    );
  }
}
