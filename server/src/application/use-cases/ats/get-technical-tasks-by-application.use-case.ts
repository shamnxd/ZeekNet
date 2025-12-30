import { IGetTechnicalTasksByApplicationUseCase } from '../../../domain/interfaces/use-cases/ats/IGetTechnicalTasksByApplicationUseCase';
import { IATSTechnicalTaskRepository } from '../../../domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { ATSTechnicalTask } from '../../../domain/entities/ats-technical-task.entity';

export class GetTechnicalTasksByApplicationUseCase implements IGetTechnicalTasksByApplicationUseCase {
  constructor(private technicalTaskRepository: IATSTechnicalTaskRepository) {}

  async execute(applicationId: string): Promise<ATSTechnicalTask[]> {
    return await this.technicalTaskRepository.findByApplicationId(applicationId);
  }
}

