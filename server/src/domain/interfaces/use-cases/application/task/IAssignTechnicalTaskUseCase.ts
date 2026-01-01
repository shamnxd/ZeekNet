import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';

export interface IAssignTechnicalTaskUseCase {
  execute(data: {
    applicationId: string;
    title: string;
    description: string;
    deadline: Date;
    documentUrl?: string;
    documentFilename?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSTechnicalTask>;
}
