import type { JobApplicationListResponseDto } from 'src/application/dto/application/job-application-response.dto';

// be

export interface IUpdateApplicationStageUseCase {
  execute(userId: string, applicationId: string, stage: 'applied' | 'shortlisted' | 'interview' | 'rejected' | 'hired', rejectionReason?: string): Promise<JobApplicationListResponseDto>;
}
