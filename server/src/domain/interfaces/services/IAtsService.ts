import { ATSScoreResult, JobDetails, CandidateData } from 'src/domain/types/ats.types';


export interface IAtsService {
  calculateATSScore(jobDetails: JobDetails, candidateData: CandidateData): Promise<ATSScoreResult>;
}
