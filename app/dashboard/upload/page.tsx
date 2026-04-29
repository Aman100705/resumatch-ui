"use client";

import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload as UploadIcon,
  FileText,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { TopBar } from "@/components/dashboard/TopBar";
import { Panel } from "@/components/ui/Panel";
import { EmptyState } from "@/components/ui/EmptyState";
import { api } from "@/lib/api";
import type { ResumeResponse } from "@/lib/types";
import { formatBytes, formatDate } from "@/lib/format";

export default function UploadPage() {
  const [resumes, setResumes] = useState<ResumeResponse[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadResumes() {
    try {
      const page = await api.listResumes(0, 50);
      setResumes(page.content);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  const onDrop = useCallback(async (accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files supported");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5 MB");
      return;
    }
    setUploading(true);
    try {
      const resume = await api.uploadResume(file);
      toast.success(`Parsed ${resume.extractedCharCount} characters`);
      setResumes((prev) => [resume, ...prev]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  async function handleDelete(id: number) {
    if (!confirm("Permanently delete this resume?")) return;
    try {
      await api.deleteResume(id);
      toast.success("Resume purged");
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <>
      <TopBar
        title="Upload resume"
        subtitle="PDF only · max 5 MB · auto-extracts text via Apache PDFBox"
      />

      <main className="px-8 py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Dropzone */}
          <Panel label="INPUT BAY" labelSuffix="accepts .pdf">
            <div
              {...getRootProps()}
              className={`relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center border border-dashed transition-all ${
                isDragActive
                  ? "border-signal bg-signal/5"
                  : "border-abyss-700 hover:border-signal/40 hover:bg-abyss-900/30"
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 size={28} className="animate-spin text-signal" />
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal">
                    Parsing PDF...
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex h-16 w-16 items-center justify-center border border-signal/30 bg-signal/5">
                    <UploadIcon size={26} strokeWidth={1.5} className="text-signal" />
                  </div>
                  <p className="mb-2 font-display text-2xl text-abyss-100">
                    {isDragActive ? "Drop it here" : "Drop PDF or click to browse"}
                  </p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-abyss-500">
                    Max 5 MB · Text-based PDFs only
                  </p>
                  <div className="mt-8 flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-abyss-500">
                    <span>◆ PARSING</span>
                    <span>◆ TOKENIZING</span>
                    <span>◆ INDEXING</span>
                  </div>
                </>
              )}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-px bg-abyss-800">
              {[
                { label: "PARSER", value: "PDFBox 3.0" },
                { label: "TIMEOUT", value: "30s" },
                { label: "SCHEMA", value: "Resume v1" },
              ].map((s) => (
                <div key={s.label} className="bg-abyss-900 px-4 py-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-abyss-500">
                    {s.label}
                  </p>
                  <p className="mt-1 font-mono text-xs text-signal">{s.value}</p>
                </div>
              ))}
            </div>
          </Panel>

          {/* Instructions */}
          <Panel label="PROTOCOL" labelSuffix="best practices">
            <div className="space-y-5 font-mono text-xs leading-relaxed text-abyss-300">
              <div>
                <p className="text-signal">01 / Use text-based PDFs</p>
                <p className="mt-1 text-abyss-400">
                  Resumes exported from Word, Google Docs, or LaTeX work
                  perfectly. Scanned/image-based PDFs won't be readable.
                </p>
              </div>
              <div>
                <p className="text-signal">02 / Keep formatting simple</p>
                <p className="mt-1 text-abyss-400">
                  Avoid fancy columns and graphics. ATS parsers (and ours) read
                  top-to-bottom. Two-column resumes can scramble.
                </p>
              </div>
              <div>
                <p className="text-signal">03 / One version, many matches</p>
                <p className="mt-1 text-abyss-400">
                  Upload once. Match against as many JDs as you want. The
                  extracted text is cached for instant re-analysis.
                </p>
              </div>
            </div>
          </Panel>
        </div>

        {/* Resume library */}
        <div className="mt-10">
          <div className="mb-6 flex items-center gap-4">
            <span className="tag-label">
              RESUME LIBRARY · {loading ? "..." : resumes.length}
            </span>
            <span className="h-px flex-1 bg-abyss-800" />
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-signal" size={20} />
            </div>
          ) : resumes.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No resumes yet"
              description="Upload your first PDF above to get started. All subsequent matches will reference it."
            />
          ) : (
            <div className="space-y-px bg-abyss-800">
              <AnimatePresence>
                {resumes.map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 bg-abyss-900 px-5 py-4 hover:bg-abyss-850"
                  >
                    <div className="flex h-10 w-10 items-center justify-center border border-signal/20 bg-signal/5">
                      <FileText size={14} className="text-signal" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-mono text-sm text-abyss-100">
                        {r.originalFilename}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-abyss-500">
                        ID · {r.id} · {formatDate(r.uploadedAt)}
                      </p>
                    </div>
                    <div className="hidden text-right md:block">
                      <p className="font-mono text-xs text-abyss-200">
                        {formatBytes(r.fileSize)}
                      </p>
                      <p className="font-mono text-[10px] uppercase text-abyss-500">
                        size
                      </p>
                    </div>
                    <div className="hidden text-right md:block">
                      <p className="font-mono text-xs text-signal">
                        {r.extractedCharCount.toLocaleString()}
                      </p>
                      <p className="font-mono text-[10px] uppercase text-abyss-500">
                        chars
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="hidden items-center gap-1.5 pr-3 font-mono text-[10px] uppercase tracking-wider text-signal md:flex">
                        <CheckCircle2 size={11} /> INDEXED
                      </span>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="flex h-8 w-8 items-center justify-center text-abyss-500 opacity-0 transition group-hover:opacity-100 hover:text-alert-red"
                        aria-label="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
