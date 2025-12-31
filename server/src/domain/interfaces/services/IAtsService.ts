import { ATSScoreResult, JobDetails, CandidateData } from '../../types/ats.types';

/**
 * ATS Service Interface
 * Responsible for calculating applicant tracking system scores
 */
export interface IAtsService {
  calculateATSScore(jobDetails: JobDetails, candidateData: CandidateData): Promise<ATSScoreResult>;
}
