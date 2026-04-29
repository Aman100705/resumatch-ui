import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center border border-signal/20 bg-signal/5">
        <Icon size={22} strokeWidth={1.5} className="text-signal" />
      </div>
      <h3 className="mb-2 font-display text-2xl text-abyss-100">{title}</h3>
      <p className="mb-6 max-w-sm font-mono text-xs leading-relaxed text-abyss-400">
        {description}
      </p>
      {action}
    </div>
  );
}
