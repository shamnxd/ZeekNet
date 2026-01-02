import { IGetTechnicalTasksByApplicationUseCase } from 'src/domain/interfaces/use-cases/application/task/IGetTechnicalTasksByApplicationUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';

export class GetTechnicalTasksByApplicationUseCase implements IGetTechnicalTasksByApplicationUseCase {
  constructor(private technicalTaskRepository: IATSTechnicalTaskRepository) {}

  async execute(applicationId: string): Promise<ATSTechnicalTask[]> {
    return await this.technicalTaskRepository.findByApplicationId(applicationId);
  }
}

