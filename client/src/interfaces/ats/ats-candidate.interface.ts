import { ATSStage } from '@/constants/ats-stages';

export interface ATSCandidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  stage: ATSStage;
  subStage: string;
  atsScore: number;
  appliedDate: string;
  phone?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
  interviewDate?: string;
  taskDeadline?: string;
  offerAmount?: string;
  lastActivity?: string;
}

export interface StageGroup {
  stage: ATSStage;
  candidates: ATSCandidate[];
  count: number;
}

export interface SubStageGroup {
  subStage: string;
  candidates: ATSCandidate[];
  count: number;
}
