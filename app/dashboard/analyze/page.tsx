"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Play,
  Loader2,
  Zap,
  CheckCircle2,
  CircleOff,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { TopBar } from "@/components/dashboard/TopBar";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
import { ScoreGauge } from "@/components/dashboard/ScoreGauge";
import { api } from "@/lib/api";
import type { ResumeResponse, JobDescriptionSummary, MatchAnalysis } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function AnalyzePage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [jobs, setJobs] = useState<JobDescriptionSummary[]>([]);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [jobId, setJobId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<MatchAnalysis | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [rPage, jPage] = await Promise.all([
          api.listResumes(0, 50),
          api.listJobs(0, 50),
        ]);
        setResumes(rPage.content);
        setJobs(jPage.content);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Load failed");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleAnalyze() {
    if (!resumeId || !jobId) {
      toast.error("Select a resume AND a job description");
      return;
    }
    setRunning(true);
    setResult(null);
    try {
      // Minimum 1.5s so the user actually sees the loading state
      const [match] = await Promise.all([
        api.analyze(resumeId, jobId),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
      setResult(match);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Analyze failed");
    } finally {
      setRunning(false);
    }
  }

  const needsData = resumes.length === 0 || jobs.length === 0;

  return (
    <>
      <TopBar
        title="Analyze"
        subtitle="Match resume against JD · scoring latency < 100ms"
      />

      <main className="px-8 py-10">
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-signal" size={24} />
          </div>
        ) : needsData ? (
          <NeedsDataPrompt hasResumes={resumes.length > 0} hasJobs={jobs.length > 0} />
        ) : (
          <>
            {/* Selection panels */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Panel label="TARGET · RESUME" labelSuffix="select one">
                <SelectionList
                  items={resumes.map((r) => ({
                    id: r.id,
                    title: r.originalFilename,
                    sub: `${r.extractedCharCount.toLocaleString()} chars · ${formatDate(r.uploadedAt)}`,
                    icon: FileText,
                  }))}
                  selectedId={resumeId}
                  onSelect={setResumeId}
                />
              </Panel>

              <Panel label="TARGET · JOB DESC" labelSuffix="select one">
                <SelectionList
                  items={jobs.map((j) => ({
                    id: j.id,
                    title: j.title,
                    sub: j.company ? `@ ${j.company}` : `ID · ${j.id}`,
                    icon: Briefcase,
                  }))}
                  selectedId={jobId}
                  onSelect={setJobId}
                />
              </Panel>
            </div>

            {/* Run button */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <Button
                onClick={handleAnalyze}
                disabled={!resumeId || !jobId || running}
                loading={running}
                size="lg"
                className="min-w-[280px]"
              >
                <Zap size={15} strokeWidth={2.5} />
                {running ? "ANALYZING..." : "RUN DIAGNOSTIC"}
              </Button>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
                ↵ ENTER · EXECUTE SCAN
              </p>
            </div>

            {/* Results */}
            {running && <RunningAnimation />}
            {result && <Results match={result} onReset={() => setResult(null)} />}
          </>
        )}
      </main>
    </>
  );
}

// ======= Sub-components =======

function NeedsDataPrompt({ hasResumes, hasJobs }: { hasResumes: boolean; hasJobs: boolean }) {
  return (
    <Panel label="CONFIGURATION REQUIRED" labelSuffix="complete setup">
      <div className="py-10 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center border border-alert-amber/30 bg-alert-amber/5">
          <CircleOff size={22} className="text-alert-amber" />
        </div>
        <h3 className="mb-2 font-display text-2xl text-abyss-100">
          Missing input data
        </h3>
        <p className="mb-8 font-mono text-xs text-abyss-400">
          You need at least one resume AND one job description to run a match.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {!hasResumes && (
            <Link href="/dashboard/upload">
              <Button>
                <FileText size={13} /> UPLOAD RESUME
              </Button>
            </Link>
          )}
          {!hasJobs && (
            <Link href="/dashboard/jobs">
              <Button variant="ghost">
                <Briefcase size={13} /> CREATE JD
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Panel>
  );
}

function SelectionList<T extends { id: number; title: string; sub: string; icon: React.ElementType }>({
  items,
  selectedId,
  onSelect,
}: {
  items: T[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="max-h-[320px] space-y-1.5 overflow-y-auto pr-2">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.id === selectedId;
        return (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={`flex w-full items-center gap-3 border px-3 py-3 text-left transition-all ${
              active
                ? "border-signal bg-signal/10"
                : "border-abyss-700 hover:border-signal/40 hover:bg-abyss-900"
            }`}
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center border ${
              active ? "border-signal bg-signal/20" : "border-abyss-700"
            }`}>
              <Icon size={13} className={active ? "text-signal" : "text-abyss-400"} />
            </div>
            <div className="min-w-0 flex-1">
              <p className={`truncate font-mono text-xs ${
                active ? "text-signal" : "text-abyss-100"
              }`}>
                {item.title}
              </p>
              <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-abyss-500">
                {item.sub}
              </p>
            </div>
            {active && (
              <CheckCircle2 size={14} className="shrink-0 text-signal" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function RunningAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mt-12 panel corner-brackets p-10 text-center"
    >
      <div className="mx-auto mb-8 h-20 w-20 relative">
        <div className="absolute inset-0 border-2 border-signal/20 animate-ping" />
        <div className="absolute inset-2 border border-signal animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Zap size={24} className="text-signal" />
        </div>
      </div>
      <div className="space-y-2 font-mono text-[11px] uppercase tracking-[0.15em] text-abyss-400">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <span className="text-signal">&gt;</span> Tokenizing resume corpus
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <span className="text-signal">&gt;</span> Parsing JD keywords
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
          <span className="text-signal">&gt;</span> Computing intersections
        </motion.p>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}>
          <span className="text-signal">&gt;</span> <span className="cursor-blink">Calculating match index</span>
        </motion.p>
      </div>
    </motion.div>
  );
}

function Results({ match, onReset }: { match: MatchAnalysis; onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mt-12"
    >
      <div className="mb-8 flex items-center gap-4">
        <span className="tag-label tag-label-signal">◆ DIAGNOSTIC COMPLETE</span>
        <span className="h-px flex-1 bg-signal/30" />
        <button
          onClick={onReset}
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-400 hover:text-signal"
        >
          NEW ANALYSIS →
        </button>
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

        {/* Keyword analysis */}
        <div className="space-y-6">
          <Panel label="MATCHED" labelSuffix={`${match.matchedKeywords.length} hits`}>
            {match.matchedKeywords.length === 0 ? (
              <p className="font-mono text-xs text-abyss-500">None detected.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {match.matchedKeywords.map((kw, i) => (
                  <motion.span
                    key={kw}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.2 + i * 0.02 }}
                    className="inline-flex items-center gap-1.5 border border-signal/30 bg-signal/5 px-2.5 py-1 font-mono text-[11px] text-signal"
                  >
                    <span className="h-1 w-1 rounded-full bg-signal" />
                    {kw}
                  </motion.span>
                ))}
              </div>
            )}
          </Panel>

          <Panel label="GAP · MISSING" labelSuffix={`${match.missingKeywords.length} items`}>
            {match.missingKeywords.length === 0 ? (
              <p className="font-mono text-xs text-signal">◆ FULL COVERAGE · NO GAPS DETECTED</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {match.missingKeywords.map((kw, i) => (
                  <motion.span
                    key={kw}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 2.5 + i * 0.02 }}
                    className="inline-flex items-center gap-1.5 border border-alert-amber/30 bg-alert-amber/5 px-2.5 py-1 font-mono text-[11px] text-alert-amber"
                  >
                    <span className="h-1 w-1 rounded-full bg-alert-amber" />
                    {kw}
                  </motion.span>
                ))}
              </div>
            )}
          </Panel>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8 }}
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
    </motion.div>
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
