import { ATSStage } from '@/constants/ats-stages';

export interface ATSJob {
  jobId: string;
  jobTitle: string;
  department?: string;
  location?: string;
  employmentType?: string;
  enabledStages: ATSStage[];
  totalCandidates?: number;
  createdAt?: string;
}
