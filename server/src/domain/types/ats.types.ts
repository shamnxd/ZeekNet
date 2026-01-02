

export interface ATSScoreResult {
  score: number;
  reasoning?: string;
  missingKeywords?: string[];
}

export interface JobDetails {
  title: string;
  description: string;
  qualifications?: string[];
  responsibilities?: string[];
  skillsRequired: string[];
  experienceLevel?: string;
}

export interface CandidateData {
  coverLetter: string;
  resumeText?: string;
}
