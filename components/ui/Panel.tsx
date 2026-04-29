import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  labelSuffix?: string;
  padded?: boolean;
}

export function Panel({
  className,
  children,
  label,
  labelSuffix,
  padded = true,
  ...props
}: PanelProps) {
  return (
    <div
      className={cn(
        "panel corner-brackets",
        padded && "p-6",
        className
      )}
      {...props}
    >
      {label && (
        <div className="mb-4 flex items-center gap-3">
          <span className="tag-label tag-label-signal">{label}</span>
          {labelSuffix && (
            <span className="tag-label text-abyss-500 before:mr-2 before:content-['//']">
              {labelSuffix}
            </span>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
