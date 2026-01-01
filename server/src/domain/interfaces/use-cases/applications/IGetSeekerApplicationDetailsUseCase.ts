import type { JobApplicationDetailResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';


export interface IGetSeekerApplicationDetailsUseCase {
  execute(userId: string, applicationId: string): Promise<JobApplicationDetailResponseDto>;
}

