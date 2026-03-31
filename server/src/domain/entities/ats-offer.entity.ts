export class ATSOffer {
  constructor(
    public readonly id: string,
    public readonly applicationId: string,
    public readonly documentUrl?: string,
    public readonly offerAmount?: string,
    public readonly status: 'draft' | 'sent' | 'signed' | 'declined' = 'draft',
    public readonly signedDocumentUrl?: string,
    public readonly withdrawalReason?: string,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date(),
  ) { }

  static create(data: {
    id: string;
    applicationId: string;
    documentUrl?: string;
    offerAmount?: string;
    status?: 'draft' | 'sent' | 'signed' | 'declined';
    signedDocumentUrl?: string;
    withdrawalReason?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): ATSOffer {
    return new ATSOffer(
      data.id,
      data.applicationId,
      data.documentUrl,
      data.offerAmount,
      data.status ?? 'draft',
      data.signedDocumentUrl,
      data.withdrawalReason,
      data.createdAt ?? new Date(),
      data.updatedAt ?? new Date(),
    );
  }
}
