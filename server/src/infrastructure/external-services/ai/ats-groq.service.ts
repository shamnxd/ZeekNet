import { IAtsService } from 'src/domain/interfaces/services/IAtsService';
import { ATSScoreResult, JobDetails, CandidateData } from 'src/domain/types/ats.types';
import { GroqService } from './groq-client.service';


import { injectable } from 'inversify';
import { env } from 'src/infrastructure/config/env';

@injectable()
export class AtsService implements IAtsService {
  private groqService: GroqService;

  constructor() {
    this.groqService = new GroqService(env.GROQ_API_KEY as string);
  }

  async calculateATSScore(jobDetails: JobDetails, candidateData: CandidateData): Promise<ATSScoreResult> {
    return this.groqService.calculateATSScore(jobDetails, candidateData);
  }
}
