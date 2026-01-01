import type { JobApplicationDetailResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';
import { AddInterviewData } from '../interview/AddInterviewData';


export interface IAddInterviewUseCase {
  execute(data: AddInterviewData): Promise<JobApplicationDetailResponseDto>;
}

