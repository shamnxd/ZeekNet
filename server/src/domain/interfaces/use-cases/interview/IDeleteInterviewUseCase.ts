import type { JobApplicationDetailResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';
import { DeleteInterviewDto } from 'src/application/dtos/interview/requests/delete-interview.dto';

export interface IDeleteInterviewUseCase {
  execute(dto: DeleteInterviewDto): Promise<JobApplicationDetailResponseDto>;
}

