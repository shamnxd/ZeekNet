import type { JobApplicationListResponseDto } from 'src/application/dto/application/job-application-response.dto';
import { UpdateApplicationStageDto } from 'src/application/dto/application/update-application-stage.dto';

export interface IUpdateApplicationStageUseCase {
  execute(dto: UpdateApplicationStageDto): Promise<JobApplicationListResponseDto>;
}
