import type { JobApplicationDetailResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';
import { DeleteInterviewDto } from 'src/application/dtos/interview/common/delete-interview.dto';

export interface IDeleteInterviewUseCase {
  execute(dto: DeleteInterviewDto): Promise<JobApplicationDetailResponseDto>;
}

