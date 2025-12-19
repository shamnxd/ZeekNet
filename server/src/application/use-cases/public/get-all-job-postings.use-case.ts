import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetAllJobPostingsUseCase } from 'src/domain/interfaces/use-cases/public/IGetAllJobPostingsUseCase';
import { JobPostingFilters } from 'src/application/dto/jobs/job-posting-filters.dto';
import { PublicJobListItemDto } from '../../dto/job-posting/job-posting-response.dto';
import { PaginatedPublicJobsDto } from '../../dto/public/paginated-public-jobs.dto';
import { JobPostingMapper } from '../../mappers/job-posting.mapper';
import { JobPosting } from '../../../domain/entities/job-posting.entity';

export class GetAllJobPostingsUseCase implements IGetAllJobPostingsUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(query: JobPostingFilters): Promise<PaginatedPublicJobsDto> {
    const projection = {
      _id: 1 as const,
      company_id: 1 as const,
      title: 1 as const,
      view_count: 1 as const,
      application_count: 1 as const,
      salary: 1 as const,
      createdAt: 1 as const,
      location: 1 as const,
      description: 1 as const,
      skills_required: 1 as const,
      employment_types: 1 as const,
      category_ids: 1 as const,
    };

    const filters = {
      categoryIds: query.categoryIds,
      employmentTypes: query.employmentTypes,
      salaryMin: query.salaryMin,
      salaryMax: query.salaryMax,
      location: query.location,
      search: query.search,
    };

    const jobs = await this._jobPostingRepository.getAllJobsForPublic(projection, filters);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const total = jobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

    const jobDtos = JobPostingMapper.toPublicJobListItemList(paginatedJobs as JobPosting[]);

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
