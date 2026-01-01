export interface OfferForSeekerDto {
  id: string;
  applicationId: string;
  documentUrl: string;
  documentFilename: string;
  offerAmount?: string;
  status: 'draft' | 'sent' | 'signed' | 'declined';
  uploadedBy: string;
  uploadedByName: string;
  sentAt?: Date;
  signedAt?: Date;
  declinedAt?: Date;
  signedDocumentUrl?: string;
  signedDocumentFilename?: string;
  withdrawalReason?: string;
  withdrawnBy?: string;
  withdrawnByName?: string;
  withdrawnAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetOffersByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<OfferForSeekerDto[]>;
}
