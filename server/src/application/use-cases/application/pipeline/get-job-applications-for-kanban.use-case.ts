import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';
import { IGetJobApplicationsForKanbanUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobApplicationsForKanbanUseCase';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { ISeekerProfileRepository } from 'src/domain/interfaces/repositories/seeker/ISeekerProfileRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { GetJobApplicationsKanbanDto } from 'src/application/dtos/application/requests/get-job-applications-kanban.dto';
import { IGetCompanyIdByUserIdUseCase } from 'src/domain/interfaces/use-cases/admin/companies/IGetCompanyIdByUserIdUseCase';
import { JobApplicationsKanbanResponseDto } from 'src/application/dtos/application/pipeline/responses/job-applications-kanban-response.dto';

@injectable()
export class GetJobApplicationsForKanbanUseCase implements IGetJobApplicationsForKanbanUseCase {
  constructor(
    @inject(TYPES.JobApplicationRepository) private _jobApplicationRepository: IJobApplicationRepository,
    @inject(TYPES.JobPostingRepository) private _jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.SeekerProfileRepository) private _seekerProfileRepository: ISeekerProfileRepository,
    @inject(TYPES.S3Service) private _s3Service: IS3Service,
    @inject(TYPES.GetCompanyIdByUserIdUseCase) private _getCompanyIdByUserIdUseCase: IGetCompanyIdByUserIdUseCase,
  ) {}

  async execute(dto: GetJobApplicationsKanbanDto): Promise<JobApplicationsKanbanResponseDto> {
    const companyId = await this._getCompanyIdByUserIdUseCase.execute(dto.userId);
    const job = await this._jobPostingRepository.findById(dto.jobId);
    if (!job) {
      throw new NotFoundError(ERROR.NOT_FOUND('Job'));
    }

    if (job.companyId !== companyId) {
      throw new ValidationError('Job does not belong to this company');
    }

    const applications = await this._jobApplicationRepository.findMany({
      job_id: dto.jobId,
      company_id: companyId,
    });

    
    const grouped: JobApplicationsKanbanResponseDto = {};

    
    job.enabledStages.forEach((stage) => {
      grouped[stage] = [];
    });

    
    const seekerIds = [...new Set(applications.map((app: { seekerId: string }) => app.seekerId))];
    const seekers = await Promise.all(
      seekerIds.map(async (seekerId: string) => {
        try {
          const [user, profile] = await Promise.all([
            this._userRepository.findById(seekerId),
            this._seekerProfileRepository.findOne({ userId:seekerId }),
          ]);

          const avatarUrl = profile?.avatarFileName 
            ? await this._s3Service.getSignedUrl(profile.avatarFileName) 
            : undefined;
          return { id: seekerId, seeker: user, avatarUrl };
        } catch {
          return { id: seekerId, seeker: null };
        }
      }),
    );

    const seekerMap = new Map(
      seekers.map((data) => [data.id, data]),
    );

    
    for (const application of applications) {
      const stage = application.stage;
      if (!grouped[stage]) {
        grouped[stage] = [];
      }

      const seekerData = seekerMap.get(application.seekerId);

      grouped[stage].push({
        id: application.id,
        seekerId: application.seekerId,
        seekerName: seekerData?.seeker?.name || 'Unknown',
        seekerAvatar: seekerData?.avatarUrl, 
        jobTitle: job.title,
        atsScore: application.atsScore,
        subStage: application.subStage,
        appliedDate: application.appliedDate,
      });
    }

    return grouped;
  }
}
