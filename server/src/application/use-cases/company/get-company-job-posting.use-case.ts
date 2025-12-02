import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { AppError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { IGetCompanyJobPostingUseCase } from '../../../domain/interfaces/use-cases/ICompanyUseCases';

export class GetCompanyJobPostingUseCase implements IGetCompanyJobPostingUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, companyId: string): Promise<JobPosting> {
    const jobPosting = await this._jobPostingRepository.findById(jobId);

    if (!jobPosting) {
      throw new AppError('Job posting not found', 404);
    }

    if (jobPosting.companyId !== companyId) {
      
      if (jobPosting.status === 'blocked') {
        throw new AppError('Job posting not found', 404);
      }
    }

    return jobPosting;
  }
}

