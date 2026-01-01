import { IJobApplicationRepository } from '../../../domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSOfferRepository } from '../../../domain/interfaces/repositories/ats/IATSOfferRepository';
import { IUpdateApplicationSubStageUseCase } from '../../../domain/interfaces/use-cases/ats/IUpdateApplicationSubStageUseCase';
import { NotFoundError, AuthorizationError } from '../../../domain/errors/errors';
import { ATSOffer } from '../../../domain/entities/ats-offer.entity';
import { ATSStage, OfferSubStage } from '../../../domain/enums/ats-stage.enum';

export interface UploadSignedOfferDocumentDto {
  signedDocumentUrl: string;
  signedDocumentFilename: string;
}

export interface IUploadSignedOfferDocumentUseCase {
  execute(
    userId: string,
    userName: string,
    offerId: string,
    data: UploadSignedOfferDocumentDto,
  ): Promise<ATSOffer>;
}

export class UploadSignedOfferDocumentUseCase implements IUploadSignedOfferDocumentUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _offerRepository: IATSOfferRepository,
    private readonly _updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
  ) {}

  async execute(
    userId: string,
    userName: string,
    offerId: string,
    data: UploadSignedOfferDocumentDto,
  ): Promise<ATSOffer> {
    const offer = await this._offerRepository.findById(offerId);
    if (!offer) {
      throw new NotFoundError('Offer not found');
    }

    const application = await this._jobApplicationRepository.findById(offer.applicationId);
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only upload signed documents for your own applications');
    }

    const updatedOffer = await this._offerRepository.update(offerId, {
      signedDocumentUrl: data.signedDocumentUrl,
      signedDocumentFilename: data.signedDocumentFilename,
      status: 'signed',
      signedAt: new Date(),
    });

    if (!updatedOffer) {
      throw new NotFoundError('Failed to update offer');
    }

    // Update application sub-stage if in OFFER stage
    if (application.stage === ATSStage.OFFER) {
      try {
        await this._updateApplicationSubStageUseCase.execute({
          applicationId: offer.applicationId,
          subStage: OfferSubStage.OFFER_ACCEPTED,
          performedBy: userId,
          performedByName: userName,
        });
      } catch (subStageError) {
        console.error('Error updating application substage:', subStageError);
      }
    }

    return updatedOffer;
  }
}
