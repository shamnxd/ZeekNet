export class CompanyVerification {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly taxId: string,
    public readonly businessLicenseUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: {
    id: string;
    companyId: string;
    taxId?: string;
    businessLicenseUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }): CompanyVerification {
    const now = new Date();
    return new CompanyVerification(
      data.id,
      data.companyId,
      data.taxId ?? '',
      data.businessLicenseUrl ?? '',
      data.createdAt ?? now,
      data.updatedAt ?? now,
    );
  }
}
