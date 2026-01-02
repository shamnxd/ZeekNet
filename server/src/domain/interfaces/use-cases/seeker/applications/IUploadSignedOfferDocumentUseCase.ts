import { ATSOffer } from 'src/domain/entities/ats-offer.entity';

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
