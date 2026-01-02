import { IJobApplicationRepository } from 'src/domain/interfaces/repositories/job-application/IJobApplicationRepository';
import { IATSOfferRepository } from 'src/domain/interfaces/repositories/ats/IATSOfferRepository';
import { IS3Service } from 'src/domain/interfaces/services/IS3Service';
import { NotFoundError, AuthorizationError } from 'src/domain/errors/errors';
import { 
  OfferForSeekerDto, 
  IGetOffersByApplicationUseCase, 
} from 'src/domain/interfaces/use-cases/seeker/applications/IGetOffersByApplicationUseCase';

export class GetOffersByApplicationUseCase implements IGetOffersByApplicationUseCase {
  constructor(
    private readonly _jobApplicationRepository: IJobApplicationRepository,
    private readonly _offerRepository: IATSOfferRepository,
    private readonly _s3Service: IS3Service,
  ) {}

  async execute(userId: string, applicationId: string): Promise<OfferForSeekerDto[]> {
    const application = await this._jobApplicationRepository.findById(applicationId);
    
    if (!application) {
      throw new NotFoundError('Application not found');
    }

    if (application.seekerId !== userId) {
      throw new AuthorizationError('You can only view your own applications');
    }

    const offers = await this._offerRepository.findByApplicationId(applicationId);
    
    return Promise.all(
      offers.map(async (offer) => {
        try {
          const signedUrl = await this._s3Service.getSignedUrl(offer.documentUrl);
          const offerDto: OfferForSeekerDto = {
            ...offer,
            documentUrl: signedUrl,
          };
          
          if (offer.signedDocumentUrl) {
            const signedDocUrl = await this._s3Service.getSignedUrl(offer.signedDocumentUrl);
            offerDto.signedDocumentUrl = signedDocUrl;
          }
          
          return offerDto;
        } catch (error) {
          console.error(`Error generating signed URL for offer ${offer.id}:`, error);
          return { ...offer };
        }
      }),
    );
  }
}
