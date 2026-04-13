import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { ILogger } from 'src/domain/interfaces/services/ILogger';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import {
  OfferForSeekerDto,
  IGetOffersByApplicationUseCase,
} from 'src/domain/interfaces/use-cases/seeker/applications/IGetOffersByApplicationUseCase';

import { injectable, inject } from 'inversify';
import { TYPES } from 'src/shared/constants/types';
import { ERROR } from 'src/shared/constants/messages';

@injectable()
export class GetOffersByApplicationUseCase implements IGetOffersByApplicationUseCase {
  constructor(
    @inject(TYPES.JobApplicationRepository) private readonly _jobApplicationRepository: IJobApplicationRepository,
    @inject(TYPES.ATSOfferRepository) private readonly _offerRepository: IATSOfferRepository,
    @inject(TYPES.S3Service) private readonly _s3Service: IS3Service,
    @inject(TYPES.LoggerService) private readonly _logger: ILogger,
  ) { }

  async execute(userId: string, applicationId: string): Promise<OfferForSeekerDto[]> {
    const application = await this._jobApplicationRepository.findById(applicationId);

    if (!application) {
      throw new NotFoundError(ERROR.NOT_FOUND('Application'));
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only view your own applications');
    }

    const offers = await this._offerRepository.findByApplicationId(applicationId);

    return Promise.all(
      offers.map(async (offer) => {
        try {
          const offerDto: OfferForSeekerDto = {
            ...offer,
          };

          if (offer.documentUrl) {
            const signedUrl = await this._s3Service.getSignedUrl(offer.documentUrl);
            offerDto.documentUrl = signedUrl;
          }

          if (offer.signedDocumentUrl) {
            const signedDocUrl = await this._s3Service.getSignedUrl(offer.signedDocumentUrl);
            offerDto.signedDocumentUrl = signedDocUrl;
          }

          return offerDto;
        } catch (error) {
          this._logger.error(`Error generating signed URL for offer ${offer.id}:`, error);
          return { ...offer };
        }
      }),
    );
  }
}
