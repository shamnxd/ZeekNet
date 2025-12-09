import type { JobApplicationListResponseDto } from 'src/application/dto/application/job-application-response.dto';

// be

export interface IUpdateApplicationScoreUseCase {
  execute(userId: string, applicationId: string, score: number): Promise<JobApplicationListResponseDto>;
}
