import { ATSOffer } from 'src/domain/entities/ats-offer.entity';

export interface IUploadOfferUseCase {
  execute(data: {
    applicationId: string;
    documentUrl: string;
    documentFilename: string;
    offerAmount?: string;
    uploadedBy: string;
    uploadedByName: string;
  }): Promise<ATSOffer>;
}
