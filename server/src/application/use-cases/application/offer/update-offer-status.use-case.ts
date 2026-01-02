import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUpdateOfferStatusUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSOffer } from 'src/domain/entities/ats-offer.entity';
import { ATSStage, OfferSubStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError } from 'src/domain/errors/errors';

import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';

export class UpdateOfferStatusUseCase implements IUpdateOfferStatusUseCase {
  constructor(
    private offerRepository: IATSOfferRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private jobPostingRepository: IJobPostingRepository,
    private userRepository: IUserRepository,
    private updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
    private activityLoggerService: IActivityLoggerService,
    private mailerService: IMailerService,
    private emailTemplateService: IEmailTemplateService,
  ) {}

  async execute(data: {
    offerId: string;
    status: 'draft' | 'sent' | 'signed' | 'declined';
    withdrawalReason?: string;
    performedBy: string;
    performedByName: string;
  }): Promise<ATSOffer> {
    
    const existingOffer = await this.offerRepository.findById(data.offerId);
    if (!existingOffer) {
      throw new NotFoundError('Offer not found');
    }

    const updateData: {
      status?: 'draft' | 'sent' | 'signed' | 'declined';
      sentAt?: Date;
      signedAt?: Date;
      declinedAt?: Date;
      withdrawalReason?: string;
      withdrawnBy?: string;
      withdrawnByName?: string;
      withdrawnAt?: Date;
    } = { status: data.status };

    if (data.status === 'sent') {
      updateData.sentAt = new Date();
    } else if (data.status === 'signed') {
      updateData.signedAt = new Date();
    } else if (data.status === 'declined') {
      updateData.declinedAt = new Date();
      
      
      if (data.withdrawalReason) {
        updateData.withdrawalReason = data.withdrawalReason;
        updateData.withdrawnBy = data.performedBy;
        updateData.withdrawnByName = data.performedByName;
        updateData.withdrawnAt = new Date();
      }
    }

    const offer = await this.offerRepository.update(data.offerId, updateData);

    if (!offer) {
      throw new NotFoundError('Offer not found');
    }

    
    const application = await this.jobApplicationRepository.findById(existingOffer.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }
    
    const job = await this.jobPostingRepository.findById(application.jobId);
    if (job && application.seekerId) {
        if (data.status === 'sent') {
            await this._sendOfferExtendedEmail(application.seekerId, job.title, job.companyName || 'ZeekNet');
        } else if (data.status === 'signed') {
            await this._sendOfferAcceptedEmail(application.seekerId, job.title, job.companyName || 'ZeekNet');
        }
    }

    
    if (data.status === 'declined' && data.withdrawalReason && application.stage === ATSStage.OFFER) {
      await this.updateApplicationSubStageUseCase.execute({
        applicationId: existingOffer.applicationId,
        subStage: OfferSubStage.OFFER_DECLINED,
        performedBy: data.performedBy,
        performedByName: data.performedByName,
      });
    }

    
    if (data.status === 'signed' || data.status === 'declined') {
      await this.activityLoggerService.logOfferActivity({
        applicationId: existingOffer.applicationId,
        offerId: offer.id,
        status: data.status,
        withdrawalReason: data.withdrawalReason,
        stage: application.stage,
        subStage: application.subStage,
        performedBy: data.performedBy,
        performedByName: data.performedByName,
      });
    }

    return offer;
  }

  private async _sendOfferExtendedEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(seekerId);
      if (!user) return;

      const { subject, html } = this.emailTemplateService.getOfferExtendedEmail(
        user.name,
        jobTitle,
        companyName,
      );
      await this.mailerService.sendMail(user.email, subject, html);
    } catch (error) {
      console.error('Failed to send offer extended email:', error);
    }
  }

  private async _sendOfferAcceptedEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    try {
      const user = await this.userRepository.findById(seekerId);
      if (!user) return;

      const { subject, html } = this.emailTemplateService.getOfferAcceptedEmail(
        user.name,
        jobTitle,
        companyName,
      );
      await this.mailerService.sendMail(user.email, subject, html);
    } catch (error) {
      console.error('Failed to send offer accepted email:', error);
    }
  }
}
