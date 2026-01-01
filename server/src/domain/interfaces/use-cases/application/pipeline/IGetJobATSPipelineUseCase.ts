import { JobPosting } from 'src/domain/entities/job-posting.entity';

export interface IGetJobATSPipelineUseCase {
  execute(jobId: string, companyId: string): Promise<{
    jobId: string;
    enabledStages: string[];
    pipelineConfig: Record<string, string[]>;
  }>;
}



