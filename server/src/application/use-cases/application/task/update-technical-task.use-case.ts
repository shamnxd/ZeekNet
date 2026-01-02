import { IUpdateTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IUpdateTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';
import { NotFoundError } from 'src/domain/errors/errors';

export class UpdateTechnicalTaskUseCase implements IUpdateTechnicalTaskUseCase {
  constructor(
    private technicalTaskRepository: IATSTechnicalTaskRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
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
  }): Promise<ATSTechnicalTask> {
    
    const existingTask = await this.technicalTaskRepository.findById(data.taskId);
    if (!existingTask) {
      throw new NotFoundError('Technical task not found');
    }

    const updateData: {
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
    } = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.deadline !== undefined) updateData.deadline = data.deadline;
    if (data.documentUrl !== undefined) updateData.documentUrl = data.documentUrl;
    if (data.documentFilename !== undefined) updateData.documentFilename = data.documentFilename;
    if (data.submissionUrl !== undefined) updateData.submissionUrl = data.submissionUrl;
    if (data.submissionFilename !== undefined) updateData.submissionFilename = data.submissionFilename;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.rating !== undefined) updateData.rating = data.rating;
    if (data.feedback !== undefined) updateData.feedback = data.feedback;

    const task = await this.technicalTaskRepository.update(data.taskId, updateData);

    if (!task) {
      throw new NotFoundError('Technical task not found');
    }

    
    const application = await this.jobApplicationRepository.findById(existingTask.applicationId);
    if (application) {
      await this.activityLoggerService.logTechnicalTaskActivity({
        applicationId: existingTask.applicationId,
        taskId: task.id,
        taskTitle: task.title,
        status: data.status === 'assigned' ? undefined : data.status,
        rating: data.rating,
        deadline: data.deadline?.toISOString(),
        title: data.title,
        stage: application.stage,
        subStage: application.subStage,
        performedBy: data.performedBy,
        performedByName: data.performedByName,
      });
    }

    return task;
  }
}

