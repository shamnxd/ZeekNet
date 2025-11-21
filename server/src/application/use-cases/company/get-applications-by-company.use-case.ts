import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IGetApplicationsByCompanyUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError } from '../../../domain/errors/errors';
import type { JobApplication, ApplicationStage } from '../../../domain/entities/job-application.entity';
import { Types } from 'mongoose';

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

    const query: Record<string, unknown> = { company_id: new Types.ObjectId(companyProfile.id) };
    if (filters.stage) query.stage = filters.stage;

    const result = await this._jobApplicationRepository.paginate(query, {
      page,
      limit,
      sortBy: 'applied_date',
      sortOrder: 'desc',
    });

    return {
      applications: result.data,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}


