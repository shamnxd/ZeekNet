import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { IGetApplicationsByCompanyUseCase } from 'src/domain/interfaces/use-cases/company/hiring/IGetApplicationsByCompanyUseCase';
import { ApplicationFiltersRequestDto } from 'src/application/dtos/company/hiring/requests/application-filters.dto';
import { NotFoundError } from 'src/domain/errors/errors';
import type { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { JobApplicationMapper } from 'src/application/mappers/job-application/job-application.mapper';
import { JobApplicationListResponseDto, PaginatedApplicationsResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';

export class GetApplicationsByCompanyUseCase implements IGetApplicationsByCompanyUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(data: ApplicationFiltersRequestDto): Promise<PaginatedApplicationsResponseDto> {
    const { userId, ...filters } = data;
    if (!userId) throw new Error('User ID is required');
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const query: Record<string, unknown> = { company_id: companyProfile.id };
    if (filters.stage) query.stage = filters.stage;
    
    
    if (filters.min_score !== undefined || filters.max_score !== undefined) {
      query.score = {};
      if (filters.min_score !== undefined) {
        (query.score as Record<string, unknown>).$gte = filters.min_score;
      }
      if (filters.max_score !== undefined) {
        (query.score as Record<string, unknown>).$lte = filters.max_score;
      }
    }

    const result = await this._jobApplicationRepository.paginate(query, {
      page,
      limit,
      sortBy: filters.sort_by || 'applied_date',
      sortOrder: filters.sort_order || 'desc',
    });

    const applications: JobApplicationListResponseDto[] = [];
    for (const app of result.data) {
      const [user, job, profile] = await Promise.all([
        this._userRepository.findById(app.seekerId),
        this._jobPostingRepository.findById(app.jobId),
        this._seekerProfileRepository.findOne({ userId: app.seekerId }),
      ]);
      
      if (user?.isBlocked) {
        continue;
      }
      
      const avatarUrl = profile?.avatarFileName 
        ? await this._s3Service.getSignedUrl(profile.avatarFileName) 
        : undefined;
      applications.push(
        JobApplicationMapper.toListResponse(app, {
          seekerName: user?.name,
          seekerAvatar: avatarUrl,
          jobTitle: job?.title,
        }),
      );
    }

    return {
      applications,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }
}






