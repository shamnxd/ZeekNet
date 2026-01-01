import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetJobPostingUseCase } from 'src/domain/interfaces/use-cases/job/IGetJobPostingUseCase';
import { NotFoundError } from 'src/domain/errors/errors';
import { JobPosting } from 'src/domain/entities/job-posting.entity';

export class GetJobPostingUseCase implements IGetJobPostingUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string): Promise<JobPosting> {
    const jobPosting = await this._jobPostingRepository.findById(jobId);

    if (!jobPosting) {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.status === 'blocked') {
      throw new NotFoundError('Job posting not found');
    }

    return jobPosting;
  }
}


