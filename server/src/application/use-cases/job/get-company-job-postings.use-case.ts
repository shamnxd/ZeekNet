import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { JobPostingQueryRequestDto } from 'src/application/dtos/admin/job/requests/get-job-postings-query.dto';
import { NotFoundError } from 'src/domain/errors/errors';
import { IGetCompanyJobPostingsUseCase } from 'src/domain/interfaces/use-cases/job/IGetCompanyJobPostingsUseCase';
import { PaginatedCompanyJobPostingsDto } from 'src/application/dtos/job/responses/paginated-company-job-postings.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';

export class GetCompanyJobPostingsUseCase implements IGetCompanyJobPostingsUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) { }

  async execute(data: JobPostingQueryRequestDto): Promise<PaginatedCompanyJobPostingsDto> {
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
      throw new NotFoundError('Company profile not found');
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
      enabled_stages: 1 as const,
      is_featured: 1 as const,
      total_vacancies: 1 as const,
      filled_vacancies: 1 as const,
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

    const jobDtos = JobPostingMapper.toCompanyListItemResponseList(paginatedJobs as JobPosting[]);

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



