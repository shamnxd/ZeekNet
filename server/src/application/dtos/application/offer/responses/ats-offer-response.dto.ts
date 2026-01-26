export interface ATSOfferResponseDto {
  id: string;
  applicationId: string;
  documentUrl: string;
  documentFilename: string;
  offerAmount?: string;
  status: string;
  uploadedBy: string;
  uploadedByName: string;
  signedDocumentUrl?: string;
  signedDocumentFilename?: string;
  signedAt?: Date;
  declinedAt?: Date;
  withdrawalReason?: string;
  withdrawnBy?: string;
  withdrawnByName?: string;
  withdrawnAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
