import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { JobPostingQueryRequestDto } from '../../dto/job-posting/job-posting.dto';
import { AppError } from '../../../domain/errors/errors';
import { CompanyJobPostingListItemDto } from '../../dto/job-posting/job-posting-response.dto';
import { IGetCompanyJobPostingsUseCase } from '../../../domain/interfaces/use-cases/company/IGetCompanyJobPostingsUseCase';

interface PaginatedCompanyJobPostings {
  jobs: CompanyJobPostingListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetCompanyJobPostingsUseCase implements IGetCompanyJobPostingsUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(data: JobPostingQueryRequestDto): Promise<PaginatedCompanyJobPostings> {
    const { userId, ...query } = data;
    if (!userId) throw new Error('User ID is required');
    let companyProfile = null;
    if (query.company_id) {
      companyProfile = await this._companyProfileRepository.findById(query.company_id);
    }
    if (!companyProfile) {
      companyProfile = await this._companyProfileRepository.findOne({ userId });
    }

    if (!companyProfile) {
      throw new AppError('Company profile not found', 404);
    }

    const projection = {
      _id: 1 as const,
      title: 1 as const,
      status: 1 as const,
      employment_types: 1 as const,
      application_count: 1 as const,
      view_count: 1 as const,
      unpublish_reason: 1 as const,
      createdAt: 1 as const,
    };

    let jobs = await this._jobPostingRepository.getJobsByCompany(companyProfile.id, projection);

    if (jobs.length === 0 && query.company_id) {
      jobs = await this._jobPostingRepository.getJobsByCompany(companyProfile.id, {});
    }

    if (query.is_active !== undefined) {
      jobs = jobs.filter(job => query.is_active ? job.status === 'active' : job.status !== 'active');
    }

    if (query.employment_types && query.employment_types.length > 0) {
      jobs = jobs.filter(job => 
        job.employmentTypes?.some(type => (query.employment_types as string[]).includes(type)),
      );
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title?.toLowerCase().includes(searchLower),
      );
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const total = jobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

    const jobDtos: CompanyJobPostingListItemDto[] = paginatedJobs.map(job => ({
      id: job.id!,
      title: job.title!,
      status: job.status!,
      employmentTypes: job.employmentTypes!,
      applicationCount: job.applicationCount!,
      viewCount: job.viewCount!,
      isFeatured: job.isFeatured!,
      unpublishReason: job.unpublishReason,
      createdAt: job.createdAt!,
    }));

    return {
      jobs: jobDtos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

