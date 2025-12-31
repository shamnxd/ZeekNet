import { IGetJobApplicationsForKanbanUseCase } from '../../../domain/interfaces/use-cases/ats/IGetJobApplicationsForKanbanUseCase';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from '../../../domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from '../../../domain/interfaces/repositories/user/IUserRepository';
import { NotFoundError, ValidationError } from '../../../domain/errors/errors';
import { ATSStage } from '../../../domain/enums/ats-stage.enum';

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
    // Get job to verify ownership and get enabled stages
    const job = await this.jobPostingRepository.findById(jobId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (job.companyId !== companyId) {
      throw new ValidationError('Job does not belong to this company');
    }

    // Get all applications for this job
    // Note: findMany expects document field names (snake_case) and ObjectIds
    const applications = await this.jobApplicationRepository.findMany({
      job_id: jobId,
      company_id: companyId,
    });

    // Group by stage
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

    // Initialize all enabled stages
    job.enabledStages.forEach((stage) => {
      grouped[stage] = [];
    });

    // Populate seeker information
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

    // Group applications
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
        seekerAvatar: undefined, // Avatar is in SeekerProfile, not User - fetch separately if needed
        jobTitle: job.title,
        atsScore: application.atsScore,
        subStage: application.subStage,
        appliedDate: application.appliedDate,
      });
    }

    return grouped;
  }
}

