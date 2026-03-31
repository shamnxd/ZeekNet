export interface ATSOfferResponseDto {
  id: string;
  applicationId: string;
  documentUrl?: string;
  offerAmount?: string;
  status: string;
  signedDocumentUrl?: string;
  withdrawalReason?: string;
  createdAt: Date;
  updatedAt: Date;
}
