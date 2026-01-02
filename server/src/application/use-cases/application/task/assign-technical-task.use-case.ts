import { v4 as uuidv4 } from 'uuid';
import { IAssignTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IAssignTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';
import { NotFoundError } from 'src/domain/errors/errors';

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

    
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    
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
