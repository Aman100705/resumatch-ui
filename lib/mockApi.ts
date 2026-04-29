/**
 * mockApi.ts — Client-side fake backend for demo mode.
 * Mimics the Spring Boot API with the same response shapes + realistic delays.
 * All data persists in localStorage so it survives page reloads.
 */

import type {
  AuthResponse,
  JobDescription,
  JobDescriptionSummary,
  MatchAnalysis,
  Page,
  ResumeResponse,
} from "./types";

// ---------- Storage helpers ----------
const STORE_KEY = "resumatch_demo_store";

type DemoStore = {
  users: Array<{ id: number; email: string; password: string; fullName: string }>;
  resumes: Array<ResumeResponse & { userId: number; extractedText: string }>;
  jobs: Array<JobDescription & { userId: number }>;
  matches: MatchAnalysis[];
  nextIds: { user: number; resume: number; job: number; match: number };
};

function emptyStore(): DemoStore {
  return {
    users: [],
    resumes: [],
    jobs: [],
    matches: [],
    nextIds: { user: 1, resume: 1, job: 1, match: 1 },
  };
}

function loadStore(): DemoStore {
  if (typeof window === "undefined") return emptyStore();
  const raw = localStorage.getItem(STORE_KEY);
  if (!raw) return emptyStore();
  try {
    return JSON.parse(raw) as DemoStore;
  } catch {
    return emptyStore();
  }
}

function saveStore(store: DemoStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

// ---------- Auth token helpers ----------
const DEMO_USER_KEY = "resumatch_demo_current_user";

function getCurrentUserId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DEMO_USER_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed.id === "number" ? parsed.id : null;
  } catch {
    return null;
  }
}

function setCurrentUser(id: number) {
  localStorage.setItem(DEMO_USER_KEY, JSON.stringify({ id }));
}

// ---------- Delays ----------
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- Keyword extractor (simplified Java dictionary) ----------
const TECH_SKILLS = new Set([
  "java", "python", "javascript", "typescript", "c++", "c#", "go", "rust", "kotlin",
  "swift", "php", "ruby", "scala", "r", "dart",
  "spring boot", "spring", "hibernate", "jpa",
  "node.js", "nodejs", "express", "django", "flask", "fastapi", "nestjs",
  "react", "react.js", "angular", "vue", "svelte", "next.js", "redux",
  "tailwind", "bootstrap", "html", "css", "sass",
  "mysql", "postgresql", "postgres", "mongodb", "redis", "firebase", "cassandra",
  "dynamodb", "sqlite", "oracle", "elasticsearch",
  "aws", "azure", "gcp", "ec2", "s3", "lambda", "rds",
  "docker", "kubernetes", "terraform", "jenkins",
  "github actions", "gitlab ci", "ci/cd", "nginx", "linux",
  "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
  "scikit-learn", "pandas", "numpy", "opencv", "nlp",
  "llm", "openai", "gpt", "gemini", "langchain", "rag", "embeddings",
  "android", "ios", "react native", "flutter",
  "git", "github", "gitlab", "jira",
  "rest", "restful", "rest api", "graphql", "grpc", "websocket",
  "microservices", "serverless", "oauth", "jwt",
  "agile", "scrum", "kanban", "tdd",
  "oop", "design patterns", "unit testing", "integration testing",
  "junit", "mockito", "jest", "postman", "swagger",
  "sql", "nosql", "kafka", "rabbitmq", "spark",
  "data structures", "algorithms", "dsa", "system design",
]);

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "is", "are", "was", "were", "be", "been",
  "have", "has", "had", "do", "does", "did", "will", "would", "could", "should",
  "i", "you", "he", "she", "it", "we", "they", "my", "your", "his", "her",
  "to", "of", "in", "on", "at", "by", "for", "with", "about", "from", "up", "down",
  "this", "that", "these", "those", "all", "any", "each", "more", "most", "some",
  "work", "experience", "role", "team", "company", "job", "position",
  "skills", "required", "preferred", "years", "year", "must", "nice",
]);

