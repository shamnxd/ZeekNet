import type { JobApplicationListResponseDto } from 'src/application/dto/application/job-application-response.dto';
import { UpdateApplicationScoreDto } from 'src/application/dto/application/update-application-score.dto';

export interface IUpdateApplicationScoreUseCase {
  execute(dto: UpdateApplicationScoreDto): Promise<JobApplicationListResponseDto>;
}
