import { IGetTechnicalTasksByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/task/IGetTechnicalTasksByApplicationUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';
import { ATSTechnicalTaskMapper } from 'src/application/mappers/ats/ats-technical-task.mapper';

export class GetTechnicalTasksByApplicationUseCase implements IGetTechnicalTasksByApplicationUseCase {
  constructor(private technicalTaskRepository: IATSTechnicalTaskRepository) {}

  async execute(applicationId: string): Promise<ATSTechnicalTaskResponseDto[]> {
    const tasks = await this.technicalTaskRepository.findByApplicationId(applicationId);
    return ATSTechnicalTaskMapper.toResponseList(tasks);
  }
}

