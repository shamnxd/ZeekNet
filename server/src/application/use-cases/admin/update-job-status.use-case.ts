import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminUpdateJobStatusUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class AdminUpdateJobStatusUseCase implements IAdminUpdateJobStatusUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, isActive: boolean, unpublishReason?: string): Promise<JobPosting> {
    const job = await this._jobPostingRepository.findById(jobId);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    const updateData: { isActive: boolean; adminBlocked?: boolean; unpublishReason?: string } = {
      isActive: isActive,
    };

    if (!isActive && unpublishReason) {
      updateData.adminBlocked = true;
      updateData.unpublishReason = unpublishReason;
    } else if (isActive) {
      
      updateData.adminBlocked = false;
      updateData.unpublishReason = undefined;
    }

    const updatedJob = await this._jobPostingRepository.update(jobId, updateData);

    if (!updatedJob) {
      throw new AppError('Failed to update job status', 500);
    }

    return updatedJob;
  }
}
