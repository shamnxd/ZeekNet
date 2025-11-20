import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IGetApplicationsByCompanyUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError } from '../../../domain/errors/errors';
import type { JobApplication, ApplicationStage } from '../../../domain/entities/job-application.entity';

export interface PaginatedApplications {
  applications: JobApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetApplicationsByCompanyUseCase implements IGetApplicationsByCompanyUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(userId: string, filters: { job_id?: string; stage?: ApplicationStage; search?: string; page?: number; limit?: number }): Promise<PaginatedApplications> {
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const result = await this._jobApplicationRepository.findByCompanyId(companyProfile.id, {
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
        totalPages: Math.ceil(result.pagination.total / limit),
      },
    };
  }
}


