import { JobApplication } from 'src/domain/entities/job-application.entity';

export interface IGetJobApplicationsForKanbanUseCase {
  execute(jobId: string, companyId: string): Promise<{
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
  }>;
}



