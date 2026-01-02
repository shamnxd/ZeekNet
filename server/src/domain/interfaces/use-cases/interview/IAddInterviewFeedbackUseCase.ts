import type { JobApplicationDetailResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';
import { AddInterviewFeedbackData } from 'src/domain/interfaces/use-cases/interview/AddInterviewFeedbackData';


export interface IAddInterviewFeedbackUseCase {
  execute(data: AddInterviewFeedbackData): Promise<JobApplicationDetailResponseDto>;
}

