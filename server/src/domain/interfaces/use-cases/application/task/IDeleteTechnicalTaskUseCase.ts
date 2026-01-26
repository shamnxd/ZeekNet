import { DeleteTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/delete-technical-task.dto';

export interface IDeleteTechnicalTaskUseCase {
  execute(data: DeleteTechnicalTaskRequestDto): Promise<void>;
}

