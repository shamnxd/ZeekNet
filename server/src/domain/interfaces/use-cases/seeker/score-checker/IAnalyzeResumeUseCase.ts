import { ATSScoreResult } from 'src/domain/types/ats.types';

export interface IAnalyzeResumeUseCase {
  execute(jobId: string, resumeBuffer: Buffer, mimeType: string): Promise<ATSScoreResult>;
}
