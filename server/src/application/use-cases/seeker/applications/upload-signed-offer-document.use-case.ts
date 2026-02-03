import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IUpdateApplicationSubStageUseCase } from 'src/domain/interfaces/use-cases/application/pipeline/IUpdateApplicationSubStageUseCase';
import { IFileUploadService } from 'src/domain/interfaces/services/IFileUploadService';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { ATSStage, OfferSubStage } from 'src/domain/enums/ats-stage.enum';
import { ILogger } from 'src/domain/interfaces/services/ILogger';
import {
  UploadSignedOfferDocumentDto,
  IUploadSignedOfferDocumentUseCase,
} from 'src/domain/interfaces/use-cases/seeker/applications/IUploadSignedOfferDocumentUseCase';
import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';
import { ATSOfferMapper } from 'src/application/mappers/ats/ats-offer.mapper';

export class UploadSignedOfferDocumentUseCase implements IUploadSignedOfferDocumentUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _offerRepository: IATSOfferRepository,
    private readonly _updateApplicationSubStageUseCase: IUpdateApplicationSubStageUseCase,
    private readonly _fileUploadService: IFileUploadService,
    private readonly _logger: ILogger,
  ) { }

  async execute(
    userId: string,
    userName: string,
    offerId: string,
    data: UploadSignedOfferDocumentDto,
  ): Promise<ATSOfferResponseDto> {
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

    let signedDocumentUrl = data.signedDocumentUrl;
    let signedDocumentFilename = data.signedDocumentFilename;

    if (data.file) {
      const uploadResult = await this._fileUploadService.uploadOfferLetter(data.file, 'signed_document');
      signedDocumentUrl = uploadResult.url;
      signedDocumentFilename = uploadResult.filename;
    }

    const updatedOffer = await this._offerRepository.update(offerId, {
      signedDocumentUrl,
      signedDocumentFilename,
      status: 'signed',
      signedAt: new Date(),
    });

    if (!updatedOffer) {
      throw new NotFoundError('Failed to update offer');
    }

    if (application.stage === ATSStage.OFFER) {
      try {
        await this._updateApplicationSubStageUseCase.execute({
          applicationId: offer.applicationId,
          subStage: OfferSubStage.OFFER_ACCEPTED,
          userId: userId,
          userName: userName,
        });
      } catch (subStageError) {
        this._logger.error('Error updating application substage:', subStageError);
      }
    }

    return ATSOfferMapper.toResponse(updatedOffer);
  }
}
