import { IGetJobATSPipelineUseCase } from '../../../domain/interfaces/use-cases/ats/IGetJobATSPipelineUseCase';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';

export class GetJobATSPipelineUseCase implements IGetJobATSPipelineUseCase {
  constructor(
    private jobPostingRepository: IJobPostingRepository,
  ) {}

  async execute(jobId: string, companyId: string): Promise<{
    jobId: string;
    enabledStages: string[];
    pipelineConfig: Record<string, string[]>;
  }> {
    const job = await this.jobPostingRepository.findById(jobId);
    
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Verify job belongs to company
    if (job.companyId !== companyId) {
      throw new ValidationError('Job does not belong to this company');
    }

    return {
      jobId: job.id,
      enabledStages: job.enabledStages,
      pipelineConfig: job.atsPipelineConfig,
    };
  }
}



