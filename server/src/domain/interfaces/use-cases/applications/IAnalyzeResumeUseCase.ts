import { ATSScoreResult } from '../../../types/ats.types';

export interface IAnalyzeResumeUseCase {
  execute(jobId: string, resumeBuffer: Buffer, mimeType: string): Promise<ATSScoreResult>;
}
