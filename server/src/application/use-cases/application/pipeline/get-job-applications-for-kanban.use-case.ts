import { IGetJobApplicationsForKanbanUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IGetJobApplicationsForKanbanUseCase';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';

export class GetJobApplicationsForKanbanUseCase implements IGetJobApplicationsForKanbanUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private userRepository: IUserRepository,
  ) {}

  async execute(jobId: string, companyId: string): Promise<{
    [stage: string]: Array<{
      id: string;
      seekerId: string;
      seekerName?: string;
      seekerAvatar?: string;
      jobTitle?: string;
      atsScore?: number;
      subStage: string;
      appliedDate: Date;
    }>;
  }> {
    
    const job = await this.jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (job.companyId !== companyId) {
      throw new ValidationError('Job does not belong to this company');
    }

    
    
    const applications = await this.jobApplicationRepository.findMany({
      job_id: jobId,
      company_id: companyId,
    });

    
    const grouped: {
      [stage: string]: Array<{
        id: string;
        seekerId: string;
        seekerName?: string;
        seekerAvatar?: string;
        jobTitle?: string;
        atsScore?: number;
        subStage: string;
        appliedDate: Date;
      }>;
    } = {};

    
    job.enabledStages.forEach((stage) => {
      grouped[stage] = [];
    });

    
    const seekerIds = [...new Set(applications.map((app: { seekerId: string }) => app.seekerId))];
    const seekers = await Promise.all(
      seekerIds.map(async (seekerId: string) => {
        try {
          const seeker = await this.userRepository.findById(seekerId);
          return { id: seekerId, seeker };
        } catch {
          return { id: seekerId, seeker: null };
        }
      }),
    );

    const seekerMap = new Map(
      seekers.map(({ id, seeker }) => [id, seeker]),
    );

    
    for (const application of applications) {
      const stage = application.stage;
      if (!grouped[stage]) {
        grouped[stage] = [];
      }

      const seeker = seekerMap.get(application.seekerId);

      grouped[stage].push({
        id: application.id,
        seekerId: application.seekerId,
        seekerName: seeker?.name || 'Unknown',
        seekerAvatar: undefined, 
        jobTitle: job.title,
        atsScore: application.atsScore,
        subStage: application.subStage,
        appliedDate: application.appliedDate,
      });
    }

    return grouped;
  }
}

