import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminGetJobByIdUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class AdminGetJobByIdUseCase implements IAdminGetJobByIdUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string): Promise<JobPosting> {
    try {
      const job = await this._jobPostingRepository.findById(jobId);

      if (!job) {
        throw new AppError('Job not found', 404);
      }

      return job;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch job', 500);
    }
  }
}
