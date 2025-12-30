import { ATSTechnicalTask } from '../../../entities/ats-technical-task.entity';

export interface IATSTechnicalTaskRepository {
  create(task: ATSTechnicalTask): Promise<ATSTechnicalTask>;
  findById(id: string): Promise<ATSTechnicalTask | null>;
  findByApplicationId(applicationId: string): Promise<ATSTechnicalTask[]>;
  update(id: string, data: Partial<ATSTechnicalTask>): Promise<ATSTechnicalTask | null>;
  delete(id: string): Promise<boolean>;
}
