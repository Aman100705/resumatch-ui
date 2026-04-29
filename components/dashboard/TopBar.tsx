"use client";

import { useEffect, useState } from "react";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toISOString().replace("T", " ").slice(0, 19) + " UTC"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-10 border-b border-abyss-800 bg-abyss-950/80 backdrop-blur">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="tag-label tag-label-signal">/ACTIVE</span>
            <h1 className="font-display text-2xl text-abyss-50">{title}</h1>
          </div>
          {subtitle && (
            <p className="mt-1 font-mono text-[11px] text-abyss-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="hidden items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] md:flex">
          <div className="flex items-center gap-2 text-abyss-400">
            <span className="h-1.5 w-1.5 rounded-full bg-signal animate-pulse" />
            <span>SYSTEM NOMINAL</span>
          </div>
          <div className="text-abyss-500">{time}</div>
        </div>
      </div>
    </header>
  );
}
