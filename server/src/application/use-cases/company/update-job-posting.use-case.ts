import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { UpdateJobPostingRequestDto } from '../../dto/job-posting/update-job-posting-request.dto';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { IUpdateJobPostingUseCase } from 'src/domain/interfaces/use-cases/jobs/IUpdateJobPostingUseCase';

export class UpdateJobPostingUseCase implements IUpdateJobPostingUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(data: UpdateJobPostingRequestDto & { jobId?: string }): Promise<JobPosting> {
    const { jobId, ...updates } = data;
    if (!jobId) throw new Error('Job ID is required');
    const existingJob = await this._jobPostingRepository.findById(jobId);

    if (!existingJob) {
      throw new AppError('Job posting not found', 404);
    }

    const updatedJob = await this._jobPostingRepository.update(jobId, updates);

    if (!updatedJob) {
      throw new AppError('Failed to update job posting', 500);
    }

    return updatedJob;
  }
}

