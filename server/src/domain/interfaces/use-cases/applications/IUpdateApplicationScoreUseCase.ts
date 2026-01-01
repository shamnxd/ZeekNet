import type { JobApplicationListResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';
import { UpdateApplicationScoreDto } from 'src/application/dtos/job-application/requests/update-application-score.dto';

export interface IUpdateApplicationScoreUseCase {
  execute(dto: UpdateApplicationScoreDto): Promise<JobApplicationListResponseDto>;
}

