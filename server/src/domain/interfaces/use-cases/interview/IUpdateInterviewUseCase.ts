import type { JobApplicationDetailResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';
import { UpdateInterviewData } from '../interview/UpdateInterviewData';


export interface IUpdateInterviewUseCase {
  execute(data: UpdateInterviewData): Promise<JobApplicationDetailResponseDto>;
}

