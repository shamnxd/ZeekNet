import { JobApplicationResponseDto } from 'src/application/dtos/application/responses/job-application-response.dto';
import { MoveApplicationStageDto } from 'src/application/dtos/application/requests/move-application-stage.dto';

export interface IMoveApplicationStageUseCase {
  execute(dto: MoveApplicationStageDto): Promise<JobApplicationResponseDto>;
}

