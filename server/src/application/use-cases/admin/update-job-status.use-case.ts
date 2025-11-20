import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminUpdateJobStatusUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class AdminUpdateJobStatusUseCase implements IAdminUpdateJobStatusUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, isActive: boolean, unpublishReason?: string): Promise<JobPosting> {
    try {
      const job = await this._jobPostingRepository.findById(jobId);

      if (!job) {
        throw new AppError('Job not found', 404);
      }

      const updateData: { is_active: boolean; admin_blocked?: boolean; unpublish_reason?: string } = {
        is_active: isActive,
      };

      if (!isActive && unpublishReason) {
        updateData.admin_blocked = true;
        updateData.unpublish_reason = unpublishReason;
      } else if (isActive) {
        
        updateData.admin_blocked = false;
        updateData.unpublish_reason = undefined;
      }

      const updatedJob = await this._jobPostingRepository.update(jobId, updateData);

      if (!updatedJob) {
        throw new AppError('Failed to update job status', 500);
      }

      return updatedJob;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update job status', 500);
    }
  }
}
