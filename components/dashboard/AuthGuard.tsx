"use client";

import { isAuthed } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      router.replace("/auth/login");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abyss-950">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-signal">
          <span className="cursor-blink">Authenticating</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
