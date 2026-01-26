import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';

export interface IGetTechnicalTasksByApplicationUseCase {
  execute(applicationId: string): Promise<ATSTechnicalTaskResponseDto[]>;
}

