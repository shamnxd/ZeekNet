import type { JobApplicationDetailResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';
import { AddInterviewFeedbackData } from '../interview/AddInterviewFeedbackData';


export interface IAddInterviewFeedbackUseCase {
  execute(data: AddInterviewFeedbackData): Promise<JobApplicationDetailResponseDto>;
}

