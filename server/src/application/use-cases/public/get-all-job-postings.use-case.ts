import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetAllJobPostingsUseCase } from 'src/domain/interfaces/use-cases/public/IGetAllJobPostingsUseCase';
import { JobPostingFilters } from 'src/application/dto/jobs/job-posting-filters.dto';
import { PublicJobListItemDto } from '../../dto/job-posting/job-posting-response.dto';

interface PaginatedPublicJobs {
  jobs: PublicJobListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetAllJobPostingsUseCase implements IGetAllJobPostingsUseCase {
  constructor(private readonly _jobPostingRepository: IJobPostingRepository) {}

  async execute(query: JobPostingFilters): Promise<PaginatedPublicJobs> {
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

    const jobDtos: PublicJobListItemDto[] = paginatedJobs.map(job => ({
      id: job.id!,
      title: job.title!,
      viewCount: job.viewCount!,
      applicationCount: job.applicationCount!,
      salary: job.salary!,
      companyName: job.companyName || '',
      companyLogo: job.companyLogo,
      isFeatured: job.isFeatured!,
      createdAt: job.createdAt!,
      location: job.location!,
      description: job.description!,
      skillsRequired: job.skillsRequired!,
      employmentTypes: job.employmentTypes!,
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
