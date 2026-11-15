# ASADULLAH — Video Editor & Motion Designer (Portfolio)

A cinematic, dark, single-page portfolio built with **Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + Motion for React**.
Centerpiece: **all 20 of Asadullah's Google Drive videos**, each as its own project with a thumbnail, category, hover effects and an on-demand player modal.

- Contact: **asadiftekhar76@gmail.com**
- Stack: Next.js 16, React 19, Tailwind 4, `motion` (import from `motion/react`), `lucide-react`, Space Grotesk + Inter via `next/font`
- Vercel-ready (no extra config needed)

## Quick start

```bash
npm install
cp .env.example .env.local      # optional: only needed for the contact form
npm run dev                     # http://localhost:3000
npm run build && npm start      # production build
npm run typecheck
```

## Project structure

```
src/
  app/
    layout.tsx          fonts, metadata, Open Graph, JSON-LD
    page.tsx            assembles the sections
    globals.css         design tokens (#080808 / #141414 / #1C1C1C / #C6FF3D ...), grain, timeline, wordmark
    api/contact/route.ts  server-side email (Resend), validation, rate limit, spam traps
    sitemap.ts robots.ts icon.svg error.tsx not-found.tsx
  components/
    navbar.tsx hero.tsx portfolio.tsx video-card.tsx video-modal.tsx
    services.tsx about.tsx process.tsx contact.tsx footer.tsx
    ui/ reveal.tsx (split-text + scroll reveals) magnetic.tsx cta-button.tsx scroll-progress.tsx
  data/
    projects.ts         ALL 20 projects (single source of truth)
    site.ts             email, nav items, social links (empty until supplied)
  lib/ validation.ts (shared client+server) utils.ts motion.ts scroll.ts
public/thumbnails/      20 optimized WebP poster frames (one per project)
.env.example
```

## The 20 portfolio videos

Every project lives in `src/data/projects.ts` (one row each, exact filename + Drive ID).
Player URL: `https://drive.google.com/file/d/<ID>/preview`; fallback link: `.../view` ("Watch on Google Drive").

Titles are shown publicly as "Video 1" ... "Video 20" (row order). The original Drive filenames stay in the `fileName` column for reference only.

**Add a project later:** upload the video to Drive (*Anyone with the link → Viewer*), save a poster frame to `public/thumbnails/<slug>.webp`, append one row to the `RAW` table. Done.

**Change a category:** edit the `category` column of that row. Rows marked `"provisional"` were *not* confidently identifiable from a single frame or the filename; please review them:

| Provisional (please confirm) | Current category |
|---|---|
| Video 3 | Cinematic (frame shows an interview-style shot, not a wedding) |
| Video 7, Video 8 | Short-Form / Commercials |
| Video 12, Video 13, Video 14, Video 15, Video 16, Video 18 | Other / Cinematic |

Categories marked `"reviewed"` were chosen after looking at a frame of the actual video.

### Thumbnails
Real poster frames, never stock photos. Drive's thumbnail service was used for 15 files. For 5 files where Drive returned a black frame (Apex ad 221, highlight, virtualconsigner, holiday cottage f, venture digital Final) a frame was extracted with FFmpeg from the file at 3-6 s. All were converted to WebP (~900 KB total for 20).

### Performance by design
No iframe is rendered until a card is opened (verified: 0 iframes before open and after close; exactly 1 while open). Thumbnails are `next/image` (lazy below the fold, priority for the first 4).

## Contact form (Resend)

Server route: `POST /api/contact`. Configure in `.env.local` / Vercel env vars (see `.env.example`):

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | required to send. Without it, submitting the form returns an honest 503 error message (no fake success); the mailto buttons keep working |
| `RESEND_FROM` | sender on a domain you verified in Resend (testing: `onboarding@resend.dev`, which Resend only delivers to the account owner's own address) |
| `CONTACT_TO_EMAIL` | recipient, defaults to `asadiftekhar76@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | public URL for canonical / sitemap / Open Graph |

Protections: client + server validation (shared `lib/validation.ts`), same-origin check, JSON-only, 20 KB body cap, honeypot field, minimum-fill-time trap, per-IP rate limit (3 / 10 min, in-memory: best-effort on serverless, add Upstash/Vercel KV for a hard limit), HTML-escaped email body, provider errors never leaked to the browser. The API key is only read server-side.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Vercel → **Add New → Project** → import the repo (framework auto-detected as Next.js).
3. **Settings → Environment Variables**: add `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_SITE_URL` (your final domain).
4. Deploy. In Resend, verify your sending domain and use an address on it for `RESEND_FROM`.

## Design system & tooling notes (honest summary)

- **UI/UX Pro Max** (`npx skills add nextlevelbuilder/ui-ux-pro-max-skill`): installed and its `--design-system` generator was run for "video editor portfolio cinematic dark". It recommended a *Motion-Driven* style with scroll-triggered storytelling, Space Grotesk, reduced-motion support, SVG icons, 44px targets and visible focus. Those recommendations were applied. Its suggested palette was **not** used: the palette in the brief (`#080808 / #C6FF3D ...`) takes precedence.
- **21st.dev** (`npx skills add 21st-dev/skill`): the skills installed, but the `21st` CLI requires a login and 21st.dev shows component source only to signed-in users, so **no component source was copied or installed**. The navbar's active "tubelight" pill is an original implementation inspired by the public description of 21st.dev's Tubelight Navbar. If you want literal 21st.dev components, run `21st login` and I/you can swap them in.
- **Motion**: `motion/react` with `AnimatePresence` (modal, filtering, mobile menu), shared-layout pills (`layoutId`), scroll-linked parallax/progress, magnetic buttons; `MotionConfig reducedMotion="user"` + CSS fallbacks.
- shadcn/ui: not added. Only `cn()` (clsx + tailwind-merge) and class-variance patterns are used; nothing needed its components.

## Verification performed

Automated browser run (Playwright + headless Chromium) against the production build passed all functional checks apart from two known non-issues in the test itself (a too-tight scroll tolerance, and the expected 503 from the contact API while email is unconfigured).

Verified: every nav link and hero CTA; all `mailto:` links point to asadiftekhar76@gmail.com; 20 cards; each card opens the correct Drive iframe + "Watch on Google Drive" link; Esc / close button / backdrop close; ← → switch videos; filter counts (Short-Form 6, Commercials 3, Cinematic 3, Gaming & Sports 2, Podcasts 1, Other 5); mobile menu (open, navigate, Esc); no horizontal overflow at 1920 / 1440 / 1024 / 768 / 390 / 320; modal fits the viewport at 1024-320; reduced-motion; API: 422 / 415 / 403 / 400 / honeypot / too-fast / 503-unconfigured / 429 rate limit.

**Drive permissions:** all 20 file IDs return `video/mp4` to anonymous requests (sharing is "anyone with the link"), none inaccessible. **Not verified:** actual in-iframe playback. In my headless-browser run the Drive player was still on its loading spinner in the screenshots (I did not determine why; it may be the test environment or Drive's player). Please click through several videos in a normal browser, and test on mobile, before relying on embeds. Drive may throttle embeds for very large files or heavy traffic: that is why every modal has a visible Drive link.

**Not measured:** Lighthouse / Core Web Vitals. No score is claimed.

## Not implemented / next steps

- Real portrait photo (a "Portrait coming soon" placeholder is shown).
- Social links: add to `SITE.socials` in `src/data/site.ts`; they appear in the footer automatically.
- Confirm provisional categories; consider short titles/descriptions per project.
- Persistent rate limiting (Upstash / Vercel KV) and Resend domain verification.
