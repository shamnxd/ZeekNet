import type { JobApplicationDetailResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';


export interface IGetSeekerApplicationDetailsUseCase {
  execute(userId: string, applicationId: string): Promise<JobApplicationDetailResponseDto>;
}

