import type { JobApplicationListResponseDto } from 'src/application/dtos/seeker/applications/responses/job-application-response.dto';
import { UpdateApplicationScoreDto } from 'src/application/dtos/company/hiring/requests/update-application-score.dto';

export interface IUpdateApplicationScoreUseCase {
  execute(dto: UpdateApplicationScoreDto): Promise<JobApplicationListResponseDto>;
}

