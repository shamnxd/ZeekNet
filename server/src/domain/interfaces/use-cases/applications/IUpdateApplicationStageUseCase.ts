import type { JobApplicationListResponseDto } from 'src/application/dtos/job-application/responses/job-application-response.dto';
import { UpdateApplicationStageDto } from 'src/application/dtos/job-application/requests/update-application-stage.dto';

export interface IUpdateApplicationStageUseCase {
  execute(dto: UpdateApplicationStageDto): Promise<JobApplicationListResponseDto>;
}

