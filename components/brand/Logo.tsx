import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 font-mono tracking-tight",
        sizes[size],
        className
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect x="1" y="1" width="16" height="16" stroke="#00ffc6" strokeWidth="1.5" />
        <path d="M5 9 L8 12 L13 6" stroke="#00ffc6" strokeWidth="1.5" fill="none" />
        <rect x="1" y="1" width="4" height="4" fill="#00ffc6" />
      </svg>
      <span className="font-medium">
        RESU<span className="text-signal">MATCH</span>
      </span>
    </div>
  );
}
