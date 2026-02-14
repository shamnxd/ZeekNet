import { IMoveApplicationStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IMoveApplicationStageUseCase';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IATSCommentRepository } from 'src/domain/interfaces/repositories/ats/IATSCommentRepository';

import { JobApplication } from 'src/domain/entities/job-application.entity';
import { ATSStage, ATSSubStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';
import { getDefaultSubStage, isValidSubStageForStage, STAGE_TO_SUB_STAGES } from 'src/domain/utils/ats-pipeline.util';
import { MoveApplicationStageDto } from 'src/application/dtos/application/requests/move-application-stage.dto';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { JobApplicationResponseDto } from 'src/application/dtos/application/responses/job-application-response.dto';
import { JobApplicationMapper } from 'src/application/mappers/job-application/job-application.mapper';
import { ILogger } from 'src/domain/interfaces/services/ILogger';
import { ATSComment } from 'src/domain/entities/ats-comment.entity';
import { v4 as uuidv4 } from 'uuid';

export class MoveApplicationStageUseCase implements IMoveApplicationStageUseCase {
  constructor(
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private commentRepository: IATSCommentRepository,
    private userRepository: IUserRepository,
    private mailerService: IMailerService,
    private emailTemplateService: IEmailTemplateService,
    private logger: ILogger,
  ) { }

  async execute(dto: MoveApplicationStageDto): Promise<JobApplication> {
    const data = {
      applicationId: dto.applicationId,
      nextStage: dto.nextStage as ATSStage,
      subStage: dto.subStage as ATSSubStage | undefined,
      performedBy: dto.userId,
      performedByName: dto.userName,
      comment: dto.comment,
    };

    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const job = await this.jobPostingRepository.findById(application.jobId);
    if (!job) {
      throw new NotFoundError('Job not found');
    }

    if (!job.enabledStages.includes(data.nextStage)) {
      throw new ValidationError(`Stage '${data.nextStage}' is not enabled for this job`);
    }

    const currentStageIndex = job.enabledStages.indexOf(application.stage);
    const nextStageIndex = job.enabledStages.indexOf(data.nextStage);

    if (currentStageIndex === -1) {

    } else if (nextStageIndex !== -1 && nextStageIndex < currentStageIndex) {
      throw new ValidationError(`Cannot move to stage '${data.nextStage}' as it is before the current stage '${application.stage}'. Stage changes can only be made from the current stage.`);
    }

    let targetSubStage: ATSSubStage;
    if (data.subStage) {
      if (!isValidSubStageForStage(data.nextStage, data.subStage)) {
        throw new ValidationError(`Sub-stage '${data.subStage}' is not valid for stage '${data.nextStage}'`);
      }
      targetSubStage = data.subStage;
    } else {
      targetSubStage = getDefaultSubStage(data.nextStage);
    }

    const previousStage = application.stage;
    const previousSubStage = application.subStage;

    const updatedApplication = await this.jobApplicationRepository.update(data.applicationId, {
      stage: data.nextStage,
      subStage: targetSubStage,
    });

    if (!updatedApplication) {
      throw new NotFoundError('Failed to update application');
    }

    // Create comment for stage/substage change if reason provided
    if (data.comment) {
      const comment = ATSComment.create({
        id: uuidv4(),
        applicationId: data.applicationId,
        comment: data.comment,
        stage: data.nextStage,
        subStage: targetSubStage,
      });
      await this.commentRepository.create(comment);
    }

    if (previousStage !== data.nextStage && application.seekerId) {
      await this._sendStageChangeEmail(application.seekerId, job.title, job.companyName || 'ZeekNet', data.nextStage);
    }

    return JobApplicationMapper.toResponse(updatedApplication);
  }

  private async _sendStageChangeEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
    stage: ATSStage,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(seekerId);
      if (!user) return;

      let emailContent;
      if (stage === ATSStage.REJECTED) {
        emailContent = this.emailTemplateService.getRejectionEmail(user.name, jobTitle, companyName);
      } else {
        emailContent = this.emailTemplateService.getStageChangeEmail(user.name, jobTitle, companyName, stage);
      }

      await this.mailerService.sendMail(user.email, emailContent.subject, emailContent.html);
    } catch (error) {
      this.logger.error('Failed to send stage change email:', error);
    }
  }
}
