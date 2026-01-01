import { UploadSignedOfferDocumentDto } from '../../../../application/use-cases/seeker/upload-signed-offer-document.use-case';
import { ATSOffer } from '../../../entities/ats-offer.entity';

export interface IUploadSignedOfferDocumentUseCase {
  execute(
    userId: string,
    userName: string,
    offerId: string,
    data: UploadSignedOfferDocumentDto,
  ): Promise<ATSOffer>;
}
