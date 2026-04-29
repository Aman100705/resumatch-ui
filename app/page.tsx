"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileUp, ScanLine, Target } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Grid background */}
      <div className="pointer-events-none fixed inset-0 bg-grid-faint [background-size:60px_60px]" />

      {/* Ambient glow */}
      <div className="pointer-events-none fixed -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 bg-signal/[0.04] blur-[120px]" />

      {/* Navbar */}
      <header className="relative z-10 border-b border-abyss-800/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link
              href="/auth/login"
              className="font-mono text-[11px] uppercase tracking-[0.15em] text-abyss-300 hover:text-signal transition"
            >
              SIGN IN
            </Link>
            <Link
              href="/auth/register"
              className="border border-signal bg-signal/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-signal hover:bg-signal hover:text-abyss-950 transition"
            >
              REQUEST ACCESS →
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 px-6 pt-24 pb-32">
        <div className="mx-auto max-w-6xl">
          {/* Status strip */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-abyss-500"
          >
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
              DIAGNOSTIC TERMINAL · ONLINE
            </span>
            <span className="hidden md:inline">LATENCY &lt; 100ms</span>
            <span className="hidden md:inline">ATS SIMULATION v1.0</span>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="tag-label mb-6">// WHY THIS EXISTS</p>
            <h1 className="font-display text-5xl leading-[1.02] text-abyss-50 md:text-7xl lg:text-8xl">
              75% of resumes die
              <br />
              before{" "}
              <span className="italic text-signal">a human</span>
              <br />
              ever sees them<span className="text-signal">.</span>
            </h1>
          </motion.div>

          {/* Subhead */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:gap-20"
          >
            <p className="text-lg leading-relaxed text-abyss-200 md:text-xl">
              Applicant Tracking Systems filter resumes by keyword before a
              recruiter ever opens them. ResuMatch runs the same logic{" "}
              <span className="text-signal">against your own resume</span>,
              shows you the gap, and tells you exactly what to add.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-signal">→</span>
                <span className="font-mono text-xs leading-relaxed text-abyss-300">
                  Match score from 0–100 with 3 explained subscores
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-signal">→</span>
                <span className="font-mono text-xs leading-relaxed text-abyss-300">
                  Keyword gap analysis — see what's missing, instantly
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 text-signal">→</span>
                <span className="font-mono text-xs leading-relaxed text-abyss-300">
                  Fast, explainable, deterministic. No black-box LLM.
                </span>
              </div>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-14 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-3 bg-signal px-7 py-4 font-mono text-xs uppercase tracking-[0.15em] text-abyss-950 hover:shadow-[0_0_30px_rgba(0,255,198,0.5)] transition-all"
            >
              Run diagnostic
              <ArrowRight size={14} strokeWidth={2.5} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/login"
              className="font-mono text-xs uppercase tracking-[0.15em] text-abyss-300 underline underline-offset-8 decoration-abyss-600 hover:text-signal hover:decoration-signal transition"
            >
              Already have access? Sign in →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ASCII divider */}
      <div className="ascii-divider border-y border-abyss-800/50 bg-abyss-900/30 py-4 text-center">
        ▸ ▸ ▸ DIAGNOSTIC · PROTOCOL · 3 · PHASES ◂ ◂ ◂
      </div>

      {/* HOW IT WORKS */}
      <section className="relative z-10 px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 flex items-center gap-4">
            <span className="tag-label">01 / PROCEDURE</span>
            <span className="h-px flex-1 bg-abyss-800" />
          </div>

          <h2 className="mb-20 max-w-3xl font-display text-4xl text-abyss-100 md:text-6xl">
            Three steps.{" "}
            <span className="italic text-signal">Under a minute.</span>{" "}
            Data you can act on.
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: FileUp,
                title: "Upload resume",
                desc: "Drag your PDF in. We extract every word using Apache PDFBox. Plain-text, no OCR voodoo.",
              },
              {
                step: "02",
                icon: ScanLine,
                title: "Paste job description",
                desc: "Grab any JD from LinkedIn, Glassdoor, wherever. Our parser extracts keywords + required skills.",
              },
              {
                step: "03",
                icon: Target,
                title: "Read the diagnosis",
                desc: "Score, matched keywords, missing keywords, and specific recommendations. Close the gap.",
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="panel corner-brackets p-6"
                >
                  <div className="mb-6 flex items-start justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
                      STEP / {s.step}
                    </span>
                    <Icon size={18} strokeWidth={1.5} className="text-signal" />
                  </div>
                  <h3 className="mb-3 font-display text-2xl text-abyss-100">{s.title}</h3>
                  <p className="font-mono text-xs leading-relaxed text-abyss-400">
                    {s.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-abyss-800/50 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
              © 2026 · BUILT BY AMAN PATEL
            </span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
            <a
              href="https://aman-portfolio-lilac.vercel.app"
              target="_blank"
              rel="noreferrer"
              className="hover:text-signal transition"
            >
              Portfolio ↗
            </a>
            <a
              href="https://github.com/Aman100705"
              target="_blank"
              rel="noreferrer"
              className="hover:text-signal transition"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
