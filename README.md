<div align="center">

# ResuMatch — UI

### Diagnostic-terminal styled frontend for the ResuMatch resume analyzer.

Next.js 15 · TypeScript · Tailwind · Framer Motion · Demo Mode

[![Live](https://img.shields.io/badge/live-resumatch--ui--3yv7.vercel.app-000?style=flat-square&logo=vercel)](https://resumatch-ui-3yv7.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

**[Live Demo](https://resumatch-ui-3yv7.vercel.app)**  ·  **[Backend Repo](https://github.com/Aman100705/resumatch)**

</div>

---

## What it is

A production-grade frontend for **[ResuMatch](https://github.com/Aman100705/resumatch)** — an ATS-style resume-to-job-description scorer.

The UI is intentionally distinct from typical SaaS dashboards: it borrows from terminal aesthetics, bracket frames, scan-lines, and monospace typography to evoke a *technical instrument* rather than a marketing landing page.

It runs in two modes:

- **🟢 Live mode** — talks to the [Spring Boot backend](https://github.com/Aman100705/resumatch) on localhost:8080. Real PDF parsing, real PostgreSQL, real JWT auth.
- **🔵 Demo mode** — set `NEXT_PUBLIC_DEMO_MODE=true`. The entire backend is mocked client-side using `localStorage`. Same UI, same algorithm, no server. This is what runs on Vercel.

---

## Aesthetic

A "diagnostic terminal" theme:

- **Palette** — deep blue-black `#0b0f1a` background, electric cyan `#00ffc6` signal accent
- **Type** — Fraunces (serif display) paired with JetBrains Mono (UI labels & data)
- **Motifs** — corner-bracket panels, ASCII dividers, scan-line CRT overlay, animated radial score gauge
- **Motion** — Framer Motion for staggered list reveals and the hero score animation

---

## Features

- 🔐 **Auth flow** — register + login, JWT stored in `localStorage`, route guard on dashboard
- 📄 **Resume upload** — drag-and-drop PDF (5 MB cap), real-time client validation
- 📝 **JD management** — full CRUD with search, modal-based creation
- 🎯 **Analysis screen** — pick resume + JD, animated score gauge sweep from 0 → score
- 📊 **Match history** — paginated past analyses with score-coded list rows
- 🔍 **Match detail** — full breakdown: matched keywords, missing keywords, recommendation
- 🟢 **Demo mode toggle** — flip a single env var to run without a backend

---

## Tech stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Framework        | Next.js 15 (App Router)                 |
| Language         | TypeScript 5                            |
| Styling          | Tailwind CSS 4                          |
| Animations       | Framer Motion                           |
| State            | React hooks + `localStorage`            |
| Icons            | Lucide React                            |
| Auth             | JWT (Bearer tokens)                     |
| Hosting          | Vercel                                  |

---

## Getting started

### Prerequisites
- Node.js 20+
- (Optional) The [ResuMatch backend](https://github.com/Aman100705/resumatch) running on `localhost:8080`

### Setup

```bash
# 1. Clone
git clone https://github.com/Aman100705/resumatch-ui.git
cd resumatch-ui

# 2. Install
npm install --legacy-peer-deps

# 3. Configure
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_DEMO_MODE=true to run without backend

# 4. Run
npm run dev
```

Open **http://localhost:3000**.

### Environment variables

| Variable                   | Description                                  | Default                |
| -------------------------- | -------------------------------------------- | ---------------------- |
| `NEXT_PUBLIC_DEMO_MODE`    | `true` runs without backend (demo)           | `false`                |
| `NEXT_PUBLIC_API_URL`      | Backend URL (only when demo mode is off)     | `http://localhost:8080`|

---

## Project structure

```
resumatch-ui/
├── app/
│   ├── auth/
│   │   ├── login/             # Login page
│   │   └── register/          # Register page
│   └── dashboard/
│       ├── upload/            # Resume upload
│       ├── jobs/              # JD CRUD
│       ├── analyze/           # Run a new analysis
│       └── matches/           # History + detail
├── components/
│   ├── dashboard/             # Sidebar, AuthGuard, DemoBanner
│   ├── analyze/               # Score gauge, result panels
│   └── ui/                    # Buttons, panels, dividers
├── lib/
│   ├── api.ts                 # Real backend client
│   ├── mockApi.ts             # Demo-mode mock backend
│   ├── types.ts               # Shared TypeScript types
│   └── utils.ts               # Date helpers, formatters
└── public/
```

---

## Engineering decisions worth noting

- **Single API surface, two backends.** `lib/api.ts` exports the same shape regardless of mode — every screen calls `api.uploadResume(file)`, never branches on `DEMO_MODE`.
- **Mock backend with real algorithm.** `lib/mockApi.ts` reimplements the Java keyword-matching logic in TypeScript so demo-mode scores are meaningful, not random.
- **Route guarding without middleware.** `<AuthGuard>` is a client component that redirects unauthenticated requests on mount — works on Vercel's static export.
- **Animated score gauge.** Custom SVG with tick marks, color-by-score (red → amber → cyan), animated sweep using `framer-motion`'s `<motion.path>`.
- **Score-coded list items.** Match history rows tint subtly based on score range — readable without reading numbers.

---

## License

MIT — built by [Aman Patel](https://github.com/Aman100705) · 2026
