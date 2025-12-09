import type { JobApplicationDetailResponseDto } from 'src/application/dto/application/job-application-response.dto';
import { UpdateInterviewData } from '../interview/UpdateInterviewData';


export interface IUpdateInterviewUseCase {
  execute(data: UpdateInterviewData): Promise<JobApplicationDetailResponseDto>;
}
