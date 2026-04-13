import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUpdateOfferStatusUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';

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
import { ERROR } from 'src/shared/constants/messages';

@injectable()
export class UpdateOfferStatusUseCase implements IUpdateOfferStatusUseCase {
  constructor(
    @inject(TYPES.ATSOfferRepository) private readonly _offerRepository: IATSOfferRepository,
    @inject(TYPES.JobApplicationRepository) private readonly _jobApplicationRepository: IJobApplicationRepository,
    @inject(TYPES.JobPostingRepository) private readonly _jobPostingRepository: IJobPostingRepository,
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.UpdateApplicationSubStageUseCase) private readonly _updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,

    @inject(TYPES.MailerService) private readonly _mailerService: IMailerService,
    @inject(TYPES.EmailTemplateService) private readonly _emailTemplateService: IEmailTemplateService,
    @inject(TYPES.LoggerService) private readonly _logger: ILogger,
  ) { }

  async execute(data: UpdateOfferStatusRequestDto): Promise<ATSOfferResponseDto> {
    const existingOffer = await this._offerRepository.findById(data.offerId);
    if (!existingOffer) {
      throw new NotFoundError(ERROR.NOT_FOUND('Offer'));
    }

    const updateData: {
      status?: 'draft' | 'sent' | 'signed' | 'declined';
      withdrawalReason?: string;
    } = { status: data.status };

    if (data.status === 'declined' && data.withdrawalReason) {
      updateData.withdrawalReason = data.withdrawalReason;
    }

    const offer = await this._offerRepository.update(data.offerId, updateData);
    if (!offer) {
      throw new NotFoundError(ERROR.NOT_FOUND('Offer'));
    }

    const application = await this._jobApplicationRepository.findById(existingOffer.applicationId);
    if (!application) {
      throw new NotFoundError(ERROR.NOT_FOUND('Application'));
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
      this._logger.error(ERROR.FAILED_TO('send offer extended email:'), error);
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
      this._logger.error(ERROR.FAILED_TO('send offer accepted email:'), error);
    }
  }
}
