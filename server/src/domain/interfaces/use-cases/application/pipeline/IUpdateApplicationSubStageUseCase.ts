import { JobApplicationResponseDto } from 'src/application/dtos/application/responses/job-application-response.dto';
import { UpdateSubStageDto } from 'src/application/dtos/application/requests/update-sub-stage.dto';

export interface IUpdateApplicationSubStageUseCase {
  execute(dto: UpdateSubStageDto): Promise<JobApplicationResponseDto>;
}

