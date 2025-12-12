import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminUpdateJobStatusUseCase } from 'src/domain/interfaces/use-cases/admin/IAdminUpdateJobStatusUseCase';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class AdminUpdateJobStatusUseCase implements IAdminUpdateJobStatusUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, status: 'active' | 'unlisted' | 'expired' | 'blocked', unpublishReason?: string): Promise<JobPosting> {
    const job = await this._jobPostingRepository.findById(jobId);

    if (!job) {
      throw new AppError('Job not found', 404);
    }

    const updateData: { status: 'active' | 'unlisted' | 'expired' | 'blocked'; unpublishReason?: string } = {
      status: status,
    };

    if (status === 'blocked' && unpublishReason) {
      updateData.unpublishReason = unpublishReason;
    } else if (status === 'active') {
      updateData.unpublishReason = undefined;
    }

    const updatedJob = await this._jobPostingRepository.update(jobId, updateData);

    if (!updatedJob) {
      throw new AppError('Failed to update job status', 500);
    }

    return updatedJob;
  }
}
