"use client";

import { cn } from "@/lib/utils";
import { forwardRef, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-mono uppercase tracking-[0.15em] transition-all disabled:opacity-40 disabled:cursor-not-allowed";

    const variants: Record<Variant, string> = {
      primary:
        "bg-signal text-abyss-950 hover:bg-signal-300 hover:shadow-[0_0_20px_rgba(0,255,198,0.5)]",
      ghost:
        "border border-abyss-600 text-abyss-200 hover:border-signal hover:text-signal hover:bg-signal/5",
      danger:
        "border border-alert-red/30 text-alert-red hover:bg-alert-red/10",
    };

    const sizes: Record<Size, string> = {
      sm: "text-[10px] px-3 py-1.5",
      md: "text-[11px] px-5 py-2.5",
      lg: "text-xs px-7 py-3.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-current animate-pulse" />
            Processing
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = "Button";
