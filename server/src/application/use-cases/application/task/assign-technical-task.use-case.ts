import { v4 as uuidv4 } from 'uuid';
import { IAssignTechnicalTaskUseCase } from 'src/domain/interfaces/use-cases/application/task/IAssignTechnicalTaskUseCase';
import { IATSTechnicalTaskRepository } from 'src/domain/interfaces/repositories/ats/IATSTechnicalTaskRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';

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
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { IFileUploadService } from 'src/domain/interfaces/services/IFileUploadService';
import { UploadedFile } from 'src/domain/types/common.types';

export class AssignTechnicalTaskUseCase implements IAssignTechnicalTaskUseCase {
  constructor(
    private readonly _taskRepository: IATSTechnicalTaskRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _userRepository: IUserRepository,

    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
    private readonly _fileUploadService: IFileUploadService,
    private readonly _s3Service: IS3Service,
    private readonly _logger: ILogger,
  ) { }

  async execute(dto: AssignTechnicalTaskRequestDto, file?: UploadedFile): Promise<ATSTechnicalTaskResponseDto> {
    let { documentUrl, documentFilename } = dto;

    if (file) {
      const uploadResult = await this._fileUploadService.uploadTaskDocument(file);
      documentUrl = uploadResult.url;
      documentFilename = uploadResult.filename;
    }

    const task = ATSTechnicalTask.create({
      id: uuidv4(),
      applicationId: dto.applicationId,
      title: dto.title,
      description: dto.description,
      deadline: dto.deadline,
      documentUrl,
      documentFilename,
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

    const response = ATSTechnicalTaskMapper.toResponse(savedTask);
    if (response.documentUrl && !response.documentUrl.startsWith('http')) {
      response.documentUrl = await this._s3Service.getSignedUrl(response.documentUrl);
    }

    return response;
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
