"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, Loader2, ArrowRight } from "lucide-react";
import { TopBar } from "@/components/dashboard/TopBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { MatchAnalysis } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadMatches() {
    try {
      const page = await api.listMatches(0, 50);
      setMatches(page.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMatches();
  }, []);

  async function handleDelete(id: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this match record?")) return;
    try {
      await api.deleteMatch(id);
      toast.success("Match record purged");
      setMatches((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  function scoreColor(score: number): string {
    if (score >= 80) return "text-signal";
    if (score >= 65) return "text-signal-400";
    if (score >= 50) return "text-alert-amber";
    return "text-alert-red";
  }

  return (
    <>
      <TopBar
        title="Match history"
        subtitle="Every diagnostic you've run, latest first"
      />

      <main className="px-8 py-10">
        <div className="mb-6 flex items-center gap-4">
          <span className="tag-label">
            {loading ? "LOADING..." : `${matches.length} RECORDS`}
          </span>
          <span className="h-px flex-1 bg-abyss-800" />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-signal" size={20} />
          </div>
        ) : matches.length === 0 ? (
          <EmptyState
            icon={History}
            title="No match history"
            description="Run your first diagnostic to populate this archive. All scoring results are saved for future reference."
            action={
              <Link href="/dashboard/analyze">
                <Button>
                  RUN FIRST DIAGNOSTIC <ArrowRight size={13} />
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {matches.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                >
                  <Link
                    href={`/dashboard/matches/${m.id}`}
                    className="panel corner-brackets group block p-5 transition-colors hover:border-signal/40"
                  >
                    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6">
                      {/* Big score */}
                      <div className="text-center">
                        <p className={`font-display text-4xl tabular-nums ${scoreColor(m.matchScore)}`}>
                          {m.matchScore.toFixed(1)}
                        </p>
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-abyss-500">
                          /100
                        </p>
                      </div>

                      {/* Middle content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
                            MATCH #{String(m.id).padStart(3, "0")}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                            ◆ {m.verdict}
                          </span>
                        </div>
                        <h3 className="mt-1 truncate font-display text-xl text-abyss-100 group-hover:text-signal">
                          {m.jobTitle}
                          {m.company && <span className="text-abyss-500"> · {m.company}</span>}
                        </h3>
                        <p className="mt-1 truncate font-mono text-xs text-abyss-400">
                          resume: {m.resumeName} · {formatDate(m.createdAt)}
                        </p>

                        {/* Subscore strip */}
                        <div className="mt-3 flex gap-4 font-mono text-[10px] uppercase tracking-wider text-abyss-500">
                          <span>KW {m.keywordScore.toFixed(0)}</span>
                          <span>·</span>
                          <span>SK {m.skillsScore.toFixed(0)}</span>
                          <span>·</span>
                          <span>TX {m.textScore.toFixed(0)}</span>
                          <span>·</span>
                          <span>{m.matchedKeywords.length} matched</span>
                          <span>·</span>
                          <span>{m.missingKeywords.length} missing</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDelete(m.id, e)}
                          className="flex h-8 w-8 items-center justify-center text-abyss-500 opacity-0 transition group-hover:opacity-100 hover:text-alert-red"
                        >
                          <Trash2 size={12} />
                        </button>
                        <ArrowRight
                          size={14}
                          className="ml-2 text-abyss-500 transition group-hover:translate-x-1 group-hover:text-signal"
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </>
  );
}
