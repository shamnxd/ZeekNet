import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { NotFoundError, AuthorizationError, ValidationError } from 'src/domain/errors/errors';
import { 
  SubmitTechnicalTaskDto, 
  ISubmitTechnicalTaskUseCase, 
} from 'src/domain/interfaces/use-cases/seeker/applications/ISubmitTechnicalTaskUseCase';

export class SubmitTechnicalTaskUseCase implements ISubmitTechnicalTaskUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _technicalTaskRepository: IATSTechnicalTaskRepository,
  ) {}

  async execute(
    userId: string,
    applicationId: string,
    taskId: string,
    data: SubmitTechnicalTaskDto,
  ) {
    if (!data.submissionUrl && !data.submissionLink) {
      throw new ValidationError('Please provide either a file upload or a submission link');
    }

    const application = await this._jobApplicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only submit tasks for your own applications');
    }

    const task = await this._technicalTaskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundError('Technical task not found');
    }

    if (task.applicationId !== applicationId) {
      throw new ValidationError('Task does not belong to this application');
    }

    const updatedTask = await this._technicalTaskRepository.update(taskId, {
      submissionUrl: data.submissionUrl,
      submissionFilename: data.submissionFilename,
      submissionLink: data.submissionLink,
      submissionNote: data.submissionNote,
      status: 'submitted',
      submittedAt: new Date(),
    });

    if (!updatedTask) {
      throw new NotFoundError('Failed to update task');
    }

    return {
      id: updatedTask.id,
      applicationId: updatedTask.applicationId,
      title: updatedTask.title,
      description: updatedTask.description,
      deadline: updatedTask.deadline,
      documentUrl: updatedTask.documentUrl,
      documentFilename: updatedTask.documentFilename,
      submissionUrl: updatedTask.submissionUrl,
      submissionFilename: updatedTask.submissionFilename,
      submissionLink: updatedTask.submissionLink,
      submissionNote: updatedTask.submissionNote,
      submittedAt: updatedTask.submittedAt,
      status: updatedTask.status,
      createdAt: updatedTask.createdAt,
      updatedAt: updatedTask.updatedAt,
    };
  }
}
