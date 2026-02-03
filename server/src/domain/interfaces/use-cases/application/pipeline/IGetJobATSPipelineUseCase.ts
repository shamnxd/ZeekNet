import { JobATSPipelineResponseDto } from 'src/application/dtos/application/pipeline/responses/job-ats-pipeline-response.dto';
import { GetJobPipelineDto } from 'src/application/dtos/application/requests/get-job-pipeline.dto';

export interface IGetJobATSPipelineUseCase {
  execute(dto: GetJobPipelineDto): Promise<JobATSPipelineResponseDto>;
}



