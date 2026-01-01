import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';

export interface IUpdateTechnicalTaskUseCase {
  execute(data: {
    taskId: string;
    title?: string;
    description?: string;
    deadline?: Date;
    documentUrl?: string;
    documentFilename?: string;
    submissionUrl?: string;
    submissionFilename?: string;
    status?: 'assigned' | 'submitted' | 'under_review' | 'completed' | 'cancelled';
    rating?: number;
    feedback?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSTechnicalTask>;
}

