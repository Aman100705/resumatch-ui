"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import { TopBar } from "@/components/dashboard/TopBar";
import { Panel } from "@/components/ui/Panel";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { api } from "@/lib/api";
import type { MatchAnalysis } from "@/lib/types";
import { formatAbsolute } from "@/lib/format";

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const [match, setMatch] = useState<MatchAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const m = await api.getMatch(id);
        setMatch(m);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Not found");
        router.push("/dashboard/matches");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) {
    return (
      <>
        <TopBar title="Loading match..." />
        <main className="flex justify-center py-24">
          <Loader2 className="animate-spin text-signal" size={22} />
        </main>
      </>
    );
  }

  if (!match) return null;

  return (
    <>
      <TopBar
        title={`Match #${String(match.id).padStart(3, "0")}`}
        subtitle={`Archived · ${formatAbsolute(match.createdAt)}`}
      />

      <main className="px-8 py-10">
        <Link
          href="/dashboard/matches"
          className="mb-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-400 hover:text-signal transition"
        >
          <ArrowLeft size={12} /> BACK TO HISTORY
        </Link>

        {/* Header */}
        <div className="mb-10 border-b border-abyss-800 pb-6">
          <p className="tag-label tag-label-signal mb-2">// DIAGNOSTIC ARCHIVE</p>
          <h1 className="font-display text-4xl text-abyss-50">
            {match.jobTitle}
            {match.company && <span className="text-abyss-500"> · {match.company}</span>}
          </h1>
          <p className="mt-2 font-mono text-xs text-abyss-400">
            Resume: {match.resumeName}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[auto_1fr]">
          {/* Gauge */}
          <Panel className="flex flex-col items-center justify-center">
            <ScoreGauge score={match.matchScore} verdict={match.verdict} />
            <div className="mt-8 w-full border-t border-abyss-800 pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <Subscore label="KEYWORDS" value={match.keywordScore} weight="50%" />
                <Subscore label="SKILLS" value={match.skillsScore} weight="30%" />
                <Subscore label="TEXT" value={match.textScore} weight="20%" />
              </div>
            </div>
          </Panel>

          <div className="space-y-6">
            <Panel label="MATCHED KEYWORDS" labelSuffix={`${match.matchedKeywords.length} hits`}>
              {match.matchedKeywords.length === 0 ? (
                <p className="font-mono text-xs text-abyss-500">None detected.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {match.matchedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 border border-signal/30 bg-signal/5 px-2.5 py-1 font-mono text-[11px] text-signal"
                    >
                      <span className="h-1 w-1 rounded-full bg-signal" />
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </Panel>

            <Panel label="MISSING · GAP" labelSuffix={`${match.missingKeywords.length} items`}>
              {match.missingKeywords.length === 0 ? (
                <p className="font-mono text-xs text-signal">◆ FULL COVERAGE</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {match.missingKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 border border-alert-amber/30 bg-alert-amber/5 px-2.5 py-1 font-mono text-[11px] text-alert-amber"
                    >
                      <span className="h-1 w-1 rounded-full bg-alert-amber" />
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </Panel>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="panel corner-brackets border-signal/30 p-6"
            >
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-signal" />
                <p className="tag-label tag-label-signal">RECOMMENDATION</p>
              </div>
              <p className="font-mono text-xs leading-relaxed text-abyss-200">
                {match.recommendation}
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
}

function Subscore({ label, value, weight }: { label: string; value: number; weight: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-abyss-500">
        {label} · {weight}
      </p>
      <p className="mt-1 font-display text-2xl tabular-nums text-abyss-100">
        {value.toFixed(1)}
      </p>
    </div>
  );
}
