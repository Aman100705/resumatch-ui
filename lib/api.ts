import type {
  AuthResponse,
  JobDescription,
  JobDescriptionSummary,
  MatchAnalysis,
  Page,
  ResumeResponse,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const TOKEN_KEY = "resumatch_token";
const USER_KEY  = "resumatch_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function saveAuth(data: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
    })
  );
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { email: string; fullName: string; role: string };
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthed(): boolean {
  return getToken() !== null;
}

/** Low-level fetch wrapper that auto-attaches JWT and parses errors. */
async function request<T>(
  path: string,
  options: RequestInit = {},
  isFormData = false
): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (!isFormData && options.body) headers.set("Content-Type", "application/json");

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) message = data.message;
      if (data?.fieldErrors) {
        const fields = Object.entries(data.fieldErrors)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        message = `${message} — ${fields}`;
      }
    } catch {
      // ignore JSON parse failures
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ===================== Auth =====================
const liveApi = {
  register: (data: {
    fullName: string;
    email: string;
    password: string;
  }) =>
    request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // =================== Resumes ==================
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<ResumeResponse>(
      "/api/resumes/upload",
      { method: "POST", body: formData },
      true
    );
  },

  listResumes: (page = 0, size = 20) =>
    request<Page<ResumeResponse>>(
      `/api/resumes?page=${page}&size=${size}&sort=uploadedAt,desc`
    ),

  getResume: (id: number) => request<ResumeResponse>(`/api/resumes/${id}`),

  getResumeText: (id: number) =>
    request<{ id: string; filename: string; text: string }>(
      `/api/resumes/${id}/text`
    ),

  deleteResume: (id: number) =>
    request<void>(`/api/resumes/${id}`, { method: "DELETE" }),

  // ================== Job Descriptions =============
  createJob: (data: { title: string; company?: string; content: string }) =>
    request<JobDescription>("/api/job-descriptions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  listJobs: (page = 0, size = 20, search?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort: "createdAt,desc",
    });
    if (search) params.set("search", search);
    return request<Page<JobDescriptionSummary>>(
      `/api/job-descriptions?${params.toString()}`
    );
  },

  getJob: (id: number) => request<JobDescription>(`/api/job-descriptions/${id}`),

  updateJob: (
    id: number,
    data: { title: string; company?: string; content: string }
  ) =>
    request<JobDescription>(`/api/job-descriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteJob: (id: number) =>
    request<void>(`/api/job-descriptions/${id}`, { method: "DELETE" }),

  // ==================== Matches ====================
  analyze: (resumeId: number, jobDescriptionId: number) =>
    request<MatchAnalysis>("/api/matches/analyze", {
      method: "POST",
      body: JSON.stringify({ resumeId, jobDescriptionId }),
    }),

  listMatches: (page = 0, size = 20) =>
    request<Page<MatchAnalysis>>(
      `/api/matches?page=${page}&size=${size}`
    ),

  getMatch: (id: number) => request<MatchAnalysis>(`/api/matches/${id}`),

  deleteMatch: (id: number) =>
    request<void>(`/api/matches/${id}`, { method: "DELETE" }),
};

// ======================================================
// Exported `api` — switches between real backend and mock.
// Set NEXT_PUBLIC_DEMO_MODE=true in .env.local to use mock.
// ======================================================
import { mockApi } from "./mockApi";

export const DEMO_MODE =
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export const api = DEMO_MODE ? mockApi : liveApi;

