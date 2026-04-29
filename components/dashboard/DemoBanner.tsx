"use client";

import { DEMO_MODE } from "@/lib/api";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (!DEMO_MODE || dismissed) return null;

  return (
    <div className="border-b border-signal/20 bg-signal/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2.5">
        <div className="flex items-center gap-3">
          <AlertCircle size={14} className="text-signal shrink-0" strokeWidth={1.5} />
          <p className="font-mono text-[11px] text-abyss-200">
            <span className="text-signal font-medium">DEMO MODE</span>
            <span className="mx-2 text-abyss-600">//</span>
            <span className="text-abyss-300">
              Running without backend — data stored in browser only. All logic runs client-side.
            </span>
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="font-mono text-[10px] uppercase tracking-[0.15em] text-abyss-400 hover:text-signal transition"
        >
          dismiss ✕
        </button>
      </div>
    </div>
  );
}
