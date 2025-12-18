export interface Company {
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
  isVerified: 'pending' | 'rejected' | 'verified';
  isBlocked: boolean;
  email: string;
  createdAt: string;
  updatedAt: string;
  verification?: {
    taxId: string;
    businessLicenseUrl: string;
  } | null;
}

export interface GetAllCompaniesParams {
  page: number;
  limit: number;
  search?: string;
  industry?: string;
  isVerified?: 'pending' | 'rejected' | 'verified';
  isBlocked?: boolean | string;
}
