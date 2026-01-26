import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IFileUploadService } from 'src/domain/interfaces/services/IFileUploadService';
import { NotFoundError, AuthorizationError, ValidationError } from 'src/domain/errors/errors';
import {
  SubmitTechnicalTaskDto,
  ISubmitTechnicalTaskUseCase,
} from 'src/domain/interfaces/use-cases/seeker/applications/ISubmitTechnicalTaskUseCase';
import { ATSTechnicalTaskMapper } from 'src/application/mappers/ats/ats-technical-task.mapper';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';

export class SubmitTechnicalTaskUseCase implements ISubmitTechnicalTaskUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _technicalTaskRepository: IATSTechnicalTaskRepository,
    private readonly _fileUploadService: IFileUploadService,
  ) { }

  async execute(
    userId: string,
    applicationId: string,
    taskId: string,
    data: SubmitTechnicalTaskDto,
  ): Promise<ATSTechnicalTaskResponseDto> {
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

    let submissionUrl = data.submissionUrl;
    let submissionFilename = data.submissionFilename;

    if (data.file) {
      const uploadResult = await this._fileUploadService.uploadTaskSubmission(data.file, 'submission');
      submissionUrl = uploadResult.url;
      submissionFilename = uploadResult.filename;
    }

    if (!submissionUrl && !data.submissionLink) {
      throw new ValidationError('Please provide either a file upload or a submission link');
    }

    const updatedTask = await this._technicalTaskRepository.update(taskId, {
      submissionUrl,
      submissionFilename,
      submissionLink: data.submissionLink,
      submissionNote: data.submissionNote,
      status: 'submitted',
      submittedAt: new Date(),
    });

    if (!updatedTask) {
      throw new NotFoundError('Failed to update task');
    }

    return ATSTechnicalTaskMapper.toResponse(updatedTask);
  }
}
