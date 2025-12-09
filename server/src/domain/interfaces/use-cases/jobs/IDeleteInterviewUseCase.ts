import type { JobApplicationDetailResponseDto } from 'src/application/dto/application/job-application-response.dto';

// be

export interface IDeleteInterviewUseCase {
  execute(userId: string, applicationId: string, interviewId: string): Promise<JobApplicationDetailResponseDto>;
}
