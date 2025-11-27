import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminGetAllJobsUseCase } from '../../../domain/interfaces/use-cases/IAdminUseCases';
import { JobPostingMapper } from '../../mappers/job-posting.mapper';
import { JobPostingResponseDto } from '../../dto/job-posting/job-posting-response.dto';

interface GetAllJobsQuery {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  admin_blocked?: boolean;
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
  ) {}

  async execute(query: GetAllJobsQuery) {
    // Use the new specific method for admin - gets all jobs with company info
    let jobs = await this._jobPostingRepository.getAllJobsForAdmin();

    // Apply filters in use case
    if (query.is_active !== undefined) {
      jobs = jobs.filter(job => job.isActive === query.is_active);
    }
    if (query.admin_blocked !== undefined) {
      jobs = jobs.filter(job => (job.adminBlocked ?? false) === query.admin_blocked);
    }
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

    // Shape minimal admin response with only relevant fields
    const jobDtos = paginatedJobs.map(job => ({
      id: job.id,
      title: job.title,
      companyName: job.companyName || 'Company',
      location: job.location,
      salary: job.salary,
      status: job.isActive,
      is_active: job.isActive,
      admin_blocked: job.adminBlocked ?? false,
      applications: job.applicationCount,
      viewCount: job.viewCount,
      createdAt: job.createdAt,
      employmentTypes: job.employmentTypes,
      categoryIds: job.categoryIds,
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
