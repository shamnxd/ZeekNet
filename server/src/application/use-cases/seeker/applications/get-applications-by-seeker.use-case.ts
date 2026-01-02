import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { ICompanyProfileRepository } from 'src/domain/interfaces/repositories/company/ICompanyProfileRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { IGetApplicationsBySeekerUseCase } from 'src/domain/interfaces/use-cases/seeker/applications/IGetApplicationsBySeekerUseCase';
import { GetApplicationsBySeekerRequestDto } from 'src/application/dtos/seeker/applications/requests/get-applications-by-seeker.dto';
import { JobApplicationMapper } from 'src/application/mappers/job-application/job-application.mapper';
import { JobApplicationListResponseDto, PaginatedApplicationsResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';
import { JobApplication } from 'src/domain/entities/job-application.entity';
import { CompanyProfile } from 'src/domain/entities/company-profile.entity';


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

    if (result.data.length === 0) {
      return {
        applications: [],
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      };
    }

    
    const { jobsMap, companyProfilesMap, blockedCompanyIds, companyLogosMap } = 
      await this._fetchRelatedDataInBatch(result.data);

    
    const applications: JobApplicationListResponseDto[] = result.data
      .filter(app => {
        const job = jobsMap.get(app.jobId);
        return job && !blockedCompanyIds.has(job.companyId);
      })
      .map(app => {
        const job = jobsMap.get(app.jobId)!;
        const companyProfile = companyProfilesMap.get(job.companyId);
        const companyLogo = companyProfile ? companyLogosMap.get(job.companyId) : undefined;

        return JobApplicationMapper.toListResponse(app, {
          jobTitle: job.title,
          companyName: job.companyName,
          companyLogo,
        });
      });

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

  
  private async _fetchRelatedDataInBatch(applications: JobApplication[]) {
    
    const jobIds = [...new Set(applications.map(app => app.jobId))];

    
    const jobs = await this._jobPostingRepository.findByIds(jobIds);
    const jobsMap = new Map(jobs.map(job => [job.id, job]));

    
    const companyIds = [...new Set(jobs.map(job => job.companyId))];

    
    const companyProfiles = await this._companyProfileRepository.findByIds(companyIds);
    const companyProfilesMap = new Map(companyProfiles.map(profile => [profile.id, profile]));

    
    const userIds = [...new Set(companyProfiles.map(profile => profile.userId))];

    
    const users = await this._userRepository.findByIds(userIds);
    const blockedUserIds = new Set(users.filter(user => user.isBlocked).map(user => user.id));

    
    const blockedCompanyIds = new Set(
      companyProfiles
        .filter(profile => blockedUserIds.has(profile.userId))
        .map(profile => profile.id),
    );

    
    const companyLogosMap = await this._generateCompanyLogos(companyProfiles, blockedCompanyIds);

    return {
      jobsMap,
      companyProfilesMap,
      blockedCompanyIds,
      companyLogosMap,
    };
  }

  
  private async _generateCompanyLogos(
    companyProfiles: CompanyProfile[],
    blockedCompanyIds: Set<string>,
  ): Promise<Map<string, string>> {
    const companyLogosMap = new Map<string, string>();

    
    const logosToGenerate = companyProfiles
      .filter(profile => !blockedCompanyIds.has(profile.id) && profile.logo)
      .map(profile => ({ companyId: profile.id, logoKey: profile.logo }));

    
    await Promise.all(
      logosToGenerate.map(async ({ companyId, logoKey }) => {
        try {
          const signedUrl = await this._s3Service.getSignedUrl(logoKey);
          companyLogosMap.set(companyId, signedUrl);
        } catch (error) {
          console.error(`Error generating signed URL for company ${companyId}:`, error);
          
        }
      }),
    );

    return companyLogosMap;
  }
}




