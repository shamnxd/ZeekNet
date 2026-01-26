import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IGetFeaturedJobsUseCase } from 'src/domain/interfaces/use-cases/public/listings/jobs/IGetFeaturedJobsUseCase';
import { GetFeaturedJobsRequestDto } from 'src/application/dtos/public/listings/jobs/requests/get-featured-jobs-request.dto';
import { GetFeaturedJobsResponseDto } from 'src/application/dtos/public/listings/jobs/responses/get-featured-jobs-response.dto';
import { GetFeaturedJobsMapper } from 'src/application/mappers/public/get-featured-jobs.mapper';
import { JobPosting } from 'src/domain/entities/job-posting.entity';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { JobPostingMapper } from 'src/application/mappers/job/job-posting.mapper';
import { PublicJobListItemDto } from 'src/application/dtos/admin/job/responses/job-posting-response.dto';

export class GetFeaturedJobsUseCase implements IGetFeaturedJobsUseCase {
  constructor(
        private readonly _jobPostingRepository: IJobPostingRepository,
        private readonly _s3Service: IS3Service,
  ) { }

  async execute(dto: GetFeaturedJobsRequestDto): Promise<GetFeaturedJobsResponseDto> {
    const page = dto.page || 1;
    const limit = dto.limit || 12;

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
      is_featured: 1 as const,
    };

    const filters = {
      isFeatured: true,
    };

    const jobs = await this._jobPostingRepository.getAllJobsForPublic(projection, filters);

    const total = jobs.length;
    const startIndex = (page - 1) * limit;
    const paginatedJobs = jobs.slice(startIndex, startIndex + limit);

    const jobDtos = JobPostingMapper.toPublicJobListItemList(paginatedJobs as JobPosting[]);

    await Promise.all(
      jobDtos.map(async (jobDto: PublicJobListItemDto) => {
        if (jobDto.companyLogo && !jobDto.companyLogo.startsWith('http')) {
          jobDto.companyLogo = await this._s3Service.getSignedUrl(jobDto.companyLogo);
        }
      }),
    );

    return GetFeaturedJobsMapper.toResponse(
      jobDtos,
      {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    );
  }
}
