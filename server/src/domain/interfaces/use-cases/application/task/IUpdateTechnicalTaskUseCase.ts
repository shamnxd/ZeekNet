import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';
import { UpdateTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/update-technical-task.dto';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';

export interface IUpdateTechnicalTaskUseCase {
  execute(dto: UpdateTechnicalTaskRequestDto): Promise<ATSTechnicalTaskResponseDto>;
}
