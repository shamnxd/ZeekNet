import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IGetApplicationsByJobUseCase } from '../../../domain/interfaces/use-cases/IJobApplicationUseCases';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { JobApplication } from '../../../domain/entities/job-application.entity';
import type { ApplicationStage } from '../../../domain/entities/job-application.entity';
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
    if (job.companyId !== companyProfile.id) {
      throw new ValidationError('You can only view applications for your own job postings');
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const query: Record<string, unknown> = { job_id: new Types.ObjectId(jobId) };
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


