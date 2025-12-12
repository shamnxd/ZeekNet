import type { JobApplicationDetailResponseDto } from 'src/application/dto/application/job-application-response.dto';


export interface IGetSeekerApplicationDetailsUseCase {
  execute(userId: string, applicationId: string): Promise<JobApplicationDetailResponseDto>;
}
