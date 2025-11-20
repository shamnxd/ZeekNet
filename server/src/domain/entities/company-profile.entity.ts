export class CompanyProfile {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly companyName: string,
    public readonly logo: string,
    public readonly banner: string,
    public readonly websiteLink: string,
    public readonly employeeCount: number,
    public readonly industry: string,
    public readonly organisation: string,
    public readonly aboutUs: string,
    public readonly isVerified: 'pending' | 'rejected' | 'verified',
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public email: string = '',
    public isBlocked: boolean = false,
    public readonly foundedDate?: Date,
    public readonly phone?: string,
    public readonly rejectionReason?: string,
  ) {}


  static create(data: {
    id: string;
      banner: this.banner,
      websiteLink: this.websiteLink,
      employeeCount: this.employeeCount,
      industry: this.industry,
      organisation: this.organisation,
      aboutUs: this.aboutUs,
      isVerified: this.isVerified,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      userEmail: this.email,
      userIsBlocked: this.isBlocked,
      foundedDate: this.foundedDate?.toISOString(),
      phone: this.phone,
      rejectionReason: this.rejectionReason,
    };
  }


  static fromJSON(data: Record<string, unknown>): CompanyProfile {
    return new CompanyProfile(
      data.id as string,
      data.userId as string,
      data.companyName as string,
      data.logo as string,
      data.banner as string,
      data.websiteLink as string,
      data.employeeCount as number,
      data.industry as string,
      data.organisation as string,
      data.aboutUs as string,
      data.isVerified as 'pending' | 'rejected' | 'verified',
      new Date(data.createdAt as string),
      new Date(data.updatedAt as string),
      (data.userEmail as string) || '', 
      (data.userIsBlocked as boolean) ?? false, 
      data.foundedDate ? new Date(data.foundedDate as string | Date) : undefined,
      data.phone as string,
      data.rejectionReason as string | undefined,
    );
  }
}

export class CompanyVerification {
  constructor(
    public readonly id: string,
    public readonly companyId: string,
    public readonly taxId: string,
    public readonly businessLicenseUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static create(data: { id: string; companyId: string; taxId?: string; businessLicenseUrl?: string; createdAt?: Date; updatedAt?: Date }): CompanyVerification {
    const now = new Date();
    return new CompanyVerification(data.id, data.companyId, data.taxId ?? '', data.businessLicenseUrl ?? '', data.createdAt ?? now, data.updatedAt ?? now);
  }
}