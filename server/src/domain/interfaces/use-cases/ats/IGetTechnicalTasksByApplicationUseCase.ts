import { ATSTechnicalTask } from '../../../entities/ats-technical-task.entity';

export interface IGetTechnicalTasksByApplicationUseCase {
  execute(applicationId: string): Promise<ATSTechnicalTask[]>;
}

