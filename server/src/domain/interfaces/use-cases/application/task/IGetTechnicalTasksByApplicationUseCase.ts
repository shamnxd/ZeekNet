import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';

export interface IGetTechnicalTasksByApplicationUseCase {
  execute(applicationId: string): Promise<ATSTechnicalTask[]>;
}

