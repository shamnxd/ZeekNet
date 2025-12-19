import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { NotFoundError } from '../../../domain/errors/errors';
import { JobPosting } from '../../../domain/entities/job-posting.entity';
import { IGetCompanyJobPostingUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyJobPostingUseCase';

export class GetCompanyJobPostingUseCase implements IGetCompanyJobPostingUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(jobId: string, companyId: string): Promise<JobPosting> {
    const jobPosting = await this._jobPostingRepository.findById(jobId);

    if (!jobPosting) {
      throw new NotFoundError('Job posting not found');
    }

    if (jobPosting.companyId !== companyId) {
      
      if (jobPosting.status === 'blocked') {
        throw new NotFoundError('Job posting not found');
      }
    }

    return jobPosting;
  }
}

