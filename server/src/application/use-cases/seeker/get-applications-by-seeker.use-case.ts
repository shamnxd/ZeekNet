import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from '../../../domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { IS3Service } from '../../../domain/interfaces/services/IS3Service';
import { IGetApplicationsBySeekerUseCase } from 'src/domain/interfaces/use-cases/applications/IGetApplicationsBySeekerUseCase';
import { GetApplicationsBySeekerRequestDto } from '../../dto/application/get-applications-by-seeker.dto';
import type { ATSStage } from '../../../domain/enums/ats-stage.enum';
import { JobApplicationMapper } from '../../mappers/job-application.mapper';
import { JobApplicationListResponseDto, PaginatedApplicationsResponseDto } from '../../dto/application/job-application-response.dto';

export class GetApplicationsBySeekerUseCase implements IGetApplicationsBySeekerUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _companyProfileRepository: ICompanyProfileRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(data: GetApplicationsBySeekerRequestDto): Promise<PaginatedApplicationsResponseDto> {
    const { seekerId, ...filters } = data;
    if (!seekerId) throw new Error('Seeker ID is required');
    const page = filters.page || 1;
    const limit = filters.limit || 10;

    const query: Record<string, unknown> = { seeker_id: seekerId };
    if (filters.stage) query.stage = filters.stage;

    const result = await this._jobApplicationRepository.paginate(query, {
      page,
      limit,
      sortBy: 'applied_date',
      sortOrder: 'desc',
    });

    const applications: JobApplicationListResponseDto[] = [];
    for (const app of result.data) {
      const job = await this._jobPostingRepository.findById(app.jobId);
      let companyLogo: string | undefined = undefined;
      
      if (job) {
        const companyProfile = await this._companyProfileRepository.findById(job.companyId);
        
        if (companyProfile) {
          const companyUser = await this._userRepository.findById(companyProfile.userId);
          
          if (companyUser?.isBlocked) {
            continue;
          }
          
          if (companyProfile.logo) {
            companyLogo = await this._s3Service.getSignedUrl(companyProfile.logo);
          }
        }
      }
      
      applications.push(
        JobApplicationMapper.toListResponse(app, {
          jobTitle: job?.title,
          companyName: job?.companyName,
          companyLogo,
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



