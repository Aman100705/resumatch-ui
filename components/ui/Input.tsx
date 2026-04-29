"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={id}
            className="tag-label block"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full bg-abyss-900 border border-abyss-700 px-4 py-3 text-sm font-mono text-abyss-100 placeholder-abyss-500 outline-none transition-all",
              "focus:border-signal focus:shadow-[0_0_0_3px_rgba(0,255,198,0.1)]",
              error && "border-alert-red/50",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="font-mono text-[10px] uppercase tracking-wider text-alert-red">
            ! {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
