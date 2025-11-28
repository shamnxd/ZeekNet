import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IUpdateJobStatusUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class UpdateJobStatusUseCase implements IUpdateJobStatusUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, isActive: boolean): Promise<JobPosting> {
    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new AppError('Job not found', 404);
    }

    if (existingJob.adminBlocked) {
      throw new AppError('This job has been blocked by admin and cannot be modified', 403);
    }

    const updatedJob = await this._jobPostingRepository.update(jobId, { isActive: isActive });

    if (!updatedJob) {
      throw new AppError('Failed to update job status', 500);
    }

    return updatedJob;
  }
}

