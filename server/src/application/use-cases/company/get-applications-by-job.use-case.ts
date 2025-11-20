import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IGetApplicationsByJobUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import type { ApplicationStage } from '../../../domain/entities/job-application.entity';

export interface PaginatedApplications {
  applications: JobApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetApplicationsByJobUseCase implements IGetApplicationsByJobUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(
    userId: string,
    jobId: string,
    filters: { stage?: ApplicationStage; search?: string; page?: number; limit?: number },
  ): Promise<PaginatedApplications> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const job = await this._jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }
    if (job.company_id !== companyProfile.id) {
      throw new ValidationError('You can only view applications for your own job postings');
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const result = await this._jobApplicationRepository.findByJobId(jobId, {
      stage: filters.stage,
      search: filters.search,
      page,
      limit,
    });

    return {
      applications: result.applications,
      pagination: {
        page,
        limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
    };
  }
}


