"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  Gauge,
  History,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { clearAuth, getUser } from "@/lib/api";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard/upload", label: "UPLOAD", code: "01", icon: Upload },
  { href: "/dashboard/jobs", label: "JOB DESCRIPTIONS", code: "02", icon: FileText },
  { href: "/dashboard/analyze", label: "ANALYZE", code: "03", icon: Gauge },
  { href: "/dashboard/matches", label: "MATCH HISTORY", code: "04", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function handleLogout() {
    clearAuth();
    router.push("/");
  }

  return (
    <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col border-r border-abyss-800 bg-abyss-950/80 backdrop-blur">
      {/* Logo + header */}
      <div className="border-b border-abyss-800 p-6">
        <Link href="/dashboard/upload">
          <Logo />
        </Link>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-abyss-500">
          v1.0 · DIAGNOSTIC
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4">
        <p className="tag-label mb-3 px-3">Navigation</p>
        <ul className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-all",
                    active
                      ? "bg-signal/10 text-signal border-l-2 border-signal -ml-[2px]"
                      : "text-abyss-300 hover:text-signal hover:bg-abyss-800/50"
                  )}
                >
                  <span className="text-[9px] text-abyss-500 group-hover:text-signal">
                    {item.code}
                  </span>
                  <Icon size={14} strokeWidth={1.5} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User + logout */}
      <div className="border-t border-abyss-800 p-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-signal/10 border border-signal/20">
            <UserIcon size={12} className="text-signal" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate font-mono text-xs text-abyss-100">
              {user?.fullName ?? "—"}
            </p>
            <p className="truncate font-mono text-[10px] text-abyss-500">
              {user?.email ?? "not signed in"}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 border border-abyss-700 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-abyss-300 transition hover:border-alert-red/50 hover:text-alert-red"
        >
          <LogOut size={11} />
          SIGN OUT
        </button>
      </div>
    </aside>
  );
}
