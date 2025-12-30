export class ATSOffer {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly documentUrl: string,
    public readonly documentFilename: string,
    public readonly offerAmount?: string,
    public readonly status: 'draft' | 'sent' | 'signed' | 'declined' = 'draft',
    public readonly uploadedBy: string = '',
    public readonly uploadedByName: string = '',
    public readonly sentAt?: Date,
    public readonly signedAt?: Date,
    public readonly declinedAt?: Date,
    public readonly signedDocumentUrl?: string,
    public readonly signedDocumentFilename?: string,
    public readonly withdrawalReason?: string,
    public readonly withdrawnBy?: string,
    public readonly withdrawnByName?: string,
    public readonly withdrawnAt?: Date,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) {}

  static create(data: {
    id: string;
    applicationId: string;
    documentUrl: string;
    documentFilename: string;
    offerAmount?: string;
    status?: 'draft' | 'sent' | 'signed' | 'declined';
    uploadedBy?: string;
    uploadedByName?: string;
    sentAt?: Date;
    signedAt?: Date;
    declinedAt?: Date;
    signedDocumentUrl?: string;
    signedDocumentFilename?: string;
    withdrawalReason?: string;
    withdrawnBy?: string;
    withdrawnByName?: string;
    withdrawnAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
  }): ATSOffer {
    return new ATSOffer(
      data.id,
      data.applicationId,
      data.documentUrl,
      data.documentFilename,
      data.offerAmount,
      data.status ?? 'draft',
      data.uploadedBy ?? '',
      data.uploadedByName ?? '',
      data.sentAt,
      data.signedAt,
      data.declinedAt,
      data.signedDocumentUrl,
      data.signedDocumentFilename,
      data.withdrawalReason,
      data.withdrawnBy,
      data.withdrawnByName,
      data.withdrawnAt,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
