import type { JobApplicationDetailResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';
import { AddInterviewData } from 'src/domain/interfaces/use-cases/interview/AddInterviewData';


export interface IAddInterviewUseCase {
  execute(data: AddInterviewData): Promise<JobApplicationDetailResponseDto>;
}

