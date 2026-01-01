import { IUpdateOfferStatusUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUpdateOfferStatusUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSOffer } from 'src/domain/entities/ats-offer.entity';
import { ATSStage, OfferSubStage } from 'src/domain/enums/ats-stage.enum';
import { NotFoundError } from 'src/domain/errors/errors';

export class UpdateOfferStatusUseCase implements IUpdateOfferStatusUseCase {
  constructor(
    private offerRepository: IATSOfferRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
    private activityLoggerService: IActivityLoggerService,
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
}