function extractKeywords(text: string): Set<string> {
  const lower = text.toLowerCase();
  const found = new Set<string>();

  // Multi-word skills first
  for (const skill of TECH_SKILLS) {
    if (skill.includes(" ") && lower.includes(skill)) {
      found.add(skill);
    }
  }

  // Single tokens
  const tokens = lower.match(/[a-z][a-z0-9.+#]*/g) ?? [];
  const singleWordSkills = new Set(
    [...TECH_SKILLS].filter((s) => !s.includes(" "))
  );
  for (const token of tokens) {
    if (token.length < 2 || token.length > 30) continue;
    if (STOP_WORDS.has(token)) continue;
    if (singleWordSkills.has(token)) found.add(token);
  }
  return found;
}

function extractJdKeywords(text: string): Set<string> {
  const result = extractKeywords(text);
  const lower = text.toLowerCase();
  const freq = new Map<string, number>();
  const tokens = lower.match(/[a-z][a-z0-9.+#]*/g) ?? [];
  for (const t of tokens) {
    if (t.length < 3 || STOP_WORDS.has(t)) continue;
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  // Add high-frequency tokens
  [...freq.entries()]
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([k]) => result.add(k));
  return result;
}

function jaccardSim(a: string, b: string): number {
  const aTokens = new Set(a.toLowerCase().match(/[a-z]+/g) ?? []);
  const bTokens = new Set(b.toLowerCase().match(/[a-z]+/g) ?? []);
  if (aTokens.size === 0 && bTokens.size === 0) return 0;
  const intersection = new Set([...aTokens].filter((x) => bTokens.has(x)));
  const union = new Set([...aTokens, ...bTokens]);
  return intersection.size / union.size;
}

function computeVerdict(score: number): string {
  if (score >= 80) return "Excellent match";
  if (score >= 65) return "Strong match";
  if (score >= 50) return "Decent match";
  if (score >= 35) return "Weak match";
  return "Poor match";
}

function buildRecommendation(missing: string[]): string {
  if (missing.length === 0) {
    return "Your resume already covers the major keywords from this JD. Focus on tailoring impact statements to the role.";
  }
  const showCount = Math.min(5, missing.length);
  return `Consider adding these keywords to your resume (if you have the experience): ${missing.slice(0, showCount).join(", ")}. Also tailor your impact bullets to match the JD's language.`;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

// ---------- Demo "PDF" text extraction ----------
// Since we can't run PDFBox in the browser, we fake it with a sample resume.
// In real demo, user uploads any PDF and we pretend we extracted this text.
const SAMPLE_RESUME_TEXT = `
Aman Patel
Full-Stack Developer | Backend Engineer

SKILLS
Languages: Java, Python, JavaScript, TypeScript, SQL
Backend: Spring Boot, Node.js, Express, RESTful APIs, JWT, Microservices
Frontend: React.js, Next.js, Tailwind CSS
Databases: MySQL, PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS (EC2, S3, Lambda), Docker, GitHub Actions, CI/CD
AI / ML: TensorFlow, OpenAI API, NLP, Prompt Engineering

PROJECTS
Full-Stack E-Commerce Platform (MERN) - Jan 2025
Built REST APIs with Node.js and Express. Implemented JWT authentication.
Integrated Redis for session caching, reducing API response times by 40%.
Deployed on AWS EC2 with Docker.

AI-Powered Chatbot - Mar 2025
Integrated OpenAI GPT API into Flask backend. Used prompt engineering to
improve response relevance by 50%.

Education: B.Tech Computer Science, SRM Institute, CGPA 8.44/10.
`;

// ============================================================
// PUBLIC API — matches the shape of lib/api.ts exactly
// ============================================================
export const mockApi = {
  async register(data: {
    fullName: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    await delay(600);
    const store = loadStore();
    const email = data.email.toLowerCase().trim();

    if (store.users.some((u) => u.email === email)) {
      throw new Error("Email already registered");
    }
    if (data.password.length < 8) {
      throw new Error("Password must be 8–100 characters");
    }

    const id = store.nextIds.user++;
    store.users.push({
      id,
      email,
      password: data.password, // demo mode — real backend uses BCrypt
      fullName: data.fullName.trim(),
    });
    saveStore(store);
    setCurrentUser(id);

    return {
      token: `demo-token-${id}-${Date.now()}`,
      email,
      fullName: data.fullName.trim(),
      role: "USER",
      expiresIn: 86_400_000,
    };
  },

  async login(data: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    await delay(500);
    const store = loadStore();
    const email = data.email.toLowerCase().trim();
    const user = store.users.find((u) => u.email === email);
    if (!user || user.password !== data.password) {
      throw new Error("Invalid email or password");
    }
    setCurrentUser(user.id);
    return {
      token: `demo-token-${user.id}-${Date.now()}`,
      email: user.email,
      fullName: user.fullName,
      role: "USER",
      expiresIn: 86_400_000,
    };
  },

  async uploadResume(file: File): Promise<ResumeResponse> {
    await delay(1200); // simulate PDF parsing
    const store = loadStore();
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("Only PDF files are supported");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be under 5 MB");
    }

    const id = store.nextIds.resume++;
    const resume: ResumeResponse & { userId: number; extractedText: string } = {
      id,
      userId,
      originalFilename: file.name,
      fileSize: file.size,
      extractedCharCount: SAMPLE_RESUME_TEXT.length,
      uploadedAt: new Date().toISOString(),
      extractedText: SAMPLE_RESUME_TEXT, // demo substitute for real extraction
    };
    store.resumes.push(resume);
    saveStore(store);

    const { userId: _, extractedText: __, ...response } = resume;
    return response;
  },

  async listResumes(
    page = 0,
    size = 20
  ): Promise<Page<ResumeResponse>> {
    await delay(200);
    const store = loadStore();
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    const mine = store.resumes
      .filter((r) => r.userId === userId)
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));

    const start = page * size;
    const content = mine.slice(start, start + size).map((r) => {
      const { userId: _, extractedText: __, ...clean } = r;
      return clean;
    });

    return {
      content,
      totalElements: mine.length,
      totalPages: Math.max(1, Math.ceil(mine.length / size)),
      number: page,
      size,
      first: page === 0,
      last: start + size >= mine.length,
    };
  },

  async getResume(id: number): Promise<ResumeResponse> {
    await delay(150);
    const store = loadStore();
    const userId = getCurrentUserId();
    const r = store.resumes.find((x) => x.id === id && x.userId === userId);
    if (!r) throw new Error("Resume not found");
    const { userId: _, extractedText: __, ...clean } = r;
    return clean;
  },

  async getResumeText(id: number) {
    await delay(150);
    const store = loadStore();
    const userId = getCurrentUserId();
    const r = store.resumes.find((x) => x.id === id && x.userId === userId);
    if (!r) throw new Error("Resume not found");
    return { id: String(r.id), filename: r.originalFilename, text: r.extractedText };
  },

  async deleteResume(id: number): Promise<void> {
    await delay(200);
    const store = loadStore();
    const userId = getCurrentUserId();
    store.resumes = store.resumes.filter(
      (r) => !(r.id === id && r.userId === userId)
    );
    saveStore(store);
  },

  async createJob(data: {
    title: string;
    company?: string;
    content: string;
  }): Promise<JobDescription> {
    await delay(400);
    const store = loadStore();
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");
    if (data.content.length < 50) {
      throw new Error("Content must be 50–20,000 characters");
    }

    const id = store.nextIds.job++;
    const jd: JobDescription & { userId: number } = {
      id,
      userId,
      title: data.title.trim(),
      company: data.company?.trim() ?? null,
      content: data.content.trim(),
      createdAt: new Date().toISOString(),
    };
    store.jobs.push(jd);
    saveStore(store);

    const { userId: _, ...clean } = jd;
    return clean;
  },

  async listJobs(
    page = 0,
    size = 20,
    search?: string
  ): Promise<Page<JobDescriptionSummary>> {
    await delay(200);
    const store = loadStore();
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    let mine = store.jobs.filter((j) => j.userId === userId);
    if (search) {
      const s = search.toLowerCase();
      mine = mine.filter((j) => j.title.toLowerCase().includes(s));
    }
    mine.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const start = page * size;
    const content: JobDescriptionSummary[] = mine
      .slice(start, start + size)
      .map((j) => ({
        id: j.id,
        title: j.title,
        company: j.company,
        createdAt: j.createdAt,
      }));

    return {
      content,
      totalElements: mine.length,
      totalPages: Math.max(1, Math.ceil(mine.length / size)),
      number: page,
      size,
      first: page === 0,
      last: start + size >= mine.length,
    };
  },

  async getJob(id: number): Promise<JobDescription> {
    await delay(150);
    const store = loadStore();
    const userId = getCurrentUserId();
    const j = store.jobs.find((x) => x.id === id && x.userId === userId);
    if (!j) throw new Error("Job description not found");
    const { userId: _, ...clean } = j;
    return clean;
  },

  async updateJob(
    id: number,
    data: { title: string; company?: string; content: string }
  ): Promise<JobDescription> {
    await delay(300);
    const store = loadStore();
    const userId = getCurrentUserId();
    const j = store.jobs.find((x) => x.id === id && x.userId === userId);
    if (!j) throw new Error("Job description not found");
    j.title = data.title.trim();
    j.company = data.company?.trim() ?? null;
    j.content = data.content.trim();
    saveStore(store);
    const { userId: _, ...clean } = j;
    return clean;
  },

  async deleteJob(id: number): Promise<void> {
    await delay(200);
    const store = loadStore();
    const userId = getCurrentUserId();
    store.jobs = store.jobs.filter(
      (j) => !(j.id === id && j.userId === userId)
    );
    saveStore(store);
  },

  async analyze(
    resumeId: number,
    jobDescriptionId: number
  ): Promise<MatchAnalysis> {
    await delay(1500); // simulate heavy analysis — looks legit
    const store = loadStore();
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    const resume = store.resumes.find(
      (r) => r.id === resumeId && r.userId === userId
    );
    if (!resume) throw new Error("Resume not found");
    const jd = store.jobs.find(
      (j) => j.id === jobDescriptionId && j.userId === userId
    );
    if (!jd) throw new Error("Job description not found");

    // Real keyword matching logic — same algorithm as Java backend
    const resumeKeywords = extractKeywords(resume.extractedText);
    const jdKeywords = extractJdKeywords(jd.content);

    const matched = [...resumeKeywords].filter((k) => jdKeywords.has(k));
    const missing = [...jdKeywords].filter((k) => !resumeKeywords.has(k));

    const keywordScore = jdKeywords.size === 0 ? 0 : 100 * matched.length / jdKeywords.size;

    const jdSkills = new Set(
      [...jdKeywords].filter((k) => TECH_SKILLS.has(k))
    );
    const resumeSkills = new Set(
      [...resumeKeywords].filter((k) => TECH_SKILLS.has(k))
    );
    const matchedSkills = [...resumeSkills].filter((k) => jdSkills.has(k));
    const skillsScore = jdSkills.size === 0
      ? 100
      : 100 * matchedSkills.length / jdSkills.size;

    const textScore = jaccardSim(resume.extractedText, jd.content) * 100;

    const finalScore = round1(
      keywordScore * 0.5 + skillsScore * 0.3 + textScore * 0.2
    );

    const id = store.nextIds.match++;
    const filteredMissing = missing.filter((k) => k.length >= 3).sort().slice(0, 25);
    const sortedMatched = matched.sort();

    const match: MatchAnalysis = {
      id,
      resumeId,
      resumeName: resume.originalFilename,
      jobDescriptionId,
      jobTitle: jd.title,
      company: jd.company,
      matchScore: finalScore,
      keywordScore: round1(keywordScore),
      skillsScore: round1(skillsScore),
      textScore: round1(textScore),
      verdict: computeVerdict(finalScore),
      matchedKeywords: sortedMatched,
      missingKeywords: filteredMissing,
      recommendation: buildRecommendation(filteredMissing),
      createdAt: new Date().toISOString(),
    };

    store.matches.push(match);
    saveStore(store);
    return match;
  },

  async listMatches(page = 0, size = 20): Promise<Page<MatchAnalysis>> {
    await delay(200);
    const store = loadStore();
    const userId = getCurrentUserId();
    if (!userId) throw new Error("Not authenticated");

    // MatchAnalysis doesn't have userId in schema; filter by resume ownership
    const myResumeIds = new Set(
      store.resumes.filter((r) => r.userId === userId).map((r) => r.id)
    );
    const mine = store.matches
      .filter((m) => myResumeIds.has(m.resumeId))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const start = page * size;
    return {
      content: mine.slice(start, start + size),
      totalElements: mine.length,
      totalPages: Math.max(1, Math.ceil(mine.length / size)),
      number: page,
      size,
      first: page === 0,
      last: start + size >= mine.length,
    };
  },

  async getMatch(id: number): Promise<MatchAnalysis> {
    await delay(150);
    const store = loadStore();
    const m = store.matches.find((x) => x.id === id);
    if (!m) throw new Error("Match not found");
    return m;
  },

  async deleteMatch(id: number): Promise<void> {
    await delay(200);
    const store = loadStore();
    store.matches = store.matches.filter((m) => m.id !== id);
    saveStore(store);
  },
};

// Clear demo data (handy for testing)
export function clearDemoStore() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(DEMO_USER_KEY);
}
