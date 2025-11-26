import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IAdminGetAllJobsUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPostingMapper } from '../../mappers/job-posting.mapper';
import { JobPostingResponseDto } from '../../dto/job-posting/job-posting-response.dto';

interface GetAllJobsQuery {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  category_ids?: string[];
  employment_types?: string[];
  salary_min?: number;
  salary_max?: number;
  location?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class GetAllJobsUseCase implements IAdminGetAllJobsUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(query: GetAllJobsQuery) {
    // Build criteria
    const criteria: Record<string, unknown> = {};
    if (query.is_active !== undefined) {
      criteria.isActive = query.is_active;
    }

    // Get jobs using thin repository
    let jobs = await this._jobPostingRepository.findMany(criteria);

    // Apply filters in use case
    if (query.category_ids && query.category_ids.length > 0) {
      jobs = jobs.filter(job => 
        job.categoryIds.some(cat => query.category_ids!.includes(cat)),
      );
    }

    if (query.employment_types && query.employment_types.length > 0) {
      jobs = jobs.filter(job => 
        job.employmentTypes.some(type => query.employment_types!.includes(type)),
      );
    }

    if (query.salary_min !== undefined) {
      jobs = jobs.filter(job => job.salary.min >= query.salary_min!);
    }

    if (query.salary_max !== undefined) {
      jobs = jobs.filter(job => job.salary.max <= query.salary_max!);
    }

    if (query.location) {
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(query.location!.toLowerCase()),
      );
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower),
      );
    }

    // Apply sorting
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    jobs.sort((a, b) => {
      const aValue = (a as unknown as Record<string, unknown>)[sortBy];
      const bValue = (b as unknown as Record<string, unknown>)[sortBy];
      if (sortOrder === 'asc') {
        return (aValue as number | string) > (bValue as number | string) ? 1 : -1;
      } else {
        return (aValue as number | string) < (bValue as number | string) ? 1 : -1;
      }
    });

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const total = jobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

    // Fetch company data for paginated jobs
    const companyIds = [...new Set(paginatedJobs.map(job => job.companyId))];
    const companies = await Promise.all(
      companyIds.map(id => this._companyProfileRepository.findById(id)),
    );
      
    const companyMap = new Map(
      companies.filter(c => c !== null).map(c => [c!.id, { companyName: c!.companyName, logo: c!.logo }]),
    );

    // Map to DTOs with company data
    const jobDtos: JobPostingResponseDto[] = paginatedJobs.map(job => 
      JobPostingMapper.toResponse(job, companyMap.get(job.companyId)),
    );

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
