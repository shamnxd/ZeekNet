import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { JobPostingQueryRequestDto } from '../../dto/job-posting/job-posting.dto';
import { AppError } from '../../../domain/errors/errors';
import { PaginatedJobPostings } from '../../../domain/entities/job-posting.entity';

export class GetCompanyJobPostingsUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
  ) {}

  async execute(userId: string, query: JobPostingQueryRequestDto): Promise<PaginatedJobPostings> {
    try {
      const companyProfile = await this._companyProfileRepository.findOne({ userId });

      if (!companyProfile) {
        throw new AppError('Company profile not found', 404);
      }

      // Build filter criteria
      const criteria: Partial<any> = { companyId: companyProfile.id };
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
          job.employmentTypes.some(type => query.employment_types!.includes(type as any)),
        );
      }

      if (query.salary_min !== undefined) {
        jobs = jobs.filter(job => job.salary.min >= query.salary_min!);
      }

      if (query.salary_max !== undefined) {
        jobs = jobs.filter(job => job.salary.max <= query.salary_max!);
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
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to fetch job postings', 500);
    }
  }
}

