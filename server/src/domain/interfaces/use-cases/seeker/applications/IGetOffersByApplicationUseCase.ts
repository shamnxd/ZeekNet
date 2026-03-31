export interface OfferForSeekerDto {
  id: string;
  applicationId: string;
  documentUrl?: string;
  offerAmount?: string;
  status: 'draft' | 'sent' | 'signed' | 'declined';
  signedDocumentUrl?: string;
  withdrawalReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetOffersByApplicationUseCase {
  execute(userId: string, applicationId: string): Promise<OfferForSeekerDto[]>;
}
