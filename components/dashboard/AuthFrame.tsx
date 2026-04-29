import { Logo } from "@/components/brand/Logo";
import Link from "next/link";

export function AuthFrame({
  title,
  subtitle,
  children,
  alt,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  alt: { text: string; linkText: string; href: string };
}) {
  return (
    <div className="relative flex min-h-screen">
      {/* Left: decorative pane */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-abyss-800 bg-abyss-950 p-12 lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-grid-faint [background-size:60px_60px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 bg-signal/5 blur-[100px]" />

        {/* Animated scan line */}
        <div
          className="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-signal to-transparent opacity-60"
          style={{ animation: "scanLine 4s linear infinite" }}
        />

        <Link href="/" className="relative z-10">
          <Logo />
        </Link>

        <div className="relative z-10 space-y-8">
          <div>
            <p className="tag-label tag-label-signal mb-4">// SESSION LOG</p>
            <div className="space-y-1.5 font-mono text-[11px] text-abyss-400">
              <p><span className="text-signal">&gt;</span> Initializing diagnostic terminal...</p>
              <p><span className="text-signal">&gt;</span> Loading skill dictionary (179 terms)</p>
              <p><span className="text-signal">&gt;</span> PDF parser ready · PDFBox 3.0</p>
              <p><span className="text-signal">&gt;</span> Keyword engine ready · Jaccard similarity</p>
              <p><span className="text-signal">&gt;</span> <span className="cursor-blink">Awaiting operator</span></p>
            </div>
          </div>

          <div className="border-l-2 border-signal/30 pl-6">
            <p className="mb-2 font-display text-2xl italic text-abyss-100">
              "If your resume doesn't hit the keywords, it never reaches a
              human."
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
              — Every recruiter, quietly
            </p>
          </div>
        </div>

        <p className="relative z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
          BUILD 1.0.0 · {new Date().getFullYear()}
        </p>
      </div>

      {/* Right: form */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-10 inline-block lg:hidden">
            <Logo />
          </Link>

          <p className="tag-label mb-3">// {title.toUpperCase()}</p>
          <h1 className="mb-3 font-display text-4xl text-abyss-50 md:text-5xl">
            {title}
          </h1>
          <p className="mb-10 font-mono text-xs leading-relaxed text-abyss-400">
            {subtitle}
          </p>

          {children}

          <p className="mt-8 border-t border-abyss-800 pt-6 font-mono text-[11px] text-abyss-500">
            {alt.text}{" "}
            <Link
              href={alt.href}
              className="text-signal underline underline-offset-4 hover:text-signal-300"
            >
              {alt.linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
