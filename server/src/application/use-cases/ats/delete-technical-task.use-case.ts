import { IDeleteTechnicalTaskUseCase } from '../../../domain/interfaces/use-cases/ats/IDeleteTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from '../../../domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { NotFoundError } from '../../../domain/errors/errors';

export class DeleteTechnicalTaskUseCase implements IDeleteTechnicalTaskUseCase {
  constructor(
    private technicalTaskRepository: IATSTechnicalTaskRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    taskId: string;
    performedBy: string;
    performedByName: string;
  }): Promise<void> {
    // Get task first to get applicationId and task details
    const existingTask = await this.technicalTaskRepository.findById(data.taskId);
    if (!existingTask) {
      throw new NotFoundError('Technical task not found');
    }

    const deleted = await this.technicalTaskRepository.delete(data.taskId);
    if (!deleted) {
      throw new NotFoundError('Technical task not found');
    }

    // Get application to get current stage and subStage for activity logging
    const application = await this.jobApplicationRepository.findById(existingTask.applicationId);
    if (application) {
      await this.activityLoggerService.logTechnicalTaskActivity({
        applicationId: existingTask.applicationId,
        taskId: existingTask.id,
        taskTitle: existingTask.title,
        stage: application.stage,
        subStage: application.subStage,
        performedBy: data.performedBy,
        performedByName: data.performedByName,
        action: 'deleted',
      });
    }
  }
}

