import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminGetAllJobsUseCase } from '../../../domain/interfaces/use-cases/admin/IAdminUseCases';

interface GetAllJobsQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'unlisted' | 'expired' | 'blocked';
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
    let jobs = await this._jobPostingRepository.getAllJobsForAdmin();

    if (query.status !== undefined) {
      jobs = jobs.filter(job => job.status === query.status);
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

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    jobs.sort((a, b) => {
      const aValue = (a as unknown as Record<string, number | string>)[sortBy];
      const bValue = (b as unknown as Record<string, number | string>)[sortBy];
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    const page = query.page || 1;
    const limit = query.limit || 10;
    const total = jobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

    const jobDtos = paginatedJobs.map(job => ({
      id: job.id,
      title: job.title,
      companyName: job.companyName || 'Company',
      location: job.location,
      salary: job.salary,
      status: job.status,
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
