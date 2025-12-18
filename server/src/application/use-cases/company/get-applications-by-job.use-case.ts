import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { ISeekerProfileRepository } from '../../../domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { IGetApplicationsByJobUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationsByJobUseCase';
import { GetApplicationsByJobRequestDto } from '../../dto/application/get-applications-by-job.dto';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import type { ApplicationStage } from '../../../domain/entities/job-application.entity';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationListResponseDto, PaginatedApplicationsResponseDto } from '../../dto/application/job-application-response.dto';
import { Types } from 'mongoose';

export class GetApplicationsByJobUseCase implements IGetApplicationsByJobUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _seekerProfileRepository: ISeekerProfileRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(data: GetApplicationsByJobRequestDto): Promise<PaginatedApplicationsResponseDto> {
    const { userId, jobId, ...filters } = data;
    if (!userId) throw new Error('User ID is required');
    if (!jobId) throw new Error('Job ID is required');
    const companyProfile = await this._companyProfileRepository.findOne({ userId });
    if (!companyProfile) {
      throw new NotFoundError('Company profile not found');
    }

    const job = await this._jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job posting not found');
    }
    if (job.companyId !== companyProfile.id) {
      throw new ValidationError('You can only view applications for your own job postings');
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const query: Record<string, unknown> = { job_id: new Types.ObjectId(jobId) };
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
      const [user, profile] = await Promise.all([
        this._userRepository.findById(app.seekerId),
        this._seekerProfileRepository.findOne({ userId: app.seekerId }),
      ]);
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


