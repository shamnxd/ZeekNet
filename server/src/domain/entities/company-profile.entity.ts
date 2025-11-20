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
    userId: string;
    companyName: string;
    logo: string;
    banner: string;
    websiteLink: string;
    employeeCount: number;
    industry: string;
    organisation: string;
    aboutUs: string;
    isVerified?: 'pending' | 'rejected' | 'verified';
    createdAt?: Date;
    updatedAt?: Date;
    email?: string;
    isBlocked?: boolean;
    foundedDate?: Date;
    phone?: string;
    rejectionReason?: string;
  }): CompanyProfile {
    const now = new Date();
    return new CompanyProfile(
      data.id,
      data.userId,
      data.companyName,
      data.logo,
      data.banner,
      data.websiteLink,
      data.employeeCount,
      data.industry,
      data.organisation,
      data.aboutUs,
      data.isVerified ?? 'pending',
      data.createdAt ?? now,
      data.updatedAt ?? now,
      data.email ?? '',
      data.isBlocked ?? false,
      data.foundedDate,
      data.phone,
      data.rejectionReason,
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