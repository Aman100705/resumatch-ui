# ResuMatch UI 🎯

> Frontend for the ResuMatch REST API. A "diagnostic terminal" UI — deep space blue with electric cyan accents, built for performing resume/JD match analysis.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Sonner (toasts)

---

## ✨ Features

- 🔐 Full auth flow (register/login with JWT saved to localStorage)
- 📄 Drag-and-drop PDF resume upload with instant parsing feedback
- 💼 Job descriptions CRUD with live search
- ⚡ Analyze flow: pick resume + JD → animated loading → results reveal
- 🎯 **Animated score gauge** with color-coded verdict (0–100)
- 🟢 Matched keywords as cyan pills, missing as amber pills
- 💡 Recommendation card explaining what to add
- 📚 Match history with detail pages for every past analysis
- 🌙 Diagnostic terminal aesthetic (CRT scanlines, corner brackets, monospace, serif display)

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure API URL
```bash
cp .env.example .env.local
```

Edit `.env.local` — point at your running Spring Boot backend:
```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Run it
```bash
npm run dev
```

Open http://localhost:3000

> ⚠️ The backend MUST be running on the URL you set. Start ResuMatch Spring Boot first (`./mvnw spring-boot:run` in the `resumatch` project).

---

## 🎨 The Aesthetic

This UI intentionally **does not** use your portfolio's editorial-amber aesthetic. Each project should stand on its own visually. The diagnostic terminal look evokes:

- Bloomberg Terminal (dense info, monospace, green/cyan accents)
- Medical imaging UIs (numbered sections, "diagnostic" language)
- 80s mainframe CRT aesthetic (scan lines, blinking cursors)

**Design tokens** in `tailwind.config.ts`:
- **`abyss`** — 12 shades of deep blue-black (`#050810` → `#eef0f6`)
- **`signal`** — electric cyan accent (`#00ffc6`)
- **`alert.amber`** and **`alert.red`** — status colors only

**Typography:**
- **Fraunces** for big display serif moments
- **JetBrains Mono** for nearly everything else
- **Geist** as a fallback sans

---

## 📁 Project Structure

```
resumatch-ui/
├── app/
│   ├── layout.tsx              # Fonts + Toaster
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Scanlines, panels, corner brackets
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── dashboard/
│       ├── layout.tsx          # Sidebar + AuthGuard
│       ├── upload/page.tsx     # Drag-and-drop + library
│       ├── jobs/page.tsx       # JD manager with modal
│       ├── analyze/page.tsx    # ⭐ The main flow
│       └── matches/
│           ├── page.tsx        # History list
│           └── [id]/page.tsx   # Match detail
├── components/
│   ├── brand/Logo.tsx
│   ├── ui/                     # Button, Input, Textarea, Panel, EmptyState
│   └── dashboard/              # Sidebar, TopBar, ScoreGauge, AuthGuard, AuthFrame
├── lib/
│   ├── api.ts                  # Full API client for Spring Boot backend
│   ├── types.ts                # TypeScript DTOs
│   ├── format.ts               # Date / bytes formatting
│   └── utils.ts                # className merger
└── public/                     # (add og-image.png etc. here)
```

---

## 🚢 Deployment

Deploy to Vercel:

1. Push to GitHub
2. Import at https://vercel.com/new
3. **Add env var:** `NEXT_PUBLIC_API_URL` → your deployed backend URL
4. Deploy

⚠️ Your Spring Boot backend must be deployed somewhere (Railway, Render, Fly.io) BEFORE deploying the UI, otherwise the UI can't talk to it.

### Backend deployment note

If you deploy the backend to Railway (recommended — free tier), you'll need to also allow CORS from your frontend URL. Update `SecurityConfig.java` in the backend:

```java
cors.setAllowedOriginPatterns(List.of(
    "http://localhost:3000",
    "https://resumatch-ui.vercel.app"  // your UI URL
));
```

---

## 🎬 Demo Flow

1. Land on homepage → click "RUN DIAGNOSTIC"
2. Register an account (takes 5 seconds)
3. Upload a resume PDF — watch it parse
4. Click "JOB DESCRIPTIONS" → paste any JD you've applied to
5. Click "ANALYZE" → pick your resume + the JD → hit "RUN DIAGNOSTIC"
6. Watch the 2-second loading animation
7. **Animated score gauge** reveals your match percentage
8. Scroll down — see matched keywords (cyan) and missing keywords (amber)
9. Read the recommendation and update your resume accordingly

**This is what you record for LinkedIn.** The 30-second demo = instant "hire this person" signal.

---

## 🛣️ Potential v2 features

- [ ] Side-by-side resume/JD diff view
- [ ] Compare multiple JDs against one resume (batch analyze)
- [ ] Export match report as PDF
- [ ] Admin dashboard with total-usage stats
- [ ] Dark-mode-only (already is — but add a light theme toggle just to show off)
- [ ] Real-time re-analysis as you type into a JD
- [ ] Shareable public match URLs (for anonymous demo mode)

---

**Built by Aman Patel** · [Portfolio](https://aman-portfolio-lilac.vercel.app) · [GitHub](https://github.com/Aman100705)
