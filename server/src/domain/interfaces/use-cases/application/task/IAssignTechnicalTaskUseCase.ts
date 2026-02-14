import { AssignTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/assign-technical-task.dto';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';
import { UploadedFile } from 'src/domain/types/common.types';

export interface IAssignTechnicalTaskUseCase {
  execute(dto: AssignTechnicalTaskRequestDto, file?: UploadedFile): Promise<ATSTechnicalTaskResponseDto>;
}
