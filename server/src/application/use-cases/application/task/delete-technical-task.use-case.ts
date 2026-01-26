import { IDeleteTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IDeleteTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { NotFoundError } from 'src/domain/errors/errors';
import { DeleteTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/delete-technical-task.dto';

export class DeleteTechnicalTaskUseCase implements IDeleteTechnicalTaskUseCase {
  constructor(
    private technicalTaskRepository: IATSTechnicalTaskRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: DeleteTechnicalTaskRequestDto): Promise<void> {
    
    const existingTask = await this.technicalTaskRepository.findById(data.taskId);
    if (!existingTask) {
      throw new NotFoundError('Technical task not found');
    }

    const deleted = await this.technicalTaskRepository.delete(data.taskId);
    if (!deleted) {
      throw new NotFoundError('Technical task not found');
    }

    
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

