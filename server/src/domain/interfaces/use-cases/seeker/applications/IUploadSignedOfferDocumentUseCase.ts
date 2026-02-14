import { ATSOfferResponseDto } from 'src/application/dtos/application/offer/responses/ats-offer-response.dto';
import { UploadedFile } from 'src/domain/types/common.types';

export interface UploadSignedOfferDocumentDto {
  file: UploadedFile;
  signedDocumentUrl?: string;
  signedDocumentFilename?: string;
}

export interface IUploadSignedOfferDocumentUseCase {
  execute(
    userId: string,
    userName: string,
    offerId: string,
    data: UploadSignedOfferDocumentDto,
  ): Promise<ATSOfferResponseDto>;
}
