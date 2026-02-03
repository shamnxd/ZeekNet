import { IAtsService } from 'src/domain/interfaces/services/IAtsService';
import { ATSScoreResult, JobDetails, CandidateData } from 'src/domain/types/ats.types';
import { GroqService } from './groq-client.service';


export class AtsService implements IAtsService {
  private groqService: GroqService;

  constructor(apiKey: string) {
    this.groqService = new GroqService(apiKey);
  }

  async calculateATSScore(jobDetails: JobDetails, candidateData: CandidateData): Promise<ATSScoreResult> {
    return this.groqService.calculateATSScore(jobDetails, candidateData);
  }
}
