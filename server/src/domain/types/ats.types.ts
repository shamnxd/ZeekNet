/**
 * ATS (Applicant Tracking System) Domain Types
 * These types represent core domain concepts related to resume analysis and scoring
 */

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
