import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUpdateOfferStatusUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSStage, OfferSubStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError } from 'src/domain/errors/errors';
import { IJobPostingRepository } from 'src/domain/interfaces/repositories/job/IJobPostingRepository';
import { IUserRepository } from 'src/domain/interfaces/repositories/user/IUserRepository';
import { IMailerService } from 'src/domain/interfaces/services/IMailerService';
import { IEmailTemplateService } from 'src/domain/interfaces/services/IEmailTemplateService';
import { UpdateOfferStatusRequestDto } from 'src/application/dtos/application/offer/requests/update-offer-status-request.dto';
import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';
import { ATSOfferMapper } from 'src/application/mappers/ats/ats-offer.mapper';
import { ILogger } from 'src/domain/interfaces/services/ILogger';

export class UpdateOfferStatusUseCase implements IUpdateOfferStatusUseCase {
  constructor(
    private readonly _offerRepository: IATSOfferRepository,
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _jobPostingRepository: IJobPostingRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
    private readonly _activityLoggerService: IActivityLoggerService,
    private readonly _mailerService: IMailerService,
    private readonly _emailTemplateService: IEmailTemplateService,
    private readonly _logger: ILogger,
  ) { }

  async execute(data: UpdateOfferStatusRequestDto): Promise<ATSOfferResponseDto> {
    const existingOffer = await this._offerRepository.findById(data.offerId);
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

    const offer = await this._offerRepository.update(data.offerId, updateData);
    if (!offer) {
      throw new NotFoundError('Offer not found');
    }

    const application = await this._jobApplicationRepository.findById(existingOffer.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    const job = await this._jobPostingRepository.findById(application.jobId);
    if (job && application.seekerId) {
      if (data.status === 'sent') {
        await this._sendOfferExtendedEmail(application.seekerId, job.title, job.companyName || 'ZeekNet');
      } else if (data.status === 'signed') {
        await this._sendOfferAcceptedEmail(application.seekerId, job.title, job.companyName || 'ZeekNet');
      }
    }

    if (data.status === 'declined' && data.withdrawalReason && application.stage === ATSStage.OFFER) {
      await this._updateApplicationSubStageUseCase.execute({
        applicationId: existingOffer.applicationId,
        subStage: OfferSubStage.OFFER_DECLINED,
        userId: data.performedBy,
        userName: data.performedByName,
      });
    }

    if (data.status === 'signed' || data.status === 'declined') {
      await this._activityLoggerService.logOfferActivity({
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

    return ATSOfferMapper.toResponse(offer);
  }

  private async _sendOfferExtendedEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    try {
      const user = await this._userRepository.findById(seekerId);
      if (!user) return;

      const { subject, html } = this._emailTemplateService.getOfferExtendedEmail(
        user.name,
        jobTitle,
        companyName,
      );
      await this._mailerService.sendMail(user.email, subject, html);
    } catch (error) {
      this._logger.error('Failed to send offer extended email:', error);
    }
  }

  private async _sendOfferAcceptedEmail(
    seekerId: string,
    jobTitle: string,
    companyName: string,
  ): Promise<void> {
    try {
      const user = await this._userRepository.findById(seekerId);
      if (!user) return;

      const { subject, html } = this._emailTemplateService.getOfferAcceptedEmail(
        user.name,
        jobTitle,
        companyName,
      );
      await this._mailerService.sendMail(user.email, subject, html);
    } catch (error) {
      this._logger.error('Failed to send offer accepted email:', error);
    }
  }
}
