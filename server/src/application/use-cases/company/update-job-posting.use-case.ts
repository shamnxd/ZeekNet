import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { UpdateJobPostingData, IUpdateJobPostingUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class UpdateJobPostingUseCase implements IUpdateJobPostingUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, updates: UpdateJobPostingData): Promise<JobPosting> {
    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new AppError('Job posting not found', 404);
    }

    try {
      const updatedJob = await this._jobPostingRepository.update(jobId, updates);

      if (!updatedJob) {
        throw new AppError('Failed to update job posting', 500);
      }

      return updatedJob;
    } catch (error) {
      throw new AppError('Failed to update job posting', 500);
    }
  }
}

