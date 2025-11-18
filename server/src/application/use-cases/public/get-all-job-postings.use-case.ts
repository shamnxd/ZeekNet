import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetAllJobPostingsUseCase } from '../../../domain/interfaces/use-cases/IPublicUseCases';
import { AppError } from '../../../domain/errors/errors';
import { JobPostingFilters, PaginatedJobPostings } from '../../../domain/entities/job-posting.entity';

export class GetAllJobPostingsUseCase implements IGetAllJobPostingsUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(query: JobPostingFilters): Promise<PaginatedJobPostings> {
    try {
      // Build criteria for active, non-blocked jobs
      const criteria: Partial<any> = {
        is_active: query.is_active ?? true,
      };

      // Get jobs using thin repository
      let jobs = await this._jobPostingRepository.findMany(criteria);

      // Filter out admin-blocked jobs
      jobs = jobs.filter(job => !job.admin_blocked);

      // Apply additional filters in use case
      if (query.category_ids && query.category_ids.length > 0) {
        jobs = jobs.filter(job => 
          job.category_ids.some(cat => query.category_ids!.includes(cat))
        );
      }

      if (query.employment_types && query.employment_types.length > 0) {
        jobs = jobs.filter(job => 
          job.employment_types.some(type => query.employment_types!.includes(type as any))
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
          job.location.toLowerCase().includes(query.location!.toLowerCase())
        );
      }

      if (query.search) {
        const searchLower = query.search.toLowerCase();
        jobs = jobs.filter(job => 
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.location.toLowerCase().includes(searchLower)
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
    } catch (error) {
      throw new AppError('Failed to fetch job postings', 500);
    }
  }
}