import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IAdminGetAllJobsUseCase } from 'src/domain/interfaces/use-cases/admin/job/IAdminGetAllJobsUseCase';
import { JobStatus } from 'src/domain/enums/job-status.enum';
import { GetAllJobsQueryDtoType } from 'src/application/dtos/admin/job/requests/get-all-jobs-query.dto';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { AdminJobListResponseDto } from 'src/application/dtos/admin/job/responses/admin-job-response.dto';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';

export class GetAllJobsUseCase implements IAdminGetAllJobsUseCase {
  constructor(
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _s3Service: IS3Service,
  ) { }

  async execute(query: GetAllJobsQueryDtoType): Promise<AdminJobListResponseDto> {
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

    const jobDtos = JobPostingMapper.toAdminListItemResponseList(paginatedJobs);

    const jobDtosWithSignedUrls = await Promise.all(
      jobDtos.map(async (job) => {
        if (job.companyLogo && !job.companyLogo.startsWith('http')) {
          try {
            job.companyLogo = await this._s3Service.getSignedUrl(job.companyLogo);
          } catch (error) {
            console.error(`Failed to sign logo for job ${job.id}:`, error);
          }
        }
        return job;
      }),
    );

    return {
      jobs: jobDtosWithSignedUrls,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}


