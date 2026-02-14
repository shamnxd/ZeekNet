import { UpdateTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/update-technical-task.dto';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';
import { UploadedFile } from 'src/domain/types/common.types';

export interface IUpdateTechnicalTaskUseCase {
  execute(dto: UpdateTechnicalTaskRequestDto, file?: UploadedFile): Promise<ATSTechnicalTaskResponseDto>;
}
