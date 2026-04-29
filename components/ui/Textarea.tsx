"use client";

import { cn } from "@/lib/utils";
import { forwardRef, TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <div className="flex items-baseline justify-between">
            <label htmlFor={id} className="tag-label">
              {label}
            </label>
            {hint && (
              <span className="font-mono text-[10px] text-abyss-500">{hint}</span>
            )}
          </div>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-abyss-900 border border-abyss-700 px-4 py-3 text-sm font-mono text-abyss-100 placeholder-abyss-500 outline-none transition-all resize-y min-h-[160px]",
            "focus:border-signal focus:shadow-[0_0_0_3px_rgba(0,255,198,0.1)]",
            error && "border-alert-red/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="font-mono text-[10px] uppercase tracking-wider text-alert-red">
            ! {error}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
