import type { JobApplicationDetailResponseDto } from 'src/application/dto/application/job-application-response.dto';
import { AddInterviewData } from '../interview/AddInterviewData';


export interface IAddInterviewUseCase {
  execute(data: AddInterviewData): Promise<JobApplicationDetailResponseDto>;
}
