import { v4 as uuidv4 } from 'uuid';
import { IUploadOfferUseCase } from 'src/domain/interfaces/use-cases/application/offer/IUploadOfferUseCase';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IActivityLoggerService } from 'src/domain/interfaces/services/IActivityLoggerService';
import { ATSOffer } from 'src/domain/entities/ats-offer.entity';
import { NotFoundError } from 'src/domain/errors/errors';

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

    
    const application = await this.jobApplicationRepository.findById(data.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    
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
