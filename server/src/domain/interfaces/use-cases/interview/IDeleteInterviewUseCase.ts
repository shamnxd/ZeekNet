import type { JobApplicationDetailResponseDto } from 'src/application/dto/application/job-application-response.dto';
import { DeleteInterviewDto } from 'src/application/dto/interview/delete-interview.dto';

export interface IDeleteInterviewUseCase {
  execute(dto: DeleteInterviewDto): Promise<JobApplicationDetailResponseDto>;
}
