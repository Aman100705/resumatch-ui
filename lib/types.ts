export type AuthResponse = {
  token: string;
  email: string;
  fullName: string;
  role: string;
  expiresIn: number;
};

export type ResumeResponse = {
  id: number;
  originalFilename: string;
  fileSize: number;
  extractedCharCount: number;
  uploadedAt: string;
};

export type JobDescription = {
  id: number;
  title: string;
  company: string | null;
  content: string;
  createdAt: string;
};

export type JobDescriptionSummary = {
  id: number;
  title: string;
  company: string | null;
  createdAt: string;
};

export type MatchAnalysis = {
  id: number;
  resumeId: number;
  resumeName: string;
  jobDescriptionId: number;
  jobTitle: string;
  company: string | null;
  matchScore: number;
  keywordScore: number;
  skillsScore: number;
  textScore: number;
  verdict: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  recommendation: string;
  createdAt: string;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
};
