import { ATSScoreResult } from '../../../../infrastructure/services/groq.service';

export interface IAnalyzeResumeUseCase {
  execute(jobId: string, resumeBuffer: Buffer, mimeType: string): Promise<ATSScoreResult>;
}
