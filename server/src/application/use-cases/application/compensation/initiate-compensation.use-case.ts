import { v4 as uuidv4 } from 'uuid';
import { IInitiateCompensationUseCase } from 'src/domain/interfaces/use-cases/application/compensation/IInitiateCompensationUseCase';
import { IATSCompensationRepository } from 'src/domain/interfaces/repositories/ats/IATSCompensationRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IAddCommentUseCase } from 'src/domain/interfaces/use-cases/application/activity/IAddCommentUseCase';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSCompensation } from 'src/domain/entities/ats-compensation.entity';
import { ATSStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError, ValidationError } from 'src/domain/errors/errors';

import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';

export class InitiateCompensationUseCase implements IInitiateCompensationUseCase {
  constructor(
    private compensationRepository: IATSCompensationRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private userRepository: IUserRepository,
    private addCommentUseCase: IAddCommentUseCase,
    private activityLoggerService: IActivityLoggerService,
    private mailerService: IMailerService,
    private emailTemplateService: IEmailTemplateService,
  ) {}

  async execute(data: {
    applicationId: string;
    candidateExpected: string;
    notes?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSCompensation> {
    
    const existing = await this.compensationRepository.findByApplicationId(data.applicationId);
    if (existing) {
      throw new ValidationError('Compensation discussion already initiated');
    }

    
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const job = await this.jobPostingRepository.findById(application.jobId);
    if (job && application.seekerId) {
        await this._sendCompensationInitiatedEmail(
            application.seekerId,
            job.title,
            job.companyName || 'ZeekNet'
        );
    }

    
    const compensation = ATSCompensation.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      candidateExpected: data.candidateExpected,
    });

    const created = await this.compensationRepository.create(compensation);

    
    await this.activityLoggerService.logCompensationActivity({
      applicationId: data.applicationId,
      type: 'initiated',
      candidateExpected: data.candidateExpected,
      stage: ATSStage.COMPENSATION,
      subStage: application.subStage,
      performedBy: data.performedBy,
      performedByName: data.performedByName,
    });

    if (data.notes) {
      await this.addCommentUseCase.execute({
        applicationId: data.applicationId,
        comment: data.notes,
        stage: ATSStage.COMPENSATION,
        addedBy: data.performedBy,
        addedByName: data.performedByName,
      });
    }

    return created;
  }

  private async _sendCompensationInitiatedEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(seekerId);
      if (!user) return;

      const { subject, html } = this.emailTemplateService.getCompensationInitiatedEmail(
        user.name,
        jobTitle,
        companyName,
      );
      await this.mailerService.sendMail(user.email, subject, html);
    } catch (error) {
      console.error('Failed to send compensation initiated email:', error);
    }
  }
}
