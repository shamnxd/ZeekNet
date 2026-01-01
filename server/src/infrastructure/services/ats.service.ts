import { IAtsService } from '../../domain/interfaces/services/IAtsService';
import { ATSScoreResult, JobDetails, CandidateData } from '../../domain/types/ats.types';
import { GroqService } from './groq.service';

/**
 * ATS Service Implementation
 * Wraps the Groq service to implement the domain interface
 */
export class AtsService implements IAtsService {
  private groqService: GroqService;

  constructor(apiKey: string) {
    this.groqService = new GroqService(apiKey);
  }

  async calculateATSScore(jobDetails: JobDetails, candidateData: CandidateData): Promise<ATSScoreResult> {
    return this.groqService.calculateATSScore(jobDetails, candidateData);
  }
}
