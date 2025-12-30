import { v4 as uuidv4 } from 'uuid';
import { IAssignTechnicalTaskUseCase } from '../../../domain/interfaces/use-cases/ats/IAssignTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from '../../../domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { ATSTechnicalTask } from '../../../domain/entities/ats-technical-task.entity';
import { NotFoundError } from '../../../domain/errors/errors';

export class AssignTechnicalTaskUseCase implements IAssignTechnicalTaskUseCase {
  constructor(
    private taskRepository: IATSTechnicalTaskRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    applicationId: string;
    title: string;
    description: string;
    deadline: Date;
    documentUrl?: string;
    documentFilename?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSTechnicalTask> {
    // Create technical task
    const task = ATSTechnicalTask.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      documentUrl: data.documentUrl,
      documentFilename: data.documentFilename,
      status: 'assigned',
    });

    const savedTask = await this.taskRepository.create(task);

    // Get application to get current stage and subStage
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Log activity
    await this.activityLoggerService.logTaskAssignedActivity({
      applicationId: data.applicationId,
      taskId: savedTask.id,
      taskTitle: data.title,
      deadline: data.deadline,
      stage: application.stage,
      subStage: application.subStage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    return savedTask;
  }
}
