"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Trash2,
  Loader2,
  Search,
  Briefcase,
  X,
} from "lucide-react";
import { TopBar } from "@/components/dashboard/TopBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { api } from "@/lib/api";
import type { JobDescriptionSummary } from "@/lib/types";
import { formatDate } from "@/lib/format";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobDescriptionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  async function loadJobs(searchTerm?: string) {
    try {
      const page = await api.listJobs(0, 50, searchTerm);
      setJobs(page.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      loadJobs(search.trim() || undefined);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function handleDelete(id: number) {
    if (!confirm("Permanently delete this job description?")) return;
    try {
      await api.deleteJob(id);
      toast.success("Job description purged");
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <>
      <TopBar
        title="Job descriptions"
        subtitle="The targets you're matching your resume against"
      />

      <main className="px-8 py-10">
        {/* Toolbar */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-abyss-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="w-full bg-abyss-900 border border-abyss-700 py-3 pl-11 pr-4 font-mono text-xs text-abyss-100 placeholder-abyss-500 outline-none focus:border-signal"
            />
          </div>

          <Button onClick={() => setModalOpen(true)}>
            <Plus size={14} strokeWidth={2.5} />
            NEW JOB DESCRIPTION
          </Button>
        </div>

        {/* Results */}
        <div className="mb-6 flex items-center gap-4">
          <span className="tag-label">
            {loading ? "SCANNING..." : `${jobs.length} JD${jobs.length === 1 ? "" : "S"}`}
          </span>
          <span className="h-px flex-1 bg-abyss-800" />
          <span className="tag-label">CREATED · DESC</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin text-signal" size={20} />
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title={search ? "No matches" : "No job descriptions"}
            description={
              search
                ? "Try a different search term."
                : "Paste a job description to get started. It becomes the target your resume gets matched against."
            }
            action={
              !search && (
                <Button onClick={() => setModalOpen(true)}>
                  <Plus size={14} strokeWidth={2.5} />
                  CREATE FIRST JD
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence>
              {jobs.map((j) => (
                <motion.article
                  key={j.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="panel corner-brackets group p-5 transition-colors hover:border-signal/30"
                >
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
                      JD · {String(j.id).padStart(3, "0")}
                    </span>
                    <button
                      onClick={() => handleDelete(j.id)}
                      className="flex h-7 w-7 items-center justify-center text-abyss-500 opacity-0 transition group-hover:opacity-100 hover:text-alert-red"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  <h3 className="mb-1 font-display text-xl leading-tight text-abyss-100 transition-colors group-hover:text-signal">
                    {j.title}
                  </h3>
                  {j.company && (
                    <p className="mb-4 font-mono text-xs text-abyss-400">
                      @ {j.company}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-abyss-800 pt-3">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-abyss-500">
                      {formatDate(j.createdAt)}
                    </p>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-signal">
                      READY →
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <CreateJobModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={(newJob) => {
          setJobs((prev) => [
            {
              id: newJob.id,
              title: newJob.title,
              company: newJob.company,
              createdAt: newJob.createdAt,
            },
            ...prev,
          ]);
          setModalOpen(false);
        }}
      />
    </>
  );
}

// ==== Modal ====
function CreateJobModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (j: { id: number; title: string; company: string | null; createdAt: string }) => void;
}) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (content.trim().length < 50) {
      toast.error("Content must be at least 50 characters");
      return;
    }
    setLoading(true);
    try {
      const jd = await api.createJob({ title, company, content });
      toast.success("JD registered · ready for matching");
      onCreated(jd);
      setTitle("");
      setCompany("");
      setContent("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-abyss-950/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 panel p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="tag-label tag-label-signal mb-2">// NEW TARGET</p>
                <h2 className="font-display text-3xl text-abyss-50">
                  Register job description
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center border border-abyss-700 text-abyss-400 hover:border-signal hover:text-signal"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="TITLE"
                placeholder="Java Backend Engineer Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
              />
              <Input
                label="COMPANY (OPTIONAL)"
                placeholder="Cool Startup Inc"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                maxLength={200}
              />
              <Textarea
                label="JOB DESCRIPTION"
                hint={`${content.length} / 20000`}
                placeholder="Paste the full JD here — responsibilities, requirements, tech stack, all of it. More context = better matching."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                minLength={50}
                maxLength={20000}
                className="min-h-[240px]"
              />
              <div className="flex gap-3 pt-2">
                <Button type="submit" loading={loading} className="flex-1">
                  REGISTER JD
                </Button>
                <Button type="button" variant="ghost" onClick={onClose}>
                  CANCEL
                </Button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
