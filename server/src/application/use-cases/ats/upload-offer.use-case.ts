import { v4 as uuidv4 } from 'uuid';
import { IUploadOfferUseCase } from '../../../domain/interfaces/use-cases/ats/IUploadOfferUseCase';
import { IATSOfferRepository } from '../../../domain/interfaces/repositories/ats/IATSOfferRepository';
import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from '../../../domain/interfaces/services/IActivityLoggerService';
import { ATSOffer } from '../../../domain/entities/ats-offer.entity';
import { NotFoundError } from '../../../domain/errors/errors';

export class UploadOfferUseCase implements IUploadOfferUseCase {
  constructor(
    private offerRepository: IATSOfferRepository,
    private jobApplicationRepository: IJobApplicationRepository,
    private activityLoggerService: IActivityLoggerService,
  ) {}

  async execute(data: {
    applicationId: string;
    documentUrl: string;
    documentFilename: string;
    offerAmount?: string;
    uploadedBy: string;
    uploadedByName: string;
  }): Promise<ATSOffer> {
    // Create offer
    const offer = ATSOffer.create({
      id: uuidv4(),
      applicationId: data.applicationId,
      documentUrl: data.documentUrl,
      documentFilename: data.documentFilename,
      offerAmount: data.offerAmount,
      status: 'sent',
      uploadedBy: data.uploadedBy,
      uploadedByName: data.uploadedByName,
      sentAt: new Date(),
    });

    const savedOffer = await this.offerRepository.create(offer);

    // Get application to get current stage and subStage
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    // Log activity
    await this.activityLoggerService.logOfferSentActivity({
      applicationId: data.applicationId,
      offerId: savedOffer.id,
      offerAmount: data.offerAmount,
      stage: application.stage,
      subStage: application.subStage,
      performedBy: data.uploadedBy,
      performedByName: data.uploadedByName,
    });

    return savedOffer;
  }
}
