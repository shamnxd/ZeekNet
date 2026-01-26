import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';
import { UploadedFile } from 'src/domain/types/common.types';

export interface SubmitTechnicalTaskDto {
  file?: UploadedFile;
  submissionUrl?: string;
  submissionFilename?: string;
  submissionLink?: string;
  submissionNote?: string;
}

export interface ISubmitTechnicalTaskUseCase {
  execute(
    userId: string,
    applicationId: string,
    taskId: string,
    data: SubmitTechnicalTaskDto,
  ): Promise<ATSTechnicalTaskResponseDto>;
}
