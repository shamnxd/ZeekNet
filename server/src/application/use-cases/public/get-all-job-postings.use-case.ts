import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetAllJobPostingsUseCase } from '../../../domain/interfaces/use-cases/IPublicUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPostingFilters, PaginatedJobPostings } from '../../../domain/entities/job-posting.entity';

export class GetAllJobPostingsUseCase implements IGetAllJobPostingsUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(query: JobPostingFilters): Promise<PaginatedJobPostings> {
    // Build criteria for active, non-blocked jobs
    const criteria: Record<string, unknown> = {
      isActive: query.isActive ?? true,
    };

    // Get jobs using thin repository
    let jobs = await this._jobPostingRepository.findMany(criteria);

    // Filter out admin-blocked jobs
    jobs = jobs.filter(job => !job.adminBlocked);

    // Apply additional filters in use case
    if (query.categoryIds && query.categoryIds.length > 0) {
      jobs = jobs.filter(job => 
        job.categoryIds.some((cat: string) => query.categoryIds!.includes(cat)),
      );
    }

    if (query.employmentTypes && query.employmentTypes.length > 0) {
      jobs = jobs.filter(job => 
        job.employmentTypes.some((type: string) => query.employmentTypes!.includes(type)),
      );
    }

    if (query.salaryMin !== undefined) {
      jobs = jobs.filter(job => job.salary.min >= query.salaryMin!);
    }

    if (query.salaryMax !== undefined) {
      jobs = jobs.filter(job => job.salary.max <= query.salaryMax!);
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

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const total = jobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

    return {
      jobs: paginatedJobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
