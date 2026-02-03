import { v4 as uuidv4 } from 'uuid';
import { IAssignTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IAssignTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSTechnicalTask } from 'src/domain/entities/ats-technical-task.entity';
import { NotFoundError } from 'src/domain/errors/errors';
import { ILogger } from 'src/domain/interfaces/services/ILogger';

import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { AssignTechnicalTaskRequestDto } from 'src/application/dtos/application/task/requests/assign-technical-task.dto';
import { ATSTechnicalTaskResponseDto } from 'src/application/dtos/application/task/responses/ats-technical-task-response.dto';
import { ATSTechnicalTaskMapper } from 'src/application/mappers/ats/ats-technical-task.mapper';

export class AssignTechnicalTaskUseCase implements IAssignTechnicalTaskUseCase {
  constructor(
    private readonly _taskRepository: IATSTechnicalTaskRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _activityLoggerService: IActivityLoggerService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
    private readonly _logger: ILogger,
  ) { }

  async execute(dto: AssignTechnicalTaskRequestDto): Promise<ATSTechnicalTaskResponseDto> {

    const task = ATSTechnicalTask.create({
      id: uuidv4(),
      applicationId: dto.applicationId,
      title: dto.title,
      description: dto.description,
      deadline: dto.deadline,
      documentUrl: dto.documentUrl,
      documentFilename: dto.documentFilename,
      status: 'assigned',
    });

    const savedTask = await this._taskRepository.create(task);


    const application = await this._jobApplicationRepository.findById(dto.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const currentUser = await this._userRepository.findById(dto.performedBy);
    const performedByName = currentUser ? currentUser.name : 'Unknown';

    const job = await this._jobPostingRepository.findById(application.jobId);
    if (job && application.seekerId) {
      await this._sendTechnicalTaskAssignedEmail(
        application.seekerId,
        job.title,
        job.companyName || 'ZeekNet',
        dto.title,
        dto.deadline,
      );
    }

    await this._activityLoggerService.logTaskAssignedActivity({
      applicationId: dto.applicationId,
      taskId: savedTask.id,
      taskTitle: dto.title,
      deadline: dto.deadline,
      stage: application.stage,
      subStage: application.subStage,
      performedBy: dto.performedBy,
      performedByName: performedByName,
    });

    return ATSTechnicalTaskMapper.toResponse(savedTask);
  }

  private async _sendTechnicalTaskAssignedEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
    taskTitle: string,
    deadline: Date,
  ): Promise<void> {
    try {
      const user = await this._userRepository.findById(seekerId);
      if (!user) return;

      const deadlineStr = deadline.toLocaleDateString();

      const { subject, html } = this._emailTemplateService.getTechnicalTaskAssignedEmail(
        user.name,
        jobTitle,
        companyName,
        taskTitle,
        deadlineStr,
      );
      await this._mailerService.sendMail(user.email, subject, html);
    } catch (error) {
      this._logger.error('Failed to send technical task assigned email:', error);
    }
  }
}
